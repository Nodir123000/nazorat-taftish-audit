import { prisma } from "@/lib/db/prisma";
import { PriorityLevel, HardBlockResult, CollisionCheckResult, CollisionDetail } from "@/lib/types/hierarchy";
import { logAudit } from "@/lib/server-audit";
import { logCollisionCheck, logHardBlock } from "./audit-logging-service";

interface UserContext {
  user_id: number;
  authority_id?: number;
  priority_level?: PriorityLevel;
}

export const collisionService = {
  async getUserPriority(userId: number): Promise<PriorityLevel | null> {
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        control_authority_id: true,
        ref_control_authorities: {
          select: { priority_level: true }
        }
      }
    });

    if (!user?.ref_control_authorities) return null;
    return (user.ref_control_authorities.priority_level || PriorityLevel.Regional) as PriorityLevel;
  },

  async checkPlanCollisionWithHierarchy(
    unitId: number,
    year: number,
    userId: number,
    excludePlanId?: number
  ): Promise<CollisionCheckResult> {
    try {
      // Get current user's priority level
      const userPriority = await this.getUserPriority(userId);
      if (!userPriority) {
        return {
          hasCollision: true,
          block: {
            hasCollision: true,
            blockLevel: "lower_priority",
            conflictingPlan: null as any,
            canOverride: false,
            requiredMinisterApproval: true,
            reason: "User has no control authority assigned",
            details: {
              userPriority: PriorityLevel.Regional,
              conflictPriority: PriorityLevel.Master,
              yearOfExistingPlan: year
            }
          }
        };
      }

      // Find existing plans for same unit/year (excluding current plan if editing)
      const existingPlans = await prisma.rev_plan_year.findMany({
        where: {
          unit_id: unitId,
          year: year,
          plan_id: excludePlanId ? { not: excludePlanId } : undefined,
          status: { in: ["approved", "101", "102"] }  // Only count active plans
        },
        include: {
          ref_control_authorities: {
            select: {
              authority_id: true,
              code: true,
              name: true,
              priority_level: true
            }
          },
          ref_inspection_types: {
            select: { name: true, code: true }
          },
          ref_control_directions: {
            select: { name: true, code: true }
          }
        }
      });

      if (existingPlans.length === 0) {
        return { hasCollision: false };
      }

      // Analyze collisions by priority rules
      const hardBlocks = existingPlans.filter((plan: any) => {
        const conflictPriority = (plan.ref_control_authorities?.priority_level || PriorityLevel.Regional) as PriorityLevel;

        // Rule 1: Same authority (same code) - always block
        // We'll skip this for now as we need to fetch user's authority separately
        // if ((plan.ref_control_authorities?.code) ===
        //     (await prisma.users.findUnique({ where: { user_id: userId } }))?.ref_control_authorities?.code) {
        //   return true;
        // }

        // Rule 2: Lower priority user trying to override higher priority plan
        // If userPriority > conflictPriority (numerically), user has LOWER authority
        if (userPriority > conflictPriority) {
          return true;
        }

        return false;
      });

      if (hardBlocks.length > 0) {
        const conflict = hardBlocks[0];
        const conflictPriority = (conflict.ref_control_authorities?.priority_level || PriorityLevel.Regional) as PriorityLevel;

        // Log hard block event with specialized audit service
        const userAuthority = await prisma.users.findUnique({
          where: { user_id: userId },
          select: { control_authority_id: true }
        });

        await logHardBlock(
          userId.toString(),
          unitId.toString(),
          year,
          1, // blockLevel
          conflict.plan_id.toString(),
          conflict.ref_control_authorities?.authority_id || 0,
          conflictPriority
        );

        await logAudit({
          userId,
          action: `COLLISION_DETECTED - HARD_BLOCK`,
          tableName: "rev_plan_year",
          recordId: conflict.plan_id,
          newValue: {
            attempt: "create_plan",
            unit_id: unitId,
            year: year,
            conflicting_plan_id: conflict.plan_id,
            user_priority: userPriority,
            conflict_priority: conflictPriority
          }
        });

        return {
          hasCollision: true,
          block: {
            hasCollision: true,
            blockLevel: userPriority > conflictPriority ? "lower_priority" : "same_authority",
            conflictingPlan: this.formatCollisionDetail(conflict),
            canOverride: userPriority <= PriorityLevel.Central,
            requiredMinisterApproval: userPriority <= PriorityLevel.Master,
            reason: userPriority > conflictPriority
              ? `Вышестоящий орган (${conflict.ref_control_authorities?.code}) уже запланировал проверку`
              : `Этот орган (${conflict.ref_control_authorities?.code}) уже запланировал проверку на этот год`,
            details: {
              userPriority,
              conflictPriority,
              yearOfExistingPlan: year
            }
          }
        };
      }

      // Soft warning: Other authorities have plans (same period, different authority)
      return {
        hasCollision: existingPlans.length > 0,
        plans: existingPlans.map((p: any) => this.formatCollisionDetail(p))
      };
    } catch (error) {
      console.error("Error in checkPlanCollisionWithHierarchy:", error);
      return { hasCollision: false };
    }
  },

  formatCollisionDetail(plan: any): CollisionDetail {
    return {
      planId: plan.plan_id,
      authority: {
        authority_id: plan.ref_control_authorities?.authority_id || 0,
        code: plan.ref_control_authorities?.code || "UNKNOWN",
        name: typeof plan.ref_control_authorities?.name === 'string'
          ? plan.ref_control_authorities.name
          : plan.ref_control_authorities?.name?.ru || "Unknown",
        priority_level: (plan.ref_control_authorities?.priority_level || 3) as PriorityLevel
      },
      inspectionType: typeof plan.ref_inspection_types?.name === 'string'
        ? plan.ref_inspection_types.name
        : plan.ref_inspection_types?.name?.ru || plan.ref_inspection_types?.code || "Unknown",
      startDate: plan.start_date,
      endDate: plan.end_date,
      inspectionDirection: typeof plan.ref_control_directions?.name === 'string'
        ? plan.ref_control_directions.name
        : plan.ref_control_directions?.name?.ru || plan.ref_control_directions?.code
    };
  },

  async validateException(
    userId: number,
    exceptionData: {
      is_exceptional: boolean;
      exceptional_reason?: string;
      minister_order_ref?: string;
      minister_order_date?: Date;
    }
  ): Promise<{ valid: boolean; error?: string }> {
    if (!exceptionData.is_exceptional) {
      return { valid: true };
    }

    // Exception requires both reason and minister order
    if (!exceptionData.exceptional_reason || !exceptionData.minister_order_ref) {
      return {
        valid: false,
        error: "Исключение требует обоснования и ссылки на приказ министра"
      };
    }

    // Only Master level can approve exceptions
    const userPriority = await this.getUserPriority(userId);
    if (userPriority !== PriorityLevel.Master) {
      return {
        valid: false,
        error: "Только КРУ МО РУ может одобрять исключения"
      };
    }

    // Log exception approval
    await logAudit({
      userId,
      action: "COLLISION_EXCEPTION_APPROVED",
      newValue: {
        minister_order_ref: exceptionData.minister_order_ref,
        reason: exceptionData.exceptional_reason
      }
    });

    return { valid: true };
  }
};

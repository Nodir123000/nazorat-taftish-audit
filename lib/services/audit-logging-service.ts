/**
 * Specialized audit logging service for collision detection and exception workflows.
 * Tracks collision checks, hard blocks, and minister exception workflows.
 */
import { prisma } from "@/lib/db/prisma";
import { PriorityLevel } from "@/lib/types/hierarchy";

export const AUDIT_EVENTS = {
  COLLISION_CHECK: 'COLLISION_CHECK',
  COLLISION_DETECTED: 'COLLISION_DETECTED',
  HARD_BLOCK_ENCOUNTERED: 'HARD_BLOCK_ENCOUNTERED',
  EXCEPTION_REQUESTED: 'EXCEPTION_REQUESTED',
  EXCEPTION_APPROVED: 'EXCEPTION_APPROVED',
  PLAN_OVERRIDE: 'PLAN_OVERRIDE',
  HIERARCHICAL_VIOLATION_BLOCKED: 'HIERARCHICAL_VIOLATION_BLOCKED'
};

interface AuditLogEntry {
  user_id: number;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
}

/**
 * Log when user initiates a collision check
 */
export async function logCollisionCheck(
  userId: string,
  unitId: string,
  year: number,
  collisionsFound: number,
  userAuthorityId: number
): Promise<void> {
  try {
    // Query user's priority level
    const userPriority = await getUserPriorityLevel(parseInt(userId));

    const entry: AuditLogEntry = {
      user_id: parseInt(userId),
      action: AUDIT_EVENTS.COLLISION_CHECK,
      resource_type: "military_unit",
      resource_id: unitId,
      details: {
        year,
        collisions_found: collisionsFound,
        user_authority_id: userAuthorityId,
        user_priority_level: userPriority,
        timestamp: new Date().toISOString()
      }
    };

    await insertAuditLog(entry);
  } catch (error) {
    console.error("[audit-logging] logCollisionCheck failed:", error);
    // Don't crash the calling function, fire-and-forget
  }
}

/**
 * Log when hard block prevents plan creation
 */
export async function logHardBlock(
  userId: string,
  unitId: string,
  year: number,
  blockLevel: number,
  conflictingPlanId: string,
  conflictingAuthorityId: number,
  blockedByPriorityLevel: number
): Promise<void> {
  try {
    const entry: AuditLogEntry = {
      user_id: parseInt(userId),
      action: AUDIT_EVENTS.HARD_BLOCK_ENCOUNTERED,
      resource_type: "plan",
      resource_id: conflictingPlanId,
      details: {
        unit_id: unitId,
        year,
        blocking_authority_id: conflictingAuthorityId,
        blocking_priority_level: blockedByPriorityLevel,
        block_level: blockLevel,
        attempted_by_user_id: userId,
        timestamp: new Date().toISOString()
      }
    };

    await insertAuditLog(entry);
  } catch (error) {
    console.error("[audit-logging] logHardBlock failed:", error);
    // Don't crash the calling function, fire-and-forget
  }
}

/**
 * Log when user requests exception to override hard block
 */
export async function logExceptionRequested(
  userId: string,
  unitId: string,
  exceptionData: {
    exceptional_reason: string;
    minister_order_ref: string;
    minister_order_date: string;
    override_authority_id: number;
  }
): Promise<void> {
  try {
    // Sanitize exceptional_reason (max 500 chars)
    const sanitizedReason = (exceptionData.exceptional_reason || "").trim().slice(0, 500);

    // Validate minister_order_ref format (basic validation)
    if (!exceptionData.minister_order_ref || exceptionData.minister_order_ref.trim().length === 0) {
      console.warn("[audit-logging] Invalid minister_order_ref format");
      // Continue logging even with invalid format, but flag it
    }

    // Validate minister_order_date is valid ISO date
    let validatedDate = exceptionData.minister_order_date;
    try {
      new Date(validatedDate).toISOString();
    } catch {
      console.warn("[audit-logging] Invalid minister_order_date format");
      validatedDate = new Date().toISOString().split('T')[0]; // Default to today
    }

    // Query user's authority
    const userAuthority = await getUserAuthorityInfo(parseInt(userId));

    const entry: AuditLogEntry = {
      user_id: parseInt(userId),
      action: AUDIT_EVENTS.EXCEPTION_REQUESTED,
      resource_type: "plan_exception",
      resource_id: unitId,
      details: {
        unit_id: unitId,
        requested_by_user_id: userId,
        requested_by_authority_id: userAuthority?.authority_id,
        reason: sanitizedReason,
        minister_order_ref: exceptionData.minister_order_ref?.trim() || "UNKNOWN",
        minister_order_date: validatedDate,
        override_authority_id: exceptionData.override_authority_id,
        timestamp: new Date().toISOString()
      }
    };

    await insertAuditLog(entry);
  } catch (error) {
    console.error("[audit-logging] logExceptionRequested failed:", error);
    // Don't crash the calling function, fire-and-forget
  }
}

/**
 * Log successful plan creation with exception
 */
export async function logExceptionApproved(
  userId: string,
  planId: string,
  planYearId: string,
  authorityId: number
): Promise<void> {
  try {
    const entry: AuditLogEntry = {
      user_id: parseInt(userId),
      action: AUDIT_EVENTS.EXCEPTION_APPROVED,
      resource_type: "plan",
      resource_id: planId,
      details: {
        plan_year_id: planYearId,
        created_by_authority_id: authorityId,
        approved_at: new Date().toISOString(),
        timestamp: new Date().toISOString()
      }
    };

    await insertAuditLog(entry);
  } catch (error) {
    console.error("[audit-logging] logExceptionApproved failed:", error);
    // Don't crash the calling function, fire-and-forget
  }
}

/**
 * Log attempted hierarchical violations
 */
export async function logHierarchicalViolation(
  userId: string,
  attemptedAction: string,
  violationType: 'INSUFFICIENT_AUTHORITY' | 'UNAUTHORIZED_SCOPE',
  resourceId: string,
  details: Record<string, any>
): Promise<void> {
  try {
    // Query user's priority level
    const userPriority = await getUserPriorityLevel(parseInt(userId));

    const entry: AuditLogEntry = {
      user_id: parseInt(userId),
      action: AUDIT_EVENTS.HIERARCHICAL_VIOLATION_BLOCKED,
      resource_type: "access_control",
      resource_id: resourceId,
      details: {
        attempted_action: attemptedAction,
        violation_type: violationType,
        user_id: userId,
        user_priority_level: userPriority,
        required_priority_level: details.required_priority_level,
        timestamp: new Date().toISOString(),
        ...details
      }
    };

    await insertAuditLog(entry);
  } catch (error) {
    console.error("[audit-logging] logHierarchicalViolation failed:", error);
    // Don't crash the calling function, fire-and-forget
  }
}

/**
 * Helper: Get user's priority level from database
 */
async function getUserPriorityLevel(userId: number): Promise<PriorityLevel | null> {
  try {
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
  } catch (error) {
    console.error("[audit-logging] Failed to get user priority level:", error);
    return null;
  }
}

/**
 * Helper: Get user's authority information
 */
async function getUserAuthorityInfo(userId: number): Promise<{ authority_id: number } | null> {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        control_authority_id: true
      }
    });

    return user?.control_authority_id ? { authority_id: user.control_authority_id } : null;
  } catch (error) {
    console.error("[audit-logging] Failed to get user authority info:", error);
    return null;
  }
}

/**
 * Helper: Insert audit log entry into database
 */
async function insertAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.audit_log.create({
      data: {
        user_id: entry.user_id,
        action: entry.action,
        table_name: entry.resource_type,
        record_id: parseInt(entry.resource_id) || null,
        new_value: JSON.stringify({
          resource_type: entry.resource_type,
          resource_id: entry.resource_id,
          ...entry.details
        }),
        ip_address: null
      }
    });
  } catch (error) {
    console.error("[audit-logging] Failed to insert audit log:", error);
    throw error;
  }
}

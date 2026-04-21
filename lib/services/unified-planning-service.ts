import { prisma } from "../db/prisma"

export type PlanStatus = "draft" | "approved" | "in_progress" | "completed" | "cancelled"
export type PeriodType = "annual" | "quarterly" | "monthly" | "unplanned"
export type AuditType = "preliminary" | "current" | "final" | "social_protection" | "deficiency_check"

export interface UnifiedPlanFilters {
  year?: number
  status?: PlanStatus
  periodType?: PeriodType
  unitId?: number
  search?: string
}

export const unifiedPlanningService = {
  async getPlans(filters?: UnifiedPlanFilters) {
    const results: any[] = []

    if (!filters?.periodType || filters.periodType === 'annual' || filters.periodType === 'unplanned') {
      const where: any = {}
      if (filters?.year) where.year = filters.year
      if (filters?.status) where.status = filters.status
      if (filters?.periodType) where.period_type = filters.periodType
      if (filters?.unitId) where.unit_id = filters.unitId
      if (filters?.search) {
        where.OR = [
          { plan_number: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ]
      }
      const plans = await prisma.rev_plan_year.findMany({
        where,
        include: {
          ref_units: true,
          users_rev_plan_year_responsible_idTousers: true
        }
      })
      results.push(...plans.map((p: any) => ({
        ...p,
        plan_id: p.plan_id,
        period_type: p.period_type,
        plan_number: p.plan_number,
        start_date: p.start_date?.toISOString(),
        end_date: p.end_date?.toISOString(),
        unit: p.ref_units,
        responsible: p.users_rev_plan_year_responsible_idTousers,
      })))
    }

    if (!filters?.periodType || filters.periodType === 'quarterly') {
      const qWhere: any = {}
      if (filters?.year) qWhere.year = filters.year
      if (filters?.status) qWhere.status = filters.status
      const qPlans = await prisma.quarterly_plans.findMany({
        where: qWhere,
        include: { rev_plan_year: { include: { ref_units: true } } }
      })
      results.push(...qPlans.map((p: any) => ({
        ...p,
        plan_id: p.id,
        period_type: 'quarterly',
        period_value: p.quarter,
        unit: p.rev_plan_year?.ref_units,
        start_date: p.created_at?.toISOString(),
        end_date: p.created_at?.toISOString(),
      })))
    }

    return results.sort((a, b) => {
      const order = { annual: 0, quarterly: 1, monthly: 2, unplanned: 3 }
      return (order[a.period_type as PeriodType] || 0) - (order[b.period_type as PeriodType] || 0)
    })
  },

  async getPlan(planId: number) {
    return await prisma.rev_plan_year.findUnique({
      where: { plan_id: planId },
      include: {
        ref_units: true,
        users_rev_plan_year_responsible_idTousers: true
      }
    })
  },

  async getChildPlans(parentPlanId: number) {
    return await prisma.quarterly_plans.findMany({
      where: { annual_plan_id: parentPlanId }
    })
  },

  async createPlan(data: any) {
    return await prisma.rev_plan_year.create({
      data: {
        year: data.year,
        plan_number: data.plan_number,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        unit_id: data.unit_id,
        responsible_id: data.responsible_id,
        status: data.status || "draft",
        description: data.description,
        period_type: data.period_type || "annual",
      } as any
    })
  },

  async updatePlan(planId: number, data: any) {
    return await prisma.rev_plan_year.update({
      where: { plan_id: planId },
      data
    })
  },

  async getPlanTasks(planId: number) {
    return await prisma.audits.findMany({
      where: {
        OR: [
          { monthly_plans: { quarterly_plans: { annual_plan_id: planId } } },
          { monthly_plans: { quarterly_plan_id: planId } },
          { monthly_plan_id: planId }
        ]
      },
      include: { ref_units: true }
    })
  },

  async createTask(data: any) {
    return await prisma.audits.create({
      data: {
        audit_number: data.task_number || `AUTO-${Date.now()}`,
        audit_type: data.audit_type || "general",
        unit_id: data.unit_id,
        start_date: new Date(data.scheduled_date),
        end_date: new Date(data.scheduled_date),
        status: data.status || "planned",
        lead_auditor_id: data.responsible_id || null,
      }
    })
  },
}

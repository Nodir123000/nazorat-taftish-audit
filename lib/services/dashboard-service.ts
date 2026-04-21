import { auditService } from "./audit-service"
import { violationService } from "./violation-service"
import { decisionService } from "./decision-service"
import { prisma } from "../db/prisma"

export const dashboardService = {
  async getDashboardStats() {
    const [auditStats, violationStats, decisionStats] = await Promise.all([
      auditService.getAuditStats(),
      violationService.getViolationStats(),
      decisionService.getDecisionStats(),
    ])

    const currentYear = new Date().getFullYear()

    // Attempt to find annual plan for current year to get progress
    const currentYearPlan = await prisma.rev_plan_year.findFirst({
      where: { year: currentYear },
      include: {
        quarterly_plans: true
      }
    })

    // Calculate total planned audits from quarterly plans
    const totalPlanned = currentYearPlan?.quarterly_plans.reduce((sum: number, qp: any) => sum + (qp.planned_audits || 0), 0) || 100
    const planCompletion = Math.round((auditStats.completed / totalPlanned) * 100)

    return {
      audits: {
        total: auditStats.total,
        inProgress: auditStats.inProgress,
        completed: auditStats.completed,
        planned: auditStats.planned,
        planCompletion,
      },
      violations: {
        total: violationStats.total,
        byStatus: violationStats.byStatus,
        bySeverity: violationStats.bySeverity,
        totalAmount: violationStats.totalAmount,
      },
      decisions: {
        total: decisionStats.total,
        overdue: decisionStats.overdue,
        inProgress: decisionStats.inProgress,
        completed: decisionStats.completed,
      },
    }
  },

  async getRecentActivity() {
    // Fetch latest audits, violations, and decisions
    const [audits, violations, decisions] = await Promise.all([
      prisma.audits.findMany({
        take: 3,
        orderBy: { created_at: 'desc' },
        include: { ref_units: true }
      }),
      prisma.violations.findMany({
        take: 3,
        orderBy: { created_at: 'desc' }
      }),
      prisma.decisions.findMany({
        take: 3,
        orderBy: { created_at: 'desc' }
      })
    ])

    const activities: any[] = []

    audits.forEach((a: any) => activities.push({
      id: `audit-${a.id}`,
      type: "audit",
      title: `Начата ревизия ${a.audit_number}`,
      description: a.unit_name || a.ref_units?.name?.ru || (typeof a.ref_units?.name === 'string' ? a.ref_units.name : ""),
      timestamp: a.created_at?.toISOString() || a.start_date?.toISOString() || new Date().toISOString()
    }))

    violations.forEach((v: any) => activities.push({
      id: `viol-${v.id}`,
      type: "violation",
      title: `Выявлено нарушение ${v.violation_number}`,
      description: v.description,
      timestamp: v.created_at?.toISOString() || v.detected_date.toISOString()
    }))

    decisions.forEach((d: any) => activities.push({
      id: `dec-${d.id}`,
      type: "decision",
      title: `Принято решение ${d.decision_number}`,
      description: d.decision_type,
      timestamp: d.created_at?.toISOString() || d.issued_date?.toISOString() || new Date().toISOString()
    }))

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
  },
}

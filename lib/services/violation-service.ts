import { prisma } from "../db/prisma"

export type ViolationSeverity = "low" | "medium" | "high" | "critical"
export type ViolationStatus = "draft" | "under_review" | "confirmed" | "resolved" | "closed"

export interface ViolationFilters {
  status?: ViolationStatus
  severity?: ViolationSeverity
  category?: string
  audit_id?: string
  date_from?: string
  date_to?: string
  search?: string
}

export const violationService = {
  async getViolations(filters?: ViolationFilters) {
    const where: any = {}

    if (filters?.status) where.status = filters.status
    if (filters?.severity) where.severity = filters.severity
    if (filters?.category) where.category = filters.category
    if (filters?.audit_id) where.audit_id = Number.parseInt(filters.audit_id)

    if (filters?.date_from || filters?.date_to) {
      where.detected_date = {}
      if (filters.date_from) where.detected_date.gte = new Date(filters.date_from)
      if (filters.date_to) where.detected_date.lte = new Date(filters.date_to)
    }

    if (filters?.search) {
      where.OR = [
        { violation_number: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { category: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    return await prisma.violations.findMany({
      where,
      include: {
        audits: true,
        ref_units: true,
      },
      orderBy: { detected_date: 'desc' }
    })
  },

  async getViolation(id: string) {
    return await prisma.violations.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        audits: true,
        ref_units: true,
        decisions: true
      }
    })
  },

  async getViolationStats() {
    const total = await prisma.violations.count()

    // Status aggregation
    const statusCounts = await prisma.violations.groupBy({
      by: ['status'],
      _count: true
    })

    const byStatus: any = { draft: 0, under_review: 0, confirmed: 0, resolved: 0, closed: 0 }
    statusCounts.forEach((item: any) => {
      if (item.status in byStatus) byStatus[item.status] = item._count
    })

    // Severity aggregation
    const severityCounts = await prisma.violations.groupBy({
      by: ['severity'],
      _count: true
    })

    const bySeverity: any = { low: 0, medium: 0, high: 0, critical: 0 }
    severityCounts.forEach((item: any) => {
      if (item.severity in bySeverity) bySeverity[item.severity] = item._count
    })

    const amountSum = await prisma.violations.aggregate({
      _sum: { amount: true }
    })

    return {
      total,
      byStatus,
      bySeverity,
      totalAmount: amountSum._sum.amount ? amountSum._sum.amount.toNumber() : 0
    }
  },

  async getViolationDynamics() {
    const currentYear = new Date().getFullYear()
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

    // Prisma grouping by month is database dependent and complex in raw SQL or needs multiple queries
    // For simplicity, we fetch this year's violations and aggregate in JS
    const violations = await prisma.violations.findMany({
      where: {
        detected_date: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`)
        }
      },
      select: {
        detected_date: true,
        amount: true
      }
    })

    const monthlyData = months.map(name => ({ name, violations: 0, amt: 0 }))

    violations.forEach((v: any) => {
      const monthIndex = v.detected_date.getMonth()
      monthlyData[monthIndex].violations += 1
      monthlyData[monthIndex].amt += v.amount ? v.amount.toNumber() : 0
    })

    return monthlyData
  },
}

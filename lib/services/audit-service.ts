import { prisma } from "../db/prisma"

export type AuditStatus = "planned" | "in_progress" | "completed" | "cancelled"

export interface AuditFilters {
  status?: AuditStatus
  unit_id?: string
  audit_type?: string
  date_from?: string
  date_to?: string
  search?: string
}

export const auditService = {
  async getAudits(filters?: AuditFilters) {
    const where: any = {}

    if (filters?.status) where.status = filters.status
    if (filters?.unit_id) where.unit_id = Number.parseInt(filters.unit_id)
    if (filters?.audit_type) where.audit_type = filters.audit_type

    if (filters?.date_from || filters?.date_to) {
      where.start_date = {}
      if (filters.date_from) where.start_date.gte = new Date(filters.date_from)
      if (filters.date_to) where.start_date.lte = new Date(filters.date_to)
    }

    if (filters?.search) {
      where.OR = [
        { audit_number: { contains: filters.search, mode: 'insensitive' } },
        { unit_name: { contains: filters.search, mode: 'insensitive' } },
        { audit_type: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    return await prisma.audits.findMany({
      where,
      include: {
        ref_units: true,
        users: true,
      },
      orderBy: { start_date: 'desc' }
    })
  },

  async getAudit(id: string) {
    return await prisma.audits.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        ref_units: true,
        users: true,
        violations: true,
      }
    })
  },

  async getAuditStats() {
    const total = await prisma.audits.count()
    const inProgress = await prisma.audits.count({ where: { status: "in_progress" } })
    const completed = await prisma.audits.count({ where: { status: "completed" } })
    const planned = await prisma.audits.count({ where: { status: "planned" } })

    return { total, inProgress, completed, planned }
  },
}

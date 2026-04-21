import { prisma } from "../db/prisma"

export type DecisionStatus = "pending" | "in_progress" | "completed" | "overdue"

export interface DecisionFilters {
  status?: DecisionStatus
  violation_id?: string
  overdue?: boolean
  search?: string
}

export const decisionService = {
  async getDecisions(filters?: DecisionFilters) {
    const where: any = {}

    if (filters?.status) where.status = filters.status
    if (filters?.violation_id) where.violation_id = Number.parseInt(filters.violation_id)

    if (filters?.overdue) {
      where.deadline = { lte: new Date() }
      where.status = { not: "completed" }
    }

    if (filters?.search) {
      where.OR = [
        { decision_number: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { decision_type: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    return await prisma.decisions.findMany({
      where,
      include: {
        violations: true,
      },
      orderBy: { issued_date: 'desc' }
    })
  },

  async getDecision(id: string) {
    return await prisma.decisions.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        violations: true,
      }
    })
  },

  async getDecisionStats() {
    const total = await prisma.decisions.count()
    const today = new Date()

    const overdue = await prisma.decisions.count({
      where: {
        deadline: { lt: today },
        status: { not: "completed" }
      }
    })

    const inProgress = await prisma.decisions.count({
      where: { status: "in_progress" }
    })

    const completed = await prisma.decisions.count({
      where: { status: "completed" }
    })

    return { total, overdue, inProgress, completed }
  },
}

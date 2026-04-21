import { prisma } from "../db/prisma"

export interface AuditResultFilters {
  status?: "draft" | "submitted" | "approved"
  taskId?: number
  orderId?: number
  search?: string
}

export const auditResultsService = {
  // Get all audit results (reports) with filtering
  async getResults(filters?: AuditResultFilters) {
    const where: any = {}

    if (filters?.status) where.status = filters.status
    if (filters?.taskId) where.audit_id = filters.taskId

    if (filters?.search) {
      where.summary = { contains: filters.search, mode: 'insensitive' }
    }

    return await prisma.audit_reports.findMany({
      where,
      include: {
        audits: true
      },
      orderBy: { report_date: 'desc' }
    })
  },

  // Get result by ID
  async getResult(resultId: number) {
    return await prisma.audit_reports.findUnique({
      where: { id: resultId },
      include: {
        audits: true,
        findings: true
      }
    })
  },

  // Create new audit result
  async createResult(data: any) {
    return await prisma.audit_reports.create({
      data: {
        audit_id: data.task_id,
        report_date: new Date(data.audit_date),
        findings_count: data.findings_count,
        violations_count: data.violations_count,
        total_amount: data.total_amount,
        summary: data.report_text,
        status: data.status || "draft",
      }
    })
  },

  // Update audit result
  async updateResult(resultId: number, data: any) {
    return await prisma.audit_reports.update({
      where: { id: resultId },
      data: {
        ...data,
        updated_at: new Date()
      }
    })
  },

  // Get summary statistics
  async getSummaryStats() {
    const stats = await prisma.audit_reports.aggregate({
      _count: { id: true },
      _sum: {
        findings_count: true,
        violations_count: true,
        total_amount: true
      }
    })

    const approvedReports = await prisma.audit_reports.count({
      where: { status: "approved" }
    })

    return {
      totalAudits: stats._count.id,
      totalFindings: stats._sum.findings_count || 0,
      totalViolations: stats._sum.violations_count || 0,
      totalAmount: stats._sum.total_amount ? Number(stats._sum.total_amount) : 0,
      approvedReports
    }
  },

  // Get results by status
  async getResultsByStatus(status: "draft" | "submitted" | "approved") {
    return this.getResults({ status })
  },

  // Export results (placeholder)
  async exportResults(resultIds: number[], format: "pdf" | "excel"): Promise<Blob> {
    // Placeholder for export functionality
    return new Blob(["Export data"], { type: "application/octet-stream" })
  },
}

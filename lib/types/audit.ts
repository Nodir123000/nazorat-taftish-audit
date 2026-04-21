export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: "create" | "update" | "delete" | "calculate" | "export" | "approve"
  entityType: "employee" | "kpi-data" | "kpi-calculation" | "report" | "weights"
  entityId: string
  details: string
  ipAddress?: string
}

export interface ElectronicSignature {
  id: string
  documentId: string
  documentType: "kpi-report" | "quarterly-report" | "annual-report"
  signedBy: string
  signedByName: string
  signedByPosition: string
  signedAt: string
  signatureHash: string
  status: "pending" | "signed" | "rejected"
  comments?: string
}

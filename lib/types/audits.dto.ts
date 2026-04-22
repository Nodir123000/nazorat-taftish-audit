import { z } from "zod";

export const AuditResultStatusEnum = z.enum(["draft", "submitted", "approved"]);

export const AuditResultSchema = z.object({
    result_id: z.number(),
    task_id: z.number().optional(),
    order_id: z.number().optional(),
    audit_date: z.string(),
    findings_count: z.number(),
    violations_count: z.number(),
    total_amount: z.number().optional(),
    report_text: z.string().optional(),
    status: AuditResultStatusEnum.or(z.string()),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),

    // Extended fields for FinancialActivityPage
    unit: z.string().optional(),
    unitSubtitle: z.string().optional(),
    controlBody: z.string().optional(),
    inspectionDirection: z.string().optional(),
    inspectionDirectionSubtitle: z.string().optional(),
    inspectionType: z.string().optional(),
    cashier: z.string().optional(),
    cashierRole: z.string().optional(),
    balance: z.number().optional(),
    financialAmount: z.number().optional(),
    propertyAmount: z.number().optional(),
    recoveredAmount: z.number().optional(),
    resolvedViolations: z.number().optional(),
});

export type AuditResultDTO = z.infer<typeof AuditResultSchema>;

export const AuditSummaryStatsSchema = z.object({
    totalAudits: z.number(),
    totalFindings: z.number(),
    totalViolations: z.number(),
    totalAmount: z.number(),
    approvedReports: z.number(),
});

export type AuditSummaryStatsDTO = z.infer<typeof AuditSummaryStatsSchema>;

export const CreateAuditResultSchema = z.object({
    task_id: z.number(),
    audit_date: z.string(),
    findings_count: z.number(),
    violations_count: z.number(),
    total_amount: z.number().optional(),
    report_text: z.string().optional(),
    status: AuditResultStatusEnum.default("draft"),
});

export type CreateAuditResultDTO = z.infer<typeof CreateAuditResultSchema>;

export const CashCheckSchema = z.object({
    check_id: z.number(),
    check_date: z.string(),
    cash_type: z.string(),
    expected_amount: z.number(),
    actual_amount: z.number(),
    discrepancy: z.number(),
    status: z.string(),
    notes: z.string().optional(),
});

export type CashCheckDTO = z.infer<typeof CashCheckSchema>;

export const ServiceCheckSchema = z.object({
    id: z.number(),
    service: z.string(),
    items_checked: z.number(),
    violations: z.number(),
    status: z.string(),
});

export type ServiceCheckDTO = z.infer<typeof ServiceCheckSchema>;

export const StorageNormSchema = z.object({
    id: z.number(),
    item: z.string(),
    norm: z.number(),
    actual: z.number(),
    unit: z.string(),
    status: z.string(),
});

export type StorageNormDTO = z.infer<typeof StorageNormSchema>;

export const LawEnforcementCaseSchema = z.object({
    id: z.string().or(z.number()),
    violationId: z.string(),
    sourceViolationId: z.string().optional(),
    outgoingNumber: z.string(),
    outgoingDate: z.string(),
    recipientOrg: z.string(),
    amount: z.number(),
    recoveredAmount: z.number().optional(),
    status: z.string(),
    caseNumber: z.string().optional(),
    decision: z.string().optional(),
    type: z.string(),
    unitName: z.string().optional(),
});

export type LawEnforcementCaseDTO = z.infer<typeof LawEnforcementCaseSchema>;

export const ServiceInvestigationSchema = z.object({
    id: z.string(),
    prescriptionNum: z.string(),
    unitName: z.string(),
    violationSummary: z.string(),
    sourceViolationId: z.string().optional(),
    assignmentOrder: z.string(),
    responsiblePerson: z.string(),
    result: z.string(),
    punishmentOrder: z.string().optional(),
    amountToRecover: z.number().optional(),
    deadline: z.string(),
    status: z.string(),
});

export type ServiceInvestigationDTO = z.infer<typeof ServiceInvestigationSchema>;

export const ActiveAuditSchema = z.object({
    audit_id: z.number(),
    order_num: z.string(),
    unit_name: z.string(),
    unit_code: z.string(),
    audit_type: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    progress: z.number(),
    status: z.string(),
    chairman: z.string(),
    members_count: z.number(),
    violations_count: z.number(),
});

export type ActiveAuditDTO = z.infer<typeof ActiveAuditSchema>;

export const AuditReportSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    createdAt: z.string(),
    period: z.string(),
    author: z.string(),
    status: z.string(),
});

export type AuditReportDTO = z.infer<typeof AuditReportSchema>;

export const PreparationChecklistItemSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    completed: z.boolean(),
    required: z.boolean(),
});

export type PreparationChecklistItemDTO = z.infer<typeof PreparationChecklistItemSchema>;

export const SourceDocumentSchema = z.object({
    id: z.number(),
    name: z.string(),
    date: z.string(),
    status: z.string(),
});

export type SourceDocumentDTO = z.infer<typeof SourceDocumentSchema>;

export const AuditDocumentSchema = z.object({
    id: z.number(),
    name: z.string(),
    type: z.string(),
    date: z.string(),
    status: z.string(),
});

export type AuditDocumentDTO = z.infer<typeof AuditDocumentSchema>;

export const AuditEvidenceSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    date: z.string(),
    size: z.string(),
    description: z.string(),
    fileType: z.enum(['image', 'video', 'document', 'other']),
});

export type AuditEvidenceDTO = z.infer<typeof AuditEvidenceSchema>;

export const AuditViolationSchema = z.object({
    id: z.number(),
    auditId: z.number(),
    kind: z.string(),
    type: z.string(),
    source: z.string(),
    amount: z.number(),
    recovered: z.number(),
    count: z.number(),
    recoveredCount: z.number().optional(),
    responsible: z.string(),
});

export type AuditViolationDTO = z.infer<typeof AuditViolationSchema>;

// Financial Audit (Cash Audit) Schema
export const FinancialAuditSchema = z.object({
    id: z.number(),
    unit: z.string(),
    unitSubtitle: z.string(),
    controlBody: z.string(),
    inspectionDirection: z.string(),
    inspectionDirectionSubtitle: z.string(),
    inspectionType: z.string(),
    date: z.string(),
    cashier: z.string(),
    cashierRole: z.string(),
    balance: z.number(),
    status: z.string(),
    violations: z.number(),
    financialAmount: z.number(),
    propertyAmount: z.number(),
    recoveredAmount: z.number(),
    resolvedViolations: z.number(),
    inspectorId: z.number().optional(),
    inspectorName: z.string().optional(),
    prescriptionId: z.number().optional(),
});

export type FinancialAuditDTO = z.infer<typeof FinancialAuditSchema>;

export const CreateFinancialAuditSchema = FinancialAuditSchema.omit({
    id: true,
    violations: true,
    financialAmount: true,
    propertyAmount: true,
    recoveredAmount: true,
    resolvedViolations: true,
});

export type CreateFinancialAuditDTO = z.infer<typeof CreateFinancialAuditSchema>;

// Repayment history for a financial violation
export const RepaymentSchema = z.object({
    id: z.number(),
    violation_id: z.number(),
    dj_article: z.string(),
    document_name: z.string(),
    document_number: z.string(),
    document_date: z.string(),
    repaid_amount: z.number(),
    remainder_after: z.number(),
    created_at: z.string().optional(),
});

export type RepaymentDTO = z.infer<typeof RepaymentSchema>;

export const CreateRepaymentSchema = RepaymentSchema.omit({ id: true, created_at: true });
export type CreateRepaymentDTO = z.infer<typeof CreateRepaymentSchema>;

import { z } from "zod";

// --- Enums ---
export const PlanStatusEnum = z.enum(["DRAFT", "APPROVED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);

export const PlanTypeEnum = z.enum(["ANNUAL", "QUARTERLY", "MONTHLY", "UNPLANNED"]);

// --- Schemas ---

export const AnnualPlanSchema = z.object({
    id: z.union([z.string(), z.number()]),
    year: z.number().int().min(2020).max(2030),
    status: PlanStatusEnum,

    // Enhanced fields for UI
    unit: z.string().optional(), // e.g. "Ташкентский военный округ"
    startDate: z.string().optional(),
    endDate: z.string().optional(),

    responsible: z.string().optional(), // e.g. "Петров А.В."
    responsibleRank: z.string().optional(),
    responsiblePosition: z.string().optional(),

    approvedBy: z.string().optional(),
    approvedAt: z.string().optional(),

    incomingNumber: z.string().optional(),
    incomingDate: z.string().optional(),

    totalAudits: z.number().int().nonnegative().default(0),
    objectsFS: z.number().int().default(0),
    objectsOS: z.number().int().default(0),

    expenseClassification: z.string().optional(),
    supplyDepartment: z.string().optional(),

    description: z.string().optional(),

    controlAuthority: z.string().optional(),
    controlObject: z.string().optional(),
    inspectionDirection: z.number().optional(),
    inspectionType: z.number().optional(),

    createdAt: z.string(),
    updatedAt: z.string(),

    planNumber: z.string().optional(),
    subordinateUnitsOnAllowance: z.array(z.object({
        unitCode: z.string(),
        unitName: z.string(),
        allowanceType: z.string()
    })).optional(),
});

export const QuarterlyPlanSchema = z.object({
    id: z.string().uuid(),
    annualPlanId: z.string().uuid(),
    quarter: z.number().int().min(1).max(4),
    year: z.number().int(),
    status: PlanStatusEnum,
    plannedAudits: z.number().int().nonnegative().default(0),

    createdAt: z.string(),
    updatedAt: z.string(),
});

export const MonthlyPlanSchema = z.object({
    id: z.string().uuid(),
    quarterlyPlanId: z.string().uuid(),
    month: z.number().int().min(1).max(12),
    year: z.number().int(),
    status: PlanStatusEnum,
    plannedAudits: z.number().int().nonnegative().default(0),

    createdAt: z.string(),
    updatedAt: z.string(),
});

// --- DTOs ---

export type AnnualPlanDTO = z.infer<typeof AnnualPlanSchema>;
export type QuarterlyPlanDTO = z.infer<typeof QuarterlyPlanSchema>;
export type MonthlyPlanDTO = z.infer<typeof MonthlyPlanSchema>;

export const CreateAnnualPlanSchema = AnnualPlanSchema.pick({
    year: true,
    description: true,
    unit: true,
    startDate: true,
    endDate: true,
    responsible: true,
    responsibleRank: true,
    responsiblePosition: true,
    incomingNumber: true,
    incomingDate: true,
    totalAudits: true,
    objectsFS: true,
    objectsOS: true,
    expenseClassification: true,
    supplyDepartment: true,
    status: true,
});


export type CreateAnnualPlanDTO = z.infer<typeof CreateAnnualPlanSchema>;

export const OrderStatusEnum = z.enum(["DRAFT", "PENDING_SIGNATURE", "ACTIVE", "COMPLETED", "CANCELLED", "PLANNED"]);

export const OrderSchema = z.object({
    id: z.union([z.string(), z.number()]),
    orderNum: z.string(),
    date: z.string(),
    unit: z.string(),
    commander: z.string(),
    period: z.string(),
    status: z.union([OrderStatusEnum, z.string()]),
});

export type OrderDTO = z.infer<typeof OrderSchema>;

export const CreateOrderSchema = OrderSchema.omit({
    id: true,
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;

export const CommissionRoleEnum = z.enum(["CHAIRMAN", "MEMBER", "SECRETARY", "SPECIALIST"]);

export const CommissionMemberSchema = z.object({
    id: z.union([z.string(), z.number()]),
    orderId: z.union([z.string(), z.number()]).optional(),
    orderNum: z.string().optional(),
    role: z.union([CommissionRoleEnum, z.string()]),
    name: z.string(),
    rank: z.string().optional(),
    position: z.string().optional(),
    unit: z.string().optional(),
});

export type CommissionMemberDTO = z.infer<typeof CommissionMemberSchema>;

export const PrescriptionSchema = z.object({
    id: z.union([z.string(), z.number()]),
    prescriptionNum: z.string(),
    date: z.string(),
    leader: z.string(),
    deputy: z.string(),
    organization: z.string(),
    period: z.string(),
    status: z.string(),
});

export type PrescriptionDTO = z.infer<typeof PrescriptionSchema>;

export const BriefingTopicSchema = z.object({
    id: z.union([z.string(), z.number()]),
    topic: z.string(),
    duration: z.string().optional(),
    completed: z.boolean().default(false),
    notes: z.string().optional(),
    conductedDate: z.string().optional(),
    plannedDate: z.string().optional(),
});

export type BriefingTopicDTO = z.infer<typeof BriefingTopicSchema>;

export const UnplannedAuditSchema = z.object({
    plan_id: z.number(),
    year: z.number(),
    plan_number: z.string().optional(),
    start_date: z.string(),
    end_date: z.string(),
    unit_id: z.number().optional(),
    responsible_id: z.number().optional(),
    status: z.enum(["planned", "in_progress", "completed", "cancelled"]),
    description: z.string().optional(),
    planned_audits_count: z.number().optional(),
    completed_audits_count: z.number().optional(),
});

export type UnplannedAuditDTO = z.infer<typeof UnplannedAuditSchema>;

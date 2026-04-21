import { z } from "zod";

export const EmployeeSchema = z.object({
    id: z.string(),
    fullName: z.string(),
    rank: z.string(),
    position: z.string(),
    department: z.string(),
    employmentDate: z.string(),
    personnelNumber: z.string(),
    status: z.enum(["active", "inactive"])
});

export type Employee = z.infer<typeof EmployeeSchema>;
export type KPIEmployeeDTO = Employee;

export const KPIWeightsSchema = z.object({
    budgetViolationPrevention: z.number(),
    remoteControl: z.number(),
    annualPlanExecution: z.number(),
    proposalExecution: z.number(),
    violationElimination: z.number(),
    deadlineCompliance: z.number()
});

export type KPIWeights = z.infer<typeof KPIWeightsSchema>;

export const KPIPeriodDataSchema = z.object({
    employeeId: z.string(),
    period: z.string(), // "Q1-2025", "Q2-2025", etc.
    year: z.number(),
    quarter: z.number(),

    // Budget violation prevention
    bxBudget: z.number(), // Bx - current period
    btBudget: z.number(), // Bt - previous period

    // Remote control
    bxRemote: z.number(),
    btRemote: z.number(),

    // Annual plan execution
    plannedActivities: z.number(),
    actualActivities: z.number(),

    // Proposal execution
    proposalsPlanned: z.number(),
    proposalsCompleted: z.number(),

    // Violation elimination (by count)
    violationsIdentified: z.number(),
    violationsEliminated: z.number(),

    // Violation elimination (by amount)
    violationAmountIdentified: z.number(),
    violationAmountEliminated: z.number(),

    // Deadline compliance
    plannedDays: z.number(),
    actualDays: z.number()
});

export type KPIPeriodData = z.infer<typeof KPIPeriodDataSchema>;

export const KPICalculationResultSchema = z.object({
    employeeId: z.string(),
    period: z.string(),

    budgetViolationScore: z.number(),
    remoteControlScore: z.number(),
    annualPlanScore: z.number(),
    proposalExecutionScore: z.number(),
    violationEliminationCountScore: z.number(),
    violationEliminationAmountScore: z.number(),
    deadlineComplianceScore: z.number(),

    totalKPI: z.number(),
    rating: z.enum(["excellent", "good", "satisfactory", "unsatisfactory"]),

    calculatedAt: z.string(),
    calculatedBy: z.string()
});

export type KPICalculationResult = z.infer<typeof KPICalculationResultSchema>;

export const DEFAULT_WEIGHTS: KPIWeights = {
    budgetViolationPrevention: 0.2,
    remoteControl: 0.2,
    annualPlanExecution: 0.2,
    proposalExecution: 0.1,
    violationElimination: 0.1,
    deadlineCompliance: 0.2,
};

export interface Employee {
  id: string
  fullName: string
  rank: string
  position: string
  department: string
  employmentDate: string
  personnelNumber: string
  status: "active" | "inactive"
}

export interface KPIWeights {
  budgetViolationPrevention: number
  remoteControl: number
  annualPlanExecution: number
  proposalExecution: number
  violationElimination: number
  deadlineCompliance: number
}

export interface KPIPeriodData {
  employeeId: string
  period: string // "Q1-2025", "Q2-2025", etc.
  year: number
  quarter: number

  // Budget violation prevention
  bxBudget: number // Bx - current period
  btBudget: number // Bt - previous period

  // Remote control
  bxRemote: number
  btRemote: number

  // Annual plan execution
  plannedActivities: number
  actualActivities: number

  // Proposal execution
  proposalsPlanned: number
  proposalsCompleted: number

  // Violation elimination (by count)
  violationsIdentified: number
  violationsEliminated: number

  // Violation elimination (by amount)
  violationAmountIdentified: number
  violationAmountEliminated: number

  // Deadline compliance
  plannedDays: number
  actualDays: number
}

export interface KPICalculationResult {
  employeeId: string
  period: string

  budgetViolationScore: number
  remoteControlScore: number
  annualPlanScore: number
  proposalExecutionScore: number
  violationEliminationCountScore: number
  violationEliminationAmountScore: number
  deadlineComplianceScore: number

  totalKPI: number
  rating: "excellent" | "good" | "satisfactory" | "unsatisfactory"

  calculatedAt: string
  calculatedBy: string
}

export const DEFAULT_WEIGHTS: KPIWeights = {
  budgetViolationPrevention: 0.2,
  remoteControl: 0.2,
  annualPlanExecution: 0.2,
  proposalExecution: 0.1,
  violationElimination: 0.1,
  deadlineCompliance: 0.2,
}

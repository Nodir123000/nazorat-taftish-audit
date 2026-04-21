import type { KPIPeriodData, KPIWeights, KPICalculationResult } from "@/lib/types/kpi"
import { DEFAULT_WEIGHTS } from "@/lib/types/kpi"

/**
 * Calculate KPI based on the technical specification formulas
 *
 * Key rules:
 * 1. If Bt = 0 or missing, ratio = 1
 * 2. If Bx/Bt > 1, cap at 1
 * 3. Each component = (ratio) × weight × 100%
 * 4. Round to whole percentage
 * 5. No negative values allowed
 */
export function calculateKPI(data: KPIPeriodData, weights: KPIWeights = DEFAULT_WEIGHTS): KPICalculationResult {
  // Helper function to calculate ratio with validation
  const calculateRatio = (current: number, previous: number): number => {
    // Rule: If Bt = 0 or missing, ratio = 1
    if (!previous || previous === 0) {
      return 1
    }

    // Calculate ratio
    const ratio = current / previous

    // Rule: Cap ratio at 1 (Bx/Bt ≤ 1)
    return Math.min(ratio, 1)
  }

  // 1. Budget violation prevention: (Bx / Bt) × weight × 100%
  const budgetRatio = calculateRatio(data.bxBudget, data.btBudget)
  const budgetViolationScore = Math.round(budgetRatio * weights.budgetViolationPrevention * 100)

  // 2. Remote control: (Bx / Bt) × weight × 100%
  const remoteRatio = calculateRatio(data.bxRemote, data.btRemote)
  const remoteControlScore = Math.round(remoteRatio * weights.remoteControl * 100)

  // 3. Annual plan execution: (actual / planned) × weight × 100%
  const planRatio = calculateRatio(data.actualActivities, data.plannedActivities)
  const annualPlanScore = Math.round(planRatio * weights.annualPlanExecution * 100)

  // 4. Proposal execution: (completed / planned) × weight × 100%
  const proposalRatio = calculateRatio(data.proposalsCompleted, data.proposalsPlanned)
  const proposalExecutionScore = Math.round(proposalRatio * weights.proposalExecution * 100)

  // 5. Violation elimination by count: (eliminated / identified) × weight × 100%
  const violationCountRatio = calculateRatio(data.violationsEliminated, data.violationsIdentified)
  const violationEliminationCountScore = Math.round(violationCountRatio * (weights.violationElimination / 2) * 100)

  // 6. Violation elimination by amount: (amount eliminated / amount identified) × weight × 100%
  const violationAmountRatio = calculateRatio(data.violationAmountEliminated, data.violationAmountIdentified)
  const violationEliminationAmountScore = Math.round(violationAmountRatio * (weights.violationElimination / 2) * 100)

  // 7. Deadline compliance: (planned days / actual days) × weight × 100%
  const deadlineRatio = calculateRatio(data.plannedDays, data.actualDays)
  const deadlineComplianceScore = Math.round(deadlineRatio * weights.deadlineCompliance * 100)

  // Calculate total KPI (sum of all components)
  const totalKPI =
    budgetViolationScore +
    remoteControlScore +
    annualPlanScore +
    proposalExecutionScore +
    violationEliminationCountScore +
    violationEliminationAmountScore +
    deadlineComplianceScore

  // Determine rating based on total KPI
  const rating = getRating(totalKPI)

  return {
    employeeId: data.employeeId,
    period: data.period,
    budgetViolationScore,
    remoteControlScore,
    annualPlanScore,
    proposalExecutionScore,
    violationEliminationCountScore,
    violationEliminationAmountScore,
    deadlineComplianceScore,
    totalKPI,
    rating,
    calculatedAt: new Date().toISOString(),
    calculatedBy: "system",
  }
}

/**
 * Determine rating based on KPI score
 *
 * Rating system:
 * - ≤56: unsatisfactory
 * - 56-71: satisfactory
 * - 71-86: good
 * - >86: excellent
 */
export function getRating(kpi: number): "excellent" | "good" | "satisfactory" | "unsatisfactory" {
  if (kpi > 86) return "excellent"
  if (kpi > 71) return "good"
  if (kpi > 56) return "satisfactory"
  return "unsatisfactory"
}

/**
 * Get color for rating badge
 */
export function getRatingColor(rating: string): string {
  switch (rating) {
    case "excellent":
      return "bg-secondary/20 text-secondary-foreground border-secondary/30"
    case "good":
      return "bg-primary/20 text-primary-foreground border-primary/30"
    case "satisfactory":
      return "bg-warning/20 text-warning-foreground border-warning/30"
    case "unsatisfactory":
      return "bg-destructive/20 text-destructive-foreground border-destructive/30"
    default:
      return "bg-muted text-muted-foreground"
  }
}

/**
 * Get Russian label for rating
 */
export function getRatingLabel(rating: string): string {
  switch (rating) {
    case "excellent":
      return "Отлично"
    case "good":
      return "Хорошо"
    case "satisfactory":
      return "Удовлетворительно"
    case "unsatisfactory":
      return "Неудовлетворительно"
    default:
      return "—"
  }
}

/**
 * Validate KPI input data
 */
export function validateKPIData(data: Partial<KPIPeriodData>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check for negative values
  const numericFields: (keyof KPIPeriodData)[] = [
    "bxBudget",
    "btBudget",
    "bxRemote",
    "btRemote",
    "plannedActivities",
    "actualActivities",
    "proposalsPlanned",
    "proposalsCompleted",
    "violationsIdentified",
    "violationsEliminated",
    "violationAmountIdentified",
    "violationAmountEliminated",
    "plannedDays",
    "actualDays",
  ]

  numericFields.forEach((field) => {
    const value = data[field] as number
    if (value !== undefined && value < 0) {
      errors.push(`Поле "${field}" не может быть отрицательным`)
    }
  })

  // Check required fields
  if (!data.employeeId) {
    errors.push("Не выбран сотрудник")
  }

  if (!data.period) {
    errors.push("Не выбран период")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

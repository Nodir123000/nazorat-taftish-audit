"use client"
import { AnalyticsPageClient } from "@/components/kpi/analytics-page-client"
import { Suspense } from "react"
import { useTranslation } from "@/lib/i18n/hooks"

// Mock data
const trendData = [
  { period: "Q1 2024", kpi: 78 },
  { period: "Q2 2024", kpi: 81 },
  { period: "Q3 2024", kpi: 83 },
  { period: "Q4 2024", kpi: 82 },
  { period: "Q1 2025", kpi: 84 },
]

const employeeRankingData = [
  { name: "Иванов И.И.", kpi: 91, rating: "excellent" },
  { name: "Петров П.П.", kpi: 84, rating: "good" },
  { name: "Сидоров С.С.", kpi: 78, rating: "good" },
]

const ratingDistributionData = [
  { name: "Отлично", value: 1, color: "hsl(var(--secondary))" },
  { name: "Хорошо", value: 2, color: "hsl(var(--primary))" },
  { name: "Удовлетворительно", value: 0, color: "hsl(var(--warning))" },
  { name: "Неудовлетворительно", value: 0, color: "hsl(var(--destructive))" },
]

const componentBreakdownData = [
  { component: "Бюджет", value: 16, color: "#3b82f6" }, // blue
  { component: "Дист. контроль", value: 17, color: "#10b981" }, // green
  { component: "План", value: 18, color: "#8b5cf6" }, // purple
  { component: "Предложения", value: 8, color: "#f59e0b" }, // amber
  { component: "Нарушения (кол.)", value: 4, color: "#ef4444" }, // red
  { component: "Нарушения (сум.)", value: 4, color: "#ec4899" }, // pink
  { component: "Сроки", value: 17, color: "#06b6d4" }, // cyan
]

const mockEmployeeReports = [
  {
    id: "1",
    employeeName: "Иванов Иван Иванович",
    rank: "Подполковник",
    position: "Начальник отдела",
    period: "Q1-2025",
    budgetViolationScore: 17,
    remoteControlScore: 18,
    annualPlanScore: 19,
    proposalExecutionScore: 9,
    violationEliminationCountScore: 5,
    violationEliminationAmountScore: 5,
    deadlineComplianceScore: 18,
    totalKPI: 91,
    rating: "excellent" as const,
  },
  {
    id: "2",
    employeeName: "Петров Петр Петрович",
    rank: "Майор",
    position: "Старший инспектор",
    period: "Q1-2025",
    budgetViolationScore: 16,
    remoteControlScore: 17,
    annualPlanScore: 18,
    proposalExecutionScore: 8,
    violationEliminationCountScore: 4,
    violationEliminationAmountScore: 4,
    deadlineComplianceScore: 17,
    totalKPI: 84,
    rating: "good" as const,
  },
  {
    id: "3",
    employeeName: "Сидоров Сидор Сидорович",
    rank: "Капитан",
    position: "Инспектор",
    period: "Q1-2025",
    budgetViolationScore: 15,
    remoteControlScore: 16,
    annualPlanScore: 17,
    proposalExecutionScore: 7,
    violationEliminationCountScore: 4,
    violationEliminationAmountScore: 3,
    deadlineComplianceScore: 16,
    totalKPI: 78,
    rating: "good" as const,
  },
]

const mockDepartmentSummary = {
  period: "Q1-2025",
  totalEmployees: 3,
  averageKPI: 84,
  excellentCount: 1,
  goodCount: 2,
  satisfactoryCount: 0,
  unsatisfactoryCount: 0,
}

const mockQuarterlyData = [
  { quarter: "Q1-2024", averageKPI: 78, employeeCount: 3 },
  { quarter: "Q2-2024", averageKPI: 81, employeeCount: 3 },
  { quarter: "Q3-2024", averageKPI: 83, employeeCount: 3 },
  { quarter: "Q4-2024", averageKPI: 82, employeeCount: 3 },
  { quarter: "Q1-2025", averageKPI: 84, employeeCount: 3 },
]

export default function AnalyticsPage() {
  const { t } = useTranslation()

  return (
    <Suspense fallback={<div className="p-6">{t("kpi.analytics.loading")}</div>}>
      <AnalyticsPageClient />
    </Suspense>
  )
}

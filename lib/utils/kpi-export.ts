import type { KPICalculationResult } from "@/lib/types/kpi"
import { getRatingLabel } from "./kpi-calculator"

/**
 * Export KPI data to CSV format
 */
export function exportToCSV(data: KPICalculationResult[], filename = "kpi-report.csv") {
  const headers = [
    "Период",
    "ID Сотрудника",
    "Бюджет (%)",
    "Дист. контроль (%)",
    "План (%)",
    "Предложения (%)",
    "Нарушения кол. (%)",
    "Нарушения сум. (%)",
    "Сроки (%)",
    "Итоговый KPI (%)",
    "Оценка",
    "Дата расчёта",
    "Рассчитал",
  ]

  const rows = data.map((item) => [
    item.period,
    item.employeeId,
    item.budgetViolationScore,
    item.remoteControlScore,
    item.annualPlanScore,
    item.proposalExecutionScore,
    item.violationEliminationCountScore,
    item.violationEliminationAmountScore,
    item.deadlineComplianceScore,
    item.totalKPI,
    getRatingLabel(item.rating),
    new Date(item.calculatedAt).toLocaleString("ru-RU"),
    item.calculatedBy,
  ])

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export KPI data to Excel format (simplified - generates CSV that Excel can open)
 */
export function exportToExcel(data: KPICalculationResult[], filename = "kpi-report.xlsx") {
  // For a real implementation, you would use a library like xlsx or exceljs
  // This is a simplified version that creates a CSV file
  exportToCSV(data, filename.replace(".xlsx", ".csv"))
}

/**
 * Generate PDF report (placeholder - would require a PDF library)
 */
export function exportToPDF(data: KPICalculationResult[], filename = "kpi-report.pdf") {
  // In a real implementation, you would use a library like jsPDF or pdfmake
  console.log("[v0] PDF export requested for:", filename)
  alert("Функция экспорта в PDF будет реализована с использованием библиотеки jsPDF")
}

/**
 * Generate DOCX report (placeholder - would require a DOCX library)
 */
export function exportToDOCX(data: KPICalculationResult[], filename = "kpi-report.docx") {
  // In a real implementation, you would use a library like docx
  console.log("[v0] DOCX export requested for:", filename)
  alert("Функция экспорта в DOCX будет реализована с использованием библиотеки docx")
}

/**
 * Print report
 */
export function printReport() {
  window.print()
}

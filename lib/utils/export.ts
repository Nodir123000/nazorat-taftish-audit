// Utility functions for exporting data to various formats

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    alert("Нет данных для экспорта")
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Escape quotes and wrap in quotes if contains comma
          const stringValue = String(value ?? "")
          return stringValue.includes(",") || stringValue.includes('"')
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue
        })
        .join(","),
    ),
  ].join("\n")

  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = "\uFEFF"
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
  downloadBlob(blob, `${filename}.csv`)
}

export async function exportToExcel(data: any[], filename: string, sheetName = "Данные") {
  if (data.length === 0) {
    alert("Нет данных для экспорта")
    return
  }

  try {
    // Dynamic import of xlsx library
    const XLSX = await import("xlsx")

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Create workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

    downloadBlob(blob, `${filename}.xlsx`)
  } catch (error) {
    console.error("Error exporting to Excel:", error)
    alert("Ошибка при экспорте в Excel")
  }
}

export function exportToJSON(data: any[], filename: string) {
  if (data.length === 0) {
    alert("Нет данных для экспорта")
    return
  }

  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json" })
  downloadBlob(blob, `${filename}.json`)
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Format data for export with readable labels
export function formatDataForExport<T extends Record<string, any>>(
  data: T[],
  columnMapping: Partial<Record<keyof T, string>>,
): any[] {
  return data.map((item) => {
    const formatted: Record<string, any> = {}
    Object.entries(columnMapping).forEach(([key, label]) => {
      if (label) {
        formatted[label as string] = item[key]
      }
    })
    return formatted
  })
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { exportToCSV, exportToExcel, exportToJSON } from "@/lib/utils/export"

interface ExportButtonProps {
  data: any[]
  filename: string
  disabled?: boolean
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function ExportButton({ data, filename, disabled, variant = "outline", size = "default" }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: "csv" | "excel" | "json") => {
    setIsExporting(true)
    try {
      switch (format) {
        case "csv":
          exportToCSV(data, filename)
          break
        case "excel":
          await exportToExcel(data, filename)
          break
        case "json":
          exportToJSON(data, filename)
          break
      }
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={disabled || isExporting}>
          {isExporting ? (
            <>
              <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Экспорт...
            </>
          ) : (
            <>
              <Icons.Download className="mr-2 h-4 w-4" />
              Экспорт
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <Icons.FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <Icons.FileText className="mr-2 h-4 w-4" />
          CSV (.csv)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          <Icons.FileJson className="mr-2 h-4 w-4" />
          JSON (.json)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

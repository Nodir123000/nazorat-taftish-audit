"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface KPIDashboardHeaderProps {
    selectedYear: string
    onYearChange: (year: string) => void
    selectedPeriod: string
    onPeriodChange: (period: string) => void
}

export function KPIDashboardHeader({
    selectedYear,
    onYearChange,
    selectedPeriod,
    onPeriodChange
}: KPIDashboardHeaderProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/50 backdrop-blur-md p-4 rounded-xl border border-slate-200">
            <div>
                <h1 className="text-2xl font-bold text-blue-900">Дашборд эффективности (KPI)</h1>
                <p className="text-sm text-slate-500">Анализ ключевых показателей деятельности</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Select value={selectedYear} onValueChange={onYearChange}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Год" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2024">2024 год</SelectItem>
                        <SelectItem value="2025">2025 год</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={selectedPeriod} onValueChange={onPeriodChange}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Период" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Q1-2025">1 квартал</SelectItem>
                        <SelectItem value="Q2-2025">2 квартал</SelectItem>
                        <SelectItem value="Q3-2025">3 квартал</SelectItem>
                        <SelectItem value="Q4-2025">4 квартал</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Экспорт
                </Button>
            </div>
        </div>
    )
}

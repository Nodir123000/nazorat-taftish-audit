"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n/hooks"
import { useServiceInvestigations } from "@/lib/hooks/use-audits"
import { ServiceInvestigationStats } from "./service-investigation-stats"
import { ServiceInvestigationFilters } from "./service-investigation-filters"
import { ServiceInvestigationTable } from "./service-investigation-table"
import { ErrorBoundary } from "@/components/error-boundary"
import { ServiceInvestigationDTO } from "@/lib/types/audits.dto"

export function ServiceInvestigationsRegistry() {
    const { t } = useTranslation()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")

    const { data: investigations = [], isLoading } = useServiceInvestigations()

    const filtered = investigations.filter((si: ServiceInvestigationDTO) => {
        const matchesSearch = si.prescriptionNum.toLowerCase().includes(search.toLowerCase()) ||
            si.unitName.toLowerCase().includes(search.toLowerCase()) ||
            si.responsiblePerson.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter ? si.status === statusFilter : true
        return matchesSearch && matchesStatus
    })

    const handleReset = () => {
        setSearch("")
        setStatusFilter("")
    }

    return (
        <div className="space-y-6">
            <ErrorBoundary>
                <ServiceInvestigationStats
                    investigations={investigations}
                    isLoading={isLoading}
                />
            </ErrorBoundary>

            <ErrorBoundary>
                <ServiceInvestigationFilters
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    onReset={handleReset}
                />
            </ErrorBoundary>

            <ErrorBoundary>
                <Card className="border-slate-200 shadow-lg overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between bg-white border-b border-slate-100 py-6 px-8">
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">
                                {t("audits.serviceInvestigations.title")}
                            </CardTitle>
                            <CardDescription className="text-slate-500 font-medium mt-1">
                                {t("audits.serviceInvestigations.description")}
                            </CardDescription>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" size="sm" className="gap-2 h-10 px-4 font-bold border-slate-200 hover:bg-slate-50 transition-all">
                                <Icons.Download className="w-4 h-4 text-emerald-600" />
                                <span className="text-slate-700">Excel</span>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 h-10 px-4 font-bold border-slate-200 hover:bg-slate-50 transition-all">
                                <Icons.Printer className="w-4 h-4 text-blue-600" />
                                <span className="text-slate-700">{t("audits.financial.export.pdf") || "Печать / PDF"}</span>
                            </Button>
                        </div>
                    </CardHeader>
                    <div className="p-0">
                        <ServiceInvestigationTable
                            data={filtered}
                            isLoading={isLoading}
                            search={search}
                            statusFilter={statusFilter}
                            onReset={handleReset}
                        />
                    </div>
                </Card>
            </ErrorBoundary>
        </div>
    )
}

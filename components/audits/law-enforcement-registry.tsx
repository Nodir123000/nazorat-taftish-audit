"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n/hooks"
import { useLawEnforcementCases } from "@/lib/hooks/use-audits"
import { LawEnforcementStats } from "./law-enforcement-stats"
import { LawEnforcementFilters } from "./law-enforcement-filters"
import { LawEnforcementTable } from "./law-enforcement-table"
import { ErrorBoundary } from "@/components/error-boundary"
import { LawEnforcementCaseDTO } from "@/lib/types/audits.dto"

export function LawEnforcementRegistry() {
    const { t } = useTranslation()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")

    const { data: cases = [], isLoading } = useLawEnforcementCases()

    const filteredCases = cases.filter((c: LawEnforcementCaseDTO) => {
        const matchesSearch = c.violationId.toLowerCase().includes(search.toLowerCase()) ||
            c.recipientOrg.toLowerCase().includes(search.toLowerCase()) ||
            c.outgoingNumber.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter ? c.status === statusFilter : true
        return matchesSearch && matchesStatus
    })

    const handleReset = () => {
        setSearch("")
        setStatusFilter("")
    }

    return (
        <div className="space-y-8">
            <ErrorBoundary>
                <LawEnforcementStats
                    cases={cases}
                    isLoading={isLoading}
                />
            </ErrorBoundary>

            <ErrorBoundary>
                <LawEnforcementFilters
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    onReset={handleReset}
                />
            </ErrorBoundary>

            <ErrorBoundary>
                <Card className="border-slate-200 shadow-2xl rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between bg-slate-50/50 border-b border-slate-100 py-8 px-8 gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary rounded-lg shadow-lg shadow-primary/20">
                                    <Icons.Gavel className="w-5 h-5 text-white" />
                                </div>
                                <CardTitle className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                                    {t("audits.lawEnforcement.title")}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-slate-500 font-bold mt-2 text-md ml-11">
                                {t("audits.lawEnforcement.description")}
                            </CardDescription>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="gap-2 h-12 px-6 font-black rounded-xl border-slate-200 hover:bg-white hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
                                <Icons.Download className="w-4 h-4 text-emerald-600" />
                                <span>EXCEL</span>
                            </Button>
                            <Button variant="outline" className="gap-2 h-12 px-6 font-black rounded-xl border-slate-200 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                                <Icons.Printer className="w-4 h-4 text-blue-600" />
                                <span>{t("audits.financial.export.pdf") || "ПЕЧАТЬ"}</span>
                            </Button>
                        </div>
                    </CardHeader>
                    <div className="p-0">
                        <LawEnforcementTable
                            data={filteredCases}
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

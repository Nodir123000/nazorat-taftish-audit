"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n/hooks"
import { LawEnforcementCaseDTO } from "@/lib/types/audits.dto"
import { Skeleton } from "@/components/ui/skeleton"

interface LawEnforcementStatsProps {
    cases: LawEnforcementCaseDTO[]
    isLoading: boolean
}

export function LawEnforcementStats({ cases, isLoading }: LawEnforcementStatsProps) {
    const { t } = useTranslation()

    const stats = {
        total: cases.length,
        criminal: cases.filter((c) => c.status === "Возбуждено УД").length,
        review: cases.filter((c) => c.status === "На рассмотрении").length,
        totalAmount: cases.reduce((sum, c) => sum + c.amount, 0),
        recovered: 125000000,
        decisions: cases.filter((c) => c.decision && c.decision !== "В процессе").length
    }

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-900">{t("audits.lawEnforcement.stats.total")}</CardTitle>
                    <div className="rounded-full bg-blue-500 p-2 ring-4 ring-blue-200">
                        <Icons.FileText className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-blue-700">{stats.total}</div>
                    <p className="text-xs text-blue-600 mt-1">Передано материалов</p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-red-900">{t("audits.lawEnforcement.stats.criminal")}</CardTitle>
                    <div className="rounded-full bg-red-500 p-2 ring-4 ring-red-200">
                        <Icons.Shield className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-red-700">{stats.criminal}</div>
                    <p className="text-xs text-red-600 mt-1">Уголовных дел</p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-900">{t("audits.lawEnforcement.stats.review")}</CardTitle>
                    <div className="rounded-full bg-yellow-500 p-2 ring-4 ring-yellow-200">
                        <Icons.Clock className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-yellow-700">{stats.review}</div>
                    <p className="text-xs text-yellow-600 mt-1">Ожидают решения</p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-900">{t("audits.lawEnforcement.stats.damage")}</CardTitle>
                    <div className="rounded-full bg-purple-500 p-2 ring-4 ring-purple-200">
                        <Icons.TrendingUp className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-xl font-bold text-purple-700">{stats.totalAmount.toLocaleString()}</div>
                    <p className="text-xs text-purple-600 mt-1 uppercase">uzs</p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-900">{t("audits.lawEnforcement.stats.recovered")}</CardTitle>
                    <div className="rounded-full bg-emerald-500 p-2 ring-4 ring-emerald-200">
                        <Icons.CheckCircle className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-xl font-bold text-emerald-700">{stats.recovered.toLocaleString()}</div>
                    <p className="text-xs text-emerald-600 mt-1 uppercase">uzs</p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-900">{t("audits.lawEnforcement.stats.decisions")}</CardTitle>
                    <div className="rounded-full bg-slate-500 p-2 ring-4 ring-slate-200">
                        <Icons.Gavel className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-700">{stats.decisions}</div>
                    <p className="text-xs text-slate-600 mt-1">Принято решений</p>
                </CardContent>
            </Card>
        </div>
    )
}

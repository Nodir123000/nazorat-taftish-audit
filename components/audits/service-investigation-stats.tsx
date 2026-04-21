"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n/hooks"
import { ServiceInvestigationDTO } from "@/lib/types/audits.dto"
import { Skeleton } from "@/components/ui/skeleton"

interface ServiceInvestigationStatsProps {
    investigations: ServiceInvestigationDTO[]
    isLoading: boolean
}

export function ServiceInvestigationStats({ investigations, isLoading }: ServiceInvestigationStatsProps) {
    const { t } = useTranslation()

    const stats = {
        total: investigations.length,
        completed: investigations.filter((si) => si.status === "Завершено").length,
        process: investigations.filter((si) => si.status === "В процессе").length,
        recoverable: investigations.reduce((sum, si) => sum + (si.amountToRecover || 0), 0),
        recovered: investigations.reduce((sum, si) => sum + (si.amountToRecover ? (si.amountToRecover * 0.4) : 0), 0), // Mock 40% recovery
        overdue: investigations.filter((si) => si.status === "Просрочено").length
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
                    <CardTitle className="text-sm font-medium text-blue-900">{t("audits.serviceInvestigations.stats.total")}</CardTitle>
                    <div className="rounded-full bg-blue-500 p-2 ring-4 ring-blue-200">
                        <Icons.FileText className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-blue-700">{stats.total}</div>
                    <p className="text-xs text-blue-600 mt-1">Всего расследований</p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-900">{t("audits.serviceInvestigations.stats.completed")}</CardTitle>
                    <div className="rounded-full bg-green-500 p-2 ring-4 ring-green-200">
                        <Icons.CheckCircle className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-green-700">{stats.completed}</div>
                    <p className="text-xs text-green-600 mt-1">Завершено</p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-900">{t("audits.serviceInvestigations.stats.process")}</CardTitle>
                    <div className="rounded-full bg-yellow-500 p-2 ring-4 ring-yellow-200">
                        <Icons.Clock className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-yellow-700">{stats.process}</div>
                    <p className="text-xs text-yellow-600 mt-1">В процессе</p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-900">{t("audits.serviceInvestigations.stats.recoverable")}</CardTitle>
                    <div className="rounded-full bg-purple-500 p-2 ring-4 ring-purple-200">
                        <Icons.TrendingUp className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-xl font-bold text-purple-700">{stats.recoverable.toLocaleString()}</div>
                    <p className="text-xs text-purple-600 mt-1 uppercase">uzs</p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-900">{t("audits.serviceInvestigations.stats.recovered")}</CardTitle>
                    <div className="rounded-full bg-emerald-500 p-2 ring-4 ring-emerald-200">
                        <Icons.Check className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-xl font-bold text-emerald-700">{Math.round(stats.recovered).toLocaleString()}</div>
                    <p className="text-xs text-emerald-600 mt-1 uppercase">uzs</p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-red-900">{t("audits.serviceInvestigations.stats.overdue")}</CardTitle>
                    <div className="rounded-full bg-red-500 p-2 ring-4 ring-red-200">
                        <Icons.AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-red-700">{stats.overdue}</div>
                    <p className="text-xs text-red-600 mt-1 uppercase">просрочено</p>
                </CardContent>
            </Card>
        </div>
    )
}

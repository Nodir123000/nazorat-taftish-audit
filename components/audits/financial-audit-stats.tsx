"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { FinancialAuditDTO, AuditViolationDTO } from "@/lib/types/audits.dto"
import { useTranslation } from "@/lib/i18n/hooks"

interface FinancialAuditStatsProps {
    audits: FinancialAuditDTO[]
    violations: AuditViolationDTO[]
    isLoading?: boolean
}

export function FinancialAuditStats({ audits, violations, isLoading }: FinancialAuditStatsProps) {
    const { t } = useTranslation()
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

    const totalAudits = audits.length
    const checkedAudits = audits.filter((a) => a.status === "Проверено").length
    const inProcessAudits = audits.filter((a) => a.status === "В процессе").length
    const totalAmount = violations.reduce((sum, v) => sum + v.amount, 0)
    const recoveredAmount = violations.reduce((sum, v) => sum + v.recovered, 0)
    const violationsCount = violations.reduce((sum, v) => sum + v.count, 0)

    const stats = [
        {
            title: t("audits.financial.stats.totalChecks"),
            value: totalAudits,
            label: t("audits.financial.stats.forPeriod"),
            icon: Icons.FileText,
            color: "blue",
            gradient: "from-blue-50 to-blue-100",
            borderColor: "border-blue-200",
            iconBg: "bg-blue-500",
            ringColor: "ring-blue-200",
            textColor: "text-blue-700",
            subTextColor: "text-blue-600"
        },
        {
            title: t("audits.financial.stats.checked"),
            value: checkedAudits,
            label: t("audits.financial.stats.objects"),
            icon: Icons.Check,
            color: "green",
            gradient: "from-green-50 to-green-100",
            borderColor: "border-green-200",
            iconBg: "bg-green-500",
            ringColor: "ring-green-200",
            textColor: "text-green-700",
            subTextColor: "text-green-600"
        },
        {
            title: t("audits.financial.stats.inProcess"),
            value: inProcessAudits,
            label: t("audits.financial.stats.checks"),
            icon: Icons.Clock,
            color: "yellow",
            gradient: "from-yellow-50 to-yellow-100",
            borderColor: "border-yellow-200",
            iconBg: "bg-yellow-500",
            ringColor: "ring-yellow-200",
            textColor: "text-yellow-700",
            subTextColor: "text-yellow-600"
        },
        {
            title: t("audits.financial.stats.totalAmount"),
            value: totalAmount.toLocaleString(),
            label: "сум",
            icon: Icons.TrendingUp,
            color: "red",
            gradient: "from-red-50 to-red-100",
            borderColor: "border-red-200",
            iconBg: "bg-red-500",
            ringColor: "ring-red-200",
            textColor: "text-red-700",
            subTextColor: "text-red-600"
        },
        {
            title: t("audits.financial.stats.recovered"),
            value: recoveredAmount.toLocaleString(),
            label: "сум",
            icon: Icons.CheckCircle,
            color: "emerald",
            gradient: "from-emerald-50 to-emerald-100",
            borderColor: "border-emerald-200",
            iconBg: "bg-emerald-500",
            ringColor: "ring-emerald-200",
            textColor: "text-emerald-700",
            subTextColor: "text-emerald-600"
        },
        {
            title: t("audits.financial.stats.violations"),
            value: violationsCount,
            label: t("audits.financial.stats.detected"),
            icon: Icons.AlertTriangle,
            color: "purple",
            gradient: "from-purple-50 to-purple-100",
            borderColor: "border-purple-200",
            iconBg: "bg-purple-500",
            ringColor: "ring-purple-200",
            textColor: "text-purple-700",
            subTextColor: "text-purple-600"
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat, idx) => (
                <Card key={idx} className={`relative overflow-hidden border-2 ${stat.borderColor} bg-gradient-to-br ${stat.gradient} hover:scale-105 transition-transform duration-200`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium ${stat.textColor}`}>{stat.title}</CardTitle>
                        <div className={`rounded-full ${stat.iconBg} p-2 ring-4 ${stat.ringColor}`}>
                            <stat.icon className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
                        <p className={`text-xs ${stat.subTextColor} mt-1`}>{stat.label}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

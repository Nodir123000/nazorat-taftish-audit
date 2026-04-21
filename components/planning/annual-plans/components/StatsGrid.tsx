import React from "react"
import { Icons } from "@/components/icons"
import { StatsCard } from "./StatsCard"
import { useTranslation } from "@/lib/i18n/hooks"

import { getLocalizedAuthorityName } from "@/lib/utils/localization"

interface StatsGridProps {
    plans: any[]
    locale: string
    onStatClick?: (status: string | null) => void
    activeStatus?: string | null
    supplyDepartments?: any[]
}

export function StatsGrid({ plans, locale, onStatClick, activeStatus, supplyDepartments = [] }: StatsGridProps) {
    const { t } = useTranslation()

    // 1. Completion Rate
    const completedCount = plans.filter(p => p.status === 'completed' || p.status === 105 || p.status === "105").length
    const completionRate = plans.length > 0 ? Math.round((completedCount / plans.length) * 100) : 0

    // 2. Overdue/Urgent Plans
    const now = new Date()
    const overdueCount = plans.filter(p => {
        const isNotFinal = p.status !== 101 && p.status !== 105 && p.status !== 'approved' && p.status !== 'completed' && p.status !== "101" && p.status !== "105"
        const startDate = p.periodCoveredStart ? new Date(p.periodCoveredStart) : null
        return isNotFinal && startDate && startDate < now
    }).length

    // 3. Geography (Unique Districts)
    const uniqueDistricts = new Set(plans.map(p => p.controlObjectSubtitle).filter(Boolean)).size

    // 4. Load (Most active authority)
    const authorityCounts: Record<string, number> = {}
    plans.forEach(p => {
        const auth = p.controlAuthority
        if (auth) authorityCounts[auth] = (authorityCounts[auth] || 0) + 1
    })
    const topAuthorityId = Object.entries(authorityCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    const topAuthorityName = topAuthorityId ? getLocalizedAuthorityName(topAuthorityId, locale as any, supplyDepartments, 'short') : "—"

    return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 mb-6">
            <StatsCard
                title={t("annual.stats.totalPlans")}
                value={plans.length}
                subtitle={t("annual.stats.inSystem")}
                icon={Icons.FileText}
                color="blue"
                onClick={() => onStatClick?.(null)}
                isActive={!activeStatus || activeStatus === "all"}
            />
            <StatsCard
                title={t("annual.stats.approved")}
                value={plans.filter((p: any) => p.status === 101 || p.status === "101" || p.status === "approved").length}
                subtitle={t("annual.stats.plans")}
                icon={Icons.Check}
                color="green"
                onClick={() => onStatClick?.("approved")}
                isActive={activeStatus === "approved"}
            />
            <StatsCard
                title={t("annual.stats.completion")}
                value={`${completionRate}%`}
                subtitle={t("annual.stats.completionDesc")}
                icon={Icons.PieChart}
                color="teal"
            />
            <StatsCard
                title={t("annual.stats.overdue")}
                value={overdueCount}
                subtitle={t("annual.stats.overdueDesc")}
                icon={Icons.AlertTriangle}
                color="red"
            />
            <StatsCard
                title={t("annual.stats.objectsCoverage")}
                value={plans.reduce((acc: number, p: any) => acc + (p.objectsFS || 0) + (p.objectsOS || 0), 0)}
                subtitle={t("annual.stats.objectsDesc")}
                icon={Icons.Building}
                color="purple"
            />
        </div>
    )
}

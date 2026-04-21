"use client"

import { Icons } from "@/components/icons"
import { StatsCardsGrid } from "@/components/ui/stats-card"
import { useTranslation } from "@/lib/i18n/hooks"
import { UniversalOrdersRegistry } from "./universal-registry"

export function UnifiedOrdersView({ initialPlans = [] }: { initialPlans?: any[] }) {
    const { t } = useTranslation()

    // Статистика вычисляется из реальных данных БД (rev_plan_year с JOIN)
    const totalOrders = initialPlans.reduce(
        (sum, p) => sum + (p.orders?.length || 0), 0
    )
    const activeOrders = initialPlans
        .filter(p => p.status === "approved" || p.status === "in_progress")
        .reduce((sum, p) => sum + (p.orders?.length || 0), 0)

    const totalCommissionMembers = initialPlans.reduce(
        (sum, p) => sum + (p.orders || []).reduce(
            (s: number, o: any) => s + (o.commission_members?.length || 0), 0
        ), 0
    )
    const plansWithCommission = initialPlans.filter(
        p => (p.orders || []).some((o: any) => (o.commission_members?.length || 0) > 0)
    ).length

    const totalPrescriptions = initialPlans.reduce(
        (sum, p) => sum + (p.prescriptions?.length || 0), 0
    )
    const issuedPrescriptions = initialPlans.reduce(
        (sum, p) => sum + (p.prescriptions || []).filter((pr: any) => pr.status === "issued").length, 0
    )

    const totalBriefings = initialPlans.reduce(
        (sum, p) => sum + (p.briefings?.length || 0), 0
    )
    const conductedBriefings = initialPlans.reduce(
        (sum, p) => sum + (p.briefings || []).filter((b: any) => b.status === "conducted").length, 0
    )

    const draftPlans = initialPlans.filter(p => p.status === "draft").length
    const approvedPlans = initialPlans.filter(p => p.status === "approved").length

    const combinedStats = [
        {
            title: t("orders.tabs.orders"),
            value: totalOrders,
            subtitle: `${activeOrders} ${t("orders.stats.active")}`,
            icon: Icons.FileText,
            colorScheme: "blue" as const,
        },
        {
            title: t("orders.tabs.commission"),
            value: totalCommissionMembers,
            subtitle: `${plansWithCommission} планов с группой`,
            icon: Icons.Users,
            colorScheme: "purple" as const,
        },
        {
            title: t("orders.tabs.prescriptions"),
            value: totalPrescriptions,
            subtitle: `${issuedPrescriptions} ${t("orders.stats.active")}`,
            icon: Icons.Shield,
            colorScheme: "orange" as const,
        },
        {
            title: t("orders.tabs.briefing"),
            value: totalBriefings,
            subtitle: `${conductedBriefings} ${t("orders.briefing.conducted")}`,
            icon: Icons.Inbox,
            colorScheme: "green" as const,
        },
        {
            title: "Черновики",
            value: draftPlans,
            subtitle: "Планов в работе",
            icon: Icons.Edit,
            colorScheme: "gray" as const,
        },
        {
            title: "Всего планов",
            value: initialPlans.length,
            subtitle: `${approvedPlans} утверждено`,
            icon: Icons.AlertCircle,
            colorScheme: "rose" as const,
        },
    ]

    return (
        <div className="space-y-6">
            <StatsCardsGrid cards={combinedStats} />
            <UniversalOrdersRegistry initialPlans={initialPlans} />
        </div>
    )
}

"use client"

import { Icons } from "@/components/icons"
import { StatsCardsGrid } from "@/components/ui/stats-card"
import { useTranslation } from "@/lib/i18n/hooks"
import { useI18n } from "@/lib/i18n/context"
import { UniversalOrdersRegistry } from "./universal-registry"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

export function UnifiedOrdersView({ initialPlans = [] }: { initialPlans?: any[] }) {
    const { t } = useTranslation()
    const { locale } = useI18n()

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
        <div className="flex-1 p-6 space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">{t("common.home")}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/planning">{t("nav.planning")}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{t("sidebar.planning.orders")}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-between items-center border-l-4 border-primary pl-6 py-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {t("sidebar.planning.orders")}
                    </h1>
                    <p className="text-muted-foreground">
                        {locale === "ru" 
                            ? "Управление приказами и назначениями на проведение контрольных мероприятий" 
                            : "Nazorat tadbirlarini o'tkazish bo'yicha buyruq va tayinlovlarni boshqarish"}
                    </p>
                </div>
            </div>

            <StatsCardsGrid cards={combinedStats} />
            <UniversalOrdersRegistry initialPlans={initialPlans} />
        </div>
    )
}

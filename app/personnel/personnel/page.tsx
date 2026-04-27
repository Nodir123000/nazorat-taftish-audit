"use client"

import { Suspense } from "react"
import { Personnel } from "@/components/reference/personnel"
import { Building2, Shield, Users, UserCheck, UserPlus, Star, ShieldCheck } from "lucide-react"
import { EnhancedStatCard } from "@/components/enhanced-stat-card"
import { useTranslation } from "@/lib/i18n/hooks"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

function PersonnelPageContent() {
    const { t } = useTranslation()
    const { data: statsData } = useSWR("/api/personnel/summary", fetcher)
    const stats = statsData || { total: 0, active: 0, officers: 0, sergeants: 0, soldiers: 0 }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-slate-50/30 min-h-screen">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">{t("common.home")}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/personnel">{t("sidebar.personnel")}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{t("sidebar.cards.personnel")}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-between items-center border-l-4 border-blue-600 pl-6 py-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        {t("sidebar.cards.personnel")}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Единый реестр личного состава и субъектов ответственности
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-right">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Всего в базе</p>
                        <div className="flex items-center gap-2 justify-end">
                            <span className="text-2xl font-black text-slate-900">{stats.total}</span>
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">БАЗА ДАННЫХ</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <EnhancedStatCard
                    title="Всего личного состава"
                    value={stats.total}
                    subtitle="Учётных записей"
                    icon={Users}
                    trend={{ value: 0.5, isPositive: true }}
                    sparklineData={[100, 105, 102, 110, 108, 115, 112]}
                    variant="default"
                />
                <EnhancedStatCard
                    title="Офицерский состав"
                    value={stats.officers}
                    subtitle="Командное звено"
                    icon={Star}
                    trend={{ value: 1.2, isPositive: true }}
                    sparklineData={[40, 42, 41, 45, 44, 46, 45]}
                    variant="info"
                />
                <EnhancedStatCard
                    title="Сержантский состав"
                    value={stats.sergeants}
                    subtitle="Младшие командиры"
                    icon={ShieldCheck}
                    trend={{ value: 0.8, isPositive: true }}
                    sparklineData={[30, 32, 31, 33, 32, 34, 33]}
                    variant="success"
                />
                <EnhancedStatCard
                    title="Рядовой состав"
                    value={stats.soldiers}
                    subtitle="Обеспечение"
                    icon={UserCheck}
                    trend={{ value: 2.1, isPositive: false }}
                    sparklineData={[25, 23, 24, 22, 21, 20, 22]}
                    variant="warning"
                />
                <EnhancedStatCard
                    title="Активные профили"
                    value={stats.active}
                    subtitle="В штате"
                    icon={UserPlus}
                    trend={{ value: 3.4, isPositive: true }}
                    sparklineData={[80, 85, 82, 88, 86, 90, 89]}
                    variant="purple"
                />
            </div>

            <Personnel navigateOnView={true} hideToggle={true} />
        </div>
    )
}

export default function PersonnelPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Загрузка...</div>}>
            <PersonnelPageContent />
        </Suspense>
    )
}


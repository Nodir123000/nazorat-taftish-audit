"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Target, Award, Clock } from "lucide-react"

interface KPIDashboardStatsProps {
    data: any
    isLoading: boolean
}

export function KPIDashboardStats({ data, isLoading }: KPIDashboardStatsProps) {
    if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Card key={i} className="h-24 animate-pulse bg-slate-100" />)}
    </div>

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
                title="Общий KPI"
                value={`${data?.totalKpi || 0}%`}
                icon={<Award className="h-5 w-5 text-blue-600" />}
                trend="+2.4%"
            />
            <StatCard
                title="Выполнение плана"
                value={`${data?.targetMet || 0}%`}
                icon={<Target className="h-5 w-5 text-emerald-600" />}
                trend="+1.2%"
            />
            <StatCard
                title="Динамика"
                value={`${data?.improvement || 0}%`}
                icon={<TrendingUp className="h-5 w-5 text-indigo-600" />}
                trend="Вверх"
            />
            <StatCard
                title="Соблюдение сроков"
                value="90%"
                icon={<Clock className="h-5 w-5 text-amber-600" />}
                trend="-0.5%"
            />
        </div>
    )
}

function StatCard({ title, value, icon, trend }: any) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">{title}</p>
                        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                        {icon}
                    </div>
                </div>
                <div className="mt-2 text-xs font-medium text-emerald-600 flex items-center gap-1">
                    {trend} <span className="text-slate-400 font-normal">к прошлому периоду</span>
                </div>
            </CardContent>
        </Card>
    )
}

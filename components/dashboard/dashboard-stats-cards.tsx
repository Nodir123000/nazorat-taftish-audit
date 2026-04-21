"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface DashboardStatsCardsProps {
    stats: any
    isLoading: boolean
}

export function DashboardStatsCards({ stats, isLoading }: DashboardStatsCardsProps) {
    if (isLoading) return <div>Loading stats...</div>

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Всего аудитов</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalAudits || 0}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Плановые</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.plannedAudits || 0}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Внеплановые</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.unplannedAudits || 0}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Сумма нарушений</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.recoveredAmount?.toLocaleString() || 0} сум</div>
                </CardContent>
            </Card>
        </div>
    )
}

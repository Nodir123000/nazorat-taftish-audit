"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardSystemSummary({ stats, isLoading }: { stats: any; isLoading: boolean }) {
    if (isLoading) return <div>Loading summary...</div>

    return (
        <Card>
            <CardHeader>
                <CardTitle>Сводка по системе</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Активных инспекторов: {stats?.activeInspectors || 0}</p>
                <p>Эффективность: {stats?.efficiencyRate || 0}%</p>
            </CardContent>
        </Card>
    )
}

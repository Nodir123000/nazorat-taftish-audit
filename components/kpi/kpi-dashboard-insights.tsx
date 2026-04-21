"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface KPIDashboardInsightsProps {
    data: any
    isLoading: boolean
}

export function KPIDashboardInsights({ data, isLoading }: KPIDashboardInsightsProps) {
    if (isLoading) return <Card className="h-40 animate-pulse bg-slate-50" />

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-semibold">Аналитические выводы</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <InsightItem
                        type="success"
                        text="Выполнение плана проверок на 92% свидетельствует о высокой дисциплине инспекторского состава."
                    />
                    <InsightItem
                        type="warning"
                        text="Показатель устранения нарушений (82%) требует дополнительного внимания и контроля исполнения предписаний."
                    />
                </div>
            </CardContent>
        </Card>
    )
}

function InsightItem({ type, text }: any) {
    return (
        <div className={`p-3 rounded-lg flex items-start gap-3 ${type === 'success' ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}>
            {type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
            ) : (
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            )}
            <p className="text-sm text-slate-700">{text}</p>
        </div>
    )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { MilitaryUnit } from "@/lib/types/military-unit"

interface MilitaryUnitStatsProps {
    unit: MilitaryUnit
}

export function MilitaryUnitStats({ unit }: MilitaryUnitStatsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Статистика части
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Личный состав</span>
                        <span className="font-bold">{unit.staffCount}</span>
                    </div>
                    <Progress value={(unit.staffCount / 500) * 100} className="h-2 bg-blue-100" indicatorClassName="bg-blue-600" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Ревизий (2024)</span>
                        <span className="font-bold">{unit.auditsCount}</span>
                    </div>
                    <Progress value={(unit.auditsCount / 5) * 100} className="h-2 bg-orange-100" indicatorClassName="bg-orange-500" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">KPI Рейтинг</span>
                        <span className="font-bold text-emerald-600">{unit.kpiScore}%</span>
                    </div>
                    <Progress value={unit.kpiScore} className="h-2 bg-emerald-100" indicatorClassName="bg-emerald-500" />
                </div>

                <div className="pt-4">
                    <button className="w-full text-center text-xs text-muted-foreground border rounded py-2 hover:bg-muted font-medium">
                        Полная аналитика
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}

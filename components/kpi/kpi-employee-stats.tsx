"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, UserMinus, Star } from "lucide-react"

interface KPIEmployeeStatsProps {
    employees: any[]
    isLoading: boolean
}

export function KPIEmployeeStats({ employees, isLoading }: KPIEmployeeStatsProps) {
    if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map(i => <Card key={i} className="h-24 bg-slate-50" />)}
    </div>

    const total = employees.length
    const active = employees.filter(e => e.status === 'active').length
    const excellent = employees.length > 0 ? 1 : 0 // Mock

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-200">
                <div className="flex items-center justify-between mb-2">
                    <Users className="h-6 w-6 opacity-80" />
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full text-white">Всего</span>
                </div>
                <h3 className="text-3xl font-bold">{total}</h3>
                <p className="text-xs opacity-70 mt-1">сотрудников в базе</p>
            </div>

            <Card className="border-l-4 border-l-emerald-500">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Активные</p>
                            <h3 className="text-2xl font-bold text-slate-900">{active}</h3>
                        </div>
                        <UserCheck className="h-8 w-8 text-emerald-100" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">В отпуске/запасе</p>
                            <h3 className="text-2xl font-bold text-slate-900">{total - active}</h3>
                        </div>
                        <UserMinus className="h-8 w-8 text-amber-100" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-indigo-500">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Отличники (KPI &gt; 90)</p>
                            <h3 className="text-2xl font-bold text-slate-900">{excellent}</h3>
                        </div>
                        <Star className="h-8 w-8 text-indigo-100" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

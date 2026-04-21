"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"

export function KPITab() {
    const metrics = [
        { label: "Боевая готовность", value: 94, color: "bg-emerald-500", icon: <Icons.Shield className="w-4 h-4" /> },
        { label: "Укомплектованность л/с", value: 88, color: "bg-blue-500", icon: <Icons.Users className="w-4 h-4" /> },
        { label: "Состояние техники", value: 92, color: "bg-amber-500", icon: <Icons.Settings className="w-4 h-4" /> },
        { label: "Финансовая дисциплина", value: 76, color: "bg-red-500", icon: <Icons.Dollar className="w-4 h-4" /> },
        { label: "Состояние правопорядка", value: 82, color: "bg-indigo-500", icon: <Icons.Gavel className="w-4 h-4" /> }
    ]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Интегральный показатель KPI</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-slate-100"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={2 * Math.PI * 80}
                                    strokeDashoffset={2 * Math.PI * 80 * (1 - 0.864)}
                                    className="text-blue-600 transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-slate-900">86.4</span>
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Рейтинг</span>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-center text-slate-600">
                            <span className="font-bold text-emerald-600">+2.4%</span> по сравнению с прошлым кварталом
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Детализация по направлениям</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {metrics.map((m, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 font-medium text-slate-700">
                                        <div className={`p-1 rounded ${m.color.replace('bg-', 'bg-opacity-10 text-')}`}>
                                            {m.icon}
                                        </div>
                                        {m.label}
                                    </div>
                                    <span className="font-bold">{m.value}%</span>
                                </div>
                                <Progress value={m.value} className="h-1.5" indicatorClassName={m.color} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Динамика эффективности за год</CardTitle>
                </CardHeader>
                <CardContent className="h-40 flex items-end justify-between gap-1 pt-6 px-4">
                    {[65, 72, 68, 75, 80, 78, 85, 82, 88, 84, 90, 86].map((h, i) => (
                        <div key={i} className="flex-1 space-y-2 group">
                            <div className="relative">
                                <div
                                    className="bg-blue-200 group-hover:bg-blue-500 rounded-t-sm transition-all duration-300"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h}%
                                    </div>
                                </div>
                            </div>
                            <div className="text-[10px] text-slate-400 text-center uppercase">
                                {['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'][i]}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

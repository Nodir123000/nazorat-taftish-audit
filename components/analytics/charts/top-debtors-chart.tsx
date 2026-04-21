"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TopDebtorsChartProps {
    data: {
        name: string
        totalDebt: number
        overdueDebt: number
    }[]
}

export function TopDebtorsChart({ data }: TopDebtorsChartProps) {
    // Sort data descending by totalDebt just in case, limiting to 10
    const sortedData = [...data].sort((a, b) => b.totalDebt - a.totalDebt).slice(0, 10);

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>ТОП-10 клиентов с просроченным долгом</CardTitle>
                <CardDescription>
                    Рейтинг клиентов по сумме задолженности
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={sortedData} layout="vertical" margin={{ top: 0, right: 30, left: 100, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={100}
                            tick={{ fontSize: 12 }}
                            interval={0}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        Клиент
                                                    </span>
                                                    <span className="font-bold text-muted-foreground">
                                                        {payload[0].payload.name}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        Долг
                                                    </span>
                                                    <span className="font-bold">
                                                        {new Intl.NumberFormat('ru-RU').format(payload[0].value as number)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Bar dataKey="totalDebt" radius={[0, 4, 4, 0]}>
                            {sortedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index < 3 ? "#ef4444" : "#f97316"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

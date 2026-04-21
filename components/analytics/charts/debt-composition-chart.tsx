"use client"

import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DebtCompositionChartProps {
    overdue: number
    noOverdue: number
}

export function DebtCompositionChart({ overdue, noOverdue }: DebtCompositionChartProps) {
    const data = [
        { name: "Без просрочки", value: noOverdue, color: "#22c55e" },
        { name: "Просрочено", value: overdue, color: "#ef4444" },
    ]

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Структура задолженности</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => new Intl.NumberFormat('ru-RU').format(value)}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

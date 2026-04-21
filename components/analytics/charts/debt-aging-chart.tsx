"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AgingData {
    days1to30: number
    days31to60: number
    days61to90: number
    days91plus: number
}

export function DebtAgingChart({ data }: { data: AgingData }) {
    const chartData = [
        { name: "1-30 дней", value: data.days1to30, fill: "#eab308" },
        { name: "31-60 дней", value: data.days31to60, fill: "#f97316" },
        { name: "61-90 дней", value: data.days61to90, fill: "#ef4444" },
        { name: "> 91 дней", value: data.days91plus, fill: "#7f1d1d" },
    ]

    return (
        <Card className="col-span-5">
            <CardHeader>
                <CardTitle>Старение задолженности (по срокам)</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            formatter={(value: number) => new Intl.NumberFormat('ru-RU').format(value)}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50} fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

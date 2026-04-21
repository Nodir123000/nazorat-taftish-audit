"use client"

import { Card, CardContent } from "@/components/ui/card"

export function DashboardModuleGrid() {
    const modules = [
        { title: "Планирование", href: "/planning" },
        { title: "Аудиты", href: "/audits" },
        { title: "Нарушения", href: "/violations" },
        { title: "Отчеты", href: "/reports" },
    ]

    return (
        <div className="grid gap-4 grid-cols-2">
            {modules.map((m) => (
                <Card key={m.title} className="hover:bg-accent transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-center min-h-[100px]">
                        <span className="font-bold">{m.title}</span>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

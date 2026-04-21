"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardQuickActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
                <Button>Создать план</Button>
                <Button variant="outline">Начать аудит</Button>
                <Button variant="outline">Зарегистрировать нарушение</Button>
            </CardContent>
        </Card>
    )
}

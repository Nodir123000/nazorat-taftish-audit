"use client"

import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ImplementationStatusProps {
  user: User
}

export function ImplementationStatus({ user }: ImplementationStatusProps) {
  const units = [
    {
      unit_id: 1,
      unit_name: "Войсковая часть 12345",
      total_decisions: 3,
      completed_decisions: 2,
      in_progress_decisions: 1,
      overdue_decisions: 0,
      total_actions: 9,
      completed_actions: 7,
      completion_rate: 78,
      trend: "up",
    },
    {
      unit_id: 2,
      unit_name: "Войсковая часть 67890",
      total_decisions: 2,
      completed_decisions: 0,
      in_progress_decisions: 0,
      overdue_decisions: 2,
      total_actions: 4,
      completed_actions: 0,
      completion_rate: 0,
      trend: "down",
    },
    {
      unit_id: 3,
      unit_name: "Войсковая часть 11111",
      total_decisions: 1,
      completed_decisions: 1,
      in_progress_decisions: 0,
      overdue_decisions: 0,
      total_actions: 3,
      completed_actions: 3,
      completion_rate: 100,
      trend: "stable",
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case "up":
        return <Badge className="bg-green-600">Улучшение</Badge>
      case "down":
        return <Badge variant="destructive">Ухудшение</Badge>
      default:
        return <Badge variant="outline">Стабильно</Badge>
    }
  }

  const overallStats = {
    total_decisions: units.reduce((sum, u) => sum + u.total_decisions, 0),
    completed_decisions: units.reduce((sum, u) => sum + u.completed_decisions, 0),
    in_progress_decisions: units.reduce((sum, u) => sum + u.in_progress_decisions, 0),
    overdue_decisions: units.reduce((sum, u) => sum + u.overdue_decisions, 0),
    total_actions: units.reduce((sum, u) => sum + u.total_actions, 0),
    completed_actions: units.reduce((sum, u) => sum + u.completed_actions, 0),
  }

  const overallCompletionRate = Math.round((overallStats.completed_actions / overallStats.total_actions) * 100)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Всего решений</CardDescription>
            <CardTitle className="text-3xl">{overallStats.total_decisions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">По всем воинским частям</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Исполнено</CardDescription>
            <CardTitle className="text-3xl text-green-600">{overallStats.completed_decisions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {Math.round((overallStats.completed_decisions / overallStats.total_decisions) * 100)}% от общего числа
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>В работе</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{overallStats.in_progress_decisions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Находятся на исполнении</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Просрочено</CardDescription>
            <CardTitle className="text-3xl text-red-600">{overallStats.overdue_decisions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Требуют внимания</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Общий прогресс исполнения</CardTitle>
          <CardDescription>
            Выполнено {overallStats.completed_actions} из {overallStats.total_actions} мероприятий
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{overallCompletionRate}%</span>
              <Badge variant="outline" className="text-base">
                {overallStats.completed_actions} / {overallStats.total_actions}
              </Badge>
            </div>
            <Progress value={overallCompletionRate} className="h-4" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Исполнение по воинским частям</CardTitle>
          <CardDescription>Детализация по подразделениям</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {units.map((unit) => (
              <Card key={unit.unit_id} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{unit.unit_name}</CardTitle>
                      <CardDescription>
                        Решений: {unit.total_decisions} • Мероприятий: {unit.total_actions}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(unit.trend)}
                      {getTrendBadge(unit.trend)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Исполнено</div>
                      <div className="text-2xl font-bold text-green-600">{unit.completed_decisions}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">В работе</div>
                      <div className="text-2xl font-bold text-blue-600">{unit.in_progress_decisions}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Просрочено</div>
                      <div className="text-2xl font-bold text-red-600">{unit.overdue_decisions}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Прогресс мероприятий</span>
                      <span className="font-medium">
                        {unit.completed_actions} / {unit.total_actions} ({unit.completion_rate}%)
                      </span>
                    </div>
                    <Progress value={unit.completion_rate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

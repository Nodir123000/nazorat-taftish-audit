"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, CheckCircle2, Clock, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const analyticsData = {
  trends: [
    { metric: "Проведено проверок", current: 156, previous: 139, change: 12.2, trend: "up" },
    { metric: "Выявлено нарушений", current: 89, previous: 97, change: -8.2, trend: "down" },
    { metric: "Материальный ущерб", current: 2400000, previous: 2280000, change: 5.3, trend: "up" },
    { metric: "Исполнено решений", current: 94, previous: 91, change: 3.3, trend: "up" },
  ],
  byUnit: [
    { unit: "В/Ч 12345", audits: 23, violations: 12, amount: 450000, completion: 96 },
    { unit: "В/Ч 67890", audits: 19, violations: 8, amount: 320000, completion: 92 },
    { unit: "В/Ч 11111", audits: 18, violations: 15, amount: 680000, completion: 88 },
    { unit: "В/Ч 22222", audits: 16, violations: 6, amount: 210000, completion: 98 },
    { unit: "В/Ч 33333", audits: 15, violations: 11, amount: 540000, completion: 85 },
  ],
  byType: [
    { type: "Финансовая", count: 45, violations: 28, percentage: 62 },
    { type: "Хозяйственная", count: 38, violations: 19, percentage: 50 },
    { type: "Документальная", count: 32, violations: 22, percentage: 69 },
    { type: "Комплексная", count: 25, violations: 14, percentage: 56 },
    { type: "Тематическая", count: 16, violations: 6, percentage: 38 },
  ],
}

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Аналитические данные</h3>
          <p className="text-sm text-muted-foreground">Статистика и тренды контрольно-ревизионной работы</p>
        </div>
        <Select defaultValue="year">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Текущий месяц</SelectItem>
            <SelectItem value="quarter">Текущий квартал</SelectItem>
            <SelectItem value="year">Текущий год</SelectItem>
            <SelectItem value="custom">Произвольный период</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsData.trends.map((item) => (
          <Card key={item.metric}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.metric}</CardTitle>
              {item.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {item.metric.includes("ущерб")
                  ? `${(item.current / 1000000).toFixed(1)}М ₽`
                  : item.metric.includes("Исполнено")
                    ? `${item.current}%`
                    : item.current}
              </div>
              <p className={`text-xs ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {item.change > 0 ? "+" : ""}
                {item.change.toFixed(1)}% от предыдущего периода
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Статистика по воинским частям</CardTitle>
            <CardDescription>Топ-5 воинских частей по количеству проверок</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.byUnit.map((unit, index) => (
                <div key={unit.unit} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{unit.unit}</p>
                        <p className="text-sm text-muted-foreground">
                          {unit.audits} проверок, {unit.violations} нарушений
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{(unit.amount / 1000).toFixed(0)}К ₽</p>
                      <p className="text-sm text-muted-foreground">{unit.completion}% исполнено</p>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${unit.completion}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Статистика по типам проверок</CardTitle>
            <CardDescription>Распределение проверок и нарушений по типам</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.byType.map((type) => (
                <div key={type.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{type.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {type.count} проверок, {type.violations} нарушений
                      </p>
                    </div>
                    <Badge variant={type.percentage > 60 ? "destructive" : "secondary"}>{type.percentage}%</Badge>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${type.percentage > 60 ? "bg-destructive" : "bg-primary"}`}
                      style={{ width: `${type.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ключевые показатели эффективности</CardTitle>
          <CardDescription>Основные метрики контрольно-ревизионной работы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-sm text-muted-foreground">Исполнение решений</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12 дней</p>
                <p className="text-sm text-muted-foreground">Средняя длительность проверки</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">15.4К ₽</p>
                <p className="text-sm text-muted-foreground">Средняя сумма нарушения</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

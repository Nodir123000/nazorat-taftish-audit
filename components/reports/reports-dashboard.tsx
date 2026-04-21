"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const quickReports = [
  { id: 1, name: "Годовой отчет 2024", type: "annual", status: "ready", date: "2024-12-31" },
  { id: 2, name: "Квартальный отчет Q4 2024", type: "quarterly", status: "ready", date: "2024-12-31" },
  { id: 3, name: "Месячный отчет Декабрь 2024", type: "monthly", status: "ready", date: "2024-12-31" },
  { id: 4, name: "Отчет по нарушениям", type: "violations", status: "generating", date: "2025-01-06" },
]

const reportStats = [
  { label: "Проведено проверок", value: "156", change: "+12%", trend: "up" },
  { label: "Выявлено нарушений", value: "89", change: "-8%", trend: "down" },
  { label: "Сумма ущерба", value: "2.4М uzs", change: "+5%", trend: "up" },
  { label: "Исполнено решений", value: "94%", change: "+3%", trend: "up" },
]

export function ReportsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <TrendingUp className={`h-4 w-4 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.change} от предыдущего периода
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Быстрый доступ к отчетам</CardTitle>
          <CardDescription>Последние сформированные отчеты</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quickReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Дата формирования: {new Date(report.date).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {report.status === "ready" ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Готов
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Формируется
                    </Badge>
                  )}
                  <Button size="sm" variant="outline" disabled={report.status !== "ready"}>
                    <Download className="h-4 w-4 mr-2" />
                    Скачать
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Периодические отчеты</CardTitle>
            <CardDescription>Регулярная отчетность по установленным формам</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              Годовой отчет
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              ��вартальный отчет
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              Месячный отчет
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Тематические отчеты</CardTitle>
            <CardDescription>Специализированные отчеты по направлениям</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Отчет по нарушениям
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Отчет по исполнению решений
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Отчет по финансовым проверкам
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

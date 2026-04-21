"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Play, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const savedReports = [
  {
    id: 1,
    name: "Нарушения по воинским частям",
    description: "Сводка нарушений с группировкой по воинским частям",
    lastRun: "2025-01-05",
    fields: ["unit", "violation_type", "amount", "status"],
  },
  {
    id: 2,
    name: "Динамика исполнения решений",
    description: "Анализ выполнения решений по месяцам",
    lastRun: "2025-01-03",
    fields: ["decision_date", "unit", "status", "deadline"],
  },
  {
    id: 3,
    name: "Финансовые проверки по типам",
    description: "Статистика проверок с разбивкой по типам",
    lastRun: "2024-12-28",
    fields: ["audit_type", "count", "violations_found", "total_amount"],
  },
]

const availableFields = [
  { id: "unit", label: "Воинская часть", category: "basic" },
  { id: "audit_type", label: "Тип проверки", category: "basic" },
  { id: "violation_type", label: "Тип нарушения", category: "violations" },
  { id: "amount", label: "Сумма ущерба", category: "violations" },
  { id: "status", label: "Статус", category: "basic" },
  { id: "decision_date", label: "Дата решения", category: "decisions" },
  { id: "deadline", label: "Срок исполнения", category: "decisions" },
  { id: "responsible_person", label: "Ответственное лицо", category: "violations" },
  { id: "count", label: "Количество", category: "statistics" },
  { id: "violations_found", label: "Выявлено нарушений", category: "statistics" },
  { id: "total_amount", label: "Общая сумма", category: "statistics" },
]

export function CustomReports() {
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [reportName, setReportName] = useState("")

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) => (prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Конструктор отчета</CardTitle>
            <CardDescription>Создайте настраиваемый отчет с нужными полями</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Название отчета</Label>
              <Input
                placeholder="Введите название отчета"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Источник данных</Label>
              <Select defaultValue="audits">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="audits">Проверки</SelectItem>
                  <SelectItem value="violations">Нарушения</SelectItem>
                  <SelectItem value="decisions">Решения</SelectItem>
                  <SelectItem value="combined">Комбинированный</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Поля отчета</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                {availableFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      checked={selectedFields.includes(field.id)}
                      onCheckedChange={() => toggleField(field.id)}
                    />
                    <label htmlFor={field.id} className="text-sm cursor-pointer flex-1">
                      {field.label}
                    </label>
                    <Badge variant="outline" className="text-xs">
                      {field.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Play className="h-4 w-4 mr-2" />
                Выполнить
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Сохраненные отчеты</CardTitle>
            <CardDescription>Ранее созданные настраиваемые отчеты</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{report.name}</CardTitle>
                        <CardDescription className="text-xs">{report.description}</CardDescription>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {report.fields.map((field) => (
                        <Badge key={field} variant="secondary" className="text-xs">
                          {availableFields.find((f) => f.id === field)?.label}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Последний запуск: {new Date(report.lastRun).toLocaleDateString("ru-RU")}</span>
                      <Button size="sm" variant="outline">
                        <Play className="h-3 w-3 mr-1" />
                        Запустить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

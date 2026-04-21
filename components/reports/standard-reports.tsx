"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const reportTemplates = [
  {
    id: 1,
    code: "ФО-1",
    name: "Годовой отчет о контрольно-ревизионной работе",
    description: "Сводный отчет о проведенных проверках за год",
    period: "annual",
    format: ["PDF", "Excel", "Word"],
  },
  {
    id: 2,
    code: "ФО-2",
    name: "Квартальный отчет о выявленных нарушениях",
    description: "Отчет по нарушениям финансово-хозяйственной деятельности",
    period: "quarterly",
    format: ["PDF", "Excel"],
  },
  {
    id: 3,
    code: "ФО-3",
    name: "Месячный отчет о ходе проверок",
    description: "Оперативная информация о текущих проверках",
    period: "monthly",
    format: ["PDF", "Excel"],
  },
  {
    id: 4,
    code: "ФО-4",
    name: "Отчет об исполнении решений",
    description: "Информация о выполнении принятых решений",
    period: "quarterly",
    format: ["PDF", "Excel", "Word"],
  },
  {
    id: 5,
    code: "ФО-5",
    name: "Отчет о материальном ущербе",
    description: "Сведения о выявленном материальном ущербе",
    period: "annual",
    format: ["PDF", "Excel"],
  },
  {
    id: 6,
    code: "ФО-6",
    name: "Отчет по финансовым проверкам",
    description: "Результаты проверок финансовой деятельности",
    period: "quarterly",
    format: ["PDF", "Excel"],
  },
]

export function StandardReports() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("2024")
  const [selectedQuarter, setSelectedQuarter] = useState<string>("Q4")

  const filteredReports = reportTemplates.filter(
    (report) => selectedPeriod === "all" || report.period === selectedPeriod,
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Параметры формирования отчета</CardTitle>
          <CardDescription>Выберите период и параметры для формирования типового отчета</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Период отчета</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все периоды</SelectItem>
                  <SelectItem value="annual">Годовые</SelectItem>
                  <SelectItem value="quarterly">Квартальные</SelectItem>
                  <SelectItem value="monthly">Месячные</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Год</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Квартал</Label>
              <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1">I квартал</SelectItem>
                  <SelectItem value="Q2">II квартал</SelectItem>
                  <SelectItem value="Q3">III квартал</SelectItem>
                  <SelectItem value="Q4">IV квартал</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredReports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{report.code}</Badge>
                    <Badge variant="secondary">
                      {report.period === "annual" && "Годовой"}
                      {report.period === "quarterly" && "Квартальный"}
                      {report.period === "monthly" && "Месячный"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Период: {selectedYear}
                  {report.period === "quarterly" && `, ${selectedQuarter}`}
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.format.map((format) => (
                    <Button key={format} size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      {format}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

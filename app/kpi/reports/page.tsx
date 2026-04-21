"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Printer } from "lucide-react"
import { getRatingColor, getRatingLabel } from "@/lib/utils/kpi-calculator"

// Mock data for demonstration
const mockEmployeeReports = [
  {
    id: "1",
    employeeName: "Иванов Иван Иванович",
    rank: "Подполковник",
    position: "Начальник отдела",
    period: "Q1-2025",
    budgetViolationScore: 17,
    remoteControlScore: 18,
    annualPlanScore: 19,
    proposalExecutionScore: 9,
    violationEliminationCountScore: 5,
    violationEliminationAmountScore: 5,
    deadlineComplianceScore: 18,
    totalKPI: 91,
    rating: "excellent" as const,
  },
  {
    id: "2",
    employeeName: "Петров Петр Петрович",
    rank: "Майор",
    position: "Старший инспектор",
    period: "Q1-2025",
    budgetViolationScore: 16,
    remoteControlScore: 17,
    annualPlanScore: 18,
    proposalExecutionScore: 8,
    violationEliminationCountScore: 4,
    violationEliminationAmountScore: 4,
    deadlineComplianceScore: 17,
    totalKPI: 84,
    rating: "good" as const,
  },
  {
    id: "3",
    employeeName: "Сидоров Сидор Сидорович",
    rank: "Капитан",
    position: "Инспектор",
    period: "Q1-2025",
    budgetViolationScore: 15,
    remoteControlScore: 16,
    annualPlanScore: 17,
    proposalExecutionScore: 7,
    violationEliminationCountScore: 4,
    violationEliminationAmountScore: 3,
    deadlineComplianceScore: 16,
    totalKPI: 78,
    rating: "good" as const,
  },
]

const mockDepartmentSummary = {
  period: "Q1-2025",
  totalEmployees: 3,
  averageKPI: 84,
  excellentCount: 1,
  goodCount: 2,
  satisfactoryCount: 0,
  unsatisfactoryCount: 0,
}

const mockQuarterlyData = [
  { quarter: "Q1-2024", averageKPI: 78, employeeCount: 3 },
  { quarter: "Q2-2024", averageKPI: 81, employeeCount: 3 },
  { quarter: "Q3-2024", averageKPI: 83, employeeCount: 3 },
  { quarter: "Q4-2024", averageKPI: 82, employeeCount: 3 },
  { quarter: "Q1-2025", averageKPI: 84, employeeCount: 3 },
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Q1-2025")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedEmployee, setSelectedEmployee] = useState("")

  const handleExport = (format: string) => {
    alert(`Экспорт в формат ${format}`)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Отчёты KPI</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Отчётные таблицы по сотрудникам, подразделению и сводные данные
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => handleExport("XLSX")}>
            <Download className="h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => handleExport("PDF")}>
            <FileText className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Печать
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <label className="text-sm font-medium">Год</label>
          </CardHeader>
          <CardContent>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <label className="text-sm font-medium">Период</label>
          </CardHeader>
          <CardContent>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q1-2025">I квартал 2025</SelectItem>
                <SelectItem value="Q2-2025">II квартал 2025</SelectItem>
                <SelectItem value="Q3-2025">III квартал 2025</SelectItem>
                <SelectItem value="Q4-2025">IV квартал 2025</SelectItem>
                <SelectItem value="YEAR-2025">Год 2025</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="employees">По сотрудникам</TabsTrigger>
          <TabsTrigger value="department">По подразделению</TabsTrigger>
          <TabsTrigger value="dynamics">Динамика</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Отчёт по сотрудникам</CardTitle>
              <CardDescription>Детализированные показатели KPI за период {selectedPeriod}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Сотрудник</TableHead>
                      <TableHead>Звание</TableHead>
                      <TableHead>Должность</TableHead>
                      <TableHead className="text-center">Бюджет</TableHead>
                      <TableHead className="text-center">Дист. контроль</TableHead>
                      <TableHead className="text-center">План</TableHead>
                      <TableHead className="text-center">Предложения</TableHead>
                      <TableHead className="text-center">Нарушения (кол.)</TableHead>
                      <TableHead className="text-center">Нарушения (сум.)</TableHead>
                      <TableHead className="text-center">Сроки</TableHead>
                      <TableHead className="text-center">Итого</TableHead>
                      <TableHead>Оценка</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEmployeeReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.employeeName}</TableCell>
                        <TableCell>{report.rank}</TableCell>
                        <TableCell>{report.position}</TableCell>
                        <TableCell className="text-center">{report.budgetViolationScore}%</TableCell>
                        <TableCell className="text-center">{report.remoteControlScore}%</TableCell>
                        <TableCell className="text-center">{report.annualPlanScore}%</TableCell>
                        <TableCell className="text-center">{report.proposalExecutionScore}%</TableCell>
                        <TableCell className="text-center">{report.violationEliminationCountScore}%</TableCell>
                        <TableCell className="text-center">{report.violationEliminationAmountScore}%</TableCell>
                        <TableCell className="text-center">{report.deadlineComplianceScore}%</TableCell>
                        <TableCell className="text-center font-bold">{report.totalKPI}%</TableCell>
                        <TableCell>
                          <Badge className={getRatingColor(report.rating)}>{getRatingLabel(report.rating)}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department">
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Средний KPI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{mockDepartmentSummary.averageKPI}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Отлично</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">{mockDepartmentSummary.excellentCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Хорошо</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{mockDepartmentSummary.goodCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Удовлетворительно</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-warning">{mockDepartmentSummary.satisfactoryCount}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Сводная таблица по подразделению</CardTitle>
                <CardDescription>Агрегированные показатели за период {selectedPeriod}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Показатель</TableHead>
                        <TableHead className="text-right">Среднее значение</TableHead>
                        <TableHead className="text-right">Минимум</TableHead>
                        <TableHead className="text-right">Максимум</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Предотвращение нарушений бюджета</TableCell>
                        <TableCell className="text-right">16%</TableCell>
                        <TableCell className="text-right">15%</TableCell>
                        <TableCell className="text-right">17%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Дистанционный контроль</TableCell>
                        <TableCell className="text-right">17%</TableCell>
                        <TableCell className="text-right">16%</TableCell>
                        <TableCell className="text-right">18%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Выполнение годового плана</TableCell>
                        <TableCell className="text-right">18%</TableCell>
                        <TableCell className="text-right">17%</TableCell>
                        <TableCell className="text-right">19%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Выполнение предложений</TableCell>
                        <TableCell className="text-right">8%</TableCell>
                        <TableCell className="text-right">7%</TableCell>
                        <TableCell className="text-right">9%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Устранение нарушений (количество)</TableCell>
                        <TableCell className="text-right">4%</TableCell>
                        <TableCell className="text-right">4%</TableCell>
                        <TableCell className="text-right">5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Устранение нарушений (сумма)</TableCell>
                        <TableCell className="text-right">4%</TableCell>
                        <TableCell className="text-right">3%</TableCell>
                        <TableCell className="text-right">5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Соблюдение сроков</TableCell>
                        <TableCell className="text-right">17%</TableCell>
                        <TableCell className="text-right">16%</TableCell>
                        <TableCell className="text-right">18%</TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold">Итоговый KPI</TableCell>
                        <TableCell className="text-right font-bold">84%</TableCell>
                        <TableCell className="text-right font-bold">78%</TableCell>
                        <TableCell className="text-right font-bold">91%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Распределение по оценкам</CardTitle>
                <CardDescription>Количество сотрудников в каждой категории</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getRatingColor("excellent")}>{getRatingLabel("excellent")}</Badge>
                      <span className="text-sm text-muted-foreground">&gt; 86%</span>
                    </div>
                    <div className="text-2xl font-bold">{mockDepartmentSummary.excellentCount}</div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getRatingColor("good")}>{getRatingLabel("good")}</Badge>
                      <span className="text-sm text-muted-foreground">71-86%</span>
                    </div>
                    <div className="text-2xl font-bold">{mockDepartmentSummary.goodCount}</div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getRatingColor("satisfactory")}>{getRatingLabel("satisfactory")}</Badge>
                      <span className="text-sm text-muted-foreground">56-71%</span>
                    </div>
                    <div className="text-2xl font-bold">{mockDepartmentSummary.satisfactoryCount}</div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getRatingColor("unsatisfactory")}>{getRatingLabel("unsatisfactory")}</Badge>
                      <span className="text-sm text-muted-foreground">≤ 56%</span>
                    </div>
                    <div className="text-2xl font-bold">{mockDepartmentSummary.unsatisfactoryCount}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dynamics">
          <Card>
            <CardHeader>
              <CardTitle>Динамика KPI по кварталам</CardTitle>
              <CardDescription>Изменение среднего KPI подразделения за последние периоды</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Период</TableHead>
                      <TableHead className="text-center">Количество сотрудников</TableHead>
                      <TableHead className="text-center">Средний KPI</TableHead>
                      <TableHead className="text-center">Изменение</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockQuarterlyData.map((data, index) => {
                      const prevKPI = index > 0 ? mockQuarterlyData[index - 1].averageKPI : null
                      const change = prevKPI ? data.averageKPI - prevKPI : null

                      return (
                        <TableRow key={data.quarter}>
                          <TableCell className="font-medium">{data.quarter}</TableCell>
                          <TableCell className="text-center">{data.employeeCount}</TableCell>
                          <TableCell className="text-center font-bold">{data.averageKPI}%</TableCell>
                          <TableCell className="text-center">
                            {change !== null && (
                              <span
                                className={
                                  change > 0
                                    ? "text-secondary"
                                    : change < 0
                                      ? "text-destructive"
                                      : "text-muted-foreground"
                                }
                              >
                                {change > 0 ? "+" : ""}
                                {change}%
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

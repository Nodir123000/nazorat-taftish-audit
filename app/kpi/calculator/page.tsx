"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calculator, Settings } from "lucide-react"
import { calculateKPI, getRatingColor, getRatingLabel } from "@/lib/utils/kpi-calculator"
import { DEFAULT_WEIGHTS } from "@/lib/types/kpi.dto"
import type { KPIPeriodData, KPIWeights, KPICalculationResult } from "@/lib/types/kpi.dto"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function CalculatorPage() {
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [weights, setWeights] = useState<KPIWeights>(DEFAULT_WEIGHTS)
  const [isWeightsDialogOpen, setIsWeightsDialogOpen] = useState(false)
  const [result, setResult] = useState<KPICalculationResult | null>(null)

  const [formData, setFormData] = useState<Partial<KPIPeriodData>>({
    bxBudget: 850,
    btBudget: 1000,
    bxRemote: 45,
    btRemote: 50,
    plannedActivities: 100,
    actualActivities: 95,
    proposalsPlanned: 20,
    proposalsCompleted: 18,
    violationsIdentified: 50,
    violationsEliminated: 45,
    violationAmountIdentified: 500,
    violationAmountEliminated: 450,
    plannedDays: 90,
    actualDays: 85,
  })

  const employees = [
    { id: "1", name: "Иванов Иван Иванович" },
    { id: "2", name: "Петров Петр Петрович" },
    { id: "3", name: "Сидоров Сидор Сидорович" },
  ]

  const handleCalculate = () => {
    if (!selectedEmployee || !selectedPeriod) {
      alert("Выберите сотрудника и период")
      return
    }

    const data: KPIPeriodData = {
      employeeId: selectedEmployee,
      period: `${selectedPeriod}-${selectedYear}`,
      year: Number(selectedYear),
      quarter: Number(selectedPeriod.replace("Q", "")),
      ...(formData as Omit<KPIPeriodData, "employeeId" | "period" | "year" | "quarter">),
    }

    const calculationResult = calculateKPI(data, weights)
    setResult(calculationResult)
  }

  const updateField = (field: keyof KPIPeriodData, value: number) => {
    setFormData({ ...formData, [field]: value })
  }

  const updateWeight = (field: keyof KPIWeights, value: number) => {
    setWeights({ ...weights, [field]: value })
  }

  const resetWeights = () => {
    setWeights(DEFAULT_WEIGHTS)
  }

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Калькулятор KPI</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Расчёт показателей эффективности с применением формул и валидаций
          </p>
        </div>
        <Dialog open={isWeightsDialogOpen} onOpenChange={setIsWeightsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Settings className="h-4 w-4" />
              Настройка весов
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Настройка весов показателей</DialogTitle>
              <DialogDescription>По умолчанию: 0.20 / 0.20 / 0.20 / 0.10 / 0.10 / 0.20</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Предотвращение нарушений бюджета</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={weights.budgetViolationPrevention}
                  onChange={(e) => updateWeight("budgetViolationPrevention", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Дистанционный контроль</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={weights.remoteControl}
                  onChange={(e) => updateWeight("remoteControl", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Выполнение годового плана</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={weights.annualPlanExecution}
                  onChange={(e) => updateWeight("annualPlanExecution", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Выполнение предложений</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={weights.proposalExecution}
                  onChange={(e) => updateWeight("proposalExecution", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Устранение нарушений</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={weights.violationElimination}
                  onChange={(e) => updateWeight("violationElimination", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Соблюдение сроков</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={weights.deadlineCompliance}
                  onChange={(e) => updateWeight("deadlineCompliance", Number(e.target.value))}
                />
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">
                  Сумма весов: {totalWeight.toFixed(2)}{" "}
                  {totalWeight !== 1 && <span className="text-destructive">(должна быть 1.00)</span>}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetWeights}>
                Сбросить
              </Button>
              <Button onClick={() => setIsWeightsDialogOpen(false)}>Применить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <Label>Сотрудник</Label>
          </CardHeader>
          <CardContent>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите сотрудника" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <Label>Год</Label>
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
            <Label>Квартал</Label>
          </CardHeader>
          <CardContent>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите квартал" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q1">I квартал</SelectItem>
                <SelectItem value="Q2">II квартал</SelectItem>
                <SelectItem value="Q3">III квартал</SelectItem>
                <SelectItem value="Q4">IV квартал</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Исходные данные</CardTitle>
          <CardDescription>Введите показатели для расчёта KPI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Предотвращение нарушений бюджета</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Bx (отчётный)</Label>
                  <Input
                    type="number"
                    value={formData.bxBudget}
                    onChange={(e) => updateField("bxBudget", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Bt (предыдущий)</Label>
                  <Input
                    type="number"
                    value={formData.btBudget}
                    onChange={(e) => updateField("btBudget", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Дистанционный контроль</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Bx (отчётный)</Label>
                  <Input
                    type="number"
                    value={formData.bxRemote}
                    onChange={(e) => updateField("bxRemote", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Bt (предыдущий)</Label>
                  <Input
                    type="number"
                    value={formData.btRemote}
                    onChange={(e) => updateField("btRemote", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Выполнение годового плана</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">План</Label>
                  <Input
                    type="number"
                    value={formData.plannedActivities}
                    onChange={(e) => updateField("plannedActivities", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Факт</Label>
                  <Input
                    type="number"
                    value={formData.actualActivities}
                    onChange={(e) => updateField("actualActivities", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Выполнение предложений</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Предусмотрено</Label>
                  <Input
                    type="number"
                    value={formData.proposalsPlanned}
                    onChange={(e) => updateField("proposalsPlanned", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Выполнено</Label>
                  <Input
                    type="number"
                    value={formData.proposalsCompleted}
                    onChange={(e) => updateField("proposalsCompleted", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Устранение нарушений (кол-во)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Выявлено</Label>
                  <Input
                    type="number"
                    value={formData.violationsIdentified}
                    onChange={(e) => updateField("violationsIdentified", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Устранено</Label>
                  <Input
                    type="number"
                    value={formData.violationsEliminated}
                    onChange={(e) => updateField("violationsEliminated", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Устранение нарушений (сумма)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Выявлено</Label>
                  <Input
                    type="number"
                    value={formData.violationAmountIdentified}
                    onChange={(e) => updateField("violationAmountIdentified", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Устранено</Label>
                  <Input
                    type="number"
                    value={formData.violationAmountEliminated}
                    onChange={(e) => updateField("violationAmountEliminated", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Соблюдение сроков</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Плановые дни</Label>
                  <Input
                    type="number"
                    value={formData.plannedDays}
                    onChange={(e) => updateField("plannedDays", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Фактические дни</Label>
                  <Input
                    type="number"
                    value={formData.actualDays}
                    onChange={(e) => updateField("actualDays", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleCalculate} className="gap-2">
              <Calculator className="h-4 w-4" />
              Рассчитать KPI
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Результаты расчёта</CardTitle>
            <CardDescription>
              Период: {result.period} | Рассчитано: {new Date(result.calculatedAt).toLocaleString("ru-RU")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Показатель</TableHead>
                    <TableHead>Вес</TableHead>
                    <TableHead className="text-right">Баллы</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Предотвращение нарушений бюджета</TableCell>
                    <TableCell>{(weights.budgetViolationPrevention * 100).toFixed(0)}%</TableCell>
                    <TableCell className="text-right font-medium">{result.budgetViolationScore}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Дистанционный контроль</TableCell>
                    <TableCell>{(weights.remoteControl * 100).toFixed(0)}%</TableCell>
                    <TableCell className="text-right font-medium">{result.remoteControlScore}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Выполнение годового плана</TableCell>
                    <TableCell>{(weights.annualPlanExecution * 100).toFixed(0)}%</TableCell>
                    <TableCell className="text-right font-medium">{result.annualPlanScore}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Выполнение предложений</TableCell>
                    <TableCell>{(weights.proposalExecution * 100).toFixed(0)}%</TableCell>
                    <TableCell className="text-right font-medium">{result.proposalExecutionScore}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Устранение нарушений (количество)</TableCell>
                    <TableCell>{(weights.violationElimination * 50).toFixed(0)}%</TableCell>
                    <TableCell className="text-right font-medium">{result.violationEliminationCountScore}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Устранение нарушений (сумма)</TableCell>
                    <TableCell>{(weights.violationElimination * 50).toFixed(0)}%</TableCell>
                    <TableCell className="text-right font-medium">{result.violationEliminationAmountScore}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Соблюдение сроков</TableCell>
                    <TableCell>{(weights.deadlineCompliance * 100).toFixed(0)}%</TableCell>
                    <TableCell className="text-right font-medium">{result.deadlineComplianceScore}%</TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">Итоговый KPI</TableCell>
                    <TableCell className="font-bold">100%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-lg font-bold">{result.totalKPI}%</span>
                        <Badge className={getRatingColor(result.rating)}>{getRatingLabel(result.rating)}</Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

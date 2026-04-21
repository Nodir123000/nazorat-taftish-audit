"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Save, Calculator, Settings, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { calculateKPI, getRatingColor, getRatingLabel } from "@/lib/utils/kpi-calculator"
import { DEFAULT_WEIGHTS } from "@/lib/types/kpi"
import type { KPIPeriodData, KPIWeights, KPICalculationResult } from "@/lib/types/kpi"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslation } from "@/lib/i18n/hooks"

export default function ManagementPage() {
  const { t } = useTranslation()

  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [weights, setWeights] = useState<KPIWeights>(DEFAULT_WEIGHTS)
  const [isWeightsDialogOpen, setIsWeightsDialogOpen] = useState(false)
  const [result, setResult] = useState<KPICalculationResult | null>(null)

  const [formData, setFormData] = useState<Partial<KPIPeriodData>>({
    bxBudget: 0,
    btBudget: 0,
    bxRemote: 0,
    btRemote: 0,
    plannedActivities: 0,
    actualActivities: 0,
    proposalsPlanned: 0,
    proposalsCompleted: 0,
    violationsIdentified: 0,
    violationsEliminated: 0,
    violationAmountIdentified: 0,
    violationAmountEliminated: 0,
    plannedDays: 0,
    actualDays: 0,
  })

  const employees = [
    { id: "1", name: "Иванов Иван Иванович" },
    { id: "2", name: "Петров Петр Петрович" },
    { id: "3", name: "Сидоров Сидор Сидорович" },
  ]

  const handleSave = () => {
    console.log("[v0] Saving KPI data:", {
      employeeId: selectedEmployee,
      period: selectedPeriod,
      year: selectedYear,
      ...formData,
    })
    alert(t("kpi.management.dataSavedSuccess"))
  }

  const handleCalculate = () => {
    if (!selectedEmployee || !selectedPeriod) {
      alert(t("kpi.management.selectEmployeeAndPeriod"))
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t("kpi.management.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("kpi.management.description")}</p>
        </div>
        <Dialog open={isWeightsDialogOpen} onOpenChange={setIsWeightsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 border-2 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
            >
              <Settings className="h-4 w-4" />
              {t("kpi.management.weightsSettings")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("kpi.management.weightsDialogTitle")}</DialogTitle>
              <DialogDescription>{t("kpi.management.weightsDialogDescription")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t("kpi.management.budgetViolationPrevention")}</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={weights.budgetViolationPrevention}
                  onChange={(e) => updateWeight("budgetViolationPrevention", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("kpi.management.remoteControl")}</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={weights.remoteControl}
                  onChange={(e) => updateWeight("remoteControl", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("kpi.management.annualPlanExecution")}</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={weights.annualPlanExecution}
                  onChange={(e) => updateWeight("annualPlanExecution", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("kpi.management.proposalExecution")}</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={weights.proposalExecution}
                  onChange={(e) => updateWeight("proposalExecution", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("kpi.management.violationElimination")}</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={weights.violationElimination}
                  onChange={(e) => updateWeight("violationElimination", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("kpi.management.deadlineCompliance")}</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={weights.deadlineCompliance}
                  onChange={(e) => updateWeight("deadlineCompliance", Number(e.target.value))}
                />
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">
                  {t("kpi.management.weightsSum")}: {totalWeight.toFixed(2)}{" "}
                  {totalWeight !== 1 && (
                    <span className="text-destructive">({t("kpi.management.weightsSumError")})</span>
                  )}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetWeights}>
                {t("kpi.management.reset")}
              </Button>
              <Button onClick={() => setIsWeightsDialogOpen(false)}>{t("kpi.management.apply")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-md">
          <CardHeader className="pb-3">
            <Label className="text-blue-900 font-semibold">{t("kpi.management.employee")}</Label>
          </CardHeader>
          <CardContent>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder={t("kpi.management.selectEmployee")} />
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

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 shadow-md">
          <CardHeader className="pb-3">
            <Label className="text-purple-900 font-semibold">{t("kpi.management.year")}</Label>
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

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-md">
          <CardHeader className="pb-3">
            <Label className="text-green-900 font-semibold">{t("kpi.management.quarter")}</Label>
          </CardHeader>
          <CardContent>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder={t("kpi.management.selectQuarter")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q1">{t("kpi.management.q1")}</SelectItem>
                <SelectItem value="Q2">{t("kpi.management.q2")}</SelectItem>
                <SelectItem value="Q3">{t("kpi.management.q3")}</SelectItem>
                <SelectItem value="Q4">{t("kpi.management.q4")}</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {selectedEmployee && selectedPeriod && (
        <>
          <Alert className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900">{t("kpi.management.alert")}</AlertDescription>
          </Alert>

          <Tabs defaultValue="budget" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-blue-100 to-green-100 p-1">
              <TabsTrigger value="budget" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                {t("kpi.management.tab.budget")}
              </TabsTrigger>
              <TabsTrigger value="remote" className="data-[state=active]:bg-white data-[state=active]:text-green-700">
                {t("kpi.management.tab.remote")}
              </TabsTrigger>
              <TabsTrigger value="plan" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
                {t("kpi.management.tab.plan")}
              </TabsTrigger>
              <TabsTrigger
                value="proposals"
                className="data-[state=active]:bg-white data-[state=active]:text-orange-700"
              >
                {t("kpi.management.tab.proposals")}
              </TabsTrigger>
              <TabsTrigger value="violations" className="data-[state=active]:bg-white data-[state=active]:text-red-700">
                {t("kpi.management.tab.violations")}
              </TabsTrigger>
              <TabsTrigger value="deadlines" className="data-[state=active]:bg-white data-[state=active]:text-cyan-700">
                {t("kpi.management.tab.deadlines")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="budget">
              <Card className="border-2 border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
                  <CardTitle className="text-blue-900">{t("kpi.management.budgetViolationPrevention")}</CardTitle>
                  <CardDescription className="text-blue-700">{t("kpi.management.formula")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bxBudget">{t("kpi.management.bxReporting")}</Label>
                      <Input
                        id="bxBudget"
                        type="number"
                        value={formData.bxBudget}
                        onChange={(e) => updateField("bxBudget", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="btBudget">{t("kpi.management.btPrevious")}</Label>
                      <Input
                        id="btBudget"
                        type="number"
                        value={formData.btBudget}
                        onChange={(e) => updateField("btBudget", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      {t("kpi.management.ratio")}:{" "}
                      {formData.btBudget ? (formData.bxBudget! / formData.btBudget!).toFixed(4) : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{t("kpi.management.ratioNote")}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="remote">
              <Card className="border-2 border-green-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
                  <CardTitle className="text-green-900">{t("kpi.management.remoteControl")}</CardTitle>
                  <CardDescription className="text-green-700">{t("kpi.management.formula")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bxRemote">{t("kpi.management.bxReportingSimple")}</Label>
                      <Input
                        id="bxRemote"
                        type="number"
                        value={formData.bxRemote}
                        onChange={(e) => updateField("bxRemote", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="btRemote">{t("kpi.management.btPreviousSimple")}</Label>
                      <Input
                        id="btRemote"
                        type="number"
                        value={formData.btRemote}
                        onChange={(e) => updateField("btRemote", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      {t("kpi.management.ratio")}:{" "}
                      {formData.btRemote ? (formData.bxRemote! / formData.btRemote!).toFixed(4) : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plan">
              <Card className="border-2 border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b-2 border-purple-200">
                  <CardTitle className="text-purple-900">{t("kpi.management.annualPlanExecution")}</CardTitle>
                  <CardDescription className="text-purple-700">{t("kpi.management.formulaPlan")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plannedActivities">{t("kpi.management.plannedActivities")}</Label>
                      <Input
                        id="plannedActivities"
                        type="number"
                        value={formData.plannedActivities}
                        onChange={(e) => updateField("plannedActivities", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="actualActivities">{t("kpi.management.actualActivities")}</Label>
                      <Input
                        id="actualActivities"
                        type="number"
                        value={formData.actualActivities}
                        onChange={(e) => updateField("actualActivities", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      {t("kpi.management.ratio")}:{" "}
                      {formData.plannedActivities
                        ? (formData.actualActivities! / formData.plannedActivities!).toFixed(4)
                        : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="proposals">
              <Card className="border-2 border-orange-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200">
                  <CardTitle className="text-orange-900">{t("kpi.management.proposalExecution")}</CardTitle>
                  <CardDescription className="text-orange-700">{t("kpi.management.formulaProposals")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="proposalsPlanned">{t("kpi.management.proposalsPlanned")}</Label>
                      <Input
                        id="proposalsPlanned"
                        type="number"
                        value={formData.proposalsPlanned}
                        onChange={(e) => updateField("proposalsPlanned", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proposalsCompleted">{t("kpi.management.proposalsCompleted")}</Label>
                      <Input
                        id="proposalsCompleted"
                        type="number"
                        value={formData.proposalsCompleted}
                        onChange={(e) => updateField("proposalsCompleted", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      {t("kpi.management.ratio")}:{" "}
                      {formData.proposalsPlanned
                        ? (formData.proposalsCompleted! / formData.proposalsPlanned!).toFixed(4)
                        : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="violations">
              <Card className="border-2 border-red-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 border-b-2 border-red-200">
                  <CardTitle className="text-red-900">{t("kpi.management.violationElimination")}</CardTitle>
                  <CardDescription className="text-red-700">{t("kpi.management.violationsTitle")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">{t("kpi.management.byCount")}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="violationsIdentified">{t("kpi.management.violationsIdentified")}</Label>
                        <Input
                          id="violationsIdentified"
                          type="number"
                          value={formData.violationsIdentified}
                          onChange={(e) => updateField("violationsIdentified", Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="violationsEliminated">{t("kpi.management.violationsEliminated")}</Label>
                        <Input
                          id="violationsEliminated"
                          type="number"
                          value={formData.violationsEliminated}
                          onChange={(e) => updateField("violationsEliminated", Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg mt-3">
                      <p className="text-sm font-medium">
                        {t("kpi.management.ratio")}:{" "}
                        {formData.violationsIdentified
                          ? (formData.violationsEliminated! / formData.violationsIdentified!).toFixed(4)
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">{t("kpi.management.byAmount")}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="violationAmountIdentified">
                          {t("kpi.management.violationAmountIdentified")}
                        </Label>
                        <Input
                          id="violationAmountIdentified"
                          type="number"
                          value={formData.violationAmountIdentified}
                          onChange={(e) => updateField("violationAmountIdentified", Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="violationAmountEliminated">
                          {t("kpi.management.violationAmountEliminated")}
                        </Label>
                        <Input
                          id="violationAmountEliminated"
                          type="number"
                          value={formData.violationAmountEliminated}
                          onChange={(e) => updateField("violationAmountEliminated", Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg mt-3">
                      <p className="text-sm font-medium">
                        {t("kpi.management.ratio")}:{" "}
                        {formData.violationAmountIdentified
                          ? (formData.violationAmountEliminated! / formData.violationAmountIdentified!).toFixed(4)
                          : "—"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deadlines">
              <Card className="border-2 border-cyan-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b-2 border-cyan-200">
                  <CardTitle className="text-cyan-900">{t("kpi.management.deadlineCompliance")}</CardTitle>
                  <CardDescription className="text-cyan-700">{t("kpi.management.formulaDeadlines")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plannedDays">{t("kpi.management.plannedDays")}</Label>
                      <Input
                        id="plannedDays"
                        type="number"
                        value={formData.plannedDays}
                        onChange={(e) => updateField("plannedDays", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="actualDays">{t("kpi.management.actualDays")}</Label>
                      <Input
                        id="actualDays"
                        type="number"
                        value={formData.actualDays}
                        onChange={(e) => updateField("actualDays", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      {t("kpi.management.ratio")}:{" "}
                      {formData.actualDays ? (formData.plannedDays! / formData.actualDays!).toFixed(4) : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleSave}
              className="gap-2 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
            >
              <Save className="h-4 w-4" />
              {t("kpi.management.saveData")}
            </Button>
            <Button
              onClick={handleCalculate}
              className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Calculator className="h-4 w-4" />
              {t("kpi.management.calculateKPI")}
            </Button>
          </div>

          {result && (
            <Card className="border-2 border-green-300 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
                <CardTitle className="text-green-900">{t("kpi.management.resultsTitle")}</CardTitle>
                <CardDescription className="text-green-700">
                  {t("kpi.management.period")}: {result.period} | {t("kpi.management.calculated")}:{" "}
                  {new Date(result.calculatedAt).toLocaleString("ru-RU")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("kpi.management.indicator")}</TableHead>
                        <TableHead>{t("kpi.management.weight")}</TableHead>
                        <TableHead className="text-right">{t("kpi.management.points")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{t("kpi.management.budgetViolationPrevention")}</TableCell>
                        <TableCell>{(weights.budgetViolationPrevention * 100).toFixed(0)}%</TableCell>
                        <TableCell className="text-right font-medium">{result.budgetViolationScore}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t("kpi.management.remoteControl")}</TableCell>
                        <TableCell>{(weights.remoteControl * 100).toFixed(0)}%</TableCell>
                        <TableCell className="text-right font-medium">{result.remoteControlScore}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t("kpi.management.annualPlanExecution")}</TableCell>
                        <TableCell>{(weights.annualPlanExecution * 100).toFixed(0)}%</TableCell>
                        <TableCell className="text-right font-medium">{result.annualPlanScore}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t("kpi.management.proposalExecution")}</TableCell>
                        <TableCell>{(weights.proposalExecution * 100).toFixed(0)}%</TableCell>
                        <TableCell className="text-right font-medium">{result.proposalExecutionScore}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t("kpi.management.violationEliminationCount")}</TableCell>
                        <TableCell>{(weights.violationElimination * 50).toFixed(0)}%</TableCell>
                        <TableCell className="text-right font-medium">
                          {result.violationEliminationCountScore}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t("kpi.management.violationEliminationAmount")}</TableCell>
                        <TableCell>{(weights.violationElimination * 50).toFixed(0)}%</TableCell>
                        <TableCell className="text-right font-medium">
                          {result.violationEliminationAmountScore}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t("kpi.management.deadlineCompliance")}</TableCell>
                        <TableCell>{(weights.deadlineCompliance * 100).toFixed(0)}%</TableCell>
                        <TableCell className="text-right font-medium">{result.deadlineComplianceScore}%</TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold">{t("kpi.management.totalKPI")}</TableCell>
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
        </>
      )}
    </div>
  )
}

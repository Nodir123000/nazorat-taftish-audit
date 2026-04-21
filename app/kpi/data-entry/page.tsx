"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { KPIPeriodData } from "@/lib/types/kpi"

export default function DataEntryPage() {
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [selectedYear, setSelectedYear] = useState("2025")

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
    alert("Данные успешно сохранены")
  }

  const updateField = (field: keyof KPIPeriodData, value: number) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ввод данных KPI</h1>
        <p className="text-sm text-muted-foreground mt-1">Заполнение показателей за отчётный и предшествующий период</p>
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

      {selectedEmployee && selectedPeriod && (
        <>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Заполните все показатели для расчёта KPI. Если показатель Bt = 0 или отсутствует, система автоматически
              примет отношение = 1.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="budget" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="budget">Бюджет</TabsTrigger>
              <TabsTrigger value="remote">Дист. контроль</TabsTrigger>
              <TabsTrigger value="plan">План</TabsTrigger>
              <TabsTrigger value="proposals">Предложения</TabsTrigger>
              <TabsTrigger value="violations">Нарушения</TabsTrigger>
              <TabsTrigger value="deadlines">Сроки</TabsTrigger>
            </TabsList>

            <TabsContent value="budget">
              <Card>
                <CardHeader>
                  <CardTitle>Предотвращение нарушений бюджета</CardTitle>
                  <CardDescription>Формула: (Bx / Bt) × вес × 100%</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bxBudget">Bx - Отчётный период (млн. сум)</Label>
                      <Input
                        id="bxBudget"
                        type="number"
                        value={formData.bxBudget}
                        onChange={(e) => updateField("bxBudget", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="btBudget">Bt - Предшествующий период (млн. сум)</Label>
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
                      Отношение: {formData.btBudget ? (formData.bxBudget! / formData.btBudget!).toFixed(4) : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Если отношение &gt; 1, система примет значение = 1
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="remote">
              <Card>
                <CardHeader>
                  <CardTitle>Дистанционный контроль</CardTitle>
                  <CardDescription>Формула: (Bx / Bt) × вес × 100%</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bxRemote">Bx - Отчётный период</Label>
                      <Input
                        id="bxRemote"
                        type="number"
                        value={formData.bxRemote}
                        onChange={(e) => updateField("bxRemote", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="btRemote">Bt - Предшествующий период</Label>
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
                      Отношение: {formData.btRemote ? (formData.bxRemote! / formData.btRemote!).toFixed(4) : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plan">
              <Card>
                <CardHeader>
                  <CardTitle>Выполнение годового плана</CardTitle>
                  <CardDescription>Формула: (факт / план) × вес × 100%</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plannedActivities">Плановое количество мероприятий</Label>
                      <Input
                        id="plannedActivities"
                        type="number"
                        value={formData.plannedActivities}
                        onChange={(e) => updateField("plannedActivities", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="actualActivities">Фактическое количество мероприятий</Label>
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
                      Отношение:{" "}
                      {formData.plannedActivities
                        ? (formData.actualActivities! / formData.plannedActivities!).toFixed(4)
                        : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="proposals">
              <Card>
                <CardHeader>
                  <CardTitle>Выполнение предложений</CardTitle>
                  <CardDescription>Формула: (выполнено / предусмотрено) × вес × 100%</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="proposalsPlanned">Предусмотрено предложений</Label>
                      <Input
                        id="proposalsPlanned"
                        type="number"
                        value={formData.proposalsPlanned}
                        onChange={(e) => updateField("proposalsPlanned", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proposalsCompleted">Выполнено предложений</Label>
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
                      Отношение:{" "}
                      {formData.proposalsPlanned
                        ? (formData.proposalsCompleted! / formData.proposalsPlanned!).toFixed(4)
                        : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="violations">
              <Card>
                <CardHeader>
                  <CardTitle>Устранение нарушений</CardTitle>
                  <CardDescription>По количеству и по сумме</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">По количеству</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="violationsIdentified">Выявлено нарушений</Label>
                        <Input
                          id="violationsIdentified"
                          type="number"
                          value={formData.violationsIdentified}
                          onChange={(e) => updateField("violationsIdentified", Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="violationsEliminated">Устранено нарушений</Label>
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
                        Отношение:{" "}
                        {formData.violationsIdentified
                          ? (formData.violationsEliminated! / formData.violationsIdentified!).toFixed(4)
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">По сумме</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="violationAmountIdentified">Сумма выявленных нарушений (млн. сум)</Label>
                        <Input
                          id="violationAmountIdentified"
                          type="number"
                          value={formData.violationAmountIdentified}
                          onChange={(e) => updateField("violationAmountIdentified", Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="violationAmountEliminated">Сумма устранённых нарушений (млн. сум)</Label>
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
                        Отношение:{" "}
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
              <Card>
                <CardHeader>
                  <CardTitle>Соблюдение сроков</CardTitle>
                  <CardDescription>Формула: (плановые дни / фактические дни) × вес × 100%</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plannedDays">Плановые дни</Label>
                      <Input
                        id="plannedDays"
                        type="number"
                        value={formData.plannedDays}
                        onChange={(e) => updateField("plannedDays", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="actualDays">Фактические дни</Label>
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
                      Отношение: {formData.actualDays ? (formData.plannedDays! / formData.actualDays!).toFixed(4) : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Отмена</Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Сохранить данные
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

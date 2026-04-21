"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { EnhancedStatCard } from "@/components/enhanced-stat-card"
import { AdvancedDataTable } from "@/components/advanced-data-table"
import { CollapsibleFilterPanel } from "@/components/collapsible-filter-panel"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { SectionSidebar } from "@/components/section-sidebar"
import { QuickFilterChips } from "@/components/quick-filter-chips"

const sections = [
  { id: "schedule", title: "План-график ревизий", icon: Icons.Calendar },
  { id: "approved", title: "Утверждённые планы", icon: Icons.Check },
  { id: "inspectors", title: "Распределение инспекторов", icon: Icons.Users },
  { id: "control", title: "Контроль выполнения", icon: Icons.Chart },
]

export default function AnnualPlanImprovedPage() {
  const [activeSection, setActiveSection] = useState("schedule")
  const [searchQuery, setSearchQuery] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([])

  const plans = [
    {
      id: 1,
      year: 2025,
      unit: "Воинская часть 12345",
      startDate: "2025-01-15",
      endDate: "2025-12-20",
      responsible: "Майор Петров А.В.",
      status: "Утверждён",
    },
    {
      id: 2,
      year: 2025,
      unit: "Воинская часть 67890",
      startDate: "2025-02-01",
      endDate: "2025-11-30",
      responsible: "Подполковник Сидоров И.И.",
      status: "На утверждении",
    },
    {
      id: 3,
      year: 2025,
      unit: "Воинская часть 11111",
      startDate: "2025-03-10",
      endDate: "2025-10-15",
      responsible: "Капитан Иванов С.С.",
      status: "Черновик",
    },
    {
      id: 4,
      year: 2025,
      unit: "Воинская часть 22222",
      startDate: "2025-04-01",
      endDate: "2025-09-30",
      responsible: "Майор Петров А.В.",
      status: "Утверждён",
    },
    {
      id: 5,
      year: 2024,
      unit: "Воинская часть 33333",
      startDate: "2024-01-10",
      endDate: "2024-12-15",
      responsible: "Подполковник Сидоров И.И.",
      status: "Утверждён",
    },
  ]

  const quickFilters = [
    { id: "approved", label: "Утверждённые", value: "Утверждён", count: 3 },
    { id: "pending", label: "На утверждении", value: "На утверждении", count: 1 },
    { id: "draft", label: "Черновики", value: "Черновик", count: 1 },
  ]

  const filterPresets = [
    { id: "current-year", label: "Текущий год", filters: { year: "2025" } },
    { id: "approved-only", label: "Только утверждённые", filters: { status: "Утверждён" } },
  ]

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.responsible.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesYear = !yearFilter || plan.year.toString() === yearFilter
    const matchesQuickFilters =
      activeQuickFilters.length === 0 ||
      activeQuickFilters.some((filterId) => {
        const filter = quickFilters.find((f) => f.id === filterId)
        return filter && plan.status === filter.value
      })
    return matchesSearch && matchesYear && matchesQuickFilters
  })

  const handleQuickFilterToggle = (filterId: string) => {
    setActiveQuickFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId],
    )
  }

  const handleExport = () => {
    const headers = ["ID", "Год", "Воинская часть", "Дата начала", "Дата окончания", "Ответственный", "Статус"]
    const rows = filteredPlans.map((plan) => [
      plan.id,
      plan.year,
      plan.unit,
      plan.startDate,
      plan.endDate,
      plan.responsible,
      plan.status,
    ])

    let csv = headers.join(",") + "\n"
    rows.forEach((row) => {
      csv += row.map((cell) => `"${cell}"`).join(",") + "\n"
    })

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `annual_plans_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const columns = [
    { key: "id", title: "ID", sortable: true },
    { key: "year", title: "Год", sortable: true },
    { key: "unit", title: "Воинская часть", sortable: true },
    {
      key: "startDate",
      title: "Период",
      render: (_: any, row: any) => (
        <div className="flex items-center gap-1 text-sm">
          <Icons.Calendar className="h-3 w-3" />
          {row.startDate} — {row.endDate}
        </div>
      ),
    },
    { key: "responsible", title: "Ответственный", sortable: true },
    {
      key: "status",
      title: "Статус",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "Утверждён" ? "default" : value === "На утверждении" ? "secondary" : "outline"}>
          {value}
        </Badge>
      ),
    },
  ]

  const renderSectionContent = () => {
    switch (activeSection) {
      case "schedule":
        return (
          <>
            <div className="flex items-center justify-between border-l-4 border-blue-500 pl-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">План-график ревизий (годовой)</h1>
                <p className="text-muted-foreground mt-1">
                  Улучшенная версия с расширенными возможностями фильтрации и визуализации
                </p>
              </div>
              <Button size="lg" className="gap-2">
                <Icons.Plus className="h-4 w-4" />
                Создать план
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <EnhancedStatCard
                title="Всего планов"
                value={plans.length}
                subtitle="На 2025 год"
                icon={Icons.Calendar}
                color="cyan"
                sparklineData={[3, 5, 4, 6, 8, 7, 9]}
                trend={{ value: 12, isPositive: true }}
              />
              <EnhancedStatCard
                title="Утверждено"
                value={plans.filter((p) => p.status === "Утверждён").length}
                subtitle="Планов"
                icon={Icons.Check}
                color="blue"
                sparklineData={[1, 2, 2, 3, 4, 5, 6]}
                trend={{ value: 8, isPositive: true }}
              />
              <EnhancedStatCard
                title="На утверждении"
                value={plans.filter((p) => p.status === "На утверждении").length}
                subtitle="Планов"
                icon={Icons.Clock}
                color="blue"
                sparklineData={[2, 3, 2, 1, 2, 1, 1]}
              />
              <EnhancedStatCard
                title="Черновики"
                value={plans.filter((p) => p.status === "Черновик").length}
                subtitle="Планов"
                icon={Icons.Edit}
                color="indigo"
                sparklineData={[4, 3, 5, 4, 3, 2, 1]}
                trend={{ value: 5, isPositive: false }}
              />
            </div>

            <QuickFilterChips
              filters={quickFilters}
              activeFilters={activeQuickFilters}
              onFilterToggle={handleQuickFilterToggle}
            />

            <CollapsibleFilterPanel
              presets={filterPresets}
              activeFiltersCount={(searchQuery ? 1 : 0) + (yearFilter ? 1 : 0) + activeQuickFilters.length}
              onReset={() => {
                setSearchQuery("")
                setYearFilter("")
                setActiveQuickFilters([])
              }}
              defaultCollapsed={false}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div className="relative">
                  <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по воинской части..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Input
                  type="number"
                  placeholder="Год"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                />
                <Button variant="outline" onClick={handleExport} className="gap-2 bg-transparent">
                  <Icons.Download className="h-4 w-4" />
                  Экспорт выбранных
                </Button>
              </div>
            </CollapsibleFilterPanel>

            <Card>
              <CardHeader>
                <CardTitle>Реестр годовых планов ревизий</CardTitle>
                <CardDescription>
                  Список всех годовых планов контрольно-ревизионной работы ({filteredPlans.length} из {plans.length})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedDataTable
                  data={filteredPlans}
                  columns={columns}
                  groupBy="status"
                  onSelectionChange={(selected) => console.log("Selected rows:", selected)}
                  actions={[
                    { icon: Icons.Eye, label: "Просмотр", onClick: (row) => console.log("View:", row) },
                    { icon: Icons.Edit, label: "Редактировать", onClick: (row) => console.log("Edit:", row) },
                    { icon: Icons.Download, label: "Скачать", onClick: (row) => console.log("Download:", row) },
                  ]}
                />
              </CardContent>
            </Card>
          </>
        )

      case "approved":
        return (
          <>
            <div className="flex items-center justify-between border-l-4 border-green-500 pl-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Утверждённые планы</h1>
                <p className="text-muted-foreground mt-1">Планы, прошедшие процедуру утверждения</p>
              </div>
              <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700">
                <Icons.Check className="h-4 w-4" />
                Утвердить план
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <EnhancedStatCard
                title="Утверждено планов"
                value={plans.filter((p) => p.status === "Утверждён").length}
                subtitle="Всего"
                icon={Icons.Check}
                color="green"
                sparklineData={[1, 2, 2, 3, 4, 5, 6]}
                trend={{ value: 15, isPositive: true }}
              />
              <EnhancedStatCard
                title="Ревизий запланировано"
                value={42}
                subtitle="На текущий год"
                icon={Icons.Calendar}
                color="green"
                sparklineData={[30, 32, 35, 38, 40, 41, 42]}
                trend={{ value: 8, isPositive: true }}
              />
              <EnhancedStatCard
                title="Воинских частей"
                value={18}
                subtitle="Охвачено планами"
                icon={Icons.Building}
                color="cyan"
                sparklineData={[12, 14, 15, 16, 17, 18, 18]}
              />
              <EnhancedStatCard
                title="Инспекторов задействовано"
                value={25}
                subtitle="Специалистов"
                icon={Icons.Users}
                color="green"
                sparklineData={[20, 21, 22, 23, 24, 25, 25]}
                trend={{ value: 4, isPositive: true }}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Утверждённые планы ревизий</CardTitle>
                <CardDescription>Планы, готовые к исполнению</CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedDataTable
                  data={plans.filter((p) => p.status === "Утверждён")}
                  columns={columns}
                  groupBy="year"
                  onSelectionChange={(selected) => console.log("Selected rows:", selected)}
                  actions={[
                    { icon: Icons.Eye, label: "Просмотр", onClick: (row) => console.log("View:", row) },
                    { icon: Icons.Download, label: "Скачать", onClick: (row) => console.log("Download:", row) },
                  ]}
                />
              </CardContent>
            </Card>
          </>
        )

      case "inspectors":
        return (
          <>
            <div className="flex items-center justify-between border-l-4 border-purple-500 pl-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Распределение инспекторов</h1>
                <p className="text-muted-foreground mt-1">Назначение ответственных за проведение ревизий</p>
              </div>
              <Button size="lg" className="gap-2 bg-purple-600 hover:bg-purple-700">
                <Icons.Users className="h-4 w-4" />
                Назначить инспектора
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <EnhancedStatCard
                title="Всего инспекторов"
                value={25}
                subtitle="В штате"
                icon={Icons.Users}
                color="purple"
                sparklineData={[22, 23, 23, 24, 24, 25, 25]}
                trend={{ value: 3, isPositive: true }}
              />
              <EnhancedStatCard
                title="Задействовано"
                value={18}
                subtitle="В текущих планах"
                icon={Icons.UserCheck}
                color="purple"
                sparklineData={[15, 16, 16, 17, 17, 18, 18]}
              />
              <EnhancedStatCard
                title="Средняя нагрузка"
                value={2.3}
                subtitle="Ревизий на инспектора"
                icon={Icons.Chart}
                color="purple"
                sparklineData={[2.0, 2.1, 2.2, 2.2, 2.3, 2.3, 2.3]}
              />
              <EnhancedStatCard
                title="Свободны"
                value={7}
                subtitle="Инспекторов"
                icon={Icons.UserPlus}
                color="red"
                sparklineData={[10, 9, 9, 8, 8, 7, 7]}
                trend={{ value: 2, isPositive: false }}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Распределение нагрузки</CardTitle>
                <CardDescription>Назначение инспекторов на ревизии</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Майор Петров А.В.", audits: 3, status: "Активен" },
                    { name: "Подполковник Сидоров И.И.", audits: 2, status: "Активен" },
                    { name: "Капитан Иванов С.С.", audits: 1, status: "Активен" },
                    { name: "Майор Козлов Д.Д.", audits: 0, status: "Свободен" },
                  ].map((inspector, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                          <Icons.User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium">{inspector.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {inspector.audits} {inspector.audits === 1 ? "ревизия" : "ревизий"}
                          </p>
                        </div>
                      </div>
                      <Badge variant={inspector.status === "Активен" ? "default" : "secondary"}>
                        {inspector.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )

      case "control":
        return (
          <>
            <div className="flex items-center justify-between border-l-4 border-orange-500 pl-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Контроль выполнения</h1>
                <p className="text-muted-foreground mt-1">Мониторинг исполнения годовых планов ревизий</p>
              </div>
              <Button size="lg" className="gap-2 bg-orange-600 hover:bg-orange-700">
                <Icons.Chart className="h-4 w-4" />
                Сформировать отчёт
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <EnhancedStatCard
                title="Выполнено"
                value={28}
                subtitle="Из 42 запланированных"
                icon={Icons.Check}
                color="orange"
                sparklineData={[10, 15, 18, 22, 24, 26, 28]}
                trend={{ value: 67, isPositive: true }}
              />
              <EnhancedStatCard
                title="В процессе"
                value={8}
                subtitle="Ревизий"
                icon={Icons.Clock}
                color="orange"
                sparklineData={[12, 10, 9, 10, 9, 8, 8]}
              />
              <EnhancedStatCard
                title="Просрочено"
                value={2}
                subtitle="Ревизий"
                icon={Icons.AlertTriangle}
                color="red"
                sparklineData={[0, 0, 1, 1, 1, 2, 2]}
                trend={{ value: 100, isPositive: false }}
              />
              <EnhancedStatCard
                title="Не начато"
                value={4}
                subtitle="Ревизий"
                icon={Icons.Calendar}
                color="orange"
                sparklineData={[15, 12, 10, 8, 6, 5, 4]}
                trend={{ value: 20, isPositive: true }}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Статус выполнения планов</CardTitle>
                <CardDescription>Прогресс исполнения годовых планов ревизий</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { unit: "Воинская часть 12345", progress: 75, status: "В срок" },
                    { unit: "Воинская часть 67890", progress: 60, status: "В срок" },
                    { unit: "Воинская часть 11111", progress: 40, status: "Риск срыва" },
                    { unit: "Воинская часть 22222", progress: 90, status: "В срок" },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.unit}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{item.progress}%</span>
                          <Badge
                            variant={item.status === "В срок" ? "default" : "destructive"}
                            className={item.status === "В срок" ? "bg-green-600" : ""}
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${item.status === "В срок" ? "bg-green-500" : "bg-red-500"
                            }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-card p-4">
        <BreadcrumbNav
          items={[
            { label: "Планирование КРР", href: "/planning" },
            { label: "Годовое планирование (улучшенная версия)" },
          ]}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <SectionSidebar sections={sections} activeSection={activeSection} onSectionChange={setActiveSection} />

        <div className="flex-1 overflow-auto p-6 space-y-6">{renderSectionContent()}</div>
      </div>
    </div>
  )
}

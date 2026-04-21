"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Target,
  AlertTriangle,
} from "lucide-react"
import { getRatingColor, getRatingLabel } from "@/lib/utils/kpi-calculator"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { SectionsTabs } from "@/components/sections-tabs"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n/hooks"

// Mock data
const trendData = [
  { period: "Q1 2024", kpi: 78 },
  { period: "Q2 2024", kpi: 81 },
  { period: "Q3 2024", kpi: 83 },
  { period: "Q4 2024", kpi: 82 },
  { period: "Q1 2025", kpi: 84 },
]

const employeeRankingData = [
  { name: "Иванов И.И.", kpi: 91, rating: "excellent" },
  { name: "Петров П.П.", kpi: 84, rating: "good" },
  { name: "Сидоров С.С.", kpi: 78, rating: "good" },
]

const ratingDistributionData = [
  { name: "Отлично", value: 1, color: "hsl(var(--secondary))" },
  { name: "Хорошо", value: 2, color: "hsl(var(--primary))" },
  { name: "Удовлетворительно", value: 0, color: "hsl(var(--warning))" },
  { name: "Неудовлетворительно", value: 0, color: "hsl(var(--destructive))" },
]

const componentBreakdownData = [
  { component: "Бюджет", value: 16, color: "#3b82f6" }, // blue
  { component: "Дист. контроль", value: 17, color: "#10b981" }, // green
  { component: "План", value: 18, color: "#8b5cf6" }, // purple
  { component: "Предложения", value: 8, color: "#f59e0b" }, // amber
  { component: "Нарушения (кол.)", value: 4, color: "#ef4444" }, // red
  { component: "Нарушения (сум.)", value: 4, color: "#ec4899" }, // pink
  { component: "Сроки", value: 17, color: "#06b6d4" }, // cyan
]

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

export function AnalyticsPageClient() {
  const { t } = useTranslation()

  const [activeSection, setActiveSection] = useState("dashboard")

  const sections = [
    { id: "dashboard", title: "Дашборд", icon: Icons.Chart },
    { id: "employees", title: t("kpi.analytics.section.employees"), icon: Icons.Users },
    { id: "department", title: t("kpi.analytics.section.department"), icon: Icons.Calendar },
    { id: "dynamics", title: t("kpi.analytics.section.dynamics"), icon: Icons.TrendingUp },
  ]
  const [selectedPeriod, setSelectedPeriod] = useState("Q1-2025")
  const [selectedYear, setSelectedYear] = useState("2025")

  const currentKPI = 84
  const previousKPI = 82
  const kpiChange = currentKPI - previousKPI

  const handleExport = (format: string) => {
    alert(`Экспорт в формат ${format}`)
  }

  const StatsCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "blue",
  }: {
    title: string
    value: number | string
    subtitle: string
    icon: any
    color?: string
  }) => {
    const colorClasses: Record<string, string> = {
      blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700 text-blue-900 text-blue-600",
      green: "from-green-50 to-green-100 border-green-200 text-green-700 text-green-900 text-green-600",
      orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700 text-orange-900 text-orange-600",
      purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700 text-purple-900 text-purple-600",
      red: "from-red-50 to-red-100 border-red-200 text-red-700 text-red-900 text-red-600",
      cyan: "from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-700 text-cyan-900 text-cyan-600",
      yellow: "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700 text-yellow-900 text-yellow-600",
      emerald: "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700 text-emerald-900 text-emerald-600",
      pink: "from-pink-50 to-pink-100 border-pink-200 text-pink-700 text-pink-900 text-pink-600",
    }

    const classes = colorClasses[color] || colorClasses.blue
    const [bgGradient, border, titleColor, valueColor, subtitleColor] = classes.split(" ")

    return (
      <Card
        className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} ${border} hover:shadow-lg transition-all duration-300 hover:scale-105`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${titleColor}`}>{title}</CardTitle>
          <div className={`rounded-full bg-${color}-100 p-2 ring-2 ring-${color}-200`}>
            <Icon className={`h-4 w-4 text-${color}-600`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
          <p className={`text-xs font-medium ${subtitleColor}`}>{subtitle}</p>
        </CardContent>
      </Card>
    )
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            <div className="flex items-center justify-between border-l-4 border-primary pl-4">
              <div>
                <h1 className="text-3xl font-bold">{t("kpi.analytics.dashboard.title")}</h1>
                <p className="text-muted-foreground">{t("kpi.analytics.dashboard.subtitle")}</p>
              </div>
              <div className="flex gap-2">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q1-2025">I квартал</SelectItem>
                    <SelectItem value="Q2-2025">II квартал</SelectItem>
                    <SelectItem value="Q3-2025">III квартал</SelectItem>
                    <SelectItem value="Q4-2025">IV квартал</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="gap-2 border-2 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                  onClick={() => handleExport("XLSX")}
                >
                  <Download className="h-4 w-4" />
                  Excel
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-2 border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                  onClick={() => handleExport("PDF")}
                >
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4" />
                  Печать
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-blue-900">{t("kpi.analytics.dashboard.avgKPI")}</CardTitle>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-4 ring-white shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                    {currentKPI}%
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs">
                    {kpiChange > 0 ? (
                      <>
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600 font-medium">+{kpiChange}%</span>
                      </>
                    ) : kpiChange < 0 ? (
                      <>
                        <TrendingDown className="h-3 w-3 text-red-600" />
                        <span className="text-red-600 font-medium">{kpiChange}%</span>
                      </>
                    ) : (
                      <span className="text-gray-600">{t("kpi.analytics.dashboard.noChange")}</span>
                    )}
                    <span className="text-gray-600 ml-1">{t("kpi.analytics.dashboard.toPreviousPeriod")}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-100 to-teal-100 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-green-900">{t("kpi.analytics.dashboard.employees")}</CardTitle>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center ring-4 ring-white shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                    3
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{t("kpi.analytics.dashboard.activeEmployees")}</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-purple-900">{t("kpi.analytics.dashboard.excellentScores")}</CardTitle>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center ring-4 ring-white shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                    1
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{t("kpi.analytics.dashboard.kpiGreater")}</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-100 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-orange-900">{t("kpi.analytics.dashboard.attentionNeeded")}</CardTitle>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center ring-4 ring-white shadow-lg">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">
                    0
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{t("kpi.analytics.dashboard.kpiLower")}</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-cyan-100 to-sky-100 border-2 border-cyan-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-cyan-900">Аттестация</CardTitle>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center ring-4 ring-white shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-sky-700 bg-clip-text text-transparent">
                    95%
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Сотрудников аттестовано</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-rose-100 to-red-100 border-2 border-rose-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-rose-900">Загрузка</CardTitle>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center ring-4 ring-white shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-rose-700 to-red-700 bg-clip-text text-transparent">
                    120%
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Выше нормы</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-2 border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
                  <CardTitle className="text-purple-900">{t("kpi.analytics.dashboard.trendTitle")}</CardTitle>
                  <CardDescription className="text-purple-700">
                    {t("kpi.analytics.dashboard.trendDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      kpi: {
                        label: "KPI",
                        color: "hsl(var(--primary))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[70, 95]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="kpi"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
                  <CardTitle className="text-blue-900">{t("kpi.analytics.dashboard.ratingDist")}</CardTitle>
                  <CardDescription className="text-blue-700">{t("kpi.analytics.dashboard.ratingDistDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Количество",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ratingDistributionData.filter((d) => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {ratingDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-2 border-green-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
                  <CardTitle className="text-green-900">{t("kpi.analytics.dashboard.employeeRating")}</CardTitle>
                  <CardDescription className="text-green-700">
                    {t("kpi.analytics.dashboard.employeeRatingDesc")} {selectedPeriod}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employeeRankingData.map((employee, index) => (
                      <div
                        key={employee.name}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <Badge className={`${getRatingColor(employee.rating)} mt-1`}>
                              {getRatingLabel(employee.rating)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-primary">{employee.kpi}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200">
                  <CardTitle className="text-orange-900">{t("kpi.analytics.dashboard.componentScores")}</CardTitle>
                  <CardDescription className="text-orange-700">{t("kpi.analytics.dashboard.componentScoresDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {componentBreakdownData.map((item) => (
                      <div
                        key={item.component}
                        className="flex items-center justify-between p-3 rounded-lg border-2 hover:shadow-md transition-shadow"
                        style={{ borderColor: item.color + "40", backgroundColor: item.color + "10" }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.component}</span>
                        </div>
                        <span className="text-lg font-bold" style={{ color: item.color }}>
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>

                  <ChartContainer
                    config={{
                      value: {
                        label: "Баллы",
                        color: "hsl(var(--primary))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={componentBreakdownData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 20]} />
                        <YAxis
                          type="category"
                          dataKey="component"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={11}
                          width={120}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {componentBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Insights */}
            <Card className="border-2 border-cyan-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b-2 border-cyan-200">
                <CardTitle className="text-cyan-900">{t("kpi.analytics.dashboard.insights")}</CardTitle>
                <CardDescription className="text-cyan-700">
                  {t("kpi.analytics.dashboard.insightsDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-secondary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{t("kpi.analytics.dashboard.positiveTrend")}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t("kpi.analytics.dashboard.avgKPI")} подразделения вырос на {kpiChange}% по сравнению с предыдущим периодом
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <Award className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{t("kpi.analytics.dashboard.highScores")}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t("kpi.analytics.dashboard.highScoresDesc")} (KPI &gt; 86%)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <Target className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{t("kpi.analytics.dashboard.bestScore")}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t("kpi.analytics.dashboard.bestScoreDesc")} - 18%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )

      case "employees":
        return (
          <>
            <div className="flex items-center justify-between border-l-4 border-blue-500 pl-4">
              <div>
                <h1 className="text-3xl font-bold">{t("kpi.analytics.employees.title")}</h1>
                <p className="text-muted-foreground">{t("kpi.analytics.employees.subtitle")}</p>
              </div>
            </div>

            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
                <CardTitle className="text-blue-900">{t("kpi.analytics.employees.cardTitle")}</CardTitle>
                <CardDescription className="text-blue-700">
                  {t("kpi.analytics.employees.cardDesc")} {selectedPeriod}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("kpi.analytics.employees.colEmployee")}</TableHead>
                        <TableHead>{t("kpi.analytics.employees.colRank")}</TableHead>
                        <TableHead>{t("kpi.analytics.employees.colPosition")}</TableHead>
                        <TableHead className="text-center">{t("kpi.analytics.employees.colBudget")}</TableHead>
                        <TableHead className="text-center">{t("kpi.analytics.employees.colRemote")}</TableHead>
                        <TableHead className="text-center">{t("kpi.analytics.employees.colPlan")}</TableHead>
                        <TableHead className="text-center">{t("kpi.analytics.employees.colProposals")}</TableHead>
                        <TableHead className="text-center">{t("kpi.analytics.employees.colViolationsCount")}</TableHead>
                        <TableHead className="text-center">{t("kpi.analytics.employees.colViolationsSum")}</TableHead>
                        <TableHead className="text-center">{t("kpi.analytics.employees.colDeadlines")}</TableHead>
                        <TableHead className="text-center">{t("kpi.analytics.employees.colTotal")}</TableHead>
                        <TableHead>{t("kpi.analytics.employees.colRating")}</TableHead>
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
          </>
        )

      case "department":
        return (
          <>
            <div className="flex items-center justify-between border-l-4 border-green-500 pl-4">
              <div>
                <h1 className="text-3xl font-bold">{t("kpi.analytics.department.title")}</h1>
                <p className="text-muted-foreground">{t("kpi.analytics.department.subtitle")}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <StatsCard
                title={t("kpi.analytics.department.avgKPI")}
                value={`${mockDepartmentSummary.averageKPI}%`}
                subtitle={t("kpi.analytics.department.avgKPISubtitle")}
                icon={Target}
                color="blue"
              />
              <StatsCard
                title={t("kpi.analytics.department.employees")}
                value={mockDepartmentSummary.totalEmployees}
                subtitle={t("kpi.analytics.department.employeesSubtitle")}
                icon={Users}
                color="green"
              />
              <StatsCard
                title={t("kpi.analytics.department.excellentScores")}
                value={mockDepartmentSummary.excellentCount}
                subtitle={t("kpi.analytics.department.excellentSubtitle")}
                icon={Award}
                color="purple"
              />
              <StatsCard
                title={t("kpi.analytics.department.attentionNeeded")}
                value={mockDepartmentSummary.unsatisfactoryCount}
                subtitle={t("kpi.analytics.department.attentionSubtitle")}
                icon={AlertTriangle}
                color="orange"
              />
              <StatsCard
                title="Обучение"
                value="24ч"
                subtitle="Часов в год"
                icon={FileText}
                color="cyan"
              />
              <StatsCard
                title="Удовлетворенность"
                value="4.8"
                subtitle="Оценка"
                icon={Target}
                color="pink"
              />
            </div>

            <Card className="border-2 border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
                <CardTitle className="text-green-900">{t("kpi.analytics.department.summaryTitle")}</CardTitle>
                <CardDescription className="text-green-700">
                  {t("kpi.analytics.department.summaryDesc")} {selectedPeriod}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("kpi.analytics.department.colIndicator")}</TableHead>
                        <TableHead className="text-right">{t("kpi.analytics.department.colAvg")}</TableHead>
                        <TableHead className="text-right">{t("kpi.analytics.department.colMin")}</TableHead>
                        <TableHead className="text-right">{t("kpi.analytics.department.colMax")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{t("kpi.analytics.department.budgetPrevention")}</TableCell>
                        <TableCell className="text-right">16%</TableCell>
                        <TableCell className="text-right">15%</TableCell>
                        <TableCell className="text-right">17%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t("kpi.analytics.department.remoteControl")}</TableCell>
                        <TableCell className="text-right">17%</TableCell>
                        <TableCell className="text-right">16%</TableCell>
                        <TableCell className="text-right">18%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t("kpi.analytics.department.annualPlan")}</TableCell>
                        <TableCell className="text-right">18%</TableCell>
                        <TableCell className="text-right">17%</TableCell>
                        <TableCell className="text-right">19%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t("kpi.analytics.department.proposalExec")}</TableCell>
                        <TableCell className="text-right">8%</TableCell>
                        <TableCell className="text-right">7%</TableCell>
                        <TableCell className="text-right">9%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t("kpi.analytics.department.violationCount")}</TableCell>
                        <TableCell className="text-right">4%</TableCell>
                        <TableCell className="text-right">4%</TableCell>
                        <TableCell className="text-right">5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t("kpi.analytics.department.violationSum")}</TableCell>
                        <TableCell className="text-right">4%</TableCell>
                        <TableCell className="text-right">3%</TableCell>
                        <TableCell className="text-right">5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t("kpi.analytics.department.deadlines")}</TableCell>
                        <TableCell className="text-right">17%</TableCell>
                        <TableCell className="text-right">16%</TableCell>
                        <TableCell className="text-right">18%</TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold">{t("kpi.analytics.department.totalKPI")}</TableCell>
                        <TableCell className="text-right font-bold">84%</TableCell>
                        <TableCell className="text-right font-bold">78%</TableCell>
                        <TableCell className="text-right font-bold">91%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
                <CardTitle className="text-purple-900">{t("kpi.analytics.department.ratingDist")}</CardTitle>
                <CardDescription className="text-purple-700">{t("kpi.analytics.department.ratingDistDesc")}</CardDescription>
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
          </>
        )

      case "dynamics":
        return (
          <>
            <div className="flex items-center justify-between border-l-4 border-orange-500 pl-4">
              <div>
                <h1 className="text-3xl font-bold">{t("kpi.analytics.dynamics.title")}</h1>
                <p className="text-muted-foreground">{t("kpi.analytics.dynamics.subtitle")}</p>
              </div>
            </div>

            <Card className="border-2 border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200">
                <CardTitle className="text-orange-900">{t("kpi.analytics.dynamics.cardTitle")}</CardTitle>
                <CardDescription className="text-orange-700">
                  {t("kpi.analytics.dynamics.cardDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("kpi.analytics.dynamics.colPeriod")}</TableHead>
                        <TableHead className="text-center">{t("kpi.analytics.dynamics.colEmployeeCount")}</TableHead>
                        <TableHead className="text-center">{t("kpi.analytics.dynamics.colAvgKPI")}</TableHead>
                        <TableHead className="text-center">{t("kpi.analytics.dynamics.colChange")}</TableHead>
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
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex flex-col">
      <SectionsTabs
        pageId="analytics"
        submoduleTitle={t("kpi.analytics.dashboard.title")}
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex flex-col gap-6 p-6">{renderSectionContent()}</div>
    </div>
  )
}

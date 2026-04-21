"use client"

import { useState } from "react"
import { SectionsTabs } from "@/components/sections-tabs"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function ReportGenerationPage() {
  const [activeSection, setActiveSection] = useState("final")

  const sections = [
    { id: "final", title: "Итоговый отчёт", icon: Icons.FileText },
    { id: "coverage", title: "Состояние обревизованности", icon: Icons.CheckCircle },
    { id: "financial", title: "Финансовые нарушения", icon: Icons.DollarSign },
    { id: "losses", title: "Утраты материальных ценностей", icon: Icons.Package },
    { id: "recoveries", title: "Возмещение ущерба", icon: Icons.TrendingUp },
    { id: "responsibles", title: "Привлечённые к ответственности", icon: Icons.Users },
  ]

  const renderSectionContent = () => {
    switch (activeSection) {
      case "final":
        return <FinalReportSection />
      case "coverage":
        return <CoverageSection />
      case "financial":
        return <FinancialSection />
      case "losses":
        return <LossesSection />
      case "recoveries":
        return <RecoveriesSection />
      case "responsibles":
        return <ResponsiblesSection />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Формирование отчётов</h1>
        <p className="text-muted-foreground mt-1">Report Generation</p>
      </div>

      <SectionsTabs
        pageId="generation"
        submoduleTitle="Генерация отчетов"
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {renderSectionContent()}
    </div>
  )
}

function FinalReportSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-blue-700 font-medium">Всего отчётов</CardDescription>
              <div className="rounded-full bg-blue-500 p-2 ring-4 ring-blue-200">
                <Icons.FileText className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-blue-700">156</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-green-700 font-medium">Утверждено</CardDescription>
              <div className="rounded-full bg-green-500 p-2 ring-4 ring-green-200">
                <Icons.CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-green-700">142</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-yellow-700 font-medium">На утверждении</CardDescription>
              <div className="rounded-full bg-yellow-500 p-2 ring-4 ring-yellow-200">
                <Icons.Clock className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-yellow-700">8</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-purple-700 font-medium">Черновики</CardDescription>
              <div className="rounded-full bg-purple-500 p-2 ring-4 ring-purple-200">
                <Icons.Edit className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-purple-700">6</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Итоговые отчёты (Ф.151/ФС)</CardTitle>
            <Button>
              <Icons.Plus className="h-4 w-4 mr-2" />
              Создать отчёт
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <Input placeholder="Поиск по номеру отчёта..." className="flex-1" />
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="draft">Черновик</SelectItem>
                <SelectItem value="pending">На утверждении</SelectItem>
                <SelectItem value="approved">Утверждён</SelectItem>
                <SelectItem value="sent">Отправлен</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="2025">
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все годы</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">ID отчёта</th>
                  <th className="text-left p-3 font-semibold">Ревизия</th>
                  <th className="text-left p-3 font-semibold">Дата</th>
                  <th className="text-left p-3 font-semibold">Статус</th>
                  <th className="text-left p-3 font-semibold">Утвердил</th>
                  <th className="text-left p-3 font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "REP-2025-001",
                    rev: "РЕВ-2025-045",
                    date: "2025-01-15",
                    status: "approved",
                    statusText: "Утверждён",
                    approver: "Полковник Иванов И.И.",
                  },
                  {
                    id: "REP-2025-002",
                    rev: "РЕВ-2025-046",
                    date: "2025-01-18",
                    status: "pending",
                    statusText: "На утверждении",
                    approver: "-",
                  },
                  {
                    id: "REP-2024-089",
                    rev: "РЕВ-2024-234",
                    date: "2024-12-28",
                    status: "sent",
                    statusText: "Отправлен",
                    approver: "Генерал-майор Петров П.П.",
                  },
                ].map((report) => (
                  <tr key={report.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-mono text-sm">{report.id}</td>
                    <td className="p-3">{report.rev}</td>
                    <td className="p-3">{report.date}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          report.status === "approved"
                            ? "default"
                            : report.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {report.statusText}
                      </Badge>
                    </td>
                    <td className="p-3">{report.approver}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Icons.Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Icons.Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Icons.Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CoverageSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-blue-700 font-medium">Всего частей</CardDescription>
              <div className="rounded-full bg-blue-500 p-2 ring-4 ring-blue-200">
                <Icons.Building className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-blue-700">245</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-green-700 font-medium">Обревизовано</CardDescription>
              <div className="rounded-full bg-green-500 p-2 ring-4 ring-green-200">
                <Icons.CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-green-700">198</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-orange-700 font-medium">В плане</CardDescription>
              <div className="rounded-full bg-orange-500 p-2 ring-4 ring-orange-200">
                <Icons.Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-orange-700">32</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-purple-700 font-medium">Не охвачено</CardDescription>
              <div className="rounded-full bg-purple-500 p-2 ring-4 ring-purple-200">
                <Icons.AlertCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-purple-700">15</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Состояние обревизованности</CardTitle>
            <Button>
              <Icons.Download className="h-4 w-4 mr-2" />
              Экспорт отчёта
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <Input placeholder="Поиск по воинской части..." className="flex-1" />
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="audited">Обревизовано</SelectItem>
                <SelectItem value="planned">В плане</SelectItem>
                <SelectItem value="not-covered">Не охвачено</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Воинская часть</th>
                  <th className="text-left p-3 font-semibold">Последняя ревизия</th>
                  <th className="text-left p-3 font-semibold">Статус</th>
                  <th className="text-left p-3 font-semibold">Следующая ревизия</th>
                  <th className="text-left p-3 font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    unit: "В/Ч 12345",
                    last: "2024-11-15",
                    status: "audited",
                    statusText: "Обревизовано",
                    next: "2025-11-15",
                  },
                  {
                    unit: "В/Ч 23456",
                    last: "2024-09-20",
                    status: "audited",
                    statusText: "Обревизовано",
                    next: "2025-09-20",
                  },
                  { unit: "В/Ч 34567", last: "-", status: "planned", statusText: "В плане", next: "2025-03-10" },
                  {
                    unit: "В/Ч 45678",
                    last: "2023-12-05",
                    status: "not-covered",
                    statusText: "Не охвачено",
                    next: "-",
                  },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-semibold">{item.unit}</td>
                    <td className="p-3">{item.last}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          item.status === "audited"
                            ? "default"
                            : item.status === "planned"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {item.statusText}
                      </Badge>
                    </td>
                    <td className="p-3">{item.next}</td>
                    <td className="p-3">
                      <Button variant="ghost" size="icon">
                        <Icons.Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FinancialSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-cyan-700 font-medium">Всего нарушений</CardDescription>
              <div className="rounded-full bg-cyan-500 p-2 ring-4 ring-cyan-200">
                <Icons.AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-cyan-700">342</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-indigo-700 font-medium">Сумма нарушений</CardDescription>
              <div className="rounded-full bg-indigo-500 p-2 ring-4 ring-indigo-200">
                <Icons.DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-indigo-700">8.5М</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-rose-700 font-medium">Критические</CardDescription>
              <div className="rounded-full bg-rose-500 p-2 ring-4 ring-rose-200">
                <Icons.XCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-rose-700">45</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-amber-700 font-medium">Устранено</CardDescription>
              <div className="rounded-full bg-amber-500 p-2 ring-4 ring-amber-200">
                <Icons.CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-amber-700">287</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Финансовые нарушения</CardTitle>
            <Button>
              <Icons.Download className="h-4 w-4 mr-2" />
              Экспорт отчёта
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <Input placeholder="Поиск по типу нарушения..." className="flex-1" />
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="critical">Критические</SelectItem>
                <SelectItem value="major">Значительные</SelectItem>
                <SelectItem value="minor">Незначительные</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Тип нарушения</th>
                  <th className="text-left p-3 font-semibold">Количество</th>
                  <th className="text-left p-3 font-semibold">Сумма</th>
                  <th className="text-left p-3 font-semibold">Устранено</th>
                  <th className="text-left p-3 font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Нецелевое использование средств", count: 78, amount: "2.3М", resolved: 65 },
                  { type: "Завышение цен при закупках", count: 124, amount: "3.8М", resolved: 98 },
                  { type: "Неправильное оформление документов", count: 89, amount: "1.2М", resolved: 76 },
                  { type: "Нарушение сроков отчётности", count: 51, amount: "1.2М", resolved: 48 },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-3">{item.type}</td>
                    <td className="p-3 font-semibold">{item.count}</td>
                    <td className="p-3 font-semibold text-red-600">{item.amount}</td>
                    <td className="p-3 font-semibold text-green-600">{item.resolved}</td>
                    <td className="p-3">
                      <Button variant="ghost" size="icon">
                        <Icons.Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LossesSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-emerald-700 font-medium">Всего случаев</CardDescription>
              <div className="rounded-full bg-emerald-500 p-2 ring-4 ring-emerald-200">
                <Icons.Package className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-emerald-700">156</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-violet-700 font-medium">Сумма ущерба</CardDescription>
              <div className="rounded-full bg-violet-500 p-2 ring-4 ring-violet-200">
                <Icons.TrendingDown className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-violet-700">4.2М</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-pink-700 font-medium">Недостачи</CardDescription>
              <div className="rounded-full bg-pink-500 p-2 ring-4 ring-pink-200">
                <Icons.Minus className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-pink-700">89</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-lime-200 bg-gradient-to-br from-lime-50 to-lime-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-lime-700 font-medium">Хищения</CardDescription>
              <div className="rounded-full bg-lime-500 p-2 ring-4 ring-lime-200">
                <Icons.AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-lime-700">67</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Утраты материальных ценностей</CardTitle>
            <Button>
              <Icons.Download className="h-4 w-4 mr-2" />
              Экспорт отчёта
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <Input placeholder="Поиск по категории..." className="flex-1" />
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="shortage">Недостачи</SelectItem>
                <SelectItem value="theft">Хищения</SelectItem>
                <SelectItem value="damage">Порча</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Категория</th>
                  <th className="text-left p-3 font-semibold">Количество случаев</th>
                  <th className="text-left p-3 font-semibold">Сумма ущерба</th>
                  <th className="text-left p-3 font-semibold">Возмещено</th>
                  <th className="text-left p-3 font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { category: "Недостачи имущества", count: 89, amount: "1.8М", recovered: "1.2М" },
                  { category: "Хищения", count: 67, amount: "2.4М", recovered: "0.8М" },
                  { category: "Порча имущества", count: 34, amount: "0.5М", recovered: "0.3М" },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-3">{item.category}</td>
                    <td className="p-3 font-semibold">{item.count}</td>
                    <td className="p-3 font-semibold text-red-600">{item.amount}</td>
                    <td className="p-3 text-green-600">{item.recovered}</td>
                    <td className="p-3">
                      <Button variant="ghost" size="icon">
                        <Icons.Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RecoveriesSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-sky-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sky-700 font-medium">Всего дел</CardDescription>
              <div className="rounded-full bg-sky-500 p-2 ring-4 ring-sky-200">
                <Icons.FileText className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-sky-700">234</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-teal-700 font-medium">Сумма к возмещению</CardDescription>
              <div className="rounded-full bg-teal-500 p-2 ring-4 ring-teal-200">
                <Icons.DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-teal-700">6.8М</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-red-700 font-medium">Возмещено</CardDescription>
              <div className="rounded-full bg-red-500 p-2 ring-4 ring-red-200">
                <Icons.TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-red-700">4.5М</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-yellow-700 font-medium">В процессе</CardDescription>
              <div className="rounded-full bg-yellow-500 p-2 ring-4 ring-yellow-200">
                <Icons.Clock className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-yellow-700">2.3М</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Возмещение ущерба</CardTitle>
            <Button>
              <Icons.Download className="h-4 w-4 mr-2" />
              Экспорт отчёта
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <Input placeholder="Поиск по делу..." className="flex-1" />
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="recovered">Возмещено</SelectItem>
                <SelectItem value="in-progress">В процессе</SelectItem>
                <SelectItem value="pending">Ожидает</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Номер дела</th>
                  <th className="text-left p-3 font-semibold">Ответственный</th>
                  <th className="text-left p-3 font-semibold">Сумма ущерба</th>
                  <th className="text-left p-3 font-semibold">Возмещено</th>
                  <th className="text-left p-3 font-semibold">Статус</th>
                  <th className="text-left p-3 font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    case: "ДЕЛ-2025-045",
                    person: "Сержант Иванов А.А.",
                    damage: "450,000",
                    recovered: "450,000",
                    status: "recovered",
                    statusText: "Возмещено",
                  },
                  {
                    case: "ДЕЛ-2025-046",
                    person: "Рядовой Петров Б.Б.",
                    damage: "280,000",
                    recovered: "140,000",
                    status: "in-progress",
                    statusText: "В процессе",
                  },
                  {
                    case: "ДЕЛ-2025-047",
                    person: "Капитан Сидоров В.В.",
                    damage: "1,200,000",
                    recovered: "0",
                    status: "pending",
                    statusText: "Ожидает",
                  },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-mono text-sm">{item.case}</td>
                    <td className="p-3">{item.person}</td>
                    <td className="p-3 font-semibold text-red-600">{item.damage}</td>
                    <td className="p-3 font-semibold text-green-600">{item.recovered}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          item.status === "recovered"
                            ? "default"
                            : item.status === "in-progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {item.statusText}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="icon">
                        <Icons.Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ResponsiblesSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-blue-700 font-medium">Всего лиц</CardDescription>
              <div className="rounded-full bg-blue-500 p-2 ring-4 ring-blue-200">
                <Icons.Users className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-blue-700">189</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-green-700 font-medium">Дисциплинарная</CardDescription>
              <div className="rounded-full bg-green-500 p-2 ring-4 ring-green-200">
                <Icons.FileText className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-green-700">98</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-orange-700 font-medium">Материальная</CardDescription>
              <div className="rounded-full bg-orange-500 p-2 ring-4 ring-orange-200">
                <Icons.DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-orange-700">67</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-purple-700 font-medium">Уголовная</CardDescription>
              <div className="rounded-full bg-purple-500 p-2 ring-4 ring-purple-200">
                <Icons.AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-purple-700">24</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Привлечённые к ответственности</CardTitle>
            <Button>
              <Icons.Download className="h-4 w-4 mr-2" />
              Экспорт отчёта
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <Input placeholder="Поиск по ФИО..." className="flex-1" />
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все виды</SelectItem>
                <SelectItem value="disciplinary">Дисциплинарная</SelectItem>
                <SelectItem value="material">Материальная</SelectItem>
                <SelectItem value="criminal">Уголовная</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">ФИО</th>
                  <th className="text-left p-3 font-semibold">Звание</th>
                  <th className="text-left p-3 font-semibold">Воинская часть</th>
                  <th className="text-left p-3 font-semibold">Вид ответственности</th>
                  <th className="text-left p-3 font-semibold">Дата</th>
                  <th className="text-left p-3 font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Иванов Иван Иванович",
                    rank: "Сержант",
                    unit: "В/Ч 12345",
                    type: "disciplinary",
                    typeText: "Дисциплинарная",
                    date: "2025-01-15",
                  },
                  {
                    name: "Петров Петр Петрович",
                    rank: "Рядовой",
                    unit: "В/Ч 23456",
                    type: "material",
                    typeText: "Материальная",
                    date: "2025-01-10",
                  },
                  {
                    name: "Сидоров Сидор Сидорович",
                    rank: "Капитан",
                    unit: "В/Ч 34567",
                    type: "criminal",
                    typeText: "Уголовная",
                    date: "2024-12-20",
                  },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-semibold">{item.name}</td>
                    <td className="p-3">{item.rank}</td>
                    <td className="p-3">{item.unit}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          item.type === "disciplinary"
                            ? "default"
                            : item.type === "material"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {item.typeText}
                      </Badge>
                    </td>
                    <td className="p-3">{item.date}</td>
                    <td className="p-3">
                      <Button variant="ghost" size="icon">
                        <Icons.Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

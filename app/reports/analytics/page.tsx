"use client"

import { useState } from "react"
import { SectionsTabs } from "@/components/sections-tabs"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
  const [activeSection, setActiveSection] = useState("periods")

  const sections = [
    { id: "periods", title: "Свод по периодам", icon: Icons.Calendar },
    { id: "services", title: "Свод по службам", icon: Icons.Users },
    { id: "forms", title: "Проверка форм", icon: Icons.FileText },
    { id: "districts", title: "По военным округам", icon: Icons.MapPin },
  ]

  const renderSectionContent = () => {
    switch (activeSection) {
      case "periods":
        return <PeriodsSection />
      case "services":
        return <ServicesSection />
      case "forms":
        return <FormsSection />
      case "districts":
        return <DistrictsSection />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Аналитика и своды</h1>
        <p className="text-muted-foreground mt-1">Analytics and Summaries</p>
      </div>

      <SectionsTabs
        submoduleTitle="Аналитика и своды"
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        pageId="analytics"
      />

      {renderSectionContent()}
    </div>
  )
}

function PeriodsSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-blue-700 font-medium">Всего ревизий</CardDescription>
              <div className="rounded-full bg-blue-500 p-2 ring-4 ring-blue-200">
                <Icons.FileText className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-blue-700">349</CardTitle>
            <p className="text-sm text-blue-600 mt-1">За 3 года</p>
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-green-700 font-medium">Нарушений</CardDescription>
              <div className="rounded-full bg-green-500 p-2 ring-4 ring-green-200">
                <Icons.AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-green-700">2,072</CardTitle>
            <p className="text-sm text-green-600 mt-1">Всего выявлено</p>
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-rose-700 font-medium">Сумма ущерба</CardDescription>
              <div className="rounded-full bg-rose-500 p-2 ring-4 ring-rose-200">
                <Icons.DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-rose-700">UZS 68.5М</CardTitle>
            <p className="text-sm text-rose-600 mt-1">За весь период</p>
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-emerald-700 font-medium">Возмещено</CardDescription>
              <div className="rounded-full bg-emerald-500 p-2 ring-4 ring-emerald-200">
                <Icons.TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-emerald-700">UZS 47.1М</CardTitle>
            <p className="text-sm text-emerald-600 mt-1">69% возмещено</p>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Годовой свод</CardTitle>
            <Button variant="outline">
              <Icons.Download className="h-4 w-4 mr-2" />
              Экспорт отчёта
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Год</th>
                  <th className="text-left p-3 font-semibold">Ревизий</th>
                  <th className="text-left p-3 font-semibold">Нарушений</th>
                  <th className="text-left p-3 font-semibold">Сумма</th>
                  <th className="text-left p-3 font-semibold">Возмещено</th>
                  <th className="text-left p-3 font-semibold">%</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { year: 2025, audits: 45, violations: 247, amount: 8400000, recovered: 6100000 },
                  { year: 2024, audits: 156, violations: 891, amount: 28900000, recovered: 21200000 },
                  { year: 2023, audits: 148, violations: 934, amount: 31200000, recovered: 19800000 },
                ].map((item) => {
                  const percent = Math.round((item.recovered / item.amount) * 100)
                  return (
                    <tr key={item.year} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-bold">{item.year}</td>
                      <td className="p-3">{item.audits}</td>
                      <td className="p-3">{item.violations}</td>
                      <td className="p-3 font-mono">UZS {(item.amount / 1000000).toFixed(1)}М</td>
                      <td className="p-3 font-mono text-green-600">UZS {(item.recovered / 1000000).toFixed(1)}М</td>
                      <td className="p-3 font-semibold">{percent}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Квартальный свод (2025)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Квартал</th>
                  <th className="text-left p-3 font-semibold">Ревизий</th>
                  <th className="text-left p-3 font-semibold">Нарушений</th>
                  <th className="text-left p-3 font-semibold">Сумма</th>
                  <th className="text-left p-3 font-semibold">Возмещено</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { quarter: "Q1 2025", audits: 45, violations: 247, amount: 8400000, recovered: 6100000 },
                  { quarter: "Q4 2024", audits: 42, violations: 234, amount: 7800000, recovered: 5600000 },
                  { quarter: "Q3 2024", audits: 38, violations: 218, amount: 7200000, recovered: 5100000 },
                  { quarter: "Q2 2024", audits: 36, violations: 201, amount: 6900000, recovered: 4800000 },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-semibold">{item.quarter}</td>
                    <td className="p-3">{item.audits}</td>
                    <td className="p-3">{item.violations}</td>
                    <td className="p-3 font-mono">UZS {(item.amount / 1000000).toFixed(1)}М</td>
                    <td className="p-3 font-mono text-green-600">UZS {(item.recovered / 1000000).toFixed(1)}М</td>
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

function ServicesSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-violet-700 font-medium">Продовольственная</CardDescription>
              <div className="rounded-full bg-violet-500 p-2 ring-4 ring-violet-200">
                <Icons.Store className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-violet-700">128</CardTitle>
            <p className="text-sm text-violet-600 mt-1">UZS 4.2М ущерба</p>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-teal-700 font-medium">Вещевая</CardDescription>
              <div className="rounded-full bg-teal-500 p-2 ring-4 ring-teal-200">
                <Icons.Package className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-teal-700">89</CardTitle>
            <p className="text-sm text-teal-600 mt-1">UZS 2.8М ущерба</p>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-pink-700 font-medium">Квартирно-эксплуатационная</CardDescription>
              <div className="rounded-full bg-pink-500 p-2 ring-4 ring-pink-200">
                <Icons.Home className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-pink-700">23</CardTitle>
            <p className="text-sm text-pink-600 mt-1">UZS 1.1М ущерба</p>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-lime-200 bg-gradient-to-br from-lime-50 to-lime-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-lime-700 font-medium">Прочие службы</CardDescription>
              <div className="rounded-full bg-lime-500 p-2 ring-4 ring-lime-200">
                <Icons.Layers className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-lime-700">7</CardTitle>
            <p className="text-sm text-lime-600 mt-1">UZS 0.3М ущерба</p>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Детальный свод по службам довольствия</CardTitle>
            <Button variant="outline">
              <Icons.Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Служба</th>
                  <th className="text-left p-3 font-semibold">Ревизий</th>
                  <th className="text-left p-3 font-semibold">Нарушений</th>
                  <th className="text-left p-3 font-semibold">Сумма ущерба</th>
                  <th className="text-left p-3 font-semibold">Возмещено</th>
                  <th className="text-left p-3 font-semibold">%</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    service: "Продовольственная служба",
                    audits: 18,
                    violations: 128,
                    amount: 4200000,
                    recovered: 3100000,
                  },
                  { service: "Вещевая служба", audits: 14, violations: 89, amount: 2800000, recovered: 2000000 },
                  {
                    service: "Квартирно-эксплуатационная служба",
                    audits: 9,
                    violations: 23,
                    amount: 1100000,
                    recovered: 800000,
                  },
                  { service: "Служба горючего", audits: 3, violations: 5, amount: 200000, recovered: 150000 },
                  { service: "Прочие службы", audits: 1, violations: 2, amount: 100000, recovered: 50000 },
                ].map((item, idx) => {
                  const percent = Math.round((item.recovered / item.amount) * 100)
                  return (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-semibold">{item.service}</td>
                      <td className="p-3">{item.audits}</td>
                      <td className="p-3">{item.violations}</td>
                      <td className="p-3 font-mono">UZS {(item.amount / 1000000).toFixed(1)}М</td>
                      <td className="p-3 font-mono text-green-600">UZS {(item.recovered / 1000000).toFixed(1)}М</td>
                      <td className="p-3 font-semibold">{percent}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Анализ по службам</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Icons.AlertCircle className="h-5 w-5 text-violet-600 mt-0.5 flex-shrink-0" />
              <span>Продовольственная служба показывает наибольшее количество нарушений (52% от общего числа)</span>
            </li>
            <li className="flex items-start gap-3">
              <Icons.CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Вещевая служба демонстрирует улучшение показателей возмещения ущерба (71%)</span>
            </li>
            <li className="flex items-start gap-3">
              <Icons.CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                Квартирно-эксплуатационная служба показывает стабильные результаты с минимальным количеством нарушений
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function FormsSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-sky-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sky-700 font-medium">Проверено форм</CardDescription>
              <div className="rounded-full bg-sky-500 p-2 ring-4 ring-sky-200">
                <Icons.FileText className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-sky-700">1,247</CardTitle>
            <p className="text-sm text-sky-600 mt-1">За текущий период</p>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-green-700 font-medium">Корректные</CardDescription>
              <div className="rounded-full bg-green-500 p-2 ring-4 ring-green-200">
                <Icons.CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-green-700">1,189</CardTitle>
            <p className="text-sm text-green-600 mt-1">95.3% успешно</p>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-red-700 font-medium">С ошибками</CardDescription>
              <div className="rounded-full bg-red-500 p-2 ring-4 ring-red-200">
                <Icons.XCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-red-700">58</CardTitle>
            <p className="text-sm text-red-600 mt-1">4.7% требуют исправления</p>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-yellow-700 font-medium">Средний балл</CardDescription>
              <div className="rounded-full bg-yellow-500 p-2 ring-4 ring-yellow-200">
                <Icons.Star className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-yellow-700">9.2</CardTitle>
            <p className="text-sm text-yellow-600 mt-1">Из 10 возможных</p>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Результаты проверки форм отчётности</CardTitle>
            <Button variant="outline">
              <Icons.Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Форма</th>
                  <th className="text-left p-3 font-semibold">Проверено</th>
                  <th className="text-left p-3 font-semibold">Корректных</th>
                  <th className="text-left p-3 font-semibold">С ошибками</th>
                  <th className="text-left p-3 font-semibold">Точность</th>
                  <th className="text-left p-3 font-semibold">Статус</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    form: "Форма 1 - Баланс",
                    checked: 245,
                    correct: 238,
                    errors: 7,
                    accuracy: 97.1,
                    status: "Отлично",
                  },
                  {
                    form: "Форма 2 - Отчёт о прибылях",
                    checked: 245,
                    correct: 232,
                    errors: 13,
                    accuracy: 94.7,
                    status: "Хорошо",
                  },
                  {
                    form: "Форма 3 - Движение капитала",
                    checked: 245,
                    correct: 240,
                    errors: 5,
                    accuracy: 98.0,
                    status: "Отлично",
                  },
                  {
                    form: "Форма 4 - Движение денежных средств",
                    checked: 245,
                    correct: 235,
                    errors: 10,
                    accuracy: 95.9,
                    status: "Хорошо",
                  },
                  {
                    form: "Форма 5 - Пояснения",
                    checked: 267,
                    correct: 244,
                    errors: 23,
                    accuracy: 91.4,
                    status: "Удовлетворительно",
                  },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-semibold">{item.form}</td>
                    <td className="p-3">{item.checked}</td>
                    <td className="p-3 text-green-600">{item.correct}</td>
                    <td className="p-3 text-red-600">{item.errors}</td>
                    <td className="p-3 font-semibold">{item.accuracy}%</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.status === "Отлично"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Хорошо"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Типичные ошибки в формах</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Icons.AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span>Несоответствие итоговых сумм в разных разделах формы (23 случая)</span>
            </li>
            <li className="flex items-start gap-3">
              <Icons.AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <span>Отсутствие обязательных подписей и печатей (15 случаев)</span>
            </li>
            <li className="flex items-start gap-3">
              <Icons.AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span>Арифметические ошибки в расчётах (12 случаев)</span>
            </li>
            <li className="flex items-start gap-3">
              <Icons.AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Неправильное заполнение реквизитов (8 случаев)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function DistrictsSection() {
  const districtData = [
    {
      id: "1",
      code: "ЮЗОВО",
      name: "Юго-Западный особый военный округ",
      detected: 5200000,
      repaid: 3650000,
      shortages: 1500000,
      thefts: 1100000,
      illegalExpenses: 2000000,
      overpayments: 400000,
      underpayments: 200000,
    },
    {
      id: "2",
      code: "ВВО",
      name: "Восточный военный округ",
      detected: 2980000,
      repaid: 2100000,
      shortages: 750000,
      thefts: 580000,
      illegalExpenses: 1200000,
      overpayments: 280000,
      underpayments: 170000,
    },
    {
      id: "3",
      code: "ТашВО",
      name: "Ташкентский военный округ",
      detected: 6200000,
      repaid: 4350000,
      shortages: 1800000,
      thefts: 1400000,
      illegalExpenses: 2300000,
      overpayments: 450000,
      underpayments: 250000,
    },
    {
      id: "4",
      code: "ЦВО",
      name: "Центральный военный округ",
      detected: 3850000,
      repaid: 2800000,
      shortages: 980000,
      thefts: 720000,
      illegalExpenses: 1450000,
      overpayments: 380000,
      underpayments: 320000,
    },
    {
      id: "5",
      code: "СЗВО",
      name: "Северо-Западный военный округ",
      detected: 3450000,
      repaid: 2400000,
      shortages: 900000,
      thefts: 650000,
      illegalExpenses: 1300000,
      overpayments: 350000,
      underpayments: 250000,
    },
    {
      id: "6",
      code: "КВ ПВО и ВВС",
      name: "Командование войск противовоздушной обороны и военно-воздушных сил",
      detected: 4520000,
      repaid: 3200000,
      shortages: 1200000,
      thefts: 850000,
      illegalExpenses: 1850000,
      overpayments: 420000,
      underpayments: 200000,
    },
    {
      id: "7",
      code: "КВ ОККО",
      name: "Командование войск по охране категорированных объектов",
      detected: 4100000,
      repaid: 2950000,
      shortages: 1100000,
      thefts: 900000,
      illegalExpenses: 1550000,
      overpayments: 350000,
      underpayments: 200000,
    },
  ]

  const totalDetected = districtData.reduce((sum, d) => sum + d.detected, 0)
  const totalRepaid = districtData.reduce((sum, d) => sum + d.repaid, 0)
  const totalOutstanding = totalDetected - totalRepaid
  const repaymentRate = Math.round((totalRepaid / totalDetected) * 100)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-blue-700 font-medium">Всего выявлено</CardDescription>
              <div className="rounded-full bg-blue-500 p-2 ring-4 ring-blue-200">
                <Icons.AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-blue-700">UZS {(totalDetected / 1000000).toFixed(1)}М</CardTitle>
            <p className="text-sm text-blue-600 mt-1">По всем округам</p>
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-green-700 font-medium">Погашено</CardDescription>
              <div className="rounded-full bg-green-500 p-2 ring-4 ring-green-200">
                <Icons.CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-green-700">UZS {(totalRepaid / 1000000).toFixed(1)}М</CardTitle>
            <p className="text-sm text-green-600 mt-1">{repaymentRate}% возмещено</p>
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-red-700 font-medium">Остаток задолженности</CardDescription>
              <div className="rounded-full bg-red-500 p-2 ring-4 ring-red-200">
                <Icons.XCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-red-700">UZS {(totalOutstanding / 1000000).toFixed(1)}М</CardTitle>
            <p className="text-sm text-red-600 mt-1">Требует возмещения</p>
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-purple-700 font-medium">Военных округов</CardDescription>
              <div className="rounded-full bg-purple-500 p-2 ring-4 ring-purple-200">
                <Icons.MapPin className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-purple-700">{districtData.length}</CardTitle>
            <p className="text-sm text-purple-600 mt-1">Под контролем</p>
          </CardHeader>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Сводная таблица по военным округам</CardTitle>
            <Button variant="outline">
              <Icons.Download className="h-4 w-4 mr-2" />
              Экспорт в Excel
            </Button>
          </div>
          <CardDescription>Анализ нарушений: выявлено, погашено и остаток по каждому военному округу</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Код</th>
                  <th className="text-left p-3 font-semibold">Военный округ</th>
                  <th className="text-left p-3 font-semibold">Выявлено</th>
                  <th className="text-left p-3 font-semibold">Погашено</th>
                  <th className="text-left p-3 font-semibold">Остаток</th>
                  <th className="text-left p-3 font-semibold">% погашения</th>
                  <th className="text-left p-3 font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {districtData.map((district) => {
                  const outstanding = district.detected - district.repaid
                  const percent = Math.round((district.repaid / district.detected) * 100)
                  return (
                    <tr key={district.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-mono font-bold text-sm">{district.code}</td>
                      <td className="p-3 font-semibold">{district.name}</td>
                      <td className="p-3 font-mono text-blue-600">UZS {(district.detected / 1000000).toFixed(2)}М</td>
                      <td className="p-3 font-mono text-green-600">UZS {(district.repaid / 1000000).toFixed(2)}М</td>
                      <td className="p-3 font-mono text-red-600">UZS {(outstanding / 1000000).toFixed(2)}М</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="font-semibold text-sm">{percent}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          <Icons.Eye className="h-4 w-4 mr-1" />
                          Детали
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown by violation type */}
      <Card>
        <CardHeader>
          <CardTitle>Детализация по типам нарушений</CardTitle>
          <CardDescription>Распределение выявленных нарушений по категориям</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Военный округ</th>
                  <th className="text-left p-3 font-semibold">Недостачи</th>
                  <th className="text-left p-3 font-semibold">Хищения</th>
                  <th className="text-left p-3 font-semibold">Незаконные расходы</th>
                  <th className="text-left p-3 font-semibold">Переплаты</th>
                  <th className="text-left p-3 font-semibold">Недоплаты</th>
                </tr>
              </thead>
              <tbody>
                {districtData.map((district) => (
                  <tr key={district.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-semibold">{district.name}</td>
                    <td className="p-3 font-mono text-sm">UZS {(district.shortages / 1000).toFixed(0)}К</td>
                    <td className="p-3 font-mono text-sm">UZS {(district.thefts / 1000).toFixed(0)}К</td>
                    <td className="p-3 font-mono text-sm">UZS {(district.illegalExpenses / 1000).toFixed(0)}К</td>
                    <td className="p-3 font-mono text-sm">UZS {(district.overpayments / 1000).toFixed(0)}К</td>
                    <td className="p-3 font-mono text-sm">UZS {(district.underpayments / 1000).toFixed(0)}К</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top and Bottom Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.TrendingUp className="h-5 w-5 text-green-600" />
              Лучшие показатели погашения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {districtData
                .sort((a, b) => b.repaid / b.detected - a.repaid / a.detected)
                .slice(0, 3)
                .map((district, idx) => {
                  const percent = Math.round((district.repaid / district.detected) * 100)
                  return (
                    <div key={district.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                          {idx + 1}
                        </div>
                        <span className="font-medium">{district.name}</span>
                      </div>
                      <span className="font-bold text-green-600">{percent}%</span>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.TrendingDown className="h-5 w-5 text-red-600" />
              Требуют усиления контроля
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {districtData
                .sort((a, b) => a.repaid / a.detected - b.repaid / b.detected)
                .slice(0, 3)
                .map((district, idx) => {
                  const percent = Math.round((district.repaid / district.detected) * 100)
                  return (
                    <div key={district.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold text-sm">
                          {idx + 1}
                        </div>
                        <span className="font-medium">{district.name}</span>
                      </div>
                      <span className="font-bold text-red-600">{percent}%</span>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


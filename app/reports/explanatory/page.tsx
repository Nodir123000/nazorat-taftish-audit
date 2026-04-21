"use client"

import { useState } from "react"
import { SectionsTabs } from "@/components/sections-tabs"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExplanatoryNotePage() {
  const [activeSection, setActiveSection] = useState("dynamics")

  const sections = [
    { id: "dynamics", title: "Анализ динамики", icon: Icons.TrendingUp },
    { id: "causes", title: "Основные причины", icon: Icons.AlertCircle },
    { id: "measures", title: "Принятые меры", icon: Icons.CheckCircle },
  ]

  const renderSectionContent = () => {
    switch (activeSection) {
      case "dynamics":
        return <DynamicsSection />
      case "causes":
        return <CausesSection />
      case "measures":
        return <MeasuresSection />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Пояснительная записка</h1>
        <p className="text-muted-foreground mt-1">Explanatory Note</p>
      </div>

      <SectionsTabs
        pageId="explanatory"
        submoduleTitle="Пояснительная записка"
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {renderSectionContent()}
    </div>
  )
}

function DynamicsSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-emerald-700 font-medium">Текущий год</CardDescription>
              <div className="rounded-full bg-emerald-500 p-2 ring-4 ring-emerald-200">
                <Icons.TrendingDown className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-emerald-700">247</CardTitle>
            <p className="text-sm text-emerald-600 mt-1">↓ -12% к прошлому году</p>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-indigo-700 font-medium">Прошлый год</CardDescription>
              <div className="rounded-full bg-indigo-500 p-2 ring-4 ring-indigo-200">
                <Icons.Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-indigo-700">281</CardTitle>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-rose-700 font-medium">Средняя сумма</CardDescription>
              <div className="rounded-full bg-rose-500 p-2 ring-4 ring-rose-200">
                <Icons.Dollar className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-rose-700">₽ 34К</CardTitle>
            <p className="text-sm text-rose-600 mt-1">↑ +8% к прошлому году</p>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Динамика по кварталам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Период</th>
                  <th className="text-left p-3 font-semibold">Количество</th>
                  <th className="text-left p-3 font-semibold">Сумма</th>
                  <th className="text-left p-3 font-semibold">Изменение</th>
                  <th className="text-left p-3 font-semibold">Вывод</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { period: "2025 Q1", count: 58, amount: 1950000, change: -8, conclusion: "Снижение нарушений" },
                  {
                    period: "2024 Q4",
                    count: 63,
                    amount: 2100000,
                    change: -5,
                    conclusion: "Положительная динамика",
                  },
                  { period: "2024 Q3", count: 66, amount: 2350000, change: +3, conclusion: "Рост нарушений" },
                  { period: "2024 Q2", count: 64, amount: 2200000, change: -2, conclusion: "Стабилизация" },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-semibold">{item.period}</td>
                    <td className="p-3">{item.count}</td>
                    <td className="p-3 font-mono">₽ {(item.amount / 1000000).toFixed(2)}М</td>
                    <td className="p-3">
                      <span className={`font-semibold ${item.change < 0 ? "text-green-600" : "text-red-600"}`}>
                        {item.change > 0 ? "↑" : "↓"} {Math.abs(item.change)}%
                      </span>
                    </td>
                    <td className="p-3">{item.conclusion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Основные тренды</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Icons.CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Снижение количества финансовых нарушений на 12% по сравнению с прошлым годом</span>
            </li>
            <li className="flex items-start gap-3">
              <Icons.XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span>Увеличение средней суммы нарушения на 8%, что требует усиления контроля</span>
            </li>
            <li className="flex items-start gap-3">
              <Icons.CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Улучшение показателей возмещения ущерба с 65% до 71%</span>
            </li>
            <li className="flex items-start gap-3">
              <Icons.AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span>Рост нарушений в продовольственной службе требует дополнительного внимания</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function CausesSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-blue-700 font-medium">Недостаток контроля</CardDescription>
              <div className="rounded-full bg-blue-500 p-2 ring-4 ring-blue-200">
                <Icons.AlertCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-blue-700">42%</CardTitle>
            <p className="text-sm text-blue-600 mt-1">104 случая</p>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-green-700 font-medium">Низкая квалификация</CardDescription>
              <div className="rounded-full bg-green-500 p-2 ring-4 ring-green-200">
                <Icons.Users className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-green-700">28%</CardTitle>
            <p className="text-sm text-green-600 mt-1">69 случаев</p>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-orange-700 font-medium">Нарушение процедур</CardDescription>
              <div className="rounded-full bg-orange-500 p-2 ring-4 ring-orange-200">
                <Icons.FileText className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-orange-700">21%</CardTitle>
            <p className="text-sm text-orange-600 mt-1">52 случая</p>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-purple-700 font-medium">Прочие причины</CardDescription>
              <div className="rounded-full bg-purple-500 p-2 ring-4 ring-purple-200">
                <Icons.MoreHorizontal className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-purple-700">9%</CardTitle>
            <p className="text-sm text-purple-600 mt-1">22 случая</p>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Детальный анализ причин</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Причина</th>
                  <th className="text-left p-3 font-semibold">Количество</th>
                  <th className="text-left p-3 font-semibold">Доля</th>
                  <th className="text-left p-3 font-semibold">Сумма ущерба</th>
                  <th className="text-left p-3 font-semibold">Служб��</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    cause: "Отсутствие должного контроля со стороны руководства",
                    count: 104,
                    percent: 42,
                    amount: 3500000,
                    service: "Все службы",
                  },
                  {
                    cause: "Недостаточная квалификация материально ответственных лиц",
                    count: 69,
                    percent: 28,
                    amount: 2300000,
                    service: "Продовольственная",
                  },
                  {
                    cause: "Нарушение установленных процедур учёта и отчётности",
                    count: 52,
                    percent: 21,
                    amount: 1800000,
                    service: "Вещевая",
                  },
                  {
                    cause: "Несвоевременное проведение инвентаризаций",
                    count: 15,
                    percent: 6,
                    amount: 600000,
                    service: "Все службы",
                  },
                  { cause: "Прочие причины", count: 7, percent: 3, amount: 200000, service: "Разные" },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-3">{item.cause}</td>
                    <td className="p-3 font-semibold">{item.count}</td>
                    <td className="p-3">
                      <span className="font-semibold text-blue-600">{item.percent}%</span>
                    </td>
                    <td className="p-3 font-mono">₽ {(item.amount / 1000000).toFixed(2)}М</td>
                    <td className="p-3 text-muted-foreground">{item.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Рекомендации по устранению причин</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Icons.CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Усилить контроль со стороны руководства за деятельностью материально ответственных лиц</span>
            </li>
            <li className="flex items-start gap-3">
              <Icons.CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Организовать регулярное обучение и повышение квалификации персонала служб довольствия</span>
            </li>
            <li className="flex items-start gap-3">
              <Icons.CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <span>Внедрить автоматизированные системы учёта для минимизации человеческого фактора</span>
            </li>
            <li className="flex items-start gap-3">
              <Icons.CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Проводить внеплановые инвентаризации для своевременного выявления нарушений</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function MeasuresSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-emerald-700 font-medium">Дисциплинарные</CardDescription>
              <div className="rounded-full bg-emerald-500 p-2 ring-4 ring-emerald-200">
                <Icons.AlertCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-emerald-700">156</CardTitle>
            <p className="text-sm text-emerald-600 mt-1">63% от всех мер</p>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-indigo-700 font-medium">Материальные</CardDescription>
              <div className="rounded-full bg-indigo-500 p-2 ring-4 ring-indigo-200">
                <Icons.Dollar className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-indigo-700">68</CardTitle>
            <p className="text-sm text-indigo-600 mt-1">28% от всех мер</p>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-rose-700 font-medium">Организационные</CardDescription>
              <div className="rounded-full bg-rose-500 p-2 ring-4 ring-rose-200">
                <Icons.Settings className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-rose-700">18</CardTitle>
            <p className="text-sm text-rose-600 mt-1">7% от всех мер</p>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-amber-700 font-medium">Обучающие</CardDescription>
              <div className="rounded-full bg-amber-500 p-2 ring-4 ring-amber-200">
                <Icons.BookOpen className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl text-amber-700">5</CardTitle>
            <p className="text-sm text-amber-600 mt-1">2% от всех мер</p>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Принятые меры по результатам ревизий</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Тип меры</th>
                  <th className="text-left p-3 font-semibold">Количество</th>
                  <th className="text-left p-3 font-semibold">Статус</th>
                  <th className="text-left p-3 font-semibold">Эффективность</th>
                  <th className="text-left p-3 font-semibold">Примечание</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    type: "Дисциплинарные взыскания",
                    count: 156,
                    status: "Исполнено",
                    effectiveness: "Высокая",
                    note: "Замечания, выговоры",
                  },
                  {
                    type: "Материальная ответственность",
                    count: 68,
                    status: "В процессе",
                    effectiveness: "Средняя",
                    note: "Возмещение ущерба",
                  },
                  {
                    type: "Организационные изменения",
                    count: 18,
                    status: "Исполнено",
                    effectiveness: "Высокая",
                    note: "Изменение процедур",
                  },
                  {
                    type: "Обучение персонала",
                    count: 5,
                    status: "Запланировано",
                    effectiveness: "Ожидается",
                    note: "Курсы повышения квалификации",
                  },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-semibold">{item.type}</td>
                    <td className="p-3">{item.count}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.status === "Исполнено"
                            ? "bg-green-100 text-green-700"
                            : item.status === "В процессе"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3">{item.effectiveness}</td>
                    <td className="p-3 text-muted-foreground">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Результаты принятых мер</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Icons.CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Снижение количества повторных нарушений на 34% по сравнению с предыдущим периодом</span>
            </li>
            <li className="flex items-start gap-3">
              <Icons.CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Возмещено 71% от общей суммы выявленного ущерба</span>
            </li>
            <li className="flex items-start gap-3">
              <Icons.CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Проведено обучение для 245 материально ответственных лиц</span>
            </li>
            <li className="flex items-start gap-3">
              <Icons.AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span>Требуется дополнительный контроль за исполнением 23 решений о материальной ответственности</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

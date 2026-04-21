"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    getUnifiedSummary,
    getPlanningStats,
    getAuditStats,
    getViolationStats,
    getKpiStats,
    getTopViolationUnits,
    MOCK_ANNUAL_PLANS,
    MOCK_AUDITS,
    MOCK_KPI_DATA,
} from "@/lib/data/unified-report-data"

export default function UnifiedReportPage() {
    const [selectedYear, setSelectedYear] = useState("2025")
    const [selectedQuarter, setSelectedQuarter] = useState("all")

    // Получаем сводные данные
    const summary = useMemo(() => getUnifiedSummary(), [])
    const topUnits = useMemo(() => getTopViolationUnits(), [])

    const formatNumber = (value: number) => value.toLocaleString()
    const formatCurrency = (value: number) => `${value.toLocaleString()} сум`

    return (
        <div className="space-y-6 p-6">
            {/* Заголовок */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Универсальный аналитический отчёт</h1>
                    <p className="text-muted-foreground">
                        Сводная аналитика по всем подмодулям системы АИС КРР
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Год" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Квартал" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Все периоды</SelectItem>
                            <SelectItem value="q1">I квартал</SelectItem>
                            <SelectItem value="q2">II квартал</SelectItem>
                            <SelectItem value="q3">III квартал</SelectItem>
                            <SelectItem value="q4">IV квартал</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Icons.Download className="mr-2 h-4 w-4" />
                        Экспорт
                    </Button>
                </div>
            </div>

            {/* Executive Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                {/* Планов КРР */}
                <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-900">Планов КРР</CardTitle>
                        <div className="rounded-full bg-blue-500 p-2 ring-4 ring-blue-200">
                            <Icons.File className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-700">{summary.planning.totalPlans}</div>
                        <p className="text-xs text-blue-600 mt-1">{summary.planning.approvedPlans} утверждено</p>
                    </CardContent>
                </Card>

                {/* Проверок */}
                <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-900">Проверок</CardTitle>
                        <div className="rounded-full bg-green-500 p-2 ring-4 ring-green-200">
                            <Icons.CheckCircle className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-700">{summary.audits.totalAudits}</div>
                        <p className="text-xs text-green-600 mt-1">{summary.audits.completedAudits} завершено</p>
                    </CardContent>
                </Card>

                {/* Нарушений */}
                <Card className="relative overflow-hidden border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-900">Нарушений</CardTitle>
                        <div className="rounded-full bg-orange-500 p-2 ring-4 ring-orange-200">
                            <Icons.Alert className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-700">{summary.violations.total.count}</div>
                        <p className="text-xs text-orange-600 mt-1">выявлено</p>
                    </CardContent>
                </Card>

                {/* Выявлено */}
                <Card className="relative overflow-hidden border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-900">Выявлено</CardTitle>
                        <div className="rounded-full bg-red-500 p-2 ring-4 ring-red-200">
                            <Icons.Dollar className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-700">{formatNumber(summary.violations.total.detected)}</div>
                        <p className="text-xs text-red-600 mt-1">сум</p>
                    </CardContent>
                </Card>

                {/* Возмещено */}
                <Card className="relative overflow-hidden border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-900">Возмещено</CardTitle>
                        <div className="rounded-full bg-emerald-500 p-2 ring-4 ring-emerald-200">
                            <Icons.TrendingUp className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700">{formatNumber(summary.violations.total.recovered)}</div>
                        <p className="text-xs text-emerald-600 mt-1">сум</p>
                    </CardContent>
                </Card>

                {/* Эффективность */}
                <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-900">Эффективность</CardTitle>
                        <div className="rounded-full bg-purple-500 p-2 ring-4 ring-purple-200">
                            <Icons.PieChart className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-700">{summary.violations.total.efficiency}%</div>
                        <p className="text-xs text-purple-600 mt-1">возмещения</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs для детализации */}
            <Tabs defaultValue="summary" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="summary">Сводка</TabsTrigger>
                    <TabsTrigger value="planning">Планирование</TabsTrigger>
                    <TabsTrigger value="audits">Результаты</TabsTrigger>
                    <TabsTrigger value="violations">Нарушения</TabsTrigger>
                    <TabsTrigger value="kpi">KPI</TabsTrigger>
                </TabsList>

                {/* Сводка */}
                <TabsContent value="summary" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Топ подразделений по нарушениям */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Icons.Building className="h-5 w-5" />
                                    Топ-5 подразделений по сумме нарушений
                                </CardTitle>
                                <CardDescription>Подразделения с наибольшей суммой выявленных нарушений</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>№</TableHead>
                                            <TableHead>Подразделение</TableHead>
                                            <TableHead className="text-right">Сумма</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {topUnits.map((item, index) => (
                                            <TableRow key={item.unit}>
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell>{item.unit}</TableCell>
                                                <TableCell className="text-right font-mono">{formatCurrency(item.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Распределение по типам */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Icons.Chart className="h-5 w-5" />
                                    Распределение нарушений по типам
                                </CardTitle>
                                <CardDescription>Структура выявленных нарушений</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span>Имущественные (недостачи)</span>
                                        </div>
                                        <div className="font-mono">{summary.violations.asset.count} шт. / {formatCurrency(summary.violations.asset.detected)}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                            <span>Переплаты</span>
                                        </div>
                                        <div className="font-mono">{summary.violations.financial.overpayments.count} шт. / {formatCurrency(summary.violations.financial.overpayments.detected)}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <span>Хищения</span>
                                        </div>
                                        <div className="font-mono">{summary.violations.financial.thefts.count} шт. / {formatCurrency(summary.violations.financial.thefts.detected)}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                            <span>Незаконные расходы</span>
                                        </div>
                                        <div className="font-mono">{summary.violations.financial.expenses.count} шт. / {formatCurrency(summary.violations.financial.expenses.detected)}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <span>Недоплаты</span>
                                        </div>
                                        <div className="font-mono">{summary.violations.financial.underpayments.count} шт. / {formatCurrency(summary.violations.financial.underpayments.detected)}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Планирование */}
                <TabsContent value="planning" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Всего планов</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.planning.totalPlans}</div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Объектов контроля</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.planning.totalObjects}</div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-orange-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Приказов</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.planning.totalOrders}</div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-purple-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Финансовых служб</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.planning.totalFS}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Годовые планы КРР</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Год</TableHead>
                                        <TableHead>Военный округ</TableHead>
                                        <TableHead className="text-center">Объектов</TableHead>
                                        <TableHead className="text-center">ФС</TableHead>
                                        <TableHead>Статус</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_ANNUAL_PLANS.map((plan) => (
                                        <TableRow key={plan.id}>
                                            <TableCell>{plan.year}</TableCell>
                                            <TableCell>{plan.district}</TableCell>
                                            <TableCell className="text-center">{plan.objects}</TableCell>
                                            <TableCell className="text-center">{plan.fsCount}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    plan.status === "Утверждён" ? "default" :
                                                        plan.status === "На рассмотрении" ? "secondary" : "outline"
                                                }>
                                                    {plan.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Результаты проверок */}
                <TabsContent value="audits" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Всего проверок</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.audits.totalAudits}</div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Завершено</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.audits.completedAudits}</div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-orange-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">В процессе</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.audits.inProgressAudits}</div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-red-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Нарушений выявлено</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.audits.totalViolations}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ревизии и проверки</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Тип</TableHead>
                                        <TableHead>Подразделение</TableHead>
                                        <TableHead>Период</TableHead>
                                        <TableHead className="text-center">Нарушений</TableHead>
                                        <TableHead className="text-right">Сумма</TableHead>
                                        <TableHead className="text-right">Возмещено</TableHead>
                                        <TableHead>Статус</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_AUDITS.map((audit) => (
                                        <TableRow key={audit.id}>
                                            <TableCell>{audit.type}</TableCell>
                                            <TableCell>{audit.unit}</TableCell>
                                            <TableCell>{audit.period}</TableCell>
                                            <TableCell className="text-center">{audit.violations}</TableCell>
                                            <TableCell className="text-right font-mono">{formatCurrency(audit.amount)}</TableCell>
                                            <TableCell className="text-right font-mono text-green-600">{formatCurrency(audit.recovered)}</TableCell>
                                            <TableCell>
                                                <Badge variant={audit.status === "Проверено" ? "default" : "secondary"}>
                                                    {audit.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Нарушения */}
                <TabsContent value="violations" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Имущественные */}
                        <Card className="border-t-4 border-t-blue-500">
                            <CardHeader>
                                <CardTitle className="text-blue-700">Имущественные нарушения</CardTitle>
                                <CardDescription>Недостачи материальных средств</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Количество:</span>
                                        <span className="font-bold">{summary.violations.asset.count}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Выявлено:</span>
                                        <span className="font-bold text-red-600">{formatCurrency(summary.violations.asset.detected)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Возмещено:</span>
                                        <span className="font-bold text-green-600">{formatCurrency(summary.violations.asset.recovered)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Остаток:</span>
                                        <span className="font-bold">{formatCurrency(summary.violations.asset.detected - summary.violations.asset.recovered)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Финансовые */}
                        <Card className="border-t-4 border-t-orange-500">
                            <CardHeader>
                                <CardTitle className="text-orange-700">Финансовые нарушения</CardTitle>
                                <CardDescription>Переплаты, хищения, незаконные расходы</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Переплат:</span>
                                        <span className="font-bold">{summary.violations.financial.overpayments.count} / {formatCurrency(summary.violations.financial.overpayments.detected)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Хищений:</span>
                                        <span className="font-bold">{summary.violations.financial.thefts.count} / {formatCurrency(summary.violations.financial.thefts.detected)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Незаконных расходов:</span>
                                        <span className="font-bold">{summary.violations.financial.expenses.count} / {formatCurrency(summary.violations.financial.expenses.detected)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Недоплат:</span>
                                        <span className="font-bold">{summary.violations.financial.underpayments.count} / {formatCurrency(summary.violations.financial.underpayments.detected)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Итого по нарушениям */}
                    <Card className="bg-gradient-to-r from-slate-50 to-slate-100">
                        <CardHeader>
                            <CardTitle>Итого по всем нарушениям</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">Всего нарушений</div>
                                    <div className="text-2xl font-bold">{summary.violations.total.count}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Выявлено</div>
                                    <div className="text-2xl font-bold text-red-600">{formatCurrency(summary.violations.total.detected)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Возмещено</div>
                                    <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.violations.total.recovered)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Эффективность</div>
                                    <div className="text-2xl font-bold text-purple-600">{summary.violations.total.efficiency}%</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* KPI */}
                <TabsContent value="kpi" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Средний KPI</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.kpi.averageKPI}%</div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Сотрудников</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.kpi.totalEmployees}</div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-purple-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Аттестация</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.kpi.attestation}%</div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-orange-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Загрузка</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.kpi.workload}%</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Рейтинг сотрудников</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>№</TableHead>
                                        <TableHead>ФИО</TableHead>
                                        <TableHead className="text-center">KPI</TableHead>
                                        <TableHead>Оценка</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_KPI_DATA.employees.map((emp, index) => (
                                        <TableRow key={emp.name}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{emp.name}</TableCell>
                                            <TableCell className="text-center font-bold">{emp.kpi}%</TableCell>
                                            <TableCell>
                                                <Badge variant={emp.rating === "Отлично" ? "default" : "secondary"}>
                                                    {emp.rating}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

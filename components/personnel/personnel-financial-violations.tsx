"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PersonnelFinancialViolationsProps {
  personnelId: number
  personnelName: string
}

export function PersonnelFinancialViolations({ personnelId, personnelName }: PersonnelFinancialViolationsProps) {
  const [activeTab, setActiveTab] = useState("shortages")

  // Mock data - в реальном приложении это будет фильтроваться по personnelId
  const shortages = [
    {
      id: 1,
      actNumber: "АКТ-2024-001",
      detectionDate: "2024-01-15",
      amountDetected: 125000,
      amountCompensated: 0,
      status: "Выявлено",
      description: "Недостача денежных средств в кассе",
    },
  ]

  const thefts = [
    {
      id: 1,
      actNumber: "AKT-2024-101",
      detectionDate: "2024-01-20",
      type: "Хищение",
      amountDetected: 450000,
      amountCompensated: 0,
      status: "Передано в следственные органы",
      description: "Хищение материальных ценностей",
    },
  ]

  const illegalExpenses = [
    {
      id: 1,
      identifiedAmount: 75000,
      reimbursedAmount: 30000,
      date: "2024-01-10",
      category: "Нецелевое использование",
      status: "Частично возмещено",
      description: "Расходы на ремонт личного транспорта",
    },
  ]

  const overpayments = [
    {
      id: 1,
      actNumber: "ПП-2024-001",
      detectionDate: "25.01.2024",
      paymentName: "Премия за выслугу лет",
      amountDetected: 45000,
      amountCompensated: 45000,
      status: "Возвращено",
      reason: "Ошибка в расчётах",
    },
  ]

  const underpayments = [
    {
      id: 1,
      actNumber: "НД-2024-001",
      detectionDate: "25.01.2024",
      paymentName: "Премия за выслугу лет",
      amountDetected: 45000,
      amountCompensated: 45000,
      status: "Возвращено",
      reason: "Ошибка в расчётах",
    },
  ]

  const totalViolations =
    shortages.length + thefts.length + illegalExpenses.length + overpayments.length + underpayments.length
  const totalAmount =
    shortages.reduce((sum, s) => sum + s.amountDetected, 0) +
    thefts.reduce((sum, t) => sum + t.amountDetected, 0) +
    illegalExpenses.reduce((sum, e) => sum + e.identifiedAmount, 0) +
    overpayments.reduce((sum, o) => sum + o.amountDetected, 0) +
    underpayments.reduce((sum, u) => sum + u.amountDetected, 0)

  const totalCompensated =
    shortages.reduce((sum, s) => sum + s.amountCompensated, 0) +
    thefts.reduce((sum, t) => sum + t.amountCompensated, 0) +
    illegalExpenses.reduce((sum, e) => sum + e.reimbursedAmount, 0) +
    overpayments.reduce((sum, o) => sum + o.amountCompensated, 0) +
    underpayments.reduce((sum, u) => sum + u.amountCompensated, 0)

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; className: string }> = {
      Выявлено: { variant: "destructive", className: "bg-red-500" },
      "В работе": { variant: "default", className: "bg-yellow-500" },
      Взыскано: { variant: "default", className: "bg-green-500" },
      Возвращено: { variant: "default", className: "bg-green-500" },
      "Частично возмещено": { variant: "default", className: "bg-blue-500" },
      Расследуется: { variant: "default", className: "bg-orange-500" },
      "Передано в следственные органы": { variant: "destructive", className: "bg-purple-500" },
    }

    const config = statusConfig[status] || { variant: "default", className: "" }
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-red-900">Всего нарушений</CardTitle>
            <div className="rounded-full bg-red-200 p-2">
              <Icons.AlertTriangle className="h-5 w-5 text-red-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900">{totalViolations}</div>
            <p className="text-xs text-red-700 font-medium">Зарегистрировано</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-orange-900">Общая сумма</CardTitle>
            <div className="rounded-full bg-orange-200 p-2">
              <Icons.DollarSign className="h-5 w-5 text-orange-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{totalAmount.toLocaleString()} uzs</div>
            <p className="text-xs text-orange-700 font-medium">Выявлено</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-green-900">Возмещено</CardTitle>
            <div className="rounded-full bg-green-200 p-2">
              <Icons.CheckCircle className="h-5 w-5 text-green-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{totalCompensated.toLocaleString()} uzs</div>
            <p className="text-xs text-green-700 font-medium">
              {totalAmount > 0 ? Math.round((totalCompensated / totalAmount) * 100) : 0}% от общей суммы
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Violations Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="shortages">Недостачи</TabsTrigger>
              <TabsTrigger value="thefts">Растраты</TabsTrigger>
              <TabsTrigger value="illegal">Незаконные</TabsTrigger>
              <TabsTrigger value="overpay">Переплаты</TabsTrigger>
              <TabsTrigger value="underpay">Недоплаты</TabsTrigger>
            </TabsList>

            <TabsContent value="shortages" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Недостачи денежных средств</h3>
                  <Badge variant="outline">{shortages.length} записей</Badge>
                </div>
                {shortages.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Номер акта</TableHead>
                        <TableHead>Дата выявления</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead>Возмещено</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Описание</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shortages.map((shortage) => (
                        <TableRow key={shortage.id}>
                          <TableCell className="font-medium">{shortage.actNumber}</TableCell>
                          <TableCell>{shortage.detectionDate}</TableCell>
                          <TableCell>{shortage.amountDetected.toLocaleString()} uzs</TableCell>
                          <TableCell>{shortage.amountCompensated.toLocaleString()} uzs</TableCell>
                          <TableCell>{getStatusBadge(shortage.status)}</TableCell>
                          <TableCell className="max-w-xs truncate">{shortage.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">Нарушений не найдено</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="thefts" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Растраты и хищения</h3>
                  <Badge variant="outline">{thefts.length} записей</Badge>
                </div>
                {thefts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Номер акта</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Тип</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Описание</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {thefts.map((theft) => (
                        <TableRow key={theft.id}>
                          <TableCell className="font-medium">{theft.actNumber}</TableCell>
                          <TableCell>{theft.detectionDate}</TableCell>
                          <TableCell>{theft.type}</TableCell>
                          <TableCell>{theft.amountDetected.toLocaleString()} uzs</TableCell>
                          <TableCell>{getStatusBadge(theft.status)}</TableCell>
                          <TableCell className="max-w-xs truncate">{theft.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">Нарушений не найдено</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="illegal" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Незаконные расходы</h3>
                  <Badge variant="outline">{illegalExpenses.length} записей</Badge>
                </div>
                {illegalExpenses.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Дата</TableHead>
                        <TableHead>Категория</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead>Возмещено</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Описание</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {illegalExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{expense.date}</TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell>{expense.identifiedAmount.toLocaleString()} uzs</TableCell>
                          <TableCell>{expense.reimbursedAmount.toLocaleString()} uzs</TableCell>
                          <TableCell>{getStatusBadge(expense.status)}</TableCell>
                          <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">Нарушений не найдено</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="overpay" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Переплаты</h3>
                  <Badge variant="outline">{overpayments.length} записей</Badge>
                </div>
                {overpayments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Номер акта</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Наименование</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Причина</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overpayments.map((overpay) => (
                        <TableRow key={overpay.id}>
                          <TableCell className="font-medium">{overpay.actNumber}</TableCell>
                          <TableCell>{overpay.detectionDate}</TableCell>
                          <TableCell>{overpay.paymentName}</TableCell>
                          <TableCell>{overpay.amountDetected.toLocaleString()} uzs</TableCell>
                          <TableCell>{getStatusBadge(overpay.status)}</TableCell>
                          <TableCell>{overpay.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">Нарушений не найдено</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="underpay" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Недоплаты</h3>
                  <Badge variant="outline">{underpayments.length} записей</Badge>
                </div>
                {underpayments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Номер акта</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Наименование</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Причина</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {underpayments.map((underpay) => (
                        <TableRow key={underpay.id}>
                          <TableCell className="font-medium">{underpay.actNumber}</TableCell>
                          <TableCell>{underpay.detectionDate}</TableCell>
                          <TableCell>{underpay.paymentName}</TableCell>
                          <TableCell>{underpay.amountDetected.toLocaleString()} uzs</TableCell>
                          <TableCell>{getStatusBadge(underpay.status)}</TableCell>
                          <TableCell>{underpay.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">Нарушений не найдено</div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" asChild>
              <a href="/violations/financial">
                Перейти к полному списку
                <Icons.ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

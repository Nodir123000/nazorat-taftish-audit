"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icons } from "@/components/icons"

export default function DeductionsPage() {
  const deductions = [
    { id: 1, accId: 1, sum: 15000, date: "2024-01-30", type: "Удержание", balance: 110000 },
    { id: 2, accId: 1, sum: 15000, date: "2024-02-28", type: "Удержание", balance: 95000 },
    { id: 3, accId: 2, sum: 50000, date: "2024-03-15", type: "Списание", balance: 0 },
  ]

  const totalDeducted = deductions.reduce((sum, d) => sum + d.sum, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Удержания и списания</h2>
          <p className="text-muted-foreground">Учёт удержаний и списаний (Таблица: deductions)</p>
        </div>
        <Button>
          <Icons.Plus className="mr-2 h-4 w-4" />
          Добавить операцию
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Всего операций</CardTitle>
            <div className="rounded-full bg-purple-500 p-2 ring-4 ring-purple-200">
              <Icons.FileText className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">{deductions.length}</div>
            <p className="text-xs text-purple-600 mt-1">Проведено</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900">Всего удержано</CardTitle>
            <div className="rounded-full bg-emerald-500 p-2 ring-4 ring-emerald-200">
              <Icons.DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700">{totalDeducted.toLocaleString()} ₽</div>
            <p className="text-xs text-emerald-600 mt-1">Взыскано</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-sky-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sky-900">Удержаний</CardTitle>
            <div className="rounded-full bg-sky-500 p-2 ring-4 ring-sky-200">
              <Icons.TrendingDown className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sky-700">
              {deductions.filter((d) => d.type === "Удержание").length}
            </div>
            <p className="text-xs text-sky-600 mt-1">Операций</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-lg transition-all hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-900">Списаний</CardTitle>
            <div className="rounded-full bg-amber-500 p-2 ring-4 ring-amber-200">
              <Icons.X className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">
              {deductions.filter((d) => d.type === "Списание").length}
            </div>
            <p className="text-xs text-amber-600 mt-1">Операций</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>Поиск и фильтрация операций</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input placeholder="ID счёта..." type="number" />
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="">Все типы</option>
              <option value="deduction">Удержание</option>
              <option value="writeoff">Списание</option>
            </select>
            <Input placeholder="Сумма от..." type="number" />
            <Input placeholder="Дата от..." type="date" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Журнал удержаний и списаний</CardTitle>
          <CardDescription>Всего записей: {deductions.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>ID счёта</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Тип операции</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Остаток после</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deductions.map((deduction) => (
                <TableRow key={deduction.id}>
                  <TableCell className="font-mono">{deduction.id}</TableCell>
                  <TableCell className="font-mono">{deduction.accId}</TableCell>
                  <TableCell>{deduction.date}</TableCell>
                  <TableCell>
                    <Badge variant={deduction.type === "Списание" ? "default" : "secondary"}>{deduction.type}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">{deduction.sum.toLocaleString()} ₽</TableCell>
                  <TableCell className="font-semibold">{deduction.balance.toLocaleString()} ₽</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Icons.Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icons.Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

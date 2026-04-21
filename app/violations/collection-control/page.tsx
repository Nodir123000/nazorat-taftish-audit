"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icons } from "@/components/icons"

export default function CollectionControlPage() {
  const controls = [
    { id: 1, accId: 1, balance: 85000, overdue: 0, lastPayment: "2024-03-15", status: "В норме" },
    { id: 2, accId: 3, balance: 45000, overdue: 15, lastPayment: "2024-02-20", status: "Просрочка" },
    { id: 3, accId: 5, balance: 120000, overdue: 45, lastPayment: "2024-01-10", status: "Критично" },
  ]

  const totalBalance = controls.reduce((sum, c) => sum + c.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Контроль взысканий</h2>
          <p className="text-muted-foreground">Контроль взысканий (Таблица: collection_control)</p>
        </div>
        <Button>
          <Icons.Plus className="mr-2 h-4 w-4" />
          Добавить контроль
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего счетов</CardTitle>
            <Icons.FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{controls.length}</div>
            <p className="text-xs text-muted-foreground">На контроле</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общий остаток</CardTitle>
            <Icons.DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalBalance.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground">К взысканию</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В норме</CardTitle>
            <Icons.CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {controls.filter((c) => c.status === "В норме").length}
            </div>
            <p className="text-xs text-muted-foreground">Без просрочек</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Критично</CardTitle>
            <Icons.AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {controls.filter((c) => c.status === "Критично").length}
            </div>
            <p className="text-xs text-muted-foreground">Более 30 дней</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>Поиск и фильтрация контроля взысканий</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input placeholder="ID счёта..." type="number" />
            <Input placeholder="Остаток от..." type="number" />
            <Input placeholder="Просрочка от (дней)..." type="number" />
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="">Все статусы</option>
              <option value="normal">В норме</option>
              <option value="overdue">Просрочка</option>
              <option value="critical">Критично</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Реестр контроля взысканий</CardTitle>
          <CardDescription>Всего записей: {controls.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>ID счёта</TableHead>
                <TableHead>Остаток</TableHead>
                <TableHead>Просрочка (дней)</TableHead>
                <TableHead>Последний платёж</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controls.map((control) => (
                <TableRow key={control.id}>
                  <TableCell className="font-mono">{control.id}</TableCell>
                  <TableCell className="font-mono">{control.accId}</TableCell>
                  <TableCell className="font-semibold">{control.balance.toLocaleString()} ₽</TableCell>
                  <TableCell>
                    <span
                      className={
                        control.overdue > 30
                          ? "text-destructive font-semibold"
                          : control.overdue > 0
                            ? "text-yellow-600 font-semibold"
                            : ""
                      }
                    >
                      {control.overdue} дн.
                    </span>
                  </TableCell>
                  <TableCell>{control.lastPayment}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        control.status === "В норме"
                          ? "default"
                          : control.status === "Критично"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {control.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Icons.Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icons.Bell className="h-4 w-4" />
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

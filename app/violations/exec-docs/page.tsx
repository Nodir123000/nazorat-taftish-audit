"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icons } from "@/components/icons"

export default function ExecDocsPage() {
  const docs = [
    {
      id: 1,
      accId: 1,
      type: "Исполнительный лист",
      number: "ИЛ-2024-001",
      date: "2024-01-25",
      amount: 125000,
      status: "Исполняется",
    },
    {
      id: 2,
      accId: 2,
      type: "Судебный приказ",
      number: "СП-2024-005",
      date: "2024-02-15",
      amount: 280000,
      status: "Исполнено",
    },
    {
      id: 3,
      accId: 3,
      type: "Исполнительный лист",
      number: "ИЛ-2024-012",
      date: "2024-03-10",
      amount: 45000,
      status: "Получен",
    },
  ]

  const totalAmount = docs.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Исполнительные документы</h2>
          <p className="text-muted-foreground">Учёт исполнительных документов (Таблица: exec_docs)</p>
        </div>
        <Button>
          <Icons.Plus className="mr-2 h-4 w-4" />
          Добавить документ
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего документов</CardTitle>
            <Icons.FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{docs.length}</div>
            <p className="text-xs text-muted-foreground">Получено</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общая сумма</CardTitle>
            <Icons.DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalAmount.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground">К взысканию</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Исполнено</CardTitle>
            <Icons.CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {docs.filter((d) => d.status === "Исполнено").length}
            </div>
            <p className="text-xs text-muted-foreground">Документов</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
            <Icons.Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {docs.filter((d) => d.status !== "Исполнено").length}
            </div>
            <p className="text-xs text-muted-foreground">Документов</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>Поиск и фильтрация исполнительных документов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input placeholder="Номер документа..." />
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="">Все типы</option>
              <option value="writ">Исполнительный лист</option>
              <option value="order">Судебный приказ</option>
            </select>
            <Input placeholder="Сумма от..." type="number" />
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="">Все статусы</option>
              <option value="received">Получен</option>
              <option value="executing">Исполняется</option>
              <option value="executed">Исполнено</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Реестр исполнительных документов</CardTitle>
          <CardDescription>Всего записей: {docs.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>ID счёта</TableHead>
                <TableHead>Тип документа</TableHead>
                <TableHead>Номер</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-mono">{doc.id}</TableCell>
                  <TableCell className="font-mono">{doc.accId}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{doc.type}</Badge>
                  </TableCell>
                  <TableCell className="font-mono">{doc.number}</TableCell>
                  <TableCell>{doc.date}</TableCell>
                  <TableCell className="font-semibold">{doc.amount.toLocaleString()} ₽</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        doc.status === "Исполнено" ? "default" : doc.status === "Исполняется" ? "secondary" : "outline"
                      }
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Icons.Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icons.Download className="h-4 w-4" />
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

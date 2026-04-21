"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icons } from "@/components/icons"

export default function CertificatesPage() {
  const certificates = [
    {
      id: 1,
      certNum: "ИС-2024-001",
      issuer: "Подполковник Иванов И.И.",
      date: "2024-01-20",
      amount: 185000,
      status: "Действует",
    },
    {
      id: 2,
      certNum: "ИС-2024-002",
      issuer: "Майор Петров П.П.",
      date: "2024-02-15",
      amount: 95000,
      status: "Действует",
    },
    {
      id: 3,
      certNum: "ИС-2024-003",
      issuer: "Капитан Сидоров С.С.",
      date: "2024-03-10",
      amount: 420000,
      status: "Исполнено",
    },
  ]

  const totalAmount = certificates.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Инспекторские свидетельства</h2>
          <p className="text-muted-foreground">Учёт инспекторских свидетельств (Таблица: asset_inspect_cert)</p>
        </div>
        <Button>
          <Icons.Plus className="mr-2 h-4 w-4" />
          Выдать свидетельство
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего свидетельств</CardTitle>
            <Icons.FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
            <p className="text-xs text-muted-foreground">Выдано</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общая сумма</CardTitle>
            <Icons.DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalAmount.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground">По свидетельствам</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Действует</CardTitle>
            <Icons.CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {certificates.filter((c) => c.status === "Действует").length}
            </div>
            <p className="text-xs text-muted-foreground">Свидетельств</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Исполнено</CardTitle>
            <Icons.Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {certificates.filter((c) => c.status === "Исполнено").length}
            </div>
            <p className="text-xs text-muted-foreground">Свидетельств</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>Поиск и фильтрация свидетельств</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input placeholder="Номер свидетельства..." />
            <Input placeholder="Выдал..." />
            <Input placeholder="Сумма от..." type="number" />
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="">Все статусы</option>
              <option value="active">Действует</option>
              <option value="executed">Исполнено</option>
              <option value="cancelled">Аннулировано</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Реестр инспекторских свидетельств</CardTitle>
          <CardDescription>Всего записей: {certificates.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Номер свидетельства</TableHead>
                <TableHead>Дата выдачи</TableHead>
                <TableHead>Выдал</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-mono">{cert.id}</TableCell>
                  <TableCell className="font-mono font-semibold">{cert.certNum}</TableCell>
                  <TableCell>{cert.date}</TableCell>
                  <TableCell>{cert.issuer}</TableCell>
                  <TableCell className="font-semibold">{cert.amount.toLocaleString()} ₽</TableCell>
                  <TableCell>
                    <Badge variant={cert.status === "Исполнено" ? "default" : "secondary"}>{cert.status}</Badge>
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

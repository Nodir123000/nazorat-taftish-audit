"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

export default function UnexpectedChecksPage() {
  const checks = [
    { id: 1, unit: "Воинская часть 12345", date: "2025-01-20", reason: "Указание командования", status: "Завершена" },
    { id: 2, unit: "Воинская часть 67890", date: "2025-02-10", reason: "Анонимное обращение", status: "В процессе" },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Внезапные проверки</h2>
          <p className="text-muted-foreground">Учёт внезапных проверок воинских частей</p>
        </div>
        <Button>
          <Icons.Plus className="mr-2 h-4 w-4" />
          Назначить внезапную проверку
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего проверок</CardTitle>
            <Icons.Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checks.length}</div>
            <p className="text-xs text-muted-foreground">Внезапных</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Завершено</CardTitle>
            <Icons.CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {checks.filter((c) => c.status === "Завершена").length}
            </div>
            <p className="text-xs text-muted-foreground">Проверок</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В процессе</CardTitle>
            <Icons.Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {checks.filter((c) => c.status === "В процессе").length}
            </div>
            <p className="text-xs text-muted-foreground">Проверок</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Воинских частей</CardTitle>
            <Icons.Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(checks.map((c) => c.unit)).size}</div>
            <p className="text-xs text-muted-foreground">Проверено</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>Поиск и фильтрация внезапных проверок</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input placeholder="Поиск по части..." />
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="">Все статусы</option>
              <option value="completed">Завершена</option>
              <option value="inprogress">В процессе</option>
            </select>
            <Input type="date" placeholder="Дата от..." />
            <Button variant="outline">Сбросить</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Реестр внезапных проверок</CardTitle>
          <CardDescription>
            Список внезапных проверок без предварительного уведомления ({checks.length} записей)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Воинская часть</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Основание</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checks.map((check) => (
                <TableRow key={check.id}>
                  <TableCell className="font-medium">{check.id}</TableCell>
                  <TableCell>{check.unit}</TableCell>
                  <TableCell>{check.date}</TableCell>
                  <TableCell>{check.reason}</TableCell>
                  <TableCell>
                    <Badge variant={check.status === "Завершена" ? "default" : "secondary"}>{check.status}</Badge>
                  </TableCell>
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

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

export default function UnplannedAuditsPage() {
  const unplanned = [
    {
      id: 1,
      type: "Внеплановая ревизия",
      reason: "Жалоба военнослужащего",
      date: "2025-01-15",
      unit: "Воинская часть 12345",
      status: "Назначена",
    },
    {
      id: 2,
      type: "Внезапная проверка",
      reason: "Указание вышестоящего командования",
      date: "2025-02-03",
      unit: "Воинская часть 67890",
      status: "Проводится",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Внеплановые ревизии</h2>
          <p className="text-muted-foreground">Учёт внеплановых и внезапных проверок</p>
        </div>
        <Button>
          <Icons.Plus className="mr-2 h-4 w-4" />
          Назначить внеплановую ревизию
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего ревизий</CardTitle>
            <Icons.AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unplanned.length}</div>
            <p className="text-xs text-muted-foreground">Внеплановых</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Назначено</CardTitle>
            <Icons.Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {unplanned.filter((u) => u.status === "Назначена").length}
            </div>
            <p className="text-xs text-muted-foreground">Ревизий</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Проводится</CardTitle>
            <Icons.Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {unplanned.filter((u) => u.status === "Проводится").length}
            </div>
            <p className="text-xs text-muted-foreground">Ревизий</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Воинских частей</CardTitle>
            <Icons.Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(unplanned.map((u) => u.unit)).size}</div>
            <p className="text-xs text-muted-foreground">Охвачено</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>Поиск и фильтрация внеплановых ревизий</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input placeholder="Поиск по части..." />
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="">Все типы</option>
              <option value="unplanned">Внеплановая ревизия</option>
              <option value="unexpected">Внезапная проверка</option>
            </select>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="">Все статусы</option>
              <option value="assigned">Назначена</option>
              <option value="inprogress">Проводится</option>
            </select>
            <Button variant="outline">Сбросить</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Реестр внеплановых ревизий</CardTitle>
          <CardDescription>Список внеплановых и внезапных проверок ({unplanned.length} записей)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Основание</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Воинская часть</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unplanned.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Проводится" ? "default" : "secondary"}>{item.status}</Badge>
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

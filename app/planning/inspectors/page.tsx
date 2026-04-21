"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

export default function InspectorsPage() {
  const assignments = [
    {
      id: 1,
      plan: "План КРР 2025",
      inspector: "Майор Петров А.В.",
      role: "Руководитель",
      unit: "Воинская часть 12345",
    },
    {
      id: 2,
      plan: "План КРР 2025",
      inspector: "Капитан Иванов С.С.",
      role: "Член комиссии",
      unit: "Воинская часть 12345",
    },
    {
      id: 3,
      plan: "План КРР 2025",
      inspector: "Подполковник Сидоров И.И.",
      role: "Руководитель",
      unit: "Воинская часть 67890",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Распределение инспекторов</h2>
          <p className="text-muted-foreground">Назначение ответственных инспекторов на проверки</p>
        </div>
        <Button>
          <Icons.Plus className="mr-2 h-4 w-4" />
          Назначить инспектора
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего назначений</CardTitle>
            <Icons.Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
            <p className="text-xs text-muted-foreground">Инспекторов</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Руководителей</CardTitle>
            <Icons.User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {assignments.filter((a) => a.role === "Руководитель").length}
            </div>
            <p className="text-xs text-muted-foreground">Назначено</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Членов комиссии</CardTitle>
            <Icons.Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assignments.filter((a) => a.role === "Член комиссии").length}
            </div>
            <p className="text-xs text-muted-foreground">Назначено</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Воинских частей</CardTitle>
            <Icons.Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(assignments.map((a) => a.unit)).size}</div>
            <p className="text-xs text-muted-foreground">Охвачено</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>Поиск и фильтрация назначений инспекторов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input placeholder="Поиск по ФИО..." />
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="">Все роли</option>
              <option value="head">Руководитель</option>
              <option value="member">Член комиссии</option>
            </select>
            <Input placeholder="Поиск по части..." />
            <Button variant="outline">Сбросить</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Реестр назначений инспекторов</CardTitle>
          <CardDescription>Список назначений инспекторов на проверки ({assignments.length} записей)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>План</TableHead>
                <TableHead>Инспектор</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Воинская часть</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.id}</TableCell>
                  <TableCell>{assignment.plan}</TableCell>
                  <TableCell>{assignment.inspector}</TableCell>
                  <TableCell>
                    <Badge variant={assignment.role === "Руководитель" ? "default" : "secondary"}>
                      {assignment.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{assignment.unit}</TableCell>
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

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

export default function CommissionPage() {
  const commissions = [
    {
      id: 1,
      order: "Приказ № 15",
      inspector: "Майор Петров А.В.",
      position: "Председатель комиссии",
      unit: "Воинская часть 12345",
    },
    {
      id: 2,
      order: "Приказ № 15",
      inspector: "Капитан Иванов С.С.",
      position: "Член комиссии",
      unit: "Воинская часть 12345",
    },
    {
      id: 3,
      order: "Приказ № 15",
      inspector: "Лейтенант Смирнов П.П.",
      position: "Член комиссии",
      unit: "Воинская часть 12345",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Состав комиссии</h2>
          <p className="text-muted-foreground">Формирование состава ревизионных комиссий</p>
        </div>
        <Button>
          <Icons.Plus className="mr-2 h-4 w-4" />
          Добавить члена комиссии
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего членов</CardTitle>
            <Icons.Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commissions.length}</div>
            <p className="text-xs text-muted-foreground">В комиссиях</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Председателей</CardTitle>
            <Icons.User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {commissions.filter((c) => c.position === "Председатель комиссии").length}
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
              {commissions.filter((c) => c.position === "Член комиссии").length}
            </div>
            <p className="text-xs text-muted-foreground">Назначено</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Приказов</CardTitle>
            <Icons.FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(commissions.map((c) => c.order)).size}</div>
            <p className="text-xs text-muted-foreground">Оформлено</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>Поиск и фильтрация состава комиссий</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input placeholder="Поиск по ФИО..." />
            <Input placeholder="Номер приказа..." />
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="">Все должности</option>
              <option value="chairman">Председатель комиссии</option>
              <option value="member">Член комиссии</option>
            </select>
            <Button variant="outline">Сбросить</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Реестр состава ревизионных комиссий</CardTitle>
          <CardDescription>Список членов комиссий по приказам ({commissions.length} записей)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Приказ</TableHead>
                <TableHead>Инспектор</TableHead>
                <TableHead>Должность в комиссии</TableHead>
                <TableHead>Воинская часть</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.map((comm) => (
                <TableRow key={comm.id}>
                  <TableCell className="font-medium">{comm.id}</TableCell>
                  <TableCell>{comm.order}</TableCell>
                  <TableCell>{comm.inspector}</TableCell>
                  <TableCell>
                    <Badge variant={comm.position === "Председатель комиссии" ? "default" : "secondary"}>
                      {comm.position}
                    </Badge>
                  </TableCell>
                  <TableCell>{comm.unit}</TableCell>
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

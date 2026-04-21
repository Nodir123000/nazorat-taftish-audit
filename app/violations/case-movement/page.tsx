"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icons } from "@/components/icons"

export default function CaseMovementPage() {
  const movements = [
    { id: 1, caseNum: "Д-2024-001", action: "Открыто дело", date: "2024-01-15", responsible: "Майор Иванов И.И." },
    {
      id: 2,
      caseNum: "Д-2024-001",
      action: "Направлено в следствие",
      date: "2024-02-10",
      responsible: "Подполковник Петров П.П.",
    },
    {
      id: 3,
      caseNum: "Д-2024-003",
      action: "Получено заключение",
      date: "2024-03-05",
      responsible: "Капитан Сидоров С.С.",
    },
  ]

  const uniqueCases = new Set(movements.map((m) => m.caseNum)).size

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Движение дел</h2>
          <p className="text-muted-foreground">Учёт движения дел (Таблица: asset_case_movement)</p>
        </div>
        <Button>
          <Icons.Plus className="mr-2 h-4 w-4" />
          Добавить запись
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего записей</CardTitle>
            <Icons.FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movements.length}</div>
            <p className="text-xs text-muted-foreground">Операций</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Дел в работе</CardTitle>
            <Icons.Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{uniqueCases}</div>
            <p className="text-xs text-muted-foreground">Уникальных дел</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Последняя операция</CardTitle>
            <Icons.Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movements[movements.length - 1]?.date.split("-")[2]}</div>
            <p className="text-xs text-muted-foreground">День</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ответственных</CardTitle>
            <Icons.Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(movements.map((m) => m.responsible)).size}</div>
            <p className="text-xs text-muted-foreground">Инспекторов</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>Поиск и фильтрация движения дел</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input placeholder="Номер дела..." />
            <Input placeholder="Действие..." />
            <Input placeholder="Ответственный..." />
            <Button variant="outline">Сбросить</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Журнал движения дел</CardTitle>
          <CardDescription>Всего записей: {movements.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Номер дела</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Действие</TableHead>
                <TableHead>Ответственный</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="font-mono">{movement.id}</TableCell>
                  <TableCell className="font-mono">{movement.caseNum}</TableCell>
                  <TableCell>{movement.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{movement.action}</Badge>
                  </TableCell>
                  <TableCell>{movement.responsible}</TableCell>
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

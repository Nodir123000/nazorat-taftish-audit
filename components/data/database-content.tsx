"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

export function DataDatabaseContent() {
  const [searchQuery, setSearchQuery] = useState("")

  const tables = [
    {
      name: "users",
      records: 156,
      size: "2.4 МБ",
      lastModified: "2024-10-19 14:30",
      status: "active",
    },
    {
      name: "audit_plans",
      records: 2847,
      size: "15.8 МБ",
      lastModified: "2024-10-19 13:45",
      status: "active",
    },
    {
      name: "audit_results",
      records: 5234,
      size: "28.3 МБ",
      lastModified: "2024-10-19 12:20",
      status: "active",
    },
    {
      name: "violations",
      records: 3456,
      size: "19.2 МБ",
      lastModified: "2024-10-18 16:15",
      status: "active",
    },
    {
      name: "decisions",
      records: 1234,
      size: "8.7 МБ",
      lastModified: "2024-10-18 10:00",
      status: "active",
    },
    {
      name: "military_units",
      records: 156,
      size: "1.2 МБ",
      lastModified: "2024-10-17 09:30",
      status: "active",
    },
  ]

  const filteredTables = tables.filter((table) => table.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Справочная база</h1>
        <p className="text-muted-foreground">Управление таблицами и данными системы</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Таблиц</CardTitle>
            <Icons.Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tables.length}</div>
            <p className="text-xs text-muted-foreground">Всего таблиц</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Записей</CardTitle>
            <Icons.Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tables.reduce((sum, t) => sum + t.records, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Всего записей</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Размер</CardTitle>
            <Icons.HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75.6 МБ</div>
            <p className="text-xs text-muted-foreground">Объём данных</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Статус</CardTitle>
            <Icons.Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">OK</div>
            <p className="text-xs text-muted-foreground">Система в норме</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Таблицы базы данных</CardTitle>
              <CardDescription>Список всех таблиц в системе</CardDescription>
            </div>
            <Button>
              <Icons.Plus className="mr-2 h-4 w-4" />
              Добавить таблицу
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Поиск по названию таблицы..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название таблицы</TableHead>
                <TableHead>Записей</TableHead>
                <TableHead>Размер</TableHead>
                <TableHead>Последнее изменение</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTables.map((table) => (
                <TableRow key={table.name}>
                  <TableCell className="font-mono font-semibold">{table.name}</TableCell>
                  <TableCell>{table.records.toLocaleString()}</TableCell>
                  <TableCell>{table.size}</TableCell>
                  <TableCell className="text-muted-foreground">{table.lastModified}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {table.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Icons.Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Icons.Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
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

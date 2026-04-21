"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DataImportContent() {
  const [isOpen, setIsOpen] = useState(false)

  const imports = [
    {
      id: 1,
      name: "Импорт пользователей",
      source: "Active Directory",
      date: "2024-10-19 10:30",
      records: 156,
      status: "completed",
    },
    {
      id: 2,
      name: "Импорт воинских частей",
      source: "МО РУз",
      date: "2024-10-18 15:45",
      records: 89,
      status: "completed",
    },
    {
      id: 3,
      name: "Импорт должностей",
      source: "Справочник МО",
      date: "2024-10-17 09:20",
      records: 234,
      status: "completed",
    },
    {
      id: 4,
      name: "Импорт видов имущества",
      source: "Справочник МО",
      date: "2024-10-16 14:00",
      records: 45,
      status: "completed",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Импорт данных</h1>
        <p className="text-muted-foreground">Загрузка данных из внешних источников в систему</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего импортов</CardTitle>
            <Icons.Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{imports.length}</div>
            <p className="text-xs text-muted-foreground">Операций импорта</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Загружено записей</CardTitle>
            <Icons.Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{imports.reduce((sum, i) => sum + i.records, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Всего записей</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Успешных</CardTitle>
            <Icons.Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {imports.filter((i) => i.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">Завершённых операций</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>История импорта</CardTitle>
              <CardDescription>Список всех операций импорта данных</CardDescription>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Icons.Plus className="mr-2 h-4 w-4" />
                  Новый импорт
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Импорт данных</DialogTitle>
                  <DialogDescription>Загрузите данные из внешнего источника</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="source">Источник данных</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите источник" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ad">Active Directory</SelectItem>
                        <SelectItem value="mo">МО РУз</SelectItem>
                        <SelectItem value="excel">Excel файл</SelectItem>
                        <SelectItem value="csv">CSV файл</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="file">Файл для загрузки</Label>
                    <Input id="file" type="file" />
                  </div>
                  <Button className="w-full">Загрузить</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Источник</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Записей</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imports.map((imp) => (
                <TableRow key={imp.id}>
                  <TableCell className="font-semibold">{imp.name}</TableCell>
                  <TableCell>{imp.source}</TableCell>
                  <TableCell className="text-muted-foreground">{imp.date}</TableCell>
                  <TableCell>{imp.records}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {imp.status === "completed" ? "Завершено" : "В процессе"}
                    </Badge>
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

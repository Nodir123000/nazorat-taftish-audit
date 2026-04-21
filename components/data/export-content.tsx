"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Checkbox } from "@/components/ui/checkbox"

export function DataExportContent() {
  const [isOpen, setIsOpen] = useState(false)

  const exports = [
    {
      id: 1,
      name: "Экспорт ревизий 2024",
      format: "Excel",
      date: "2024-10-19 11:20",
      records: 2847,
      size: "15.3 МБ",
      status: "completed",
    },
    {
      id: 2,
      name: "Экспорт нарушений",
      format: "PDF",
      date: "2024-10-18 16:45",
      records: 3456,
      size: "28.7 МБ",
      status: "completed",
    },
    {
      id: 3,
      name: "Экспорт решений",
      format: "CSV",
      date: "2024-10-17 10:15",
      records: 1234,
      size: "8.2 МБ",
      status: "completed",
    },
    {
      id: 4,
      name: "Экспорт пользователей",
      format: "Excel",
      date: "2024-10-16 14:30",
      records: 156,
      size: "2.1 МБ",
      status: "completed",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Экспорт данных</h1>
        <p className="text-muted-foreground">Выгрузка данных в различные форматы</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего экспортов</CardTitle>
            <Icons.Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exports.length}</div>
            <p className="text-xs text-muted-foreground">Операций экспорта</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выгружено записей</CardTitle>
            <Icons.Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exports.reduce((sum, e) => sum + e.records, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Всего записей</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Объём данных</CardTitle>
            <Icons.HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54.3 МБ</div>
            <p className="text-xs text-muted-foreground">Всего выгружено</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>История экспорта</CardTitle>
              <CardDescription>Список всех операций экспорта данных</CardDescription>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Icons.Plus className="mr-2 h-4 w-4" />
                  Новый экспорт
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Экспорт данных</DialogTitle>
                  <DialogDescription>Выберите данные для экспорта</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Таблицы для экспорта</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="audits" />
                        <Label htmlFor="audits" className="font-normal cursor-pointer">
                          Ревизии
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="violations" />
                        <Label htmlFor="violations" className="font-normal cursor-pointer">
                          Нарушения
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="decisions" />
                        <Label htmlFor="decisions" className="font-normal cursor-pointer">
                          Решения
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="format">Формат экспорта</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите формат" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                        <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                        <SelectItem value="json">JSON (.json)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Экспортировать</Button>
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
                <TableHead>Формат</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Записей</TableHead>
                <TableHead>Размер</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exports.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell className="font-semibold">{exp.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{exp.format}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{exp.date}</TableCell>
                  <TableCell>{exp.records}</TableCell>
                  <TableCell>{exp.size}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Завершено
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

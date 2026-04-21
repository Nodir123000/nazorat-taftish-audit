"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Eye, AlertCircle, CheckCircle, Clock } from "lucide-react"

interface UnplannedAuditsProps {
  user: User
}

interface UnplannedAudit {
  unplan_id: number
  type: string
  reason: string
  date: string
  unit_id: number
  initiated_by: number
  status: string
  unit: {
    name: string
    unit_code: string
  }
  initiator: {
    fullname: string
    rank: string
  }
}

export function UnplannedAudits({ user }: UnplannedAuditsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const audits: UnplannedAudit[] = [
    {
      unplan_id: 1,
      type: "Внезапная проверка",
      reason: "Поступила информация о возможных нарушениях в службе продовольственного обеспечения",
      date: "2024-05-15",
      unit_id: 1,
      initiated_by: 1,
      status: "completed",
      unit: {
        name: "Войсковая часть 12345",
        unit_code: "ВЧ-12345",
      },
      initiator: {
        fullname: "Администратор Системы",
        rank: "Полковник",
      },
    },
    {
      unplan_id: 2,
      type: "Контрольная проверка",
      reason: "Проверка исполнения предписаний по результатам предыдущей ревизии",
      date: "2024-07-20",
      unit_id: 2,
      initiated_by: 2,
      status: "in_progress",
      unit: {
        name: "Войсковая часть 67890",
        unit_code: "ВЧ-67890",
      },
      initiator: {
        fullname: "Иванов Иван Иванович",
        rank: "Подполковник",
      },
    },
    {
      unplan_id: 3,
      type: "Внеплановая ревизия",
      reason: "По указанию вышестоящего командования",
      date: "2024-09-10",
      unit_id: 1,
      initiated_by: 1,
      status: "scheduled",
      unit: {
        name: "Войсковая часть 12345",
        unit_code: "ВЧ-12345",
      },
      initiator: {
        fullname: "Администратор Системы",
        rank: "Полковник",
      },
    },
  ]

  const filteredAudits = audits.filter(
    (audit) =>
      audit.unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.reason.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            Запланирована
          </Badge>
        )
      case "in_progress":
        return (
          <Badge className="gap-1 bg-blue-600">
            <AlertCircle className="w-3 h-3" />В процессе
          </Badge>
        )
      case "completed":
        return (
          <Badge className="gap-1 bg-green-600">
            <CheckCircle className="w-3 h-3" />
            Завершена
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const canCreateAudits = user.role === "admin" || user.role === "chief_inspector"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Внеплановые ревизии</CardTitle>
            <CardDescription>Учёт внеплановых и внезапных проверок</CardDescription>
          </div>
          {canCreateAudits && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Добавить внеплановую ревизию
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Добавить внеплановую ревизию</DialogTitle>
                  <DialogDescription>Заполните информацию о внеплановой ревизии</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Тип проверки *</Label>
                    <Select>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unexpected">Внезапная проверка</SelectItem>
                        <SelectItem value="unplanned">Внеплановая ревизия</SelectItem>
                        <SelectItem value="control">Контрольная проверка</SelectItem>
                        <SelectItem value="special">Специальная проверка</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Воинская часть *</Label>
                    <Select>
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Выберите часть" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Войсковая часть 12345 (ВЧ-12345)</SelectItem>
                        <SelectItem value="2">Войсковая часть 67890 (ВЧ-67890)</SelectItem>
                        <SelectItem value="3">Войсковая часть 11111 (ВЧ-11111)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Дата проведения *</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Основание *</Label>
                    <Textarea
                      id="reason"
                      placeholder="Укажите основание для проведения внеплановой ревизии..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Добавить</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по части, типу или основанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Тип проверки</TableHead>
                <TableHead>Воинская часть</TableHead>
                <TableHead>Основание</TableHead>
                <TableHead>Инициатор</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudits.map((audit) => (
                <TableRow key={audit.unplan_id}>
                  <TableCell className="font-medium">{formatDate(audit.date)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{audit.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{audit.unit.name}</div>
                      <div className="text-sm text-muted-foreground">{audit.unit.unit_code}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm line-clamp-2">{audit.reason}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{audit.initiator.fullname}</div>
                      <div className="text-muted-foreground">{audit.initiator.rank}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(audit.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-muted-foreground">
          Показано {filteredAudits.length} из {audits.length} внеплановых ревизий
        </div>
      </CardContent>
    </Card>
  )
}

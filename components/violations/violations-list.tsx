"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Eye, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"

interface ViolationsListProps {
  user: User
}

interface Violation {
  violation_id: number
  violation_num: string
  audit_id: number
  audit_order: string
  unit_name: string
  category: string
  severity: string
  description: string
  amount?: number
  detected_date: string
  status: string
  responsible_person?: string
}

export function ViolationsList({ user }: ViolationsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const violations: Violation[] = [
    {
      violation_id: 1,
      violation_num: "НАР-2024/001",
      audit_id: 1,
      audit_order: "Приказ-2024/045",
      unit_name: "Войсковая часть 12345",
      category: "Финансовые нарушения",
      severity: "high",
      description: "Недостача денежных документов в кассе",
      amount: 500,
      detected_date: "2024-04-02",
      status: "open",
      responsible_person: "Старший лейтенант Сидоров А.А.",
    },
    {
      violation_id: 2,
      violation_num: "НАР-2024/002",
      audit_id: 1,
      audit_order: "Приказ-2024/045",
      unit_name: "Войсковая часть 12345",
      category: "Нарушения учёта",
      severity: "medium",
      description: "Несвоевременное оформление первичных документов",
      detected_date: "2024-04-03",
      status: "in_progress",
      responsible_person: "Капитан Иванов П.С.",
    },
    {
      violation_id: 3,
      violation_num: "НАР-2024/003",
      audit_id: 1,
      audit_order: "Приказ-2024/045",
      unit_name: "Войсковая часть 12345",
      category: "Нарушения хранения",
      severity: "low",
      description: "Нарушение условий хранения продовольствия",
      detected_date: "2024-04-05",
      status: "resolved",
      responsible_person: "Старшина Петров В.И.",
    },
    {
      violation_id: 4,
      violation_num: "НАР-2024/004",
      audit_id: 2,
      audit_order: "Приказ-2024/067",
      unit_name: "Войсковая часть 67890",
      category: "Финансовые нарушения",
      severity: "high",
      description: "Нецелевое использование бюджетных средств",
      amount: 15000,
      detected_date: "2024-06-03",
      status: "open",
      responsible_person: "Майор Козлов Д.Н.",
    },
    {
      violation_id: 5,
      violation_num: "НАР-2024/005",
      audit_id: 2,
      audit_order: "Приказ-2024/067",
      unit_name: "Войсковая часть 67890",
      category: "Нарушения учёта",
      severity: "medium",
      description: "Отсутствие обязательных реквизитов в документах",
      detected_date: "2024-06-04",
      status: "in_progress",
      responsible_person: "Лейтенант Смирнов К.А.",
    },
  ]

  const filteredViolations = violations.filter((violation) => {
    const matchesSearch =
      violation.violation_num.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.unit_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSeverity = severityFilter === "all" || violation.severity === severityFilter
    const matchesStatus = statusFilter === "all" || violation.status === statusFilter

    return matchesSearch && matchesSeverity && matchesStatus
  })

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">Высокая</Badge>
      case "medium":
        return <Badge className="bg-orange-600">Средняя</Badge>
      case "low":
        return <Badge variant="secondary">Низкая</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="gap-1 text-red-600 border-red-600">
            <AlertCircle className="w-3 h-3" />
            Открыто
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="gap-1 text-blue-600 border-blue-600">
            <Clock className="w-3 h-3" />В работе
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3" />
            Устранено
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="outline" className="gap-1">
            <XCircle className="w-3 h-3" />
            Закрыто
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return "—"
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const canAddViolations = user.role === "admin" || user.role === "chief_inspector" || user.role === "inspector"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Реестр нарушений</CardTitle>
            <CardDescription>Все выявленные нарушения по результатам ревизий</CardDescription>
          </div>
          {canAddViolations && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Зарегистрировать нарушение
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Регистрация нарушения</DialogTitle>
                  <DialogDescription>Заполните информацию о выявленном нарушении</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="violation_num">Номер нарушения *</Label>
                      <Input id="violation_num" placeholder="НАР-2024/006" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="detected_date">Дата выявления *</Label>
                      <Input id="detected_date" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audit">Ревизия *</Label>
                    <Select>
                      <SelectTrigger id="audit">
                        <SelectValue placeholder="Выберите ревизию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Приказ-2024/045 (ВЧ-12345)</SelectItem>
                        <SelectItem value="2">Приказ-2024/067 (ВЧ-67890)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Категория *</Label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="financial">Финансовые нарушения</SelectItem>
                          <SelectItem value="accounting">Нарушения учёта</SelectItem>
                          <SelectItem value="storage">Нарушения хранения</SelectItem>
                          <SelectItem value="documentation">Нарушения документооборота</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="severity">Степень тяжести *</Label>
                      <Select>
                        <SelectTrigger id="severity">
                          <SelectValue placeholder="Выберите степень" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Высокая</SelectItem>
                          <SelectItem value="medium">Средняя</SelectItem>
                          <SelectItem value="low">Низкая</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Сумма ущерба (руб.)</Label>
                    <Input id="amount" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание нарушения *</Label>
                    <Textarea id="description" placeholder="Подробное описание нарушения..." rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsible">Ответственное лицо</Label>
                    <Input id="responsible" placeholder="Звание, ФИО" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Зарегистрировать</Button>
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
              placeholder="Поиск по номеру, части или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все степени</SelectItem>
              <SelectItem value="high">Высокая</SelectItem>
              <SelectItem value="medium">Средняя</SelectItem>
              <SelectItem value="low">Низкая</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="open">Открыто</SelectItem>
              <SelectItem value="in_progress">В работе</SelectItem>
              <SelectItem value="resolved">Устранено</SelectItem>
              <SelectItem value="closed">Закрыто</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Ревизия</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Степень</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredViolations.map((violation) => (
                <TableRow key={violation.violation_id}>
                  <TableCell className="font-medium">{violation.violation_num}</TableCell>
                  <TableCell>{formatDate(violation.detected_date)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{violation.audit_order}</div>
                      <div className="text-muted-foreground">{violation.unit_name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{violation.category}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm line-clamp-2">{violation.description}</div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(violation.amount)}</TableCell>
                  <TableCell>{getSeverityBadge(violation.severity)}</TableCell>
                  <TableCell>{getStatusBadge(violation.status)}</TableCell>
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

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Показано {filteredViolations.length} из {violations.length} нарушений
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full" />
              <span>Открыто: {violations.filter((v) => v.status === "open").length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
              <span>В работе: {violations.filter((v) => v.status === "in_progress").length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full" />
              <span>Устранено: {violations.filter((v) => v.status === "resolved").length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

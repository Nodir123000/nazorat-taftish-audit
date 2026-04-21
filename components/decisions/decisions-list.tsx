"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Search, Eye, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface DecisionsListProps {
  user: User
}

interface Decision {
  decision_id: number
  decision_num: string
  audit_order: string
  unit_name: string
  decision_type: string
  decision_date: string
  deadline: string
  description: string
  actions_count: number
  completed_actions: number
  status: string
  responsible_person: string
}

export function DecisionsList({ user }: DecisionsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const decisions: Decision[] = [
    {
      decision_id: 1,
      decision_num: "РЕШ-2024/001",
      audit_order: "Приказ-2024/045",
      unit_name: "Войсковая часть 12345",
      decision_type: "Предписание",
      decision_date: "2024-04-10",
      deadline: "2024-05-10",
      description: "Устранить недостачу денежных документов и привести в порядок кассовую дисциплину",
      actions_count: 3,
      completed_actions: 1,
      status: "in_progress",
      responsible_person: "Старший лейтенант Сидоров А.А.",
    },
    {
      decision_id: 2,
      decision_num: "РЕШ-2024/002",
      audit_order: "Приказ-2024/045",
      unit_name: "Войсковая часть 12345",
      decision_type: "Рекомендация",
      decision_date: "2024-04-10",
      deadline: "2024-04-30",
      description: "Организовать своевременное оформление первичных документов",
      actions_count: 2,
      completed_actions: 2,
      status: "completed",
      responsible_person: "Капитан Иванов П.С.",
    },
    {
      decision_id: 3,
      decision_num: "РЕШ-2024/003",
      audit_order: "Приказ-2024/045",
      unit_name: "Войсковая часть 12345",
      decision_type: "Предписание",
      decision_date: "2024-04-10",
      deadline: "2024-04-20",
      description: "Привести условия хранения продовольствия в соответствие с нормами",
      actions_count: 4,
      completed_actions: 4,
      status: "completed",
      responsible_person: "Старшина Петров В.И.",
    },
    {
      decision_id: 4,
      decision_num: "РЕШ-2024/004",
      audit_order: "Приказ-2024/067",
      unit_name: "Войсковая часть 67890",
      decision_type: "Предписание",
      decision_date: "2024-06-08",
      deadline: "2024-06-25",
      description: "Возместить нецелевое использование бюджетных средств",
      actions_count: 2,
      completed_actions: 0,
      status: "overdue",
      responsible_person: "Майор Козлов Д.Н.",
    },
  ]

  const filteredDecisions = decisions.filter((decision) => {
    const matchesSearch =
      decision.decision_num.toLowerCase().includes(searchQuery.toLowerCase()) ||
      decision.unit_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      decision.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || decision.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return (
          <Badge variant="outline" className="gap-1 text-blue-600 border-blue-600">
            <Clock className="w-3 h-3" />В работе
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3" />
            Исполнено
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="outline" className="gap-1 text-red-600 border-red-600">
            <AlertTriangle className="w-3 h-3" />
            Просрочено
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Предписание":
        return <Badge variant="destructive">Предписание</Badge>
      case "Рекомендация":
        return <Badge className="bg-blue-600">Рекомендация</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const getDaysRemaining = (deadline: string) => {
    const end = new Date(deadline)
    const today = new Date()
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const canAddDecisions = user.role === "admin" || user.role === "chief_inspector"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Реестр решений</CardTitle>
            <CardDescription>Решения по результатам контрольно-ревизионных мероприятий</CardDescription>
          </div>
          {canAddDecisions && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Добавить решение
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Добавить решение</DialogTitle>
                  <DialogDescription>Заполните информацию о принятом решении</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="decision_num">Номер решения *</Label>
                      <Input id="decision_num" placeholder="РЕШ-2024/005" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="decision_date">Дата решения *</Label>
                      <Input id="decision_date" type="date" />
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
                      <Label htmlFor="decision_type">Тип решения *</Label>
                      <Select>
                        <SelectTrigger id="decision_type">
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prescription">Предписание</SelectItem>
                          <SelectItem value="recommendation">Рекомендация</SelectItem>
                          <SelectItem value="order">Приказ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Срок исполнения *</Label>
                      <Input id="deadline" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Содержание решения *</Label>
                    <Textarea id="description" placeholder="Подробное описание решения..." rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsible">Ответственный исполнитель *</Label>
                    <Input id="responsible" placeholder="Звание, ФИО" />
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
              placeholder="Поиск по номеру, части или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="in_progress">В работе</SelectItem>
              <SelectItem value="completed">Исполнено</SelectItem>
              <SelectItem value="overdue">Просрочено</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredDecisions.map((decision) => {
            const daysRemaining = getDaysRemaining(decision.deadline)
            const progress = Math.round((decision.completed_actions / decision.actions_count) * 100)

            return (
              <Card key={decision.decision_id} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{decision.decision_num}</CardTitle>
                        {getTypeBadge(decision.decision_type)}
                        {getStatusBadge(decision.status)}
                      </div>
                      <CardDescription>
                        {decision.audit_order} • {decision.unit_name}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Eye className="w-4 h-4" />
                      Подробнее
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">{decision.description}</div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Дата решения</div>
                      <div className="font-medium">{formatDate(decision.decision_date)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Срок исполнения</div>
                      <div className="font-medium">
                        {formatDate(decision.deadline)}
                        {decision.status === "in_progress" && (
                          <span
                            className={`ml-2 text-xs ${daysRemaining < 0 ? "text-red-600" : daysRemaining < 7 ? "text-orange-600" : "text-muted-foreground"}`}
                          >
                            ({daysRemaining > 0 ? `${daysRemaining} дн.` : "просрочено"})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Мероприятия</div>
                      <div className="font-medium">
                        {decision.completed_actions} из {decision.actions_count}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Ответственный</div>
                      <div className="font-medium text-sm">{decision.responsible_person}</div>
                    </div>
                  </div>

                  {decision.status !== "completed" && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Прогресс исполнения</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${progress === 100 ? "bg-green-600" : progress > 50 ? "bg-blue-600" : "bg-orange-600"}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Показано {filteredDecisions.length} из {decisions.length} решений
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
              <span>В работе: {decisions.filter((d) => d.status === "in_progress").length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full" />
              <span>Исполнено: {decisions.filter((d) => d.status === "completed").length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full" />
              <span>Просрочено: {decisions.filter((d) => d.status === "overdue").length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

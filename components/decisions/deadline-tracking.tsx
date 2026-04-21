"use client"

import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Clock, CheckCircle } from "lucide-react"

interface DeadlineTrackingProps {
  user: User
}

interface DeadlineItem {
  item_id: number
  type: "decision" | "action"
  number: string
  description: string
  unit_name: string
  responsible_person: string
  deadline: string
  status: string
  days_remaining: number
}

export function DeadlineTracking({ user }: DeadlineTrackingProps) {
  const today = new Date()

  const items: DeadlineItem[] = [
    {
      item_id: 1,
      type: "action",
      number: "РЕШ-2024/001 (п.2)",
      description: "Возместить недостачу денежных документов",
      unit_name: "Войсковая часть 12345",
      responsible_person: "Старший лейтенант Сидоров А.А.",
      deadline: "2024-05-01",
      status: "in_progress",
      days_remaining: -5,
    },
    {
      item_id: 2,
      type: "action",
      number: "РЕШ-2024/001 (п.3)",
      description: "Организовать обучение кассира",
      unit_name: "Войсковая часть 12345",
      responsible_person: "Капитан Иванов П.С.",
      deadline: "2024-05-10",
      status: "pending",
      days_remaining: 4,
    },
    {
      item_id: 3,
      type: "decision",
      number: "РЕШ-2024/004",
      description: "Возместить нецелевое использование бюджетных средств",
      unit_name: "Войсковая часть 67890",
      responsible_person: "Майор Козлов Д.Н.",
      deadline: "2024-06-25",
      status: "overdue",
      days_remaining: -11,
    },
    {
      item_id: 4,
      type: "action",
      number: "РЕШ-2024/005 (п.1)",
      description: "Провести служебное расследование",
      unit_name: "Войсковая часть 67890",
      responsible_person: "Подполковник Васильев С.М.",
      deadline: "2024-07-15",
      status: "in_progress",
      days_remaining: 39,
    },
  ]

  const sortedItems = [...items].sort((a, b) => a.days_remaining - b.days_remaining)

  const getStatusBadge = (daysRemaining: number, status: string) => {
    if (status === "completed") {
      return (
        <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
          <CheckCircle className="w-3 h-3" />
          Выполнено
        </Badge>
      )
    }

    if (daysRemaining < 0) {
      return (
        <Badge variant="outline" className="gap-1 text-red-600 border-red-600">
          <AlertTriangle className="w-3 h-3" />
          Просрочено на {Math.abs(daysRemaining)} дн.
        </Badge>
      )
    }

    if (daysRemaining <= 7) {
      return (
        <Badge variant="outline" className="gap-1 text-orange-600 border-orange-600">
          <Clock className="w-3 h-3" />
          Осталось {daysRemaining} дн.
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="gap-1">
        <Clock className="w-3 h-3" />
        Осталось {daysRemaining} дн.
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    return type === "decision" ? (
      <Badge variant="secondary">Решение</Badge>
    ) : (
      <Badge variant="outline">Мероприятие</Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const overdueCount = items.filter((item) => item.days_remaining < 0 && item.status !== "completed").length
  const urgentCount = items.filter(
    (item) => item.days_remaining >= 0 && item.days_remaining <= 7 && item.status !== "completed",
  ).length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Просрочено</CardDescription>
            <CardTitle className="text-3xl text-red-600">{overdueCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Требуют немедленного внимания</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Срочные (до 7 дней)</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{urgentCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Приближается срок исполнения</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Всего активных</CardDescription>
            <CardTitle className="text-3xl">{items.filter((i) => i.status !== "completed").length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Решений и мероприятий</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Контроль сроков исполнения</CardTitle>
          <CardDescription>Решения и мероприятия, отсортированные по срокам</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Тип</TableHead>
                  <TableHead>Номер</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Воинская часть</TableHead>
                  <TableHead>Ответственный</TableHead>
                  <TableHead>Срок</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.map((item) => (
                  <TableRow key={item.item_id} className={item.days_remaining < 0 ? "bg-red-50" : ""}>
                    <TableCell>{getTypeBadge(item.type)}</TableCell>
                    <TableCell className="font-medium">{item.number}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm line-clamp-2">{item.description}</div>
                    </TableCell>
                    <TableCell className="text-sm">{item.unit_name}</TableCell>
                    <TableCell className="text-sm">{item.responsible_person}</TableCell>
                    <TableCell className="text-sm">{formatDate(item.deadline)}</TableCell>
                    <TableCell>{getStatusBadge(item.days_remaining, item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

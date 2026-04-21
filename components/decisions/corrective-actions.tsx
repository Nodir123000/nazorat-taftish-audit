"use client"

import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, CheckCircle, Clock, XCircle } from "lucide-react"

interface CorrectiveActionsProps {
  user: User
}

interface Action {
  action_id: number
  decision_num: string
  action_text: string
  deadline: string
  responsible_person: string
  status: string
  completion_date?: string
  notes?: string
}

export function CorrectiveActions({ user }: CorrectiveActionsProps) {
  const actions: Action[] = [
    {
      action_id: 1,
      decision_num: "РЕШ-2024/001",
      action_text: "Провести инвентаризацию денежных документов",
      deadline: "2024-04-20",
      responsible_person: "Старший лейтенант Сидоров А.А.",
      status: "completed",
      completion_date: "2024-04-18",
    },
    {
      action_id: 2,
      decision_num: "РЕШ-2024/001",
      action_text: "Возместить недостачу денежных документов",
      deadline: "2024-05-01",
      responsible_person: "Старший лейтенант Сидоров А.А.",
      status: "in_progress",
    },
    {
      action_id: 3,
      decision_num: "РЕШ-2024/001",
      action_text: "Организовать обучение кассира по работе с денежными документами",
      deadline: "2024-05-10",
      responsible_person: "Капитан Иванов П.С.",
      status: "pending",
    },
    {
      action_id: 4,
      decision_num: "РЕШ-2024/002",
      action_text: "Разработать инструкцию по оформлению первичных документов",
      deadline: "2024-04-25",
      responsible_person: "Капитан Иванов П.С.",
      status: "completed",
      completion_date: "2024-04-23",
    },
    {
      action_id: 5,
      decision_num: "РЕШ-2024/002",
      action_text: "Провести инструктаж личного состава",
      deadline: "2024-04-30",
      responsible_person: "Капитан Иванов П.С.",
      status: "completed",
      completion_date: "2024-04-28",
    },
    {
      action_id: 6,
      decision_num: "РЕШ-2024/004",
      action_text: "Возместить нецелевое использование средств",
      deadline: "2024-06-20",
      responsible_person: "Майор Козлов Д.Н.",
      status: "overdue",
    },
    {
      action_id: 7,
      decision_num: "РЕШ-2024/004",
      action_text: "Предоставить объяснительную записку",
      deadline: "2024-06-25",
      responsible_person: "Майор Козлов Д.Н.",
      status: "overdue",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3" />
            Выполнено
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="gap-1 text-blue-600 border-blue-600">
            <Clock className="w-3 h-3" />В работе
          </Badge>
        )
      case "pending":
        return <Badge variant="outline">Ожидает</Badge>
      case "overdue":
        return (
          <Badge variant="outline" className="gap-1 text-red-600 border-red-600">
            <XCircle className="w-3 h-3" />
            Просрочено
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const groupedActions = actions.reduce(
    (acc, action) => {
      if (!acc[action.decision_num]) {
        acc[action.decision_num] = []
      }
      acc[action.decision_num].push(action)
      return acc
    },
    {} as Record<string, Action[]>,
  )

  const canAddActions = user.role === "admin" || user.role === "chief_inspector"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Корректирующие мероприятия</CardTitle>
            <CardDescription>Мероприятия по устранению выявленных нарушений</CardDescription>
          </div>
          {canAddActions && (
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Добавить мероприятие
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedActions).map(([decisionNum, decisionActions]) => (
          <Card key={decisionNum} className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{decisionNum}</CardTitle>
                <Badge variant="outline">
                  {decisionActions.filter((a) => a.status === "completed").length} из {decisionActions.length} выполнено
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {decisionActions.map((action) => (
                  <div key={action.action_id} className="flex items-start gap-3 p-4 border rounded-lg">
                    <Checkbox checked={action.status === "completed"} className="mt-1" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-medium">{action.action_text}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Ответственный: {action.responsible_person}
                          </div>
                        </div>
                        {getStatusBadge(action.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div>Срок: {formatDate(action.deadline)}</div>
                        {action.completion_date && <div>Выполнено: {formatDate(action.completion_date)}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Eye, Edit, CheckCircle, Clock } from "lucide-react"

interface QuarterlyPlansProps {
  user: User
}

interface QuarterlyPlan {
  qplan_id: number
  year: number
  quarter: number
  plan_number: string
  approved_by?: number
  approval_date?: string
  status: string
  approver?: {
    fullname: string
    rank: string
  }
}

export function QuarterlyPlans({ user }: QuarterlyPlansProps) {
  const [yearFilter, setYearFilter] = useState("2024")
  const [quarterFilter, setQuarterFilter] = useState("all")

  const plans: QuarterlyPlan[] = [
    {
      qplan_id: 1,
      year: 2024,
      quarter: 1,
      plan_number: "КП-2024/Q1",
      approved_by: 1,
      approval_date: "2024-01-05",
      status: "approved",
      approver: {
        fullname: "Администратор Системы",
        rank: "Полковник",
      },
    },
    {
      qplan_id: 2,
      year: 2024,
      quarter: 2,
      plan_number: "КП-2024/Q2",
      approved_by: 1,
      approval_date: "2024-04-01",
      status: "approved",
      approver: {
        fullname: "Администратор Системы",
        rank: "Полковник",
      },
    },
    {
      qplan_id: 3,
      year: 2024,
      quarter: 3,
      plan_number: "КП-2024/Q3",
      approved_by: 1,
      approval_date: "2024-07-01",
      status: "approved",
      approver: {
        fullname: "Администратор Системы",
        rank: "Полковник",
      },
    },
    {
      qplan_id: 4,
      year: 2024,
      quarter: 4,
      plan_number: "КП-2024/Q4",
      status: "draft",
    },
  ]

  const filteredPlans = plans.filter((plan) => {
    const matchesYear = plan.year.toString() === yearFilter
    const matchesQuarter = quarterFilter === "all" || plan.quarter.toString() === quarterFilter
    return matchesYear && matchesQuarter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            Черновик
          </Badge>
        )
      case "approved":
        return (
          <Badge className="gap-1 bg-green-600">
            <CheckCircle className="w-3 h-3" />
            Утверждён
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getQuarterName = (quarter: number) => {
    return `${quarter} квартал`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const canCreatePlans = user.role === "admin" || user.role === "chief_inspector"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Квартальные планы</CardTitle>
            <CardDescription>Планирование ревизий по кварталам</CardDescription>
          </div>
          {canCreatePlans && (
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Создать квартальный план
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023 год</SelectItem>
              <SelectItem value="2024">2024 год</SelectItem>
              <SelectItem value="2025">2025 год</SelectItem>
            </SelectContent>
          </Select>
          <Select value={quarterFilter} onValueChange={setQuarterFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все кварталы</SelectItem>
              <SelectItem value="1">1 квартал</SelectItem>
              <SelectItem value="2">2 квартал</SelectItem>
              <SelectItem value="3">3 квартал</SelectItem>
              <SelectItem value="4">4 квартал</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер плана</TableHead>
                <TableHead>Год</TableHead>
                <TableHead>Квартал</TableHead>
                <TableHead>Утверждён</TableHead>
                <TableHead>Дата утверждения</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.map((plan) => (
                <TableRow key={plan.qplan_id}>
                  <TableCell className="font-medium">{plan.plan_number}</TableCell>
                  <TableCell>{plan.year}</TableCell>
                  <TableCell>{getQuarterName(plan.quarter)}</TableCell>
                  <TableCell>
                    {plan.approver ? (
                      <div className="text-sm">
                        <div>{plan.approver.fullname}</div>
                        <div className="text-muted-foreground">{plan.approver.rank}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(plan.approval_date)}</TableCell>
                  <TableCell>{getStatusBadge(plan.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {canCreatePlans && (
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-muted-foreground">
          Показано {filteredPlans.length} из {plans.length} планов
        </div>
      </CardContent>
    </Card>
  )
}

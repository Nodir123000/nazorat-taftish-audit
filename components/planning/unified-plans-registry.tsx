"use client"

import { useState, useEffect } from "react"
import type { AuditPlan, User } from "@/lib/types"
import { unifiedPlanningService, type PeriodType } from "@/lib/services/unified-planning-service"
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
import { Plus, Search, Eye, Edit, CheckCircle, Clock, FileCheck } from "lucide-react"

interface UnifiedPlansRegistryProps {
  user: User
}

export function UnifiedPlansRegistry({ user }: UnifiedPlansRegistryProps) {
  const [plans, setPlans] = useState<AuditPlan[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPeriodType, setFilterPeriodType] = useState<PeriodType | "all">("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPlans()
  }, [filterPeriodType, filterStatus])

  const loadPlans = async () => {
    setIsLoading(true)
    try {
      const filters = {
        search: searchQuery,
        periodType: filterPeriodType === "all" ? undefined : (filterPeriodType as PeriodType),
        status: filterStatus === "all" ? undefined : (filterStatus as any),
      }
      const data = await unifiedPlanningService.getPlans(filters)
      setPlans(data)
    } finally {
      setIsLoading(false)
    }
  }

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
      case "in_progress":
        return (
          <Badge className="gap-1 bg-blue-600">
            <FileCheck className="w-3 h-3" />В работе
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            Завершён
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPeriodTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      annual: "Годовой",
      quarterly: "Квартальный",
      monthly: "Месячный",
      unplanned: "Внеплановый",
    }
    return labels[type] || type
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const canCreatePlans = user.role === "admin" || user.role === "chief_inspector"

  const filteredPlans = plans.filter(
    (plan) =>
      plan.plan_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Реестр планов КРР</CardTitle>
            <CardDescription>Единый реестр всех планов контрольно-ревизионной работы</CardDescription>
          </div>
          {canCreatePlans && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Создать план
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Создать новый план</DialogTitle>
                  <DialogDescription>Заполните информацию о новом плане КРР</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Год *</Label>
                      <Input id="year" type="number" placeholder="2024" defaultValue={new Date().getFullYear()} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plan_number">Номер плана *</Label>
                      <Input id="plan_number" placeholder="План-2024/001" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="period_type">Тип периода *</Label>
                    <Select>
                      <SelectTrigger id="period_type">
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">Годовой</SelectItem>
                        <SelectItem value="quarterly">Квартальный</SelectItem>
                        <SelectItem value="monthly">Месячный</SelectItem>
                        <SelectItem value="unplanned">Внеплановый</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Дата начала *</Label>
                      <Input id="start_date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_date">Дата окончания *</Label>
                      <Input id="end_date" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea id="description" placeholder="Описание плана..." rows={3} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Создать план</Button>
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
              placeholder="Поиск по номеру или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterPeriodType} onValueChange={(value) => setFilterPeriodType(value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Тип периода" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="annual">Годовой</SelectItem>
              <SelectItem value="quarterly">Квартальный</SelectItem>
              <SelectItem value="monthly">Месячный</SelectItem>
              <SelectItem value="unplanned">Внеплановый</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="draft">Черновик</SelectItem>
              <SelectItem value="approved">Утверждён</SelectItem>
              <SelectItem value="in_progress">В работе</SelectItem>
              <SelectItem value="completed">Завершён</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер плана</TableHead>
                <TableHead>Год</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Период</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Прогресс</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Загрузка...
                  </TableCell>
                </TableRow>
              ) : filteredPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Планы не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlans.map((plan) => (
                  <TableRow key={plan.plan_id}>
                    <TableCell className="font-medium">{plan.plan_number}</TableCell>
                    <TableCell>{plan.year}</TableCell>
                    <TableCell>{getPeriodTypeLabel(plan.period_type)}</TableCell>
                    <TableCell className="text-sm">
                      {formatDate(plan.start_date)} — {formatDate(plan.end_date)}
                    </TableCell>
                    <TableCell>{getStatusBadge(plan.status)}</TableCell>
                    <TableCell className="text-sm">
                      {plan.planned_audits_count ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${((plan.completed_audits_count || 0) / plan.planned_audits_count) * 100}%`,
                              }}
                            />
                          </div>
                          <span>
                            {plan.completed_audits_count}/{plan.planned_audits_count}
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
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
                ))
              )}
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

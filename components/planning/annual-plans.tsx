"use client"

import { useState } from "react"
import type { User, AuditPlan } from "@/lib/types"
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
import { UnitSelect } from "@/components/reference/unit-select"
import { PersonnelSelect } from "@/components/reference/personnel-select"

interface AnnualPlansProps {
  user: User
}

export function AnnualPlans({ user }: AnnualPlansProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const [newPlan, setNewPlan] = useState({
    year: new Date().getFullYear(),
    planNumber: "",
    startDate: "",
    endDate: "",
    unit: "",
    responsible: "",
    description: ""
  })

  // Mock data
  const plans: AuditPlan[] = [
    {
      plan_id: 1,
      year: 2024,
      plan_number: "План-2024/001",
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      unit_id: 1,
      responsible_id: 2,
      status: "approved",
      description: "Годовой план контрольно-ревизионной работы на 2024 год",
      period_type: "annual",
      unit: {
        unit_id: 1,
        name: "Войсковая часть 12345",
        unit_code: "ВЧ-12345",
        subordination: "Западный военный округ",
        location: "г. Москва",
        unit_type: "Мотострелковая",
        is_active: true,
      },
      responsible: {
        user_id: 2,
        username: "ivanov",
        fullname: "Иванов Иван Иванович",
        rank: "Подполковник",
        position: "Старший инспектор",
        role: "chief_inspector",
        is_active: true,
        created_at: "2024-01-20T10:00:00Z",
        updated_at: "2024-01-20T10:00:00Z",
      },
    },
    {
      plan_id: 2,
      year: 2024,
      plan_number: "План-2024/002",
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      unit_id: 2,
      responsible_id: 2,
      status: "in_progress",
      description: "Годовой план ревизий для ВЧ-67890",
      period_type: "annual",
      unit: {
        unit_id: 2,
        name: "Войсковая часть 67890",
        unit_code: "ВЧ-67890",
        subordination: "Южный военный округ",
        location: "г. Ростов-на-Дону",
        unit_type: "Танковая",
        is_active: true,
      },
      responsible: {
        user_id: 2,
        username: "ivanov",
        fullname: "Иванов Иван Иванович",
        rank: "Подполковник",
        position: "Старший инспектор",
        role: "chief_inspector",
        is_active: true,
        created_at: "2024-01-20T10:00:00Z",
        updated_at: "2024-01-20T10:00:00Z",
      },
    },
    {
      plan_id: 3,
      year: 2025,
      plan_number: "План-2025/001",
      start_date: "2025-01-01",
      end_date: "2025-12-31",
      unit_id: 1,
      responsible_id: 2,
      status: "draft",
      description: "Проект годового плана на 2025 год",
      period_type: "annual",
      unit: {
        unit_id: 1,
        name: "Войсковая часть 12345",
        unit_code: "ВЧ-12345",
        subordination: "Западный военный округ",
        location: "г. Москва",
        unit_type: "Мотострелковая",
        is_active: true,
      },
      responsible: {
        user_id: 2,
        username: "ivanov",
        fullname: "Иванов Иван Иванович",
        rank: "Подполковник",
        position: "Старший инспектор",
        role: "chief_inspector",
        is_active: true,
        created_at: "2024-01-20T10:00:00Z",
        updated_at: "2024-01-20T10:00:00Z",
      },
    },
  ]

  const filteredPlans = plans.filter(
    (plan) =>
      plan.plan_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.unit?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const canCreatePlans = user.role === "admin" || user.role === "chief_inspector"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Годовые планы ревизий</CardTitle>
            <CardDescription>Планирование контрольно-ревизионной работы на год</CardDescription>
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
                  <DialogTitle>Создать годовой план ревизий</DialogTitle>
                  <DialogDescription>Заполните информацию о новом годовом плане</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Год *</Label>
                      <Input id="year" type="number" placeholder="2025" defaultValue={new Date().getFullYear()} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plan_number">Номер плана *</Label>
                      <Input id="plan_number" placeholder="План-2025/001" />
                    </div>
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
                    <Label htmlFor="unit">Воинская часть *</Label>
                    <UnitSelect
                      value={newPlan.unit}
                      onValueChange={(val) => setNewPlan({ ...newPlan, unit: val })}
                      placeholder="Выберите воинскую часть..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsible">Ответственный *</Label>
                    <PersonnelSelect
                      value={newPlan.responsible}
                      onValueChange={(val) => setNewPlan({ ...newPlan, responsible: val })}
                      placeholder="Выберите ответственного..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea id="description" placeholder="Описание плана ревизий..." rows={3} />
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
              placeholder="Поиск по номеру плана, части или описанию..."
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
                <TableHead>Номер плана</TableHead>
                <TableHead>Год</TableHead>
                <TableHead>Воинская часть</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.map((plan) => (
                <TableRow key={plan.plan_id}>
                  <TableCell className="font-medium">{plan.plan_number}</TableCell>
                  <TableCell>{plan.year}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{plan.unit?.name}</div>
                      <div className="text-sm text-muted-foreground">{plan.unit?.unit_code}</div>
                    </div>
                  </TableCell>
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

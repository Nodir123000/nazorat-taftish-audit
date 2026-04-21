"use client"

import { useState, useEffect } from "react"
import type { AuditPlan, User } from "@/lib/types"
import { unplannedAuditsService } from "@/lib/services/unplanned-audits-service"
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
import { Plus, Search, Eye, Edit, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"

interface UnplannedAuditsRegistryProps {
  user: User
}

export function UnplannedAuditsRegistry({ user }: UnplannedAuditsRegistryProps) {
  const [audits, setAudits] = useState<AuditPlan[]>([])
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [filterStatus])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const filters = {
        status: filterStatus === "all" ? undefined : (filterStatus as any),
        search: searchQuery,
      }
      const [auditsData, statsData] = await Promise.all([
        unplannedAuditsService.getUnplannedAudits(filters),
        unplannedAuditsService.getUnplannedAuditsStats(),
      ])
      setAudits(auditsData)
      setStats(statsData)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planned":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            Запланирована
          </Badge>
        )
      case "in_progress":
        return (
          <Badge className="gap-1 bg-orange-600">
            <AlertTriangle className="w-3 h-3" />В работе
          </Badge>
        )
      case "completed":
        return (
          <Badge className="gap-1 bg-green-600">
            <CheckCircle className="w-3 h-3" />
            Завершена
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" />
            Отменена
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

  const filteredAudits = audits.filter(
    (audit) =>
      audit.plan_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Всего внеплановых</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Завершено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Отменено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Реестр внеплановых ревизий</CardTitle>
              <CardDescription>Управление внеплановыми проверками, интегрированными в основной реестр</CardDescription>
            </div>
            {canCreateAudits && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Создать внеплановую
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Создать внеплановую ревизию</DialogTitle>
                    <DialogDescription>Заполните информацию о новой внеплановой проверке</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="plan_number">Номер плана *</Label>
                        <Input id="plan_number" placeholder="Внеплан-2024/003" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Год *</Label>
                        <Input id="year" type="number" placeholder="2024" defaultValue={new Date().getFullYear()} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="basis">Основание для внеплановой проверки *</Label>
                      <Select>
                        <SelectTrigger id="basis">
                          <SelectValue placeholder="Выберите основание" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="complaint">По жалобе</SelectItem>
                          <SelectItem value="order">По приказу вышестоящего командования</SelectItem>
                          <SelectItem value="incident">По факту происшествия</SelectItem>
                          <SelectItem value="other">Иное</SelectItem>
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
                      <Label htmlFor="description">Описание причины проверки *</Label>
                      <Textarea id="description" placeholder="Описание..." rows={3} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Создать внеплановую</Button>
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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="planned">Запланирована</SelectItem>
                <SelectItem value="in_progress">В работе</SelectItem>
                <SelectItem value="completed">Завершена</SelectItem>
                <SelectItem value="cancelled">Отменена</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер плана</TableHead>
                  <TableHead>Период</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Прогресс</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Загрузка...
                    </TableCell>
                  </TableRow>
                ) : filteredAudits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Внеплановые ревизии не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAudits.map((audit) => (
                    <TableRow key={audit.plan_id}>
                      <TableCell className="font-medium">{audit.plan_number}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(audit.start_date)} — {formatDate(audit.end_date)}
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">{audit.description}</TableCell>
                      <TableCell>{getStatusBadge(audit.status)}</TableCell>
                      <TableCell className="text-sm">
                        {audit.planned_audits_count ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{
                                  width: `${((audit.completed_audits_count || 0) / audit.planned_audits_count) * 100}%`,
                                }}
                              />
                            </div>
                            <span>
                              {audit.completed_audits_count}/{audit.planned_audits_count}
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
                          {canCreateAudits && (
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
            Показано {filteredAudits.length} из {audits.length} внеплановых ревизий
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

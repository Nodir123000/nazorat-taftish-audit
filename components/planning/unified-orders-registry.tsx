"use client"

import { useState, useEffect } from "react"
import type { AuditOrder, User, Employee } from "@/lib/types"
import { unifiedOrdersService } from "@/lib/services/unified-orders-service"
import { useTranslation } from "@/lib/i18n/hooks"
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
import { Plus, Search, Eye, Edit, Users, CheckCircle, XCircle, Send } from "lucide-react"

interface UnifiedOrdersRegistryProps {
  user: User
}

export function UnifiedOrdersRegistry({ user }: UnifiedOrdersRegistryProps) {
  const { t } = useTranslation()
  const [orders, setOrders] = useState<AuditOrder[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<AuditOrder | null>(null)
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
      const [ordersData, employeesData] = await Promise.all([
        unifiedOrdersService.getOrders(filters),
        unifiedOrdersService.getEmployees(),
      ])
      setOrders(ordersData)
      setEmployees(employeesData)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="gap-1 bg-green-600">
            <CheckCircle className="w-3 h-3" />
            Активен
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            Завершён
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" />
            Отменён
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDeliveryStatusBadge = (status?: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge variant="outline" className="gap-1">
            <Send className="w-3 h-3" />
            Отправлен
          </Badge>
        )
      case "received":
        return (
          <Badge className="gap-1 bg-blue-600">
            <CheckCircle className="w-3 h-3" />
            Получен
          </Badge>
        )
      case "acknowledged":
        return (
          <Badge className="gap-1 bg-green-600">
            <CheckCircle className="w-3 h-3" />
            Подтвержден
          </Badge>
        )
      default:
        return <Badge variant="outline">—</Badge>
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const canCreateOrders = user.role === "admin" || user.role === "chief_inspector"

  const filteredOrders = orders.filter(
    (order) =>
      order.order_num.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.audit_type?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Реестр приказов и ревизоров</CardTitle>
              <CardDescription>Управление приказами на ревизию и назначенными ревизорами</CardDescription>
            </div>
            {canCreateOrders && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Создать приказ
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Создать приказ на ревизию</DialogTitle>
                    <DialogDescription>Заполните информацию о новом приказе, связанном с планом</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="order_num">Номер приказа *</Label>
                        <Input id="order_num" placeholder="Приказ-2024/100" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="order_date">Дата приказа *</Label>
                        <Input id="order_date" type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plan_id">Связанный план *</Label>
                      <Select>
                        <SelectTrigger id="plan_id">
                          <SelectValue placeholder="Выберите план" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">План-2024/001 (Годовой)</SelectItem>
                          <SelectItem value="2">План-2024/Q1 (Квартальный)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="audit_type">Тип ревизии *</Label>
                      <Select>
                        <SelectTrigger id="audit_type">
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planned">Плановая ревизия</SelectItem>
                          <SelectItem value="targeted">Целевая проверка</SelectItem>
                          <SelectItem value="unplanned">Внеплановая ревизия</SelectItem>
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
                      <Label htmlFor="order_text">Текст приказа *</Label>
                      <Textarea id="order_text" placeholder="Текст приказа..." rows={4} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Создать приказ</Button>
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
                placeholder="Поиск по номеру приказа или типу..."
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
                <SelectItem value="active">Активен</SelectItem>
                <SelectItem value="completed">Завершён</SelectItem>
                <SelectItem value="cancelled">Отменён</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер приказа</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Тип ревизии</TableHead>
                  <TableHead>Период</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Доведение</TableHead>
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
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Приказы не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell className="font-medium">{order.order_num}</TableCell>
                      <TableCell>{formatDate(order.order_date)}</TableCell>
                      <TableCell>{order.audit_type}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(order.start_date)} — {formatDate(order.end_date)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{getDeliveryStatusBadge(order.delivery_status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order)
                              setIsCommissionDialogOpen(true)
                            }}
                          >
                            <Users className="w-4 h-4" />
                          </Button>
                          {canCreateOrders && (
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
            Показано {filteredOrders.length} из {orders.length} приказов
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCommissionDialogOpen} onOpenChange={setIsCommissionDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Назначенные ревизоры</DialogTitle>
            <DialogDescription>
              Приказ {selectedOrder?.order_num} от {formatDate(selectedOrder?.order_date)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Ревизоры</h4>
              {canCreateOrders && (
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Добавить члена
                </Button>
              )}
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ФИО</TableHead>
                    <TableHead>Звание</TableHead>
                    <TableHead>Должность</TableHead>
                    <TableHead>Специализация</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Иванов Иван Иванович</TableCell>
                    <TableCell>Подполковник</TableCell>
                    <TableCell>Старший инспектор</TableCell>
                    <TableCell>Финансовый контроль</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-600">Главный ревизор</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Петров Петр Петрович</TableCell>
                    <TableCell>Майор</TableCell>
                    <TableCell>Инспектор</TableCell>
                    <TableCell>МТО</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Ревизор</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommissionDialogOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

"use client"

import { useState } from "react"
import type { User, AuditOrder } from "@/lib/types"
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
import { Plus, Search, Eye, Edit, Users, CheckCircle, XCircle } from "lucide-react"

interface AuditOrdersProps {
  user: User
}

export function AuditOrders({ user }: AuditOrdersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<AuditOrder | null>(null)
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false)

  const orders: AuditOrder[] = [
    {
      order_id: 1,
      order_num: "Приказ-2024/045",
      order_date: "2024-03-15",
      unit_id: 1,
      commander_id: 1,
      audit_type: "Плановая ревизия",
      start_date: "2024-04-01",
      end_date: "2024-04-15",
      status: "active",
      order_text: "Провести плановую ревизию финансово-хозяйственной деятельности",
      unit: {
        unit_id: 1,
        name: "Войсковая часть 12345",
        unit_code: "ВЧ-12345",
        subordination: "Западный военный округ",
        location: "г. Москва",
        unit_type: "Мотострелковая",
        is_active: true,
      },
      commander: {
        user_id: 1,
        username: "admin",
        fullname: "Администратор Системы",
        rank: "Полковник",
        position: "Начальник КРУ",
        role: "admin",
        is_active: true,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
    },
    {
      order_id: 2,
      order_num: "Приказ-2024/067",
      order_date: "2024-05-20",
      unit_id: 2,
      commander_id: 1,
      audit_type: "Целевая проверка",
      start_date: "2024-06-01",
      end_date: "2024-06-10",
      status: "active",
      order_text: "Провести целевую проверку службы продовольственного обеспечения",
      unit: {
        unit_id: 2,
        name: "Войсковая часть 67890",
        unit_code: "ВЧ-67890",
        subordination: "Южный военный округ",
        location: "г. Ростов-на-Дону",
        unit_type: "Танковая",
        is_active: true,
      },
      commander: {
        user_id: 1,
        username: "admin",
        fullname: "Администратор Системы",
        rank: "Полковник",
        position: "Начальник КРУ",
        role: "admin",
        is_active: true,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
    },
    {
      order_id: 3,
      order_num: "Приказ-2024/089",
      order_date: "2024-08-10",
      unit_id: 1,
      commander_id: 1,
      audit_type: "Плановая ревизия",
      start_date: "2024-09-01",
      end_date: "2024-09-20",
      status: "completed",
      order_text: "Провести плановую ревизию материально-технического обеспечения",
      unit: {
        unit_id: 1,
        name: "Войсковая часть 12345",
        unit_code: "ВЧ-12345",
        subordination: "Западный военный округ",
        location: "г. Москва",
        unit_type: "Мотострелковая",
        is_active: true,
      },
      commander: {
        user_id: 1,
        username: "admin",
        fullname: "Администратор Системы",
        rank: "Полковник",
        position: "Начальник КРУ",
        role: "admin",
        is_active: true,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
    },
  ]

  const filteredOrders = orders.filter(
    (order) =>
      order.order_num.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.unit?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.audit_type?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const canCreateOrders = user.role === "admin" || user.role === "chief_inspector"

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Приказы на ревизию</CardTitle>
              <CardDescription>Управление приказами и составом комиссий</CardDescription>
            </div>
            {canCreateOrders && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Создать приказ 12
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-100 w-full">
                  <DialogHeader>
                    <DialogTitle>Создать приказ на ревизию</DialogTitle>
                    <DialogDescription>Заполните информацию о новом приказе</DialogDescription>
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
                      <Label htmlFor="audit_type">Тип ревизии *</Label>
                      <Select>
                        <SelectTrigger id="audit_type">
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planned">Плановая ревизия</SelectItem>
                          <SelectItem value="targeted">Целевая проверка</SelectItem>
                          <SelectItem value="unplanned">Внеплановая ревизия</SelectItem>
                          <SelectItem value="control">Контрольная проверка</SelectItem>
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
                placeholder="Поиск по номеру приказа, части или типу..."
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
                  <TableHead>Номер приказа</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Воинская часть</TableHead>
                  <TableHead>Тип ревизии</TableHead>
                  <TableHead>Период</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.order_id}>
                    <TableCell className="font-medium">{order.order_num}</TableCell>
                    <TableCell>{formatDate(order.order_date)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.unit?.name}</div>
                        <div className="text-sm text-muted-foreground">{order.unit?.unit_code}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.audit_type}</TableCell>
                    <TableCell className="text-sm">
                      {formatDate(order.start_date)} — {formatDate(order.end_date)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="text-sm text-muted-foreground">
            Показано {filteredOrders.length} из {orders.length} приказов
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCommissionDialogOpen} onOpenChange={setIsCommissionDialogOpen}>
        <DialogContent className="w-full w-100">
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
                    <TableHead>Роль</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Иванов Иван Иванович</TableCell>
                    <TableCell>Подполковник</TableCell>
                    <TableCell>Старший инспектор</TableCell>
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

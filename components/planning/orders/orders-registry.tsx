"use client"

import { useState, useMemo, Fragment, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { StatsCardsGrid } from "@/components/ui/stats-card"
import { useTranslation } from "@/lib/i18n/hooks"
import type { Order, OrdersFilters } from "@/lib/types/orders"
import { getOrdersStats, getAllOrders, getCommissionMembersByOrderId, getAnnualPlanById } from "@/lib/mock-data/orders"
import { ClassifierSelect } from "@/components/reference/classifier-select"
import { UnitSelect } from "@/components/reference/unit-select"
import { militaryUnits } from "@/lib/data/military-data"
import { militaryPersonnel } from "@/components/reference/personnel-data"
import { physicalPersons } from "@/components/reference/physical-persons-data"
import { SmartDeadline } from "./smart-deadline"
import { CommissionAvatarGroup } from "./commission-avatar-group"
import { OrderDetails } from "./order-details"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const getUnitName = (id: string) => {
    const unit = militaryUnits.find(u => u.id.toString() === id);
    return unit ? unit.name : id;
};

const getPersonnelName = (id: string) => {
    const mp = militaryPersonnel.find(p => p.id.toString() === id);
    if (!mp) return id;
    const person = physicalPersons.find(p => p.id === mp.personId);
    return person ? `${person.lastName} ${person.firstName.charAt(0)}.${person.middleName ? person.middleName.charAt(0) + '.' : ''}` : id;
};

export function OrdersRegistry() {
    const { t } = useTranslation()
    const router = useRouter()
    const orders = getAllOrders()
    const stats = getOrdersStats()

    const [filters, setFilters] = useState<OrdersFilters>({
        search: "",
        status: "",
        dateFrom: "",
    })
    const [viewOrderOpen, setViewOrderOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const searchLower = filters.search.toLowerCase()
            const matchesSearch =
                order.orderNum.toLowerCase().includes(searchLower) || order.unit.toLowerCase().includes(searchLower)

            const matchesStatus = !filters.status || order.status === filters.status

            const matchesDate = !filters.dateFrom || order.date >= filters.dateFrom

            return matchesSearch && matchesStatus && matchesDate
        })
    }, [orders, filters])

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order)
        setViewOrderOpen(true)
    }

    const toggleRow = (orderId: number) => {
        setExpandedOrderId(prev => prev === orderId ? null : orderId)
    }

    const handleDownloadOrder = (order: Order, e: React.MouseEvent) => {
        e.stopPropagation()
        const unitName = getUnitName(order.unit)
        const commanderName = getPersonnelName(order.commander)
        const content = `Приказ ${order.orderNum}\nДата: ${order.date}\nВоинская часть: ${unitName}\nПериод: ${order.period}\nПодписал: ${commanderName}\nСтатус: ${order.status}`
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `Приказ_${order.orderNum.replace("№ ", "")}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const handleResetFilters = () => {
        setFilters({ search: "", status: "", dateFrom: "" })
    }

    const statsCards = [
        {
            title: t("orders.stats.totalOrders"),
            value: stats.total,
            subtitle: t("orders.stats.forYear"),
            icon: Icons.FileText,
            colorScheme: "blue" as const,
        },
        {
            title: t("orders.stats.active"),
            value: stats.active,
            subtitle: t("orders.stats.orders"),
            icon: Icons.Check,
            colorScheme: "green" as const,
        },
        {
            title: t("orders.stats.completed"),
            value: stats.completed,
            subtitle: t("orders.stats.orders"),
            icon: Icons.Archive,
            colorScheme: "orange" as const,
        },
        {
            title: t("orders.stats.last"),
            value: stats.lastOrder,
            subtitle: t("orders.stats.orderNumber"),
            icon: Icons.Calendar,
            colorScheme: "purple" as const,
        },
        {
            title: "Черновики",
            value: "2",
            subtitle: "В работе",
            icon: Icons.Edit,
            colorScheme: "gray" as const,
        },
        {
            title: "Срочные",
            value: "1",
            subtitle: "Требуют внимания",
            icon: Icons.AlertCircle,
            colorScheme: "red" as const,
        },
    ]

    return (
        <div className="space-y-6">
            {/* Статистика */}
            <StatsCardsGrid cards={statsCards} />

            {/* Фильтры */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("orders.filters.title")}</CardTitle>
                    <CardDescription>{t("orders.filters.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <ClassifierSelect
                            classifierId={25}
                            value={filters.status}
                            onValueChange={(value) => setFilters({ ...filters, status: value })}
                            placeholder={t("orders.filters.allStatuses")}
                        />
                        <UnitSelect
                            value={filters.search}
                            onValueChange={(value) => setFilters({ ...filters, search: value })}
                            placeholder="Поиск по в/ч"
                        />
                        <Input
                            type="date"
                            placeholder={t("orders.filters.dateFrom")}
                            value={filters.dateFrom}
                            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                        />
                        <Button variant="outline" onClick={handleResetFilters}>
                            {t("orders.filters.reset")}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Таблица */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{t("orders.table.title")}</CardTitle>
                    </div>

                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>{t("orders.table.orderNumber")} и дата приказа</TableHead>
                                <TableHead>ID плана</TableHead>
                                <TableHead>{t("orders.table.period")}</TableHead>
                                <TableHead>Комиссия</TableHead>
                                <TableHead>{t("orders.table.unit")}</TableHead>
                                <TableHead>{t("orders.table.signedBy")}</TableHead>
                                <TableHead>{t("orders.table.status")}</TableHead>
                                <TableHead className="text-right">{t("orders.table.actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => {
                                const commissionMembers = getCommissionMembersByOrderId(order.id)
                                const isExpanded = expandedOrderId === order.id

                                return (
                                    <Fragment key={order.id}>
                                        <TableRow
                                            className={cn("cursor-pointer", isExpanded ? "bg-muted/50" : "")}
                                            onClick={() => toggleRow(order.id)}
                                        >
                                            <TableCell>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                    {isExpanded ? <Icons.ChevronUp className="h-4 w-4" /> : <Icons.ChevronDown className="h-4 w-4" />}
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{order.orderNum}</span>
                                                    <span className="text-xs text-muted-foreground mt-1">{order.date}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="cursor-help">
                                                                {order.annualPlanId ? (
                                                                    <Badge variant="outline" className="gap-1">
                                                                        <Icons.Link className="h-3 w-3" />
                                                                        {getAnnualPlanById(order.annualPlanId)?.planNumber || `#${order.annualPlanId}`}
                                                                    </Badge>
                                                                ) : (
                                                                    <span className="text-muted-foreground text-sm">—</span>
                                                                )}
                                                            </div>
                                                        </TooltipTrigger>
                                                        {order.annualPlanId && (() => {
                                                            const plan = getAnnualPlanById(order.annualPlanId);
                                                            return plan ? (
                                                                <TooltipContent side="top" className="max-w-sm">
                                                                    <div className="space-y-1 text-sm">
                                                                        <p className="font-semibold">{plan.planNumber}</p>
                                                                        <p className="text-xs text-muted-foreground">Год: {plan.year}</p>
                                                                        <p className="text-xs text-muted-foreground">Утверждён: {plan.approvedBy}</p>
                                                                    </div>
                                                                </TooltipContent>
                                                            ) : null;
                                                        })()}
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            <TableCell>
                                                <SmartDeadline period={order.period} status={order.status} />
                                            </TableCell>
                                            <TableCell>
                                                <CommissionAvatarGroup members={commissionMembers} />
                                            </TableCell>
                                            <TableCell>{getUnitName(order.unit)}</TableCell>
                                            <TableCell>{getPersonnelName(order.commander)}</TableCell>
                                            <TableCell>
                                                <Badge className={order.status === "Действует"
                                                    ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px] font-black uppercase tracking-widest"
                                                    : order.status === "Завершён"
                                                        ? "bg-slate-500/15 text-slate-600 border-slate-500/30 text-[10px] font-black uppercase tracking-widest"
                                                        : "bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px] font-black uppercase tracking-widest"
                                                }>{order.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewOrder(order); }} title="Просмотр">
                                                        <Icons.Eye className="h-4 w-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()} title="Создать на основании">
                                                                <Icons.Plus className="h-4 w-4 text-green-600" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-72">
                                                            <div className="px-2 py-1.5">
                                                                <p className="text-sm font-semibold">Создать документ</p>
                                                                <p className="text-xs text-muted-foreground">На основе приказа {order.orderNum}</p>
                                                            </div>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    const params = new URLSearchParams()
                                                                    params.set("planId", order.annualPlanId?.toString() || order.id.toString())
                                                                    params.set("object", getUnitName(order.unit))
                                                                    router.push(`/planning/orders/create?${params.toString()}`)
                                                                }}
                                                                className="flex-col items-start gap-1 py-3"
                                                            >
                                                                <div className="flex items-center gap-2 w-full">
                                                                    <Icons.FileText className="h-4 w-4 text-blue-600" />
                                                                    <span className="font-medium">Приказ</span>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground pl-6">
                                                                    Создать новый приказ на проведение проверки
                                                                </p>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    const params = new URLSearchParams()
                                                                    params.set("planId", order.annualPlanId?.toString() || order.id.toString())
                                                                    params.set("object", getUnitName(order.unit))
                                                                    router.push(`/planning/orders/create-prescription?${params.toString()}`)
                                                                }}
                                                                className="flex-col items-start gap-1 py-3"
                                                            >
                                                                <div className="flex items-center gap-2 w-full">
                                                                    <Icons.Shield className="h-4 w-4 text-amber-600" />
                                                                    <span className="font-medium">Предписание</span>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground pl-6">
                                                                    Выдать предписание об устранении нарушений
                                                                </p>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    const params = new URLSearchParams()
                                                                    params.set("planId", order.annualPlanId?.toString() || order.id.toString())
                                                                    router.push(`/planning/orders/create-briefing?${params.toString()}`)
                                                                }}
                                                                className="flex-col items-start gap-1 py-3"
                                                            >
                                                                <div className="flex items-center gap-2 w-full">
                                                                    <Icons.BookOpen className="h-4 w-4 text-red-600" />
                                                                    <span className="font-medium">Инструктаж</span>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground pl-6">
                                                                    Провести инструктаж для членов комиссии
                                                                </p>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <Button variant="ghost" size="sm" onClick={(e) => handleDownloadOrder(order, e)} title="Скачать">
                                                        <Icons.Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {isExpanded && (
                                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                                <TableCell colSpan={9} className="p-4 pt-0">
                                                    <div className="pl-10">
                                                        <OrderDetails order={order} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Технический Паспорт Приказа */}
            <Dialog open={viewOrderOpen} onOpenChange={setViewOrderOpen}>
                <DialogContent className="max-w-2xl rounded-2xl border-none shadow-2xl bg-card p-0 overflow-hidden">
                    {/* Gradient Header */}
                    {selectedOrder && (
                        <>
                            <div className="relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 px-8 pt-7 pb-6 overflow-hidden">
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(ellipse at 80% 50%, #3b82f6 0%, transparent 60%)" }} />
                                <div className="absolute top-4 right-4 opacity-5">
                                    <Icons.FileText className="h-20 w-20 text-white" />
                                </div>
                                <div className="relative">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">ТЕХНИЧЕСКИЙ ПАСПОРТ</p>
                                            <h2 className="text-2xl font-black text-white tracking-tight">Приказ {selectedOrder.orderNum}</h2>
                                            <p className="text-slate-400 text-sm mt-1">{selectedOrder.date}</p>
                                        </div>
                                        <Badge className={selectedOrder.status === "Действует"
                                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-black uppercase tracking-widest"
                                            : "bg-slate-500/20 text-slate-300 border-slate-500/30 text-[10px] font-black uppercase tracking-widest"
                                        }>{selectedOrder.status}</Badge>
                                    </div>
                                    <div className="mt-4">
                                        <SmartDeadline period={selectedOrder.period} status={selectedOrder.status} />
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="px-8 py-5 space-y-1">
                                {[
                                    { label: "Воинская часть (объект)", value: getUnitName(selectedOrder.unit), icon: Icons.Landmark },
                                    { label: "Подписал", value: getPersonnelName(selectedOrder.commander), icon: Icons.User },
                                    { label: "Период проверки", value: selectedOrder.period, icon: Icons.Calendar },
                                    { label: "Состав комиссии", value: `${getCommissionMembersByOrderId(selectedOrder.id).length} чел.`, icon: Icons.Users },
                                ].map((row) => (
                                    <div key={row.label} className="grid grid-cols-2 gap-4 py-2.5 border-b border-border/30 last:border-0">
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            <row.icon className="h-3.5 w-3.5" />
                                            {row.label}
                                        </div>
                                        <span className="text-sm font-semibold text-foreground">{row.value || "—"}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Commission Members Summary */}
                            {getCommissionMembersByOrderId(selectedOrder.id).length > 0 && (
                                <div className="px-8 pb-6">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">СОСТАВ КОМИССИИ</p>
                                    <div className="space-y-2">
                                        {getCommissionMembersByOrderId(selectedOrder.id).map((m: any) => (
                                            <div key={m.id} className="flex items-center justify-between bg-muted/30 rounded-lg px-4 py-2.5">
                                                <div>
                                                    <p className="text-sm font-semibold">{getPersonnelName(m.name)}</p>
                                                    <p className="text-[10px] text-muted-foreground">{m.position}</p>
                                                </div>
                                                <Badge className={m.role === "Председатель комиссии"
                                                    ? "bg-purple-600 text-white text-[9px] font-black uppercase"
                                                    : "bg-teal-600 text-white text-[9px] font-black uppercase"
                                                }>{m.role === "Председатель комиссии" ? "ПРЕДСЕДАТЕЛЬ" : "ЧЛЕН"}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="px-8 pb-6 flex justify-end">
                                <Button variant="outline" onClick={() => setViewOrderOpen(false)}>Закрыть</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

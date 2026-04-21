"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/lib/i18n/hooks"
import type { CommissionMember } from "@/lib/types/orders"
import { ClassifierSelect } from "@/components/reference/classifier-select"
import { UnitSelect } from "@/components/reference/unit-select"
import { useI18n } from "@/lib/i18n/context"
import { toast } from "sonner"
import {
    getLocalizedDirectionName,
    getInspectionTypeLabel
} from "@/lib/utils/localization"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import type { OrdersFilters } from "@/lib/types/orders"

type RegistryType = "order" | "commission" | "prescription" | "briefing"

interface UnifiedRegistryItem {
    id: string
    type: RegistryType
    typeName: string
    title: string
    orderNum: string
    date: string
    entity: string
    period: string
    responsible: string
    status: string
    statusVariant: "default" | "secondary" | "outline" | "destructive"
    legalBasis?: string
    planId?: string
    orderId?: number | string | null
    briefingId?: number | string | null
    prescriptionId?: number | string | null
    controlObject: string
    controlObjectSubtitle?: string
    briefingStatus?: string
    briefingDate?: string | null
    prescriptionStatus?: string
    prescriptionNum?: string | null
    prescriptionDate?: string | null
    inspectionDirection?: string
    inspectionDirectionSubtitle?: string
    commissionCount?: number
    commissionMembers?: CommissionMember[]
    commissionMembersData?: string
    subordinateUnits?: Array<{ unitCode: string; unitName: string; allowanceType: string }>
    orderText?: string | null
    briefingContent?: string | null
    prescriptionRequirements?: string | null
}


export function UniversalOrdersRegistry({ initialPlans = [] }: { initialPlans?: any[] }) {
    const { t, locale } = useTranslation()
    const router = useRouter()
    const [filters, setFilters] = useState<OrdersFilters>({
        search: "",
        status: "",
        dateFrom: "",
    })
    const [showViewDoc, setShowViewDoc] = useState(false)
    const [showManageDialog, setShowManageDialog] = useState(false)
    const [managingItem, setManagingItem] = useState<UnifiedRegistryItem | null>(null)
    const [showHistory, setShowHistory] = useState(false)
    const [selectedItemForHistory, setSelectedItemForHistory] = useState<UnifiedRegistryItem | null>(null)
    const [historyLogs, setHistoryLogs] = useState<Array<{ id: number; action: string; details: string; date: string }>>([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [availableDocs, setAvailableDocs] = useState<Array<{ type: string, content: string, title: string, label?: string }>>([])
    const [activeDocType, setActiveDocType] = useState<string>("")

    // Новые стейты для работы с реальными данными
    const [kruStaff, setKruStaff] = useState<any[]>([])
    const [specSearchText, setSpecSearchText] = useState("")
    const [specSearchResults, setSpecSearchResults] = useState<any[]>([])
    const [isSearchingSpec, setIsSearchingSpec] = useState(false)

    useEffect(() => {
        const fetchKruStaff = async () => {
            try {
                const res = await fetch("/api/planning/kru-staff")
                const data = await res.json()
                if (data.users) setKruStaff(data.users)
            } catch (err) {
                console.error("Failed to fetch KRU staff:", err)
            }
        }
        fetchKruStaff()
    }, [])

    useEffect(() => {
        const searchSpec = async () => {
            if (specSearchText.length < 3) {
                setSpecSearchResults([])
                return
            }
            setIsSearchingSpec(true)
            try {
                const res = await fetch(`/api/personnel?search=${encodeURIComponent(specSearchText)}&limit=10`)
                const data = await res.json()
                if (data.items) setSpecSearchResults(data.items)
            } catch (err) {
                console.error("Search failed:", err)
            } finally {
                setIsSearchingSpec(false)
            }
        }
        const timer = setTimeout(searchSpec, 500)
        return () => clearTimeout(timer)
    }, [specSearchText])

    const [manageFormData, setManageFormData] = useState({
        orderNum: "",
        orderDate: "",
        briefingDate: "",
        prescriptionNum: "",
        prescriptionDate: "",
        groupLeader: "",
        deputyLeader: "",
        groupMembers: [] as string[],
        groupSpecialists: [] as string[]
    })

    const formatDateShort = (dateStr: any): string => {
        if (!dateStr) return "—";
        if (dateStr instanceof Date) {
            dateStr = dateStr.toISOString().split('T')[0];
        }
        if (typeof dateStr !== 'string') return String(dateStr);

        if (dateStr.includes(" - ")) {
            return dateStr.split(" - ").map(part => formatDateShort(part)).join(" - ");
        }

        if (dateStr.includes("-") && dateStr.length === 10 && dateStr.indexOf("-") === 4) {
            const [year, month, day] = dateStr.split("-");
            return `${day}.${month}.${year.substring(2)}`;
        }

        if (dateStr.includes(".") && dateStr.length === 10) {
            const [day, month, year] = dateStr.split(".");
            return `${day}.${month}.${year.substring(2)}`;
        }
        return dateStr;
    };

    const getLocalizedName = (obj: any, locale: any): string => {
        if (!obj?.name) return ""
        if (typeof obj.name === 'string') return obj.name
        if (locale === "uzLatn") return obj.name.uz || obj.name.ru
        if (locale === "uzCyrl") return obj.name.uzk || obj.name.ru
        return obj.name.ru || obj.name.uz
    }

    const allData = useMemo(() => {
        const items: UnifiedRegistryItem[] = []

        if (initialPlans && initialPlans.length > 0) {
            initialPlans.forEach((p, index) => {
                const latestOrder = p.orders && p.orders.length > 0 ? p.orders[0] : null;
                const latestBriefing = p.briefings && p.briefings.length > 0 ? p.briefings[0] : null;
                const latestPrescription = p.prescriptions && p.prescriptions.length > 0 ? p.prescriptions[0] : null;

                items.push({
                    id: `plan-${p.planId}`,
                    type: "order",
                    typeName: t("orders.tabs.orders"),
                    title: p.planNumber || `План #${p.planId}`,
                    orderNum: latestOrder?.order_number || latestOrder?.orderNum || "—",
                    date: latestOrder?.order_date ? new Date(latestOrder.order_date).toISOString().split('T')[0] : latestOrder?.orderDate ? new Date(latestOrder.orderDate).toISOString().split('T')[0] : "—",
                    entity: p.unit ? getLocalizedName(p.unit, locale) : (p.controlObject || "—"),
                    period: p.periodCoveredStart && p.periodCoveredEnd
                        ? `${new Date(p.periodCoveredStart).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ')} - ${new Date(p.periodCoveredEnd).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ')}`
                        : "—",
                    responsible: JSON.stringify({
                        name: p.responsible?.fullname || p.responsible?.full_name || "Не назначен",
                        position: p.responsible?.rank || "—"
                    }),
                    status: p.status === "approved" ? "Действует" : p.status === "draft" ? "Черновик" : p.status,
                    statusVariant: p.status === "approved" ? "default" : "secondary",
                    planId: String(p.planId || index + 1),
                    controlObject: p.unit ? getLocalizedName(p.unit, locale) : (p.controlObject || "—"),
                    controlObjectSubtitle: p.unit?.ref_military_districts?.short_name
                        ? (typeof p.unit.ref_military_districts.short_name === 'string' ? p.unit.ref_military_districts.short_name : p.unit.ref_military_districts.short_name.ru)
                        : "",
                    inspectionDirection: getLocalizedDirectionName(p.inspectionDirection, locale as any),
                    inspectionDirectionSubtitle: getInspectionTypeLabel(p.inspectionType, locale as any),
                    commissionCount: latestOrder?.commission_members?.length || 0,
                    commissionMembers: latestOrder?.commission_members?.map((m: any) => ({
                        id: m.user_id || m.userId,
                        personnelId: m.personnel_id || m.personnelId,
                        name: m.users?.fullname || m.fullname || (m.personnel?.ref_physical_persons ? `${m.personnel.ref_physical_persons.last_name} ${m.personnel.ref_physical_persons.first_name}` : "—"),
                        rank: m.users?.rank || m.rank || (m.personnel?.ref_ranks?.name?.ru || "—"),
                        role: m.role || ""
                    })) || [],
                    briefingStatus: latestBriefing ? "Проведен" : "Не проведен",
                    briefingDate: latestBriefing?.instruction_date || latestBriefing?.date || latestBriefing?.created_at || null,
                    briefingContent: latestBriefing?.content || null,
                    briefingId: latestBriefing?.id || null,
                    prescriptionNum: latestPrescription?.prescription_num || latestPrescription?.prescriptionNum || null,
                    prescriptionDate: latestPrescription?.date || latestPrescription?.issueDate || null,
                    prescriptionRequirements: latestPrescription?.requirements || null,
                    prescriptionId: latestPrescription?.id || null,
                    orderText: latestOrder?.order_text || null,
                    orderId: latestOrder?.id || null,
                    commissionMembersData: latestOrder?.commission_members?.map((m: any) => {
                        const rank = m.users?.rank || ""
                        const name = m.users?.fullname || m.memberId
                        const role = m.role ? `(${m.role})` : ""
                        return `${rank} ${name} ${role}`.trim()
                    }).join(", ") || "",
                })
            })
        }

        return items
    }, [t, initialPlans, locale])

    const handleOpenManage = (item: UnifiedRegistryItem) => {
        setManagingItem(item);

        const leader = item.commissionMembers?.find(m => m.role === "Главный ревизор")?.id?.toString() || ""
        const members = item.commissionMembers
            ?.filter(m => m.role === "Ревизор")
            .map(m => m.id?.toString())
            .filter(Boolean) as string[] || []
        const specialists = item.commissionMembers
            ?.filter(m => m.role === "Привлечённый специалист")
            .map(m => (m.personnelId || m.id)?.toString())
            .filter(Boolean) as string[] || []

        setManageFormData({
            orderNum: item.orderNum !== "—" ? item.orderNum : "",
            orderDate: item.date !== "—" ? item.date : "",
            briefingDate: item.briefingDate ? new Date(item.briefingDate).toISOString().split('T')[0] : "",
            prescriptionNum: item.prescriptionNum || "",
            prescriptionDate: item.prescriptionDate ? new Date(item.prescriptionDate).toISOString().split('T')[0] : "",
            groupLeader: leader,
            deputyLeader: "",
            groupMembers: members,
            groupSpecialists: specialists
        });
        setShowManageDialog(true);
    };

    const handleViewHistory = async (item: UnifiedRegistryItem) => {
        setSelectedItemForHistory(item)
        setShowHistory(true)
        setHistoryLoading(true)
        try {
            const res = await fetch(`/api/planning/annual-plans/history?planId=${item.planId || item.id}`)
            const data = await res.json()
            setHistoryLogs(Array.isArray(data) ? data : [])
        } catch {
            setHistoryLogs([])
        } finally {
            setHistoryLoading(false)
        }
    }

    const handleSaveManagement = async () => {
        if (!managingItem) return;

        try {
            const payload = {
                planId: managingItem.planId,
                lang: locale,
                orderNumber: manageFormData.orderNum,
                orderDate: manageFormData.orderDate,
                briefingDate: manageFormData.briefingDate,
                prescriptionNumber: manageFormData.prescriptionNum,
                prescriptionDate: manageFormData.prescriptionDate,
                commission: [
                    ...(manageFormData.groupLeader ? [{ userId: manageFormData.groupLeader, role: "Главный ревизор" }] : []),
                    ...manageFormData.groupMembers.map(id => ({ userId: id, role: "Ревизор" })),
                    ...manageFormData.groupSpecialists.map(id => ({ personnelId: id, role: "Привлечённый специалист" }))
                ]
            };

            const res = await fetch("/api/planning/orders/manage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to save changes");
            }

            toast.success("Данные успешно сохранены")
            setShowManageDialog(false);
            router.refresh()
        } catch (err: any) {
            console.error("HandleSaveManagement Error:", err);
            toast.error(`Ошибка при сохранении: ${err.message}`);
        }
    };

    const handleViewDocument = (item: UnifiedRegistryItem) => {
        const docs = []
        if (item.orderText) docs.push({ type: "order", label: "Приказ", content: item.orderText, title: item.orderNum })
        if (item.briefingContent) docs.push({ type: "briefing", label: "Инструктаж", content: item.briefingContent, title: `Инструктаж по ${item.title}` })
        if (item.prescriptionRequirements) docs.push({ type: "prescription", label: "Предписание", content: item.prescriptionRequirements, title: item.prescriptionNum || "Предписание" })

        if (docs.length === 0) {
            toast.info("Для данной записи нет изданных документов.")
            return
        }

        const mappedDocs = docs.map(d => ({ type: d.type, content: d.content, title: d.title, label: d.label }))
        setAvailableDocs(mappedDocs)
        setActiveDocType(mappedDocs[0].type)
        setShowViewDoc(true)
    }

    const filteredData = useMemo(() => {
        return allData.filter(item => {
            const searchLower = filters.search.toLowerCase()
            const matchesSearch = item.orderNum.toLowerCase().includes(searchLower) ||
                item.entity.toLowerCase().includes(searchLower) ||
                item.responsible.toLowerCase().includes(searchLower)

            const matchesStatus = !filters.status || item.status === filters.status
            const matchesDate = !filters.dateFrom || item.date >= filters.dateFrom

            return matchesSearch && matchesStatus && matchesDate
        })
    }, [allData, filters])

    return (
        <div className="space-y-6">
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
                        <Button variant="outline" onClick={() => setFilters({ search: "", status: "", dateFrom: "" })}>
                            {t("orders.filters.reset")}
                        </Button>
                    </div>
                </CardContent>
            </Card>

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
                                <TableHead className="w-[50px]">{t("orders.table.id")}</TableHead>
                                <TableHead className="w-[100px]">ИД плана</TableHead>
                                <TableHead className="w-[200px]">Объект контроля</TableHead>
                                <TableHead className="w-[180px]">Направление проверки</TableHead>
                                <TableHead className="w-[150px]">{t("orders.table.period")}</TableHead>
                                <TableHead className="w-[180px]">Номер и дата приказа</TableHead>
                                <TableHead className="w-[120px]">Инструктаж</TableHead>
                                <TableHead className="w-[160px]">Предписание</TableHead>
                                <TableHead className="w-[120px]">{t("orders.table.status")}</TableHead>
                                <TableHead className="w-[50px]">{t("orders.table.actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell><Badge variant="outline">{item.planId}</Badge></TableCell>
                                    <TableCell>{item.controlObject}</TableCell>
                                    <TableCell>{item.inspectionDirection}</TableCell>
                                    <TableCell>{formatDateShort(item.period)}</TableCell>
                                    <TableCell>{item.orderNum} ({formatDateShort(item.date)})</TableCell>
                                    <TableCell>{item.briefingDate ? formatDateShort(item.briefingDate) : "—"}</TableCell>
                                    <TableCell>{item.prescriptionNum ? `${item.prescriptionNum} (${formatDateShort(item.prescriptionDate)})` : "—"}</TableCell>
                                    <TableCell><Badge variant={item.statusVariant}>{item.status}</Badge></TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenManage(item)}>
                                                <Icons.Plus className="h-4 w-4 text-green-600" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleViewDocument(item)}>
                                                <Icons.FileText className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleViewHistory(item)}>
                                                <Icons.Clock className="h-4 w-4 text-slate-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Unified Management Dialog */}
            <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
                <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Управление данными: {managingItem?.controlObject}</DialogTitle>
                        <DialogDescription>
                            Заполните реквизиты документов и назначьте ревизоров
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4 border-b pb-4">
                            <div className="space-y-2">
                                <Label className="text-blue-600 font-bold">Приказ №</Label>
                                <Input value={manageFormData.orderNum} onChange={e => setManageFormData({ ...manageFormData, orderNum: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-blue-600 font-bold">Дата приказа</Label>
                                <Input type="date" value={manageFormData.orderDate} onChange={e => setManageFormData({ ...manageFormData, orderDate: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-b pb-4">
                            <div className="space-y-2">
                                <Label className="text-green-600 font-bold">Инструктаж (дата)</Label>
                                <Input type="date" value={manageFormData.briefingDate} onChange={e => setManageFormData({ ...manageFormData, briefingDate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-amber-600 font-bold">Предписание №</Label>
                                <Input value={manageFormData.prescriptionNum} onChange={e => setManageFormData({ ...manageFormData, prescriptionNum: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-amber-600 font-bold">Дата предписания</Label>
                                <Input type="date" value={manageFormData.prescriptionDate} onChange={e => setManageFormData({ ...manageFormData, prescriptionDate: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 border-b pb-1 uppercase italic">Назначенные ревизоры</h3>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-blue-800">Главный ревизор (сотрудник КРУ)</Label>
                                <Select value={manageFormData.groupLeader} onValueChange={val => setManageFormData({ ...manageFormData, groupLeader: val })}>
                                    <SelectTrigger className="bg-white"><SelectValue placeholder="Выберите главного ревизора" /></SelectTrigger>
                                    <SelectContent>
                                        {kruStaff.map(s => <SelectItem key={s.user_id} value={s.user_id.toString()}>{s.rank} {s.fullname}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-blue-800">Ревизоры (сотрудники КРУ)</Label>
                                <ScrollArea className="h-[120px] border rounded-md p-2 bg-slate-50">
                                    <div className="grid grid-cols-2 gap-2">
                                        {kruStaff.map(s => (
                                            <div key={s.user_id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`m-${s.user_id}`}
                                                    checked={manageFormData.groupMembers.includes(s.user_id.toString())}
                                                    onCheckedChange={checked => {
                                                        const m = checked ? [...manageFormData.groupMembers, s.user_id.toString()] : manageFormData.groupMembers.filter(id => id !== s.user_id.toString())
                                                        setManageFormData({ ...manageFormData, groupMembers: m })
                                                    }}
                                                />
                                                <Label htmlFor={`m-${s.user_id}`} className="text-[10px] cursor-pointer">{s.rank} {s.fullname}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-dashed">
                                <Label className="text-xs font-bold text-teal-700">Поиск специалистов (ПИНФЛ/Фамилия)</Label>
                                <div className="relative">
                                    <Input placeholder="Поиск..." value={specSearchText} onChange={e => setSpecSearchText(e.target.value)} className="bg-teal-50/20" />
                                    {isSearchingSpec && <Icons.Loader2 className="absolute right-2 top-2 h-4 w-4 animate-spin text-teal-600" />}

                                    {specSearchResults.length > 0 && (
                                        <div className="absolute z-50 w-full mt-1 border rounded shadow-lg bg-white max-h-[150px] overflow-auto">
                                            {specSearchResults.map(p => (
                                                <div key={p.id} className="p-2 hover:bg-teal-50 cursor-pointer text-xs border-b flex justify-between items-center" onClick={() => {
                                                    if (!manageFormData.groupSpecialists.includes(p.id.toString())) {
                                                        setManageFormData({ ...manageFormData, groupSpecialists: [...manageFormData.groupSpecialists, p.id.toString()] })
                                                    }
                                                    setSpecSearchText(""); setSpecSearchResults([])
                                                }}>
                                                    <span>{p.rank} {p.fullName}</span>
                                                    <Badge variant="outline" className="text-[9px]">Выбрать</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {manageFormData.groupSpecialists.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {manageFormData.groupSpecialists.map(id => (
                                            <Badge key={id} variant="secondary" className="text-[9px] bg-teal-50 text-teal-900 border-teal-200">
                                                ID: {id}
                                                <Icons.X className="h-2 w-2 ml-1 cursor-pointer" onClick={() => setManageFormData({ ...manageFormData, groupSpecialists: manageFormData.groupSpecialists.filter(i => i !== id) })} />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setShowManageDialog(false)}>Отмена</Button>
                        <Button onClick={handleSaveManagement} className="bg-blue-600 hover:bg-blue-700">Сохранить</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Document View Dialog */}
            <Dialog open={showViewDoc} onOpenChange={setShowViewDoc}>
                <DialogContent className="max-w-[1000px] h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Просмотр документа</DialogTitle>
                    </DialogHeader>
                    {availableDocs.length > 1 && (
                        <div className="flex gap-2 mb-4">
                            {availableDocs.map(d => (
                                <Button key={d.type} variant={activeDocType === d.type ? "default" : "outline"} size="sm" onClick={() => setActiveDocType(d.type)}>
                                    {d.label}
                                </Button>
                            ))}
                        </div>
                    )}
                    <div className="p-8 border rounded-md font-serif text-lg bg-white shadow-inner whitespace-pre-wrap">
                        {availableDocs.find(d => d.type === activeDocType)?.content || "Текст отсутствует"}
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => window.print()}><Icons.Printer className="mr-2 h-4 w-4" />Печать</Button>
                        <Button onClick={() => setShowViewDoc(false)}>Закрыть</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* History Dialog */}
            <Dialog open={showHistory} onOpenChange={setShowHistory}>
                <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>История изменений: {selectedItemForHistory?.controlObject}</DialogTitle>
                    </DialogHeader>
                    {historyLoading ? (
                        <div className="flex items-center justify-center py-8 text-slate-500">Загрузка...</div>
                    ) : historyLogs.length === 0 ? (
                        <div className="flex items-center justify-center py-8 text-slate-400">Нет записей об изменениях</div>
                    ) : (
                        <div className="space-y-2">
                            {historyLogs.map(log => (
                                <div key={log.id} className="border rounded-md p-3 text-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <Badge variant="outline">{log.action}</Badge>
                                        <span className="text-xs text-slate-500">{log.date ? new Date(log.date).toLocaleString("ru-RU") : "—"}</span>
                                    </div>
                                    <p className="text-slate-700">{log.details}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={() => setShowHistory(false)}>Закрыть</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

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
    DialogFooter,
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
    getInspectionTypeLabel,
    getStatusLabel
} from "@/lib/utils/localization"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
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

    const [currentStep, setCurrentStep] = useState(1)
    const totalSteps = 3
    
    const nextStep = () => {
        if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
    }
    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

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
            initialPlans.forEach((p: any, index: number) => {
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
                    status: getStatusLabel(p.status, locale as any),
                    statusVariant: p.status === "approved" || p.status === "101" ? "default" : "secondary",
                    planId: String(p.planId || index + 1),
                    controlObject: p.unit ? getLocalizedName(p.unit, locale) : (p.controlObject || "—"),
                    controlObjectSubtitle: p.unit?.ref_military_districts?.short_name
                        ? (typeof p.unit.ref_military_districts.short_name === 'string' ? p.unit.ref_military_districts.short_name : p.unit.ref_military_districts.short_name.ru)
                        : "",
                    inspectionDirection: getLocalizedDirectionName(p.inspectionDirectionId || p.inspectionDirection, locale as any),
                    inspectionDirectionSubtitle: getInspectionTypeLabel(p.inspectionTypeId || p.inspectionType, locale as any),
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

        const leader = item.commissionMembers?.find(m => m.role === "Председатель комиссии")?.id?.toString() || ""
        const members = item.commissionMembers
            ?.filter(m => m.role === "Член комиссии")
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
                    ...(manageFormData.groupLeader ? [{ userId: manageFormData.groupLeader, role: "Председатель комиссии" }] : []),
                    ...manageFormData.groupMembers.map(id => ({ userId: id, role: "Член комиссии" })),
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

        const mappedDocs = docs.map((d: any) => ({ type: d.type, content: d.content, title: d.title, label: d.label }))
        setAvailableDocs(mappedDocs)
        setActiveDocType(mappedDocs[0].type)
        setShowViewDoc(true)
    }

    const filteredData = useMemo(() => {
        return allData.filter((item: UnifiedRegistryItem) => {
            const searchLower = filters.search.toLowerCase()
            const matchesCommission = item.commissionMembers?.some((m: CommissionMember) => 
                m.name.toLowerCase().includes(searchLower)
            ) || false
            
            const matchesSearch = item.orderNum.toLowerCase().includes(searchLower) ||
                item.entity.toLowerCase().includes(searchLower) ||
                item.responsible.toLowerCase().includes(searchLower) ||
                matchesCommission

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
                                <TableHead className="w-12.5">{t("orders.table.id")}</TableHead>
                                <TableHead className="w-20">ИД плана</TableHead>
                                <TableHead className="w-45">Объект контроля</TableHead>
                                <TableHead className="w-37.5">Направление</TableHead>
                                <TableHead className="w-25">Тип</TableHead>
                                <TableHead className="w-45">Состав комиссии</TableHead>
                                <TableHead className="w-37.5">Номер и дата приказа</TableHead>
                                <TableHead className="w-25">Инструктаж</TableHead>
                                <TableHead className="w-37.5">Предписание</TableHead>
                                <TableHead className="w-25">{t("orders.table.status")}</TableHead>
                                <TableHead className="w-12.5">{t("orders.table.actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((item, index) => (
                                <TableRow key={item.id} className="text-[11px]">
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell><Badge variant="outline" className="font-mono">{item.planId}</Badge></TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{item.controlObject}</span>
                                            <span className="text-[9px] text-muted-foreground">{item.controlObjectSubtitle}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.inspectionDirection}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="text-[9px] whitespace-nowrap">
                                            {item.inspectionDirectionSubtitle || "—"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-50">
                                            {item.commissionMembers && item.commissionMembers.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {item.commissionMembers.slice(0, 3).map((m, i) => (
                                                        <Badge key={i} variant="outline" className="text-[9px] bg-slate-50">
                                                            {m.name.split(' ').map((n, idx) => idx === 0 ? n : n[0] + '.').join(' ')}
                                                        </Badge>
                                                    ))}
                                                    {item.commissionMembers.length > 3 && (
                                                        <Badge variant="outline" className="text-[9px] bg-blue-50 text-blue-700">
                                                            +{item.commissionMembers.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">Не назначена</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item.orderNum !== "—" ? (
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.orderNum}</span>
                                                <span className="text-[9px] text-muted-foreground">{formatDateShort(item.date)}</span>
                                            </div>
                                        ) : "—"}
                                    </TableCell>
                                    <TableCell>{item.briefingDate ? formatDateShort(item.briefingDate) : "—"}</TableCell>
                                    <TableCell>
                                        {item.prescriptionNum ? (
                                            <div className="flex flex-col">
                                                <span className="font-medium text-amber-700">{item.prescriptionNum}</span>
                                                <span className="text-[9px] text-muted-foreground">{formatDateShort(item.prescriptionDate)}</span>
                                            </div>
                                        ) : "—"}
                                    </TableCell>
                                    <TableCell><Badge variant={item.statusVariant} className="text-[9px]">{item.status}</Badge></TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="sm" onClick={() => handleOpenManage(item)} className="h-7 w-7 p-0">
                                                            <Icons.Plus className="h-4 w-4 text-green-600" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Управление данными</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <Button variant="ghost" size="sm" onClick={() => handleViewDocument(item)} className="h-7 w-7 p-0">
                                                <Icons.FileText className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Unified Management Dialog - Stepper Implementation */}
            <Dialog open={showManageDialog} onOpenChange={(open) => {
                setShowManageDialog(open)
                if (open) setCurrentStep(1)
            }}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
                    <DialogHeader className="p-6 bg-linear-to-r from-blue-600/10 to-indigo-600/10 border-b relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                                <Icons.Settings className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold tracking-tight">
                                    {t("orders.manage.title") || "Управление данными"}
                                </DialogTitle>
                                <DialogDescription className="text-blue-600/70 font-medium">
                                    {managingItem?.controlObject}
                                </DialogDescription>
                            </div>
                        </div>

                        {/* Visual Stepper */}
                        <div className="flex items-center justify-between gap-2 px-2 pt-2">
                            {[
                                { id: 1, label: locale === "ru" ? "Приказ" : "Buyruq", icon: Icons.FileText },
                                { id: 2, label: locale === "ru" ? "Исполнение" : "Ijro", icon: Icons.Zap },
                                { id: 3, label: locale === "ru" ? "Комиссия" : "Komissiya", icon: Icons.Users }
                            ].map((step, idx) => (
                                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                                    <div className="flex flex-col items-center gap-1.5 relative z-10">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                                            currentStep === step.id ? "bg-blue-600 text-white ring-4 ring-blue-600/20 scale-110" :
                                            currentStep > step.id ? "bg-green-500 text-white" : "bg-muted text-muted-foreground border-2"
                                        )}>
                                            {currentStep > step.id ? <Icons.Check className="w-4 h-4" /> : step.id}
                                        </div>
                                        <span className={cn(
                                            "text-[9px] uppercase tracking-wider font-bold",
                                            currentStep === step.id ? "text-blue-600" : "text-muted-foreground"
                                        )}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {idx < 2 && (
                                        <div className={cn(
                                            "h-0.5 flex-1 mx-2 -mt-4 transition-colors duration-500",
                                            currentStep > step.id ? "bg-green-500" : "bg-muted"
                                        )} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-8 py-8 bg-background/50 backdrop-blur-sm">
                        <div className="min-h-75">
                            {/* Step 1: Official Order */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                                        <Icons.Info className="h-5 w-5 text-blue-600" />
                                        <p className="text-xs text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
                                            Укажите номер и дату официального приказа, на основании которого проводится данное мероприятие.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-foreground/80">Номер приказа</Label>
                                            <Input 
                                                className="h-12 text-lg font-mono border-2 focus-visible:ring-blue-500"
                                                placeholder="Например: Пр-123"
                                                value={manageFormData.orderNum} 
                                                onChange={e => setManageFormData({ ...manageFormData, orderNum: e.target.value })} 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-foreground/80">Дата издания приказа</Label>
                                            <Input 
                                                type="date" 
                                                className="h-12 border-2 focus-visible:ring-blue-500"
                                                value={manageFormData.orderDate} 
                                                onChange={e => setManageFormData({ ...manageFormData, orderDate: e.target.value })} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Execution & Basis */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="p-6 bg-green-50/50 dark:bg-green-900/10 rounded-2xl border-2 border-dashed border-green-200 dark:border-green-800 space-y-3">
                                            <div className="flex items-center gap-2 text-green-700">
                                                <Icons.ShieldCheck className="h-5 w-5" />
                                                <Label className="font-bold">Инструктаж по безопасности</Label>
                                            </div>
                                            <Input 
                                                type="date" 
                                                className="bg-white dark:bg-slate-900 border-green-200 focus-visible:ring-green-500 h-11"
                                                value={manageFormData.briefingDate} 
                                                onChange={e => setManageFormData({ ...manageFormData, briefingDate: e.target.value })} 
                                            />
                                        </div>

                                        <div className="p-6 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border-2 border-dashed border-amber-200 dark:border-amber-800 space-y-4">
                                            <div className="flex items-center gap-2 text-amber-700">
                                                <Icons.Lock className="h-5 w-5" />
                                                <Label className="font-bold">Данные предписания</Label>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-amber-700/70">Номер</Label>
                                                    <Input 
                                                        className="bg-white dark:bg-slate-900 border-amber-200 focus-visible:ring-amber-500"
                                                        placeholder="№..."
                                                        value={manageFormData.prescriptionNum} 
                                                        onChange={e => setManageFormData({ ...manageFormData, prescriptionNum: e.target.value })} 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-amber-700/70">Дата</Label>
                                                    <Input 
                                                        type="date" 
                                                        className="bg-white dark:bg-slate-900 border-amber-200 focus-visible:ring-amber-500"
                                                        value={manageFormData.prescriptionDate} 
                                                        onChange={e => setManageFormData({ ...manageFormData, prescriptionDate: e.target.value })} 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Commission members */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-purple-700 dark:text-purple-400">Главный ревизор</Label>
                                            <Select value={manageFormData.groupLeader} onValueChange={val => setManageFormData({ ...manageFormData, groupLeader: val })}>
                                                <SelectTrigger className="h-11 border-2 border-purple-200/50">
                                                    <SelectValue placeholder="Выберите главного ревизора" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {kruStaff.map((s: any) => (
                                                        <SelectItem key={s.user_id} value={s.user_id.toString()}>
                                                            {s.rank} {s.fullname}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-purple-700 dark:text-purple-400 uppercase tracking-widest text-[10px]">Участники комиссии</Label>
                                            <ScrollArea className="h-40 border-2 rounded-2xl p-4 bg-background/50 border-purple-100 dark:border-purple-900/50">
                                                <div className="grid grid-cols-2 gap-3">
                                                    {kruStaff.map((s: any) => (
                                                        <div key={s.user_id} className="flex items-center space-x-3 p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors border border-transparent hover:border-purple-200/50">
                                                            <Checkbox
                                                                id={`m-${s.user_id}`}
                                                                className="h-5 w-5 border-2 border-purple-300 text-purple-600"
                                                                checked={manageFormData.groupMembers.includes(s.user_id.toString())}
                                                                onCheckedChange={(checked: boolean) => {
                                                                    const m = checked ? [...manageFormData.groupMembers, s.user_id.toString()] : manageFormData.groupMembers.filter((id: string) => id !== s.user_id.toString())
                                                                    setManageFormData({ ...manageFormData, groupMembers: m })
                                                                }}
                                                            />
                                                            <Label htmlFor={`m-${s.user_id}`} className="text-xs cursor-pointer font-medium">
                                                                {s.rank} {s.fullname}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>

                                        <div className="pt-2">
                                            <Label className="text-sm font-bold text-teal-700 dark:text-teal-400">Внешние специалисты</Label>
                                            <div className="mt-2 relative">
                                                <Input 
                                                    placeholder="Поиск по ФИО или ПИНФЛ..." 
                                                    value={specSearchText} 
                                                    onChange={e => setSpecSearchText(e.target.value)} 
                                                    className="h-11 pl-10 border-2 border-teal-100" 
                                                />
                                                <Icons.Search className="absolute left-3.5 top-3.5 h-4 w-4 text-teal-500/50" />
                                                {isSearchingSpec && <Icons.Loader2 className="absolute right-3.5 top-3.5 h-4 w-4 animate-spin text-teal-600" />}

                                                {specSearchResults.length > 0 && (
                                                    <div className="absolute z-50 w-full mt-2 border rounded-2xl shadow-2xl bg-background max-h-48 overflow-auto animate-in fade-in zoom-in-95 duration-200">
                                                        {specSearchResults.map((p: any) => (
                                                            <div key={p.id} className="p-3 hover:bg-teal-50 dark:hover:bg-teal-900/20 cursor-pointer text-xs border-b last:border-0 flex justify-between items-center transition-colors" onClick={() => {
                                                                if (!manageFormData.groupSpecialists.includes(p.id.toString())) {
                                                                    setManageFormData({ ...manageFormData, groupSpecialists: [...manageFormData.groupSpecialists, p.id.toString()] })
                                                                }
                                                                setSpecSearchText(""); setSpecSearchResults([])
                                                            }}>
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold">{p.rank} {p.fullName}</span>
                                                                    <span className="text-[10px] text-muted-foreground">{p.pinfl}</span>
                                                                </div>
                                                                <Badge variant="outline" className="bg-teal-500 text-white border-none">Выбрать</Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {manageFormData.groupSpecialists.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {manageFormData.groupSpecialists.map(id => (
                                                        <Badge key={id} className="bg-teal-600/10 text-teal-700 border-teal-200 px-3 py-1.5 rounded-full flex items-center gap-2">
                                                            ID: {id}
                                                            <Icons.X className="h-3.5 w-3.5 cursor-pointer hover:text-red-500 transition-colors" onClick={() => setManageFormData({ ...manageFormData, groupSpecialists: manageFormData.groupSpecialists.filter(i => i !== id) })} />
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-muted/30 border-t flex items-center justify-between gap-3 shrink-0">
                        <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest px-6" onClick={() => {
                            if (currentStep === 1) setShowManageDialog(false)
                            else prevStep()
                        }}>
                            {currentStep === 1 ? (t("common.cancel") || "Отмена") : (t("common.back") || "Назад")}
                        </Button>
                        
                        <div className="flex gap-3">
                            {currentStep < totalSteps ? (
                                <Button 
                                    onClick={nextStep} 
                                    className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 px-8 font-bold text-xs uppercase tracking-widest"
                                >
                                    {t("common.next") || "Далее"}
                                    <Icons.ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleSaveManagement} 
                                    className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 px-8 font-bold text-xs uppercase tracking-widest"
                                >
                                    <Icons.Save className="mr-2 h-4 w-4" />
                                    {t("common.save") || "Сохранить"}
                                </Button>
                            )}
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Document View Dialog - Modernized */}
            <Dialog open={showViewDoc} onOpenChange={setShowViewDoc}>
                <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-slate-900 text-white border-b shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Icons.FileText className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold">Просмотр документа</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Официальный сформированный документ
                                    </DialogDescription>
                                </div>
                            </div>
                            {availableDocs.length > 1 && (
                                <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                                    {availableDocs.map(d => (
                                        <Button 
                                            key={d.type} 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setActiveDocType(d.type)}
                                            className={cn(
                                                "h-8 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-all",
                                                activeDocType === d.type ? "bg-white text-slate-900 shadow-lg" : "text-slate-400 hover:text-white"
                                            )}
                                        >
                                            {d.label}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-12 bg-slate-100 dark:bg-slate-950 flex justify-center">
                        <div className="w-full max-w-[210mm] bg-white dark:bg-slate-900 shadow-2xl rounded-sm p-[20mm] min-h-full font-serif text-[14pt] leading-relaxed relative border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-500">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
                            <div className="whitespace-pre-wrap selection:bg-blue-100 dark:selection:bg-blue-900">
                                {availableDocs.find(d => d.type === activeDocType)?.content || "Текст отсутствует"}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t flex items-center justify-between gap-4 shrink-0">
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest px-4">
                            Документ сгенерирован автоматически АИС КРР
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="h-9 px-4 font-bold text-xs uppercase tracking-wider" onClick={() => window.print()}>
                                <Icons.Printer className="mr-2 h-4 w-4" />
                                Печать
                            </Button>
                            <Button className="h-9 px-6 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 font-bold text-xs uppercase tracking-wider" onClick={() => setShowViewDoc(false)}>
                                Закрыть
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* History Dialog - Modernized */}
            <Dialog open={showHistory} onOpenChange={setShowHistory}>
                <DialogContent className="max-w-xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-muted/50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border">
                                <Icons.History className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold">История изменений</DialogTitle>
                                <DialogDescription className="text-xs">
                                    {selectedItemForHistory?.controlObject}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-y-auto px-8 py-8">
                        {historyLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <Icons.Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Загрузка данных...</span>
                            </div>
                        ) : historyLogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                                <Icons.Inbox className="h-10 w-10 opacity-20" />
                                <span className="text-sm italic">История изменений пуста</span>
                            </div>
                        ) : (
                            <div className="relative space-y-6 before:absolute before:left-2.75 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-muted">
                                {historyLogs.map((log, idx) => (
                                    <div key={log.id} className="relative pl-10 group animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-background bg-blue-600 shadow-sm z-10 transition-transform group-hover:scale-110" />
                                        <div className="p-4 bg-muted/30 hover:bg-muted/50 rounded-2xl border border-transparent hover:border-muted-foreground/10 transition-all">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant="outline" className="text-[9px] uppercase tracking-tighter bg-background font-bold text-blue-600">
                                                    {log.action}
                                                </Badge>
                                                <time className="text-[10px] text-muted-foreground font-mono">
                                                    {log.date ? new Date(log.date).toLocaleString("ru-RU", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "—"}
                                                </time>
                                            </div>
                                            <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                                                {log.details}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-4 bg-muted/30 border-t">
                        <Button variant="ghost" className="w-full font-bold text-xs uppercase tracking-widest h-10" onClick={() => setShowHistory(false)}>
                            Закрыть
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { 
    Building2, 
    MapPin, 
    Tag, 
    ShieldAlert, 
    CircleDot, 
    FileText, 
    Calendar, 
    Users, 
    Zap, 
    CheckCircle2, 
    UserCheck,
    ClipboardCheck,
    Gavel,
    History as HistoryIcon,
    Plus,
    Search,
    Trash2,
    Eye
} from "lucide-react"
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
import { motion } from "framer-motion"

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
}


export function UniversalOrdersRegistry({ initialPlans = [] }: { initialPlans?: any[] }) {
    const { t, locale } = useTranslation()
    const router = useRouter()
    const [filters, setFilters] = useState<OrdersFilters>({
        search: "",
        status: "",
        dateFrom: "",
    })
    const [showManageDialog, setShowManageDialog] = useState(false)
    const [managingItem, setManagingItem] = useState<UnifiedRegistryItem | null>(null)
    const [showHistory, setShowHistory] = useState(false)
    const [selectedItemForHistory, setSelectedItemForHistory] = useState<UnifiedRegistryItem | null>(null)
    const [historyLogs, setHistoryLogs] = useState<Array<{ id: number; action: string; details: string; date: string }>>([])
    const [historyLoading, setHistoryLoading] = useState(false)

    // Новые стейты для работы с реальными данными
    // Search states for Step 3
    const [specSearchText, setSpecSearchText] = useState("")
    const [chairmanSearchText, setChairmanSearchText] = useState("")
    const [memberSearchText, setMemberSearchText] = useState("")
    
    const [specSearchResults, setSpecSearchResults] = useState<any[]>([])
    const [chairmanSearchResults, setChairmanSearchResults] = useState<any[]>([])
    const [memberSearchResults, setMemberSearchResults] = useState<any[]>([])
    
    const [isSearchingSpec, setIsSearchingSpec] = useState(false)
    const [isSearchingChairman, setIsSearchingChairman] = useState(false)
    const [isSearchingMember, setIsSearchingMember] = useState(false)

    // Personnel cache (id -> object)
    const [personnelObjects, setPersonnelObjects] = useState<Record<string, any>>({})
    
    // Busy status (id -> { busy, where })
    const [busyPersonnel, setBusyPersonnel] = useState<Record<string, { busy: boolean; where: string }>>({})
    const [isCheckingConflicts, setIsCheckingConflicts] = useState(false)

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
    const [isSaving, setIsSaving] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const totalSteps = 3

    // Cache helper
    const cachePersonnel = (items: any[]) => {
        setPersonnelObjects(prev => {
            const next = { ...prev }
            items.forEach(i => { next[i.id.toString()] = i })
            return next
        })
    }

    const isMounted = useRef(true)
    useEffect(() => {
        isMounted.current = true
        return () => { isMounted.current = false }
    }, [])

    // Unified Search Effect
    useEffect(() => {
        const search = async (text: string, setter: any, loader: any) => {
            if (text.length < 1) { 
                if (isMounted.current) setter([]); 
                return; 
            }
            if (isMounted.current) loader(true)
            try {
                const res = await fetch(`/api/personnel?search=${encodeURIComponent(text)}&limit=50`)
                const data = await res.json()
                const items = data.items || data.data || []
                if (isMounted.current) {
                    setter(items)
                    cachePersonnel(items)
                }
            } catch (err) { console.error("Search failed:", err) }
            finally { 
                if (isMounted.current) loader(false) 
            }
        }

        const t1 = setTimeout(() => search(specSearchText, setSpecSearchResults, setIsSearchingSpec), 300)
        const t2 = setTimeout(() => search(chairmanSearchText, setChairmanSearchResults, setIsSearchingChairman), 300)
        const t3 = setTimeout(() => search(memberSearchText, setMemberSearchResults, setIsSearchingMember), 300)
        
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); }
    }, [specSearchText, chairmanSearchText, memberSearchText])

    // Load initial data for existing members
    useEffect(() => {
        if (!managingItem) return;
        // In a real app, we'd fetch full objects for current IDs here
    }, [managingItem])

    
    const nextStep = () => {
        // Basic Validation
        if (currentStep === 1) {
            if (!manageFormData.orderNum || !manageFormData.orderDate) {
                toast.error(locale === "ru" ? "Заполните номер и дату приказа" : "Buyruq raqami va sanasini kiriting")
                return
            }
        }
        if (currentStep === 2) {
            if (!manageFormData.briefingDate) {
                toast.error(locale === "ru" ? "Заполните дату инструктажа" : "Yo'riqnoma sanasini kiriting")
                return
            }
        }

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

    // Converts "dd.mm.yyyy" or "dd.mm.yy" to "yyyy-mm-dd" for API params
    const convertRuDateToIso = (ruDate: string): string | null => {
        if (!ruDate) return null
        const parts = ruDate.trim().split(".")
        if (parts.length !== 3) return null
        const [d, m, y] = parts
        const year = y.length === 2 ? `20${y}` : y
        return `${year}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
    }

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
                    inspectionDirection: getLocalizedDirectionName(p.inspectionDirectionId || p.inspectionDirection, locale as any) || (locale === "ru" ? "Направление не указано" : "Yo'nalish ko'rsatilmagan"),
                    inspectionDirectionSubtitle: getInspectionTypeLabel(p.inspectionTypeId || p.inspectionType, locale as any) || (locale === "ru" ? "Плановая инспекция" : "Rejali inspektsiya"),
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
                    briefingId: latestBriefing?.id || null,
                    prescriptionNum: latestPrescription?.prescription_num || latestPrescription?.prescriptionNum || null,
                    prescriptionDate: latestPrescription?.date || latestPrescription?.issueDate || null,
                    prescriptionId: latestPrescription?.id || null,
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

        // Pre-populate personnel objects for existing members to show them in cards
        const initialCache: Record<string, any> = {}
        item.commissionMembers?.forEach(m => {
            const mid = (m.personnelId || m.id)?.toString()
            if (mid) {
                initialCache[mid] = {
                    id: mid,
                    fullName: m.name,
                    rank: m.rank,
                    militaryUnit: "" // Unit might be unknown here but name/rank will show
                }
            }
        })
        setPersonnelObjects(prev => ({ ...prev, ...initialCache }))

        const leader = item.commissionMembers?.find(m => m.role === "Председатель комиссии")?.personnelId?.toString() || 
                       item.commissionMembers?.find(m => m.role === "Председатель комиссии")?.id?.toString() || ""
        
        const members = item.commissionMembers
            ?.filter(m => m.role === "Член комиссии")
            .map(m => (m.personnelId || m.id)?.toString())
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
        
        // Validation: chairman is REQUIRED
        if (!manageFormData.groupLeader) {
            toast.error(locale === "ru" 
                ? "Необходимо выбрать Председателя комиссии перед сохранением." 
                : "Saqlashdan oldin komissiya raisi tanlanishi shart.");
            return;
        }

        setIsSaving(true);

        const promise = new Promise(async (resolve, reject) => {
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
                        ...(manageFormData.groupLeader ? [{ personnelId: manageFormData.groupLeader, role: "Председатель комиссии" }] : []),
                        ...manageFormData.groupMembers.map(id => ({ personnelId: id, role: "Член комиссии" })),
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

                setShowManageDialog(false);
                router.refresh();
                resolve(true);
            } catch (err) {
                reject(err);
            } finally {
                setIsSaving(false);
            }
        });

        toast.promise(promise, {
            loading: locale === "ru" ? "Сохранение изменений..." : "O'zgarishlar saqlanmoqda...",
            success: locale === "ru" ? "Данные успешно обновлены" : "Ma'lumotlar muvaffaqiyatli yangilandi",
            error: (err: any) => `${locale === "ru" ? "Ошибка" : "Xato"}: ${err.message}`
        });
    };


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
                        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/20">
                            <TableRow className="hover:bg-transparent border-b-2">
                                <TableHead className="w-[50px] font-bold text-[10px] uppercase tracking-wider text-muted-foreground/80">#</TableHead>
                                <TableHead className="min-w-[220px] font-bold text-[10px] uppercase tracking-wider text-muted-foreground/80">Объект и План</TableHead>
                                <TableHead className="min-w-[180px] font-bold text-[10px] uppercase tracking-wider text-muted-foreground/80">Параметры проверки</TableHead>
                                <TableHead className="min-w-[220px] font-bold text-[10px] uppercase tracking-wider text-muted-foreground/80">Состав комиссии</TableHead>
                                <TableHead className="min-w-[280px] font-bold text-[10px] uppercase tracking-wider text-muted-foreground/80">Документооборот</TableHead>
                                <TableHead className="w-[120px] font-bold text-[10px] uppercase tracking-wider text-muted-foreground/80 text-center">{t("orders.table.status")}</TableHead>
                                <TableHead className="w-[80px] font-bold text-[10px] uppercase tracking-wider text-muted-foreground/80 text-right">{t("orders.table.actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((item, index) => (
                                <TableRow key={item.id} className="group transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                    <TableCell className="font-mono text-[10px] text-muted-foreground/70">
                                        {(index + 1).toString().padStart(3, '0')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="font-bold text-sm leading-tight">{item.controlObject}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 ml-6">
                                                <Badge variant="outline" className="font-mono text-[9px] py-0 h-4 px-1.5 border-primary/20 text-primary/70 bg-primary/5">
                                                    ID: {item.planId}
                                                </Badge>
                                                {item.controlObjectSubtitle && (
                                                    <Badge variant="secondary" className="text-[9px] py-0 h-4 px-1.5 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 font-bold uppercase tracking-tighter">
                                                        {item.controlObjectSubtitle}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-start gap-2">
                                                <ShieldAlert className="w-3.5 h-3.5 text-blue-500/80 shrink-0 mt-0.5" />
                                                <span className="text-[11px] font-medium leading-tight text-foreground/80">
                                                    {item.inspectionDirection}
                                                </span>
                                            </div>
                                            <div className="mt-0.5 ml-5.5">
                                                <Badge variant="secondary" className="py-0 h-4 px-1.5 text-[9px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                    <Tag className="w-2.5 h-2.5 mr-1" />
                                                    {item.inspectionDirectionSubtitle || "—"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            {item.commissionMembers && item.commissionMembers.length > 0 ? (
                                                <>
                                                    <div className="flex items-center gap-1.5">
                                                        <UserCheck className="w-3.5 h-3.5 text-purple-500/80 shrink-0" />
                                                        <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400">
                                                            {item.commissionMembers.find(m => m.role?.includes("Председатель"))?.name || item.commissionMembers[0].name}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 ml-5">
                                                        {item.commissionMembers.filter(m => !m.role?.includes("Председатель")).slice(0, 2).map((m, i) => (
                                                            <Badge key={i} variant="outline" className="text-[9px] bg-slate-50/50 py-0 h-4 border-slate-200">
                                                                {m.name.split(' ').map((n, idx) => idx === 0 ? n : n[0] + '.').join(' ')}
                                                            </Badge>
                                                        ))}
                                                        {item.commissionMembers.length > 3 && (
                                                            <Badge variant="outline" className="text-[9px] bg-blue-50 text-blue-700 border-blue-100 py-0 h-4">
                                                                +{item.commissionMembers.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-slate-400 italic text-[10px]">
                                                    <Users className="w-3.5 h-3.5" />
                                                    <span>Не назначена</span>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            {/* Order */}
                                            <div className="flex items-start gap-2">
                                                <FileText className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", item.orderNum !== "—" ? "text-indigo-500" : "text-muted-foreground/30")} />
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground">Приказ</span>
                                                    {item.orderNum !== "—" ? (
                                                        <span className="text-[10px] font-mono font-medium">
                                                            №{item.orderNum} <span className="text-muted-foreground ml-1">от {formatDateShort(item.date)}</span>
                                                        </span>
                                                    ) : <span className="text-[10px] text-muted-foreground/50 italic">{locale === "ru" ? "Не сформирован" : "Shakllantirilmagan"}</span>}
                                                </div>
                                            </div>
                                            
                                            {/* Briefing */}
                                            <div className="flex items-start gap-2 ml-0.5 border-l-2 border-slate-100 dark:border-slate-800 pl-3 py-0.5">
                                                <Zap className={cn("w-3 h-3 shrink-0 mt-1", item.briefingDate ? "text-amber-500" : "text-muted-foreground/30")} />
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] uppercase tracking-wider font-semibold text-muted-foreground/70">Инструктаж</span>
                                                    <span className={cn("text-[10px]", item.briefingDate ? "font-medium" : "text-muted-foreground/40")}>
                                                        {item.briefingDate ? formatDateShort(item.briefingDate) : <span className="text-muted-foreground/50 italic">{locale === "ru" ? "Не проведен" : "O'tkazilmagan"}</span>}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Prescription */}
                                            <div className="flex items-start gap-2 ml-0.5 border-l-2 border-slate-100 dark:border-slate-800 pl-3 py-0.5">
                                                <ClipboardCheck className={cn("w-3 h-3 shrink-0 mt-1", item.prescriptionNum ? "text-green-500" : "text-muted-foreground/30")} />
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] uppercase tracking-wider font-semibold text-muted-foreground/70">Предписание</span>
                                                    <span className={cn("text-[10px]", item.prescriptionNum ? "font-medium" : "text-muted-foreground/40")}>
                                                         {item.prescriptionNum ? (
                                                             <>
                                                                 {item.prescriptionNum}
                                                                 {item.prescriptionDate && (
                                                                     <span className="text-muted-foreground ml-1 font-normal italic">
                                                                         от {formatDateShort(item.prescriptionDate)}
                                                                     </span>
                                                                 )}
                                                             </>
                                                         ) : (
                                                             <span className="text-muted-foreground/50 italic">{locale === "ru" ? "Не выдано" : "Berilmagan"}</span>
                                                         )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={item.statusVariant} className={cn("whitespace-nowrap font-medium text-[10px] px-2 py-0.5 shadow-sm transition-all hover:shadow-md")}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => handleOpenManage(item)} className="h-8 w-8 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950">
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Управление данными</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => {/* handle delete */}} className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Удалить запись</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
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
                                    {t("orders.manage.title") !== "orders.manage.title" ? t("orders.manage.title") : (locale === "ru" ? "Управление документами" : "Hujjatlarni boshqarish")}
                                </DialogTitle>
                                <DialogDescription className="text-blue-600/70 font-medium">
                                    {managingItem?.controlObject}
                                </DialogDescription>
                            </div>
                        </div>

                        {/* Visual Stepper */}
                        <div className="flex items-center justify-between gap-2 px-2 pt-2">
                            {[
                                { id: 1, label: t("orders.manage.step1"), icon: Icons.FileText },
                                { id: 2, label: t("orders.manage.step2"), icon: Icons.ClipboardCheck },
                                { id: 3, label: t("orders.manage.step3"), icon: Icons.Users }
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
                                                <Label className="font-bold">{locale === "ru" ? "Проведение инструктажа" : "Yo'riqnoma o'tkazish"}</Label>
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
                                                <Icons.FileText className="h-5 w-5" />
                                                <Label className="font-bold">{locale === "ru" ? "Выдача предписания" : "Ko'rsatma berish"}</Label>
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
                                    {/* Chairman Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[10px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-[0.2em]">
                                                {locale === "ru" ? "Председатель комиссии" : "Komissiya raisi"}
                                            </Label>
                                            {manageFormData.groupLeader && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => setManageFormData({...manageFormData, groupLeader: ""})}
                                                    className="h-6 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    {locale === "ru" ? "Изменить" : "O'zgartirish"}
                                                </Button>
                                            )}
                                        </div>

                                        {!manageFormData.groupLeader ? (
                                            <div className="relative">
                                                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    placeholder={locale === "ru" ? "Поиск председателя по ФИО..." : "Raisni qidirish..."}
                                                    value={chairmanSearchText}
                                                    onChange={(e) => setChairmanSearchText(e.target.value)}
                                                    className="pl-9 h-11 border-2 border-purple-100 focus:border-purple-300 rounded-xl transition-all shadow-sm bg-white"
                                                />
                                                {isSearchingChairman && <Icons.Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-purple-400" />}
                                                
                                                {chairmanSearchResults.length > 0 && (
                                                    <div className="absolute z-50 w-full mt-2 bg-background border-2 border-purple-100 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-80 overflow-y-auto">
                                                        {chairmanSearchResults.map(p => (
                                                            <div 
                                                                key={p.id}
                                                                onClick={() => {
                                                                    setManageFormData({...manageFormData, groupLeader: p.id.toString()})
                                                                    setChairmanSearchText("")
                                                                    setChairmanSearchResults([])
                                                                }}
                                                                className="p-3 hover:bg-purple-50 cursor-pointer border-b border-purple-50 last:border-0 flex items-center justify-between group"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs uppercase">
                                                                        {p.lastName?.[0]}{p.firstName?.[0]}
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <p className="text-sm font-bold group-hover:text-purple-700">{p.fullName}</p>
                                                                            {p.isInspector && <Badge className="text-[8px] h-3.5 px-1 bg-blue-100 text-blue-700 border-blue-200">КРУ</Badge>}
                                                                        </div>
                                                                        <p className="text-[10px] text-muted-foreground">{p.rank} • {p.militaryUnit} {p.pnr ? `[${p.pnr}]` : ""}</p>
                                                                    </div>
                                                                </div>
                                                                <Icons.ChevronRight className="h-4 w-4 text-purple-200 group-hover:text-purple-400 transition-colors" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="p-4 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-background border-2 border-purple-200 dark:border-purple-800 rounded-2xl flex items-center gap-4 shadow-sm"
                                            >
                                                <div className="h-12 w-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-200 dark:shadow-none">
                                                    <Icons.UserCheck className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-black text-slate-800 dark:text-slate-100">{personnelObjects[manageFormData.groupLeader]?.fullName}</span>
                                                        <Badge className="bg-purple-600 text-white border-0 text-[9px] px-1.5 py-0">ПРЕДСЕДАТЕЛЬ</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {personnelObjects[manageFormData.groupLeader]?.rank} • {personnelObjects[manageFormData.groupLeader]?.militaryUnit}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Members Section */}
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-[0.2em]">
                                            {locale === "ru" ? "Члены комиссии" : "Komissiya a'zolari"}
                                        </Label>
                                        
                                        <div className="relative">
                                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                placeholder={locale === "ru" ? "Найти и добавить члена комиссии..." : "A'zo qo'shish..."}
                                                value={memberSearchText}
                                                onChange={(e) => setMemberSearchText(e.target.value)}
                                                className="pl-9 h-11 border-2 border-blue-50 focus:border-blue-200 rounded-xl bg-blue-50/20 shadow-sm"
                                            />
                                            {isSearchingMember && <Icons.Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-blue-400" />}

                                            {memberSearchResults.length > 0 && (
                                                <div className="absolute z-50 w-full mt-2 bg-background border border-blue-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 max-h-60 overflow-y-auto">
                                                    {memberSearchResults.filter(p => !manageFormData.groupMembers.includes(p.id.toString()) && p.id.toString() !== manageFormData.groupLeader).map(p => (
                                                        <div 
                                                            key={p.id}
                                                            onClick={() => {
                                                                setManageFormData({...manageFormData, groupMembers: [...manageFormData.groupMembers, p.id.toString()]})
                                                                setMemberSearchText("")
                                                                setMemberSearchResults([])
                                                            }}
                                                            className="p-3 hover:bg-blue-50 cursor-pointer border-b border-blue-50 last:border-0 flex items-center justify-between group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px] uppercase">
                                                                    {p.lastName?.[0]}{p.firstName?.[0]}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="text-xs font-bold group-hover:text-blue-700">{p.fullName}</p>
                                                                        {p.isInspector && <Badge className="text-[8px] h-3.5 px-1 bg-blue-100 text-blue-700 border-blue-200">КРУ</Badge>}
                                                                    </div>
                                                                    <p className="text-[9px] text-muted-foreground">{p.rank} • {p.militaryUnit} {p.pnr ? `[${p.pnr}]` : ""}</p>
                                                                </div>
                                                            </div>
                                                            <Icons.Plus className="h-4 w-4 text-blue-200 group-hover:text-blue-500" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <ScrollArea className="max-h-40 overflow-auto pr-2">
                                            <div className="grid grid-cols-1 gap-2">
                                                {manageFormData.groupMembers.map(id => {
                                                    const p = personnelObjects[id]
                                                    return (
                                                        <motion.div 
                                                            key={id}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                                                    {p?.lastName?.[0] || '?'}{p?.firstName?.[0] || ''}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-bold">{p?.fullName || `ID: ${id}`}</p>
                                                                    <p className="text-[9px] text-muted-foreground">{p?.rank} • {p?.militaryUnit}</p>
                                                                </div>
                                                            </div>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                                                onClick={() => setManageFormData({...manageFormData, groupMembers: manageFormData.groupMembers.filter(m => m !== id)})}
                                                            >
                                                                <Icons.X className="h-4 w-4" />
                                                            </Button>
                                                        </motion.div>
                                                    )
                                                })}
                                                {manageFormData.groupMembers.length === 0 && (
                                                    <div className="text-center py-6 border-2 border-dashed border-slate-50 rounded-2xl opacity-40">
                                                        <Icons.Users className="h-6 w-6 mx-auto mb-2 text-slate-300" />
                                                        <p className="text-[10px] uppercase tracking-widest font-black">
                                                            {locale === "ru" ? "Члены комиссии не выбраны" : "A'zolar tanlanmagan"}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </div>

                                    {/* Specialists Section */}
                                    <div className="space-y-3 pt-4 border-t border-dashed border-slate-200">
                                        <Label className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.2em]">
                                            {locale === "ru" ? "Привлечённые специалисты" : "Mutaxassislar"}
                                        </Label>
                                        <div className="relative">
                                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                placeholder={locale === "ru" ? "Поиск по ФИО или ПИНФЛ..." : "Ism yoki PINFL bo'yicha..."}
                                                value={specSearchText}
                                                onChange={(e) => setSpecSearchText(e.target.value)}
                                                className="pl-9 h-10 border-2 border-emerald-50 focus:border-emerald-200 rounded-xl bg-emerald-50/10 shadow-sm"
                                            />
                                            {isSearchingSpec && <Icons.Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-emerald-400" />}

                                            {specSearchResults.length > 0 && (
                                                <div className="absolute z-50 w-full mt-2 bg-background border border-emerald-100 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                                                    {specSearchResults.map(p => (
                                                        <div 
                                                            key={p.id}
                                                            onClick={() => {
                                                                if (!manageFormData.groupSpecialists.includes(p.id.toString())) {
                                                                    setManageFormData({...manageFormData, groupSpecialists: [...manageFormData.groupSpecialists, p.id.toString()]})
                                                                }
                                                                setSpecSearchText("")
                                                                setSpecSearchResults([])
                                                            }}
                                                            className="p-3 hover:bg-emerald-50 cursor-pointer border-b border-emerald-50 last:border-0 flex items-center justify-between group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-[10px] uppercase">
                                                                    {p.lastName?.[0]}{p.firstName?.[0]}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="text-xs font-bold group-hover:text-emerald-700">{p.fullName}</p>
                                                                        {p.isInspector && <Badge className="text-[8px] h-3.5 px-1 bg-blue-100 text-blue-700 border-blue-200">КРУ</Badge>}
                                                                    </div>
                                                                    <p className="text-[9px] text-muted-foreground">{p.rank} • {p.militaryUnit} {p.pnr ? `[${p.pnr}]` : ""}</p>
                                                                </div>
                                                            </div>
                                                            <Icons.Plus className="h-4 w-4 text-emerald-300 group-hover:text-emerald-600" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {manageFormData.groupSpecialists.map(id => (
                                                <Badge key={id} variant="secondary" className="pl-1 pr-1 py-1 h-8 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 gap-2 rounded-xl group">
                                                    <div className="h-6 w-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-[9px] font-black uppercase">
                                                        {personnelObjects[id]?.lastName?.[0] || 'S'}
                                                    </div>
                                                    <span className="text-[10px] font-bold">{personnelObjects[id]?.fullName || `ID: ${id}`}</span>
                                                    <button 
                                                        className="h-5 w-5 rounded-md hover:bg-emerald-200 flex items-center justify-center transition-colors"
                                                        onClick={() => setManageFormData({...manageFormData, groupSpecialists: manageFormData.groupSpecialists.filter(s => s !== id)})}
                                                    >
                                                        <Icons.X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
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
                            {currentStep === 1 ? (t("common.cancel")) : (t("common.back"))}
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

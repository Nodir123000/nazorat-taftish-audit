"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
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
    Eye,
    Table as TableIcon,
    Filter as FilterIcon,
    ChevronDown,
    ChevronRight,
    MoreVertical,
    RefreshCw
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
    getStatusLabel,
    getLocalizedAuthorityName,
    getLocalizedDistrictName,
    toSafeString
} from "@/lib/utils/localization"
import { loadSupplyDepartments } from "@/lib/api/reference-service"

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
    periodConducted: string
    responsible: string
    status: string
    statusVariant: "default" | "secondary" | "outline" | "destructive" | "success"
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
    inspectionAbbreviation?: string
    inspectionAbbreviationUzLatn?: string
    inspectionAbbreviationUzCyrl?: string
    inspectionDirectionName?: any
    controlAuthority?: string
    subordinateUnits?: Array<{ unitCode: string; unitName: string; allowanceType: string }>
    originalPlan?: any
}

function getLocalizedName(obj: any, locale: any): string {
    if (!obj) return ""
    const nameData = typeof obj.name === 'object' ? obj.name : obj
    if (typeof nameData === 'string') return nameData
    const langKey = locale === "uzLatn" ? "uz" : (locale === "uzCyrl" ? "uzk" : "ru")
    return nameData[langKey] || nameData["ru"] || nameData["uz"] || ""
}

function getAreaRegionData(plan: any) {
    if (!plan) return null
    if (plan.unit?.ref_areas) {
        return { 
            area: plan.unit.ref_areas, 
            region: plan.unit.ref_areas.ref_regions 
        }
    }
    if (plan.unit?.ref_military_districts?.ref_areas) {
        return { 
            area: plan.unit.ref_military_districts.ref_areas, 
            region: plan.unit.ref_military_districts.ref_areas.ref_regions 
        }
    }
    return null
}

function getLocationDisplay(plan: any, locale: any): string {
    const data = getAreaRegionData(plan)
    if (data) {
        const areaName = getLocalizedName(data.area, locale)
        const regionName = data.region ? getLocalizedName(data.region, locale) : ""
        return regionName ? `${regionName}, ${areaName}` : areaName
    }
    return plan.controlObjectSubtitle || "—"
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
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

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
    const [viewMode, setViewMode] = useState<'list' | 'regions' | 'districts' | 'authorities'>('list')
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
    const [supplyDepartments, setSupplyDepartments] = useState<any[]>([])

    // Load supply departments for localization
    useEffect(() => {
        loadSupplyDepartments().then(data => {
            if (isMounted.current) setSupplyDepartments(data)
        }).catch(console.error)
    }, [])

    // Cache helper
    const cachePersonnel = (items: any[]) => {
        setPersonnelObjects(prev => {
            const next = { ...prev }
            items.forEach(i => { next[i.id.toString()] = i })
            return next
        })
    }

    const isMounted = useRef(false)
    useEffect(() => {
        isMounted.current = true
        return () => { isMounted.current = false }
    }, [])

    const searchPersonnel = async (
        text: string,
        setter: (v: any[]) => void,
        loader: (v: boolean) => void
    ) => {
        if (text.length < 1) { if (isMounted.current) setter([]); return }
        if (isMounted.current) loader(true)
        try {
            const res = await fetch(`/api/personnel?search=${encodeURIComponent(text)}&limit=50`)
            const data = await res.json()
            const items = data.items || data.data || []
            if (isMounted.current) { setter(items); cachePersonnel(items) }
        } catch (err) { console.error("Search failed:", err) }
        finally { if (isMounted.current) loader(false) }
    }

    // Три независимых эффекта — каждый реагирует только на свой текст
    useEffect(() => {
        const t = setTimeout(() => searchPersonnel(specSearchText, setSpecSearchResults, setIsSearchingSpec), 300)
        return () => clearTimeout(t)
    }, [specSearchText])

    useEffect(() => {
        const t = setTimeout(() => searchPersonnel(chairmanSearchText, setChairmanSearchResults, setIsSearchingChairman), 300)
        return () => clearTimeout(t)
    }, [chairmanSearchText])

    useEffect(() => {
        const t = setTimeout(() => searchPersonnel(memberSearchText, setMemberSearchResults, setIsSearchingMember), 300)
        return () => clearTimeout(t)
    }, [memberSearchText])

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


    const allData = useMemo(() => {
        const items: UnifiedRegistryItem[] = []

        if (initialPlans && initialPlans.length > 0) {
            initialPlans.forEach((p: any, index: number) => {
                const latestOrder = p.orders && p.orders.length > 0
                    ? [...p.orders].sort((a: any, b: any) => {
                        const da = a.order_date ? new Date(a.order_date).getTime() : 0
                        const db = b.order_date ? new Date(b.order_date).getTime() : 0
                        return db - da
                    })[0]
                    : null;
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
                    periodConducted: p.startDate && p.endDate
                        ? `${new Date(p.startDate).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ')} - ${new Date(p.endDate).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ')}`
                        : "—",
                    responsible: p.responsible?.fullname || p.responsible?.full_name || "Не назначен",
                    status: getStatusLabel(p.status, locale as any),
                    statusVariant: (p.status === "approved" || p.status === "101") ? "default" : 
                                   (p.status === "completed" || p.status === "104") ? "success" :
                                   (p.status === "draft" || p.status === "106") ? "outline" : "secondary",
                    planId: String(p.planId || index + 1),
                    controlObject: p.unit ? getLocalizedName(p.unit, locale) : (p.controlObject || "—"),
                    controlObjectSubtitle: getLocationDisplay(p, locale),
                    inspectionDirection: p.inspectionDirection,
                    inspectionDirectionSubtitle: p.inspectionType,
                    inspectionDirectionName: p.inspectionDirectionName,
                    inspectionAbbreviation: p.inspectionAbbreviation,
                    inspectionAbbreviationUzLatn: p.inspectionAbbreviationUzLatn,
                    inspectionAbbreviationUzCyrl: p.inspectionAbbreviationUzCyrl,
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
                    controlAuthority: p.controlAuthority,
                    commissionMembersData: latestOrder?.commission_members?.map((m: any) => {
                        const rank = m.users?.rank || ""
                        const name = m.users?.fullname || m.memberId
                        const role = m.role ? `(${m.role})` : ""
                        return `${rank} ${name} ${role}`.trim()
                    }).join(", ") || "",
                    originalPlan: p,
                })
            })
        }

        return items
    }, [t, initialPlans, locale])

    // Grouping helper
    const getRegionDisplay = (item: UnifiedRegistryItem) => {
        if (item.controlObjectSubtitle && item.controlObjectSubtitle.includes(",")) {
            // "Region, Area" -> split(",")[0] is Region
            return item.controlObjectSubtitle.split(",")[0].trim()
        }
        return item.controlObjectSubtitle || (locale === 'ru' ? 'Без области' : 'Viloyatsiz')
    }

    const getDistrictDisplay = (item: UnifiedRegistryItem) => {
        if (item.controlObjectSubtitle && item.controlObjectSubtitle.includes(",")) {
            // "Region, Area" -> split(",")[1] is Area
            return item.controlObjectSubtitle.split(",")[1].trim()
        }
        return locale === 'ru' ? 'Без района' : 'Tumansiz'
    }

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }))
    }

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
            if (isMounted.current) setHistoryLogs(Array.isArray(data) ? data : [])
        } catch {
            if (isMounted.current) setHistoryLogs([])
        } finally {
            if (isMounted.current) setHistoryLoading(false)
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

    const sortedData = useMemo(() => {
        if (viewMode === 'list') return filteredData;
        
        return [...filteredData].sort((a, b) => {
            const groupA = viewMode === 'regions' ? getRegionDisplay(a) :
                           viewMode === 'districts' ? getDistrictDisplay(a) :
                           viewMode === 'authorities' ? getLocalizedAuthorityName(a.controlAuthority || "", locale as any, supplyDepartments, 'full') :
                           '';
            const groupB = viewMode === 'regions' ? getRegionDisplay(b) :
                           viewMode === 'districts' ? getDistrictDisplay(b) :
                           viewMode === 'authorities' ? getLocalizedAuthorityName(b.controlAuthority || "", locale as any, supplyDepartments, 'full') :
                           '';
            return groupA.localeCompare(groupB);
        });
    }, [filteredData, viewMode, locale, supplyDepartments]);

    // Auto-expand all groups when viewMode changes
    useEffect(() => {
        if (viewMode !== 'list') {
            const allGroups: Record<string, boolean> = {};
            filteredData.forEach(item => {
                const group = viewMode === 'regions' ? getRegionDisplay(item) :
                              viewMode === 'districts' ? getDistrictDisplay(item) :
                              viewMode === 'authorities' ? getLocalizedAuthorityName(item.controlAuthority || "", locale as any, supplyDepartments, 'full') :
                              'default';
                allGroups[group] = true;
            });
            setExpandedGroups(allGroups);
        }
    }, [viewMode]);

    if (!hasMounted) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-700">
                <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <TableIcon className="absolute inset-0 m-auto h-5 w-5 text-primary/40" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] animate-pulse">
                        Инициализация реестра
                    </span>
                    <span className="text-[9px] text-muted-foreground/60 italic">
                        Подготовка данных и компонентов...
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle>{t("orders.filters.title")}</CardTitle>
                    <CardDescription>{t("orders.filters.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-5">
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
                        <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                                setFilters({ search: "", status: "", dateFrom: "" });
                                setViewMode('list');
                            }}
                        >
                            <RefreshCw className="mr-2 h-4 w-4 text-muted-foreground" />
                            {t("orders.filters.reset")}
                        </Button>
                        <Select value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
                            <SelectTrigger className="w-full h-10 text-xs font-medium bg-background/50 border-primary/20">
                                <div className="flex items-center gap-2">
                                    <FilterIcon className="w-3.5 h-3.5 text-primary" />
                                    <SelectValue placeholder="Группировка" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="list">{locale === 'ru' ? 'Списком' : 'Ro\'yxat'}</SelectItem>
                                <SelectItem value="regions">{locale === 'ru' ? 'По областям' : 'Viloyatlar bo\'yicha'}</SelectItem>
                                <SelectItem value="districts">{locale === 'ru' ? 'По районам' : 'Tumanlar bo\'yicha'}</SelectItem>
                                <SelectItem value="authorities">{locale === 'ru' ? 'По органам' : 'Organlar bo\'yicha'}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-xl bg-background/60 backdrop-blur-xl">
                <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/20 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <TableIcon className="w-5 h-5 text-primary" />
                                {t("orders.table.title")}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {filteredData.length} {locale === 'ru' ? 'записей найдено' : 'yozuv topildi'}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Grouping Select moved to filters as per user request */}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table className="relative border-collapse">
                        <TableHeader className="sticky top-0 bg-background/80 backdrop-blur-md z-20 shadow-[0_1px_3px_0_rgb(0,0,0,0.05)]">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="w-10 bg-transparent font-semibold text-foreground/80 text-[10px] uppercase tracking-wider pl-4">ID</TableHead>
                                <TableHead className="bg-transparent font-semibold text-foreground/80 min-w-40 text-[10px] uppercase tracking-wider px-2">Объект</TableHead>
                                <TableHead className="bg-transparent font-semibold text-foreground/80 min-w-40 text-[10px] uppercase tracking-wider px-2">Орган / Направление</TableHead>
                                <TableHead className="bg-transparent font-semibold text-foreground/80 min-w-24 text-[10px] uppercase tracking-wider px-2">Тип</TableHead>
                                <TableHead className="bg-transparent font-semibold text-foreground/80 min-w-36 text-[10px] uppercase tracking-wider px-2">Срок проведения</TableHead>
                                <TableHead className="bg-transparent font-semibold text-foreground/80 min-w-32 text-[10px] uppercase tracking-wider px-2">Приказ</TableHead>
                                <TableHead className="bg-transparent font-semibold text-foreground/80 min-w-24 text-[10px] uppercase tracking-wider px-2">Инструктаж</TableHead>
                                <TableHead className="bg-transparent font-semibold text-foreground/80 min-w-32 text-[10px] uppercase tracking-wider px-2">Предписание</TableHead>
                                <TableHead className="bg-transparent font-semibold text-foreground/80 min-w-32 text-[10px] uppercase tracking-wider px-2">Комиссия</TableHead>
                                <TableHead className="bg-transparent font-semibold text-foreground/80 min-w-24 text-[10px] uppercase tracking-wider text-center px-2">Статус</TableHead>
                                <TableHead className="text-right bg-transparent font-semibold text-foreground/80 text-[10px] uppercase tracking-wider pr-4">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedData.map((item, index) => {
                                const currentGroup = viewMode === 'regions' ? getRegionDisplay(item) :
                                    viewMode === 'districts' ? getDistrictDisplay(item) :
                                    viewMode === 'authorities' ? getLocalizedAuthorityName(item.controlAuthority || "", locale as any, supplyDepartments, 'full') :
                                    'default'

                                const prevItem = index > 0 ? sortedData[index - 1] : null
                                const prevGroup = prevItem ? (
                                    viewMode === 'regions' ? getRegionDisplay(prevItem) :
                                    viewMode === 'districts' ? getDistrictDisplay(prevItem) :
                                    viewMode === 'authorities' ? getLocalizedAuthorityName(prevItem.controlAuthority || "", locale as any, supplyDepartments, 'full') :
                                    'default'
                                ) : null

                                const showGroupHeader = viewMode !== 'list' && currentGroup !== prevGroup
                                const isGroupExpanded = expandedGroups[currentGroup] ?? false

                                return (
                                    <React.Fragment key={item.id}>
                                        {showGroupHeader && (
                                            <TableRow className="bg-slate-100/60 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200 border-b shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] group/header" onClick={() => toggleGroup(currentGroup)}>
                                                <TableCell colSpan={11} className="font-semibold p-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn(
                                                                "p-1 rounded-sm transition-colors",
                                                                isGroupExpanded ? "bg-primary/10 text-primary" : "bg-muted-foreground/10 text-muted-foreground group-hover/header:bg-primary/5 group-hover/header:text-primary/70"
                                                            )}>
                                                                {isGroupExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                            </div>
                                                            <span className="text-sm font-semibold tracking-tight text-foreground/90">
                                                                {currentGroup}
                                                            </span>
                                                            <Badge variant="outline" className="ml-2 font-bold bg-primary/10 text-primary border-primary/20 shadow-sm">
                                                                {sortedData.filter(p => {
                                                                    if (viewMode === 'regions') return getRegionDisplay(p) === currentGroup
                                                                    if (viewMode === 'districts') return getDistrictDisplay(p) === currentGroup
                                                                    if (viewMode === 'authorities') return getLocalizedAuthorityName(p.controlAuthority || "", locale as any, supplyDepartments, 'full') === currentGroup
                                                                    return false
                                                                }).length} {locale === 'ru' ? 'объектов' : 'obyektlar'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        {(viewMode === 'list' || isGroupExpanded) && (
                                            <TableRow className="group transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 hover:shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                <TableCell className="font-mono text-[10px] text-muted-foreground/70 pl-4 py-3">
                                                    {(index + 1).toString().padStart(5, '0')}
                                                </TableCell>

                                                <TableCell className="font-medium min-w-36 px-2 py-3">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="flex items-start gap-2 text-sm font-semibold cursor-help group/obj">
                                                                    <Building2 className="w-4 h-4 text-primary/70 shrink-0 mt-0.5 group-hover/obj:text-primary transition-colors" />
                                                                    <span className="whitespace-normal leading-tight text-foreground/90 border-b border-transparent group-hover/obj:border-primary/30 transition-all">
                                                                        {item.controlObject}
                                                                    </span>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="right" className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white border-none shadow-xl">
                                                                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] font-bold uppercase tracking-tighter opacity-50">
                                                                        {locale === 'ru' ? 'Местоположение' : 'Joylashuv'}
                                                                    </span>
                                                                    <span className="text-xs font-medium italic">
                                                                        {(() => {
                                                                            const plan = item.originalPlan;
                                                                            const data = getAreaRegionData(plan);
                                                                            const areaName = data?.area ? getLocalizedName(data.area, locale) : (getLocationDisplay(plan, locale).includes(",") ? getLocationDisplay(plan, locale).split(",")[1].trim() : "—");
                                                                            const regionName = data?.region ? getLocalizedName(data.region, locale) : (getLocationDisplay(plan, locale).includes(",") ? getLocationDisplay(plan, locale).split(",")[0].trim() : "");
                                                                            return regionName ? `${regionName}, ${areaName}` : areaName;
                                                                        })()}
                                                                    </span>
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>


                                                <TableCell className="min-w-36 px-2 py-3">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-start gap-1.5">
                                                            <ShieldAlert className="w-3.5 h-3.5 text-amber-500/80 shrink-0 mt-0.5" />
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <span className="font-medium cursor-help underline decoration-dotted decoration-muted-foreground/50 text-xs leading-tight">
                                                                            {getLocalizedAuthorityName(item.controlAuthority || "", locale as any, supplyDepartments, 'short')}
                                                                        </span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        {getLocalizedAuthorityName(item.controlAuthority || "", locale as any, supplyDepartments, 'full')}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 ml-5">
                                                            <CircleDot className="w-3 h-3 text-blue-500/80 shrink-0" />
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <span className="text-[10px] font-bold text-slate-600 cursor-help border-b border-dotted border-slate-300">
                                                                            {(() => {
                                                                                if (locale === 'uzLatn' && item.inspectionAbbreviationUzLatn) return item.inspectionAbbreviationUzLatn;
                                                                                if (locale === 'uzCyrl' && item.inspectionAbbreviationUzCyrl) return item.inspectionAbbreviationUzCyrl;
                                                                                if (item.inspectionAbbreviation) return item.inspectionAbbreviation;
                                                                                return getLocalizedDirectionName(item.inspectionDirection, locale as any, 'short');
                                                                            })()}
                                                                        </span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="top">
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                                                                {locale === "ru" ? "Направление" : "Yo'nalish"}
                                                                            </span>
                                                                            <span className="text-xs font-semibold">
                                                                                {item.inspectionDirectionName ? getLocalizedName(item.inspectionDirectionName, locale) : getLocalizedDirectionName(item.inspectionDirection, locale as any, 'full')}
                                                                            </span>
                                                                        </div>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    </div>
                                                </TableCell>


                                                <TableCell className="min-w-20 px-2 py-3">
                                                    <Badge variant="outline" className="py-0 h-4.5 px-1.5 text-[10px] font-medium border-primary/20 text-primary/80 bg-primary/5">
                                                        {getInspectionTypeLabel(item.inspectionDirectionSubtitle, locale as any)}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="min-w-36 px-2 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex flex-col gap-0.5">
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                                <span className="text-[10px] font-mono font-bold text-foreground/80">
                                                                    {item.originalPlan.startDate ? new Date(item.originalPlan.startDate).toLocaleDateString() : "—"}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                                                <span className="text-[10px] font-mono font-bold text-foreground/80">
                                                                    {item.originalPlan.endDate ? new Date(item.originalPlan.endDate).toLocaleDateString() : "—"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {(() => {
                                                            const start = item.originalPlan.startDate ? new Date(item.originalPlan.startDate) : null;
                                                            const end = item.originalPlan.endDate ? new Date(item.originalPlan.endDate) : null;
                                                            if (!start || !end) return null;
                                                            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                                                            const colorClass = days <= 15 ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" : 
                                                                             days <= 30 ? "bg-blue-500/10 text-blue-600 border-blue-200" : 
                                                                             "bg-amber-500/10 text-amber-600 border-amber-200";
                                                            return (
                                                                <Badge variant="outline" className={cn("text-[9px] font-black h-7 flex flex-col justify-center px-1.5 border leading-none min-w-8 text-center", colorClass)}>
                                                                    <span>{days}</span>
                                                                    <span className="text-[7px] uppercase tracking-tighter opacity-70 mt-0.5">
                                                                        {locale === 'ru' ? 'дн' : 'kun'}
                                                                    </span>
                                                                </Badge>
                                                            );
                                                        })()}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="min-w-24 px-2 py-3">
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="flex items-center gap-1.5">
                                                            <FileText className="w-3.5 h-3.5 text-indigo-500/70" />
                                                            <span className="text-[10px] font-mono font-bold tracking-tighter">
                                                                {item.orderNum !== "—" ? item.orderNum : "—"}
                                                            </span>
                                                        </div>
                                                        {item.date && item.date !== "—" && (
                                                            <span className="text-[9px] text-muted-foreground italic ml-5">
                                                                {new Date(item.date).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell className="min-w-20 px-2 py-3">
                                                    <div className="flex flex-col gap-0.5">
                                                        {item.briefingDate ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5 text-emerald-500/70" />
                                                                <span className="text-[10px] font-mono font-bold tracking-tighter">
                                                                    {new Date(item.briefingDate).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground text-[10px] italic ml-5">—</span>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="min-w-24 px-2 py-3">
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="flex items-center gap-1.5">
                                                            <ClipboardCheck className="w-3.5 h-3.5 text-orange-500/70" />
                                                            <span className="text-[10px] font-mono font-bold tracking-tighter">
                                                                {item.prescriptionNum || "—"}
                                                            </span>
                                                        </div>
                                                        {item.prescriptionDate && (
                                                            <span className="text-[9px] text-muted-foreground italic ml-5">
                                                                {new Date(item.prescriptionDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="min-w-24 px-2 py-3">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="flex flex-col gap-1 cursor-help">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Users className="w-3.5 h-3.5 text-purple-500/70" />
                                                                        <span className="text-[11px] font-medium truncate max-w-20">
                                                                            {item.commissionMembers?.[0]?.name || "—"}
                                                                        </span>
                                                                    </div>
                                                                    {item.commissionCount && item.commissionCount > 1 && (
                                                                        <Badge variant="secondary" className="w-fit text-[9px] py-0 h-4 px-1.5 ml-5">
                                                                            +{item.commissionCount - 1}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="w-64 p-0 overflow-hidden border-none shadow-2xl">
                                                                <div className="bg-slate-900 text-slate-50">
                                                                    <div className="px-4 py-2 border-b border-slate-800 bg-slate-800/50">
                                                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                                                                            {locale === 'ru' ? 'Состав комиссии' : 'Komissiya tarkibi'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="p-2 space-y-1">
                                                                        {item.commissionMembers?.map((member, idx) => (
                                                                            <div key={idx} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                                                                <div className={cn(
                                                                                    "mt-1 w-1.5 h-1.5 rounded-full shrink-0",
                                                                                    member.role?.includes("Председатель") ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-blue-400"
                                                                                )} />
                                                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                                        <span className="text-[11px] font-bold truncate leading-tight">
                                                                                            {member.name}
                                                                                        </span>
                                                                                        {member.rank && (
                                                                                            <span className="text-[9px] font-medium px-1 bg-white/10 rounded-sm text-slate-400 uppercase tracking-tighter">
                                                                                                {member.rank}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    <span className="text-[10px] text-slate-400 italic">
                                                                                        {member.role || (locale === 'ru' ? 'Член комиссии' : 'Komissiya a\'zosi')}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>

                                                {/* Статус */}
                                                <TableCell className="text-center">
                                                    <Badge variant={item.statusVariant} className={cn("whitespace-nowrap font-bold text-[10px] px-2.5 py-0.5 shadow-sm")}>
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>

                                                {/* Действия */}
                                                <TableCell className="text-right pr-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/80">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-45 p-1.5 shadow-xl border-border/50 backdrop-blur-sm bg-background/95">
                                                            <DropdownMenuItem 
                                                                className="gap-2 focus:bg-primary/10 focus:text-primary cursor-pointer rounded-md transition-colors"
                                                                onClick={() => handleOpenManage(item)}
                                                            >
                                                                <Icons.Settings className="h-4 w-4" />
                                                                <span>{locale === "ru" ? "Управление" : "Boshqarish"}</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                className="gap-2 focus:bg-primary/10 focus:text-primary cursor-pointer rounded-md transition-colors"
                                                                onClick={() => handleViewHistory(item)}
                                                            >
                                                                <Icons.History className="h-4 w-4" />
                                                                <span>{locale === "ru" ? "История" : "Tarix"}</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem 
                                                                className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-md transition-colors"
                                                                onClick={() => {/* handle delete */}}
                                                            >
                                                                <Icons.Trash className="h-4 w-4" />
                                                                <span>{locale === "ru" ? "Удалить" : "O'chirish"}</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                );
                            })}
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
                                { id: 1, label: t("orders.manage.step1"), icon: FileText },
                                { id: 2, label: t("orders.manage.step2"), icon: ClipboardCheck },
                                { id: 3, label: t("orders.manage.step3"), icon: Users }
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
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                                            <Icons.Info className="h-5 w-5 text-blue-600" />
                                            <p className="text-xs text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
                                                Укажите номер и дату официального приказа, на основании которого проводится данное мероприятие.
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                    <Calendar className="h-5 w-5 text-emerald-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                        {locale === 'ru' ? 'Срок проведения' : 'O\'tkazish muddati'}
                                                    </span>
                                                    <span className="text-sm font-mono font-black text-foreground/80 tracking-tight">
                                                        {managingItem?.periodConducted}
                                                    </span>
                                                </div>
                                            </div>
                                            {(() => {
                                                const start = managingItem?.originalPlan?.startDate ? new Date(managingItem.originalPlan.startDate) : null;
                                                const end = managingItem?.originalPlan?.endDate ? new Date(managingItem.originalPlan.endDate) : null;
                                                if (!start || !end) return null;
                                                const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                                                return (
                                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 font-black h-8 px-2 flex flex-col justify-center leading-none">
                                                        <span className="text-xs">{days}</span>
                                                        <span className="text-[8px] uppercase tracking-tighter opacity-70">{locale === 'ru' ? 'дней' : 'kun'}</span>
                                                    </Badge>
                                                );
                                            })()}
                                        </div>
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
                                                className="p-4 bg-linear-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-background border-2 border-purple-200 dark:border-purple-800 rounded-2xl flex items-center gap-4 shadow-sm"
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

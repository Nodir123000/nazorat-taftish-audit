"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import useSWR from "swr"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, User, ShieldCheck, Landmark, MoreHorizontal, UserCheck, MapPin, CheckCircle2, XCircle, Clock, Check, ChevronsUpDown, Eye } from "lucide-react"
import { TechnicalNameBadge } from "./technical-name-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MilitaryPersonnel } from "./personnel-data"
import { useI18n } from "@/lib/i18n/context"
import { cn, maskPINFL } from "@/lib/utils"
import { toast } from "sonner"
import { z } from "zod"
import { savePersonnel, deletePersonnel } from "@/lib/services/reference-db-service"


// Validation Schema
const personnelSchema = z.object({
  personId: z.string().min(1, { message: "Выберите физическое лицо" }),
  pnr: z.string().min(1, { message: "Личный номер (PNR) обязателен" }),
  rankId: z.string().min(1, { message: "Выберите звание" }),
  unitId: z.string().min(1, { message: "Выберите воинскую часть" }),
  positionId: z.string().min(1, { message: "Выберите или введите должность" }),
  vusId: z.string().min(1, { message: "Выберите ВУС" }),
  category: z.string().min(1, { message: "Выберите категорию" }),
  status: z.enum(["active", "reserve", "retired"]).optional().default("active"),
})

interface PhysicalPerson {
  id: number;
  lastName: string;
  firstName: string;
  middleName?: string;
  pinfl: string;
}

interface PersonnelProps {
  lockedUnitId?: string;
  hideHeader?: boolean;
  navigateOnView?: boolean;
}

interface PersonnelMember {
  id: number;
  pnr: string;
  physical_person_id?: number;
  rank_id?: number;
  unit_id?: number;
  position_id?: number;
  vus_id?: number;
  category?: string;
  status: "active" | "reserve" | "retired";
  ref_physical_persons?: any;
  ref_ranks?: any;
  ref_positions?: any;
  ref_units?: any;
  ref_vus_list?: any;
  person?: any;
  rank?: any;
  position?: any;
  unit?: any;
  vus?: any;
  physicalPerson?: any;
  rankId?: number | string;
  unitId?: number | string;
  positionId?: number | string;
  vusId?: number | string;
}

import { PersonnelTable } from "./personnel-table"
import type {
  MRT_PaginationState,
  MRT_SortingState,
  MRT_ColumnFiltersState
} from "material-react-table"

// ... (schema remains same)

export function Personnel({ lockedUnitId, hideHeader, navigateOnView }: PersonnelProps) {
  const { locale } = useI18n()
  const [personnel, setPersonnel] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // MRT States
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  })
  const [sorting, setSorting] = useState<MRT_SortingState>([{ id: 'unit.unitId', desc: false }])
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const columnFiltersObj = useMemo(() => {
    const filters: Record<string, any> = {}
    columnFilters.forEach((filter) => {
      filters[filter.id] = filter.value
    })
    return filters
  }, [columnFilters])

  // Data fetching via SWR
  const fetcher = (url: string) => fetch(url).then((res: Response) => res.json())
  const swrConfig = { revalidateOnFocus: false, dedupingInterval: 600000 }

  const { data: unitsResponse } = useSWR('/api/units', fetcher, swrConfig)
  const unitOptions = unitsResponse?.data || []
  const { data: rankResponse } = useSWR('/api/ranks', fetcher, swrConfig)
  const rankOptions = Array.isArray(rankResponse) ? rankResponse : []

  const { data: positionResponse } = useSWR('/api/positions', fetcher, swrConfig)
  const positionOptions = Array.isArray(positionResponse) ? positionResponse : []

  const { data: vusResponse } = useSWR('/api/vus', fetcher, swrConfig)
  const vusOptions = Array.isArray(vusResponse) ? vusResponse : []

  // dialog and UI states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isMoveOpen, setIsMoveOpen] = useState(false)
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [openPersonSelect, setOpenPersonSelect] = useState(false)
  const [openRankSelect, setOpenRankSelect] = useState(false)
  const [openVusSelect, setOpenVusSelect] = useState(false)
  const [openUnitSelect, setOpenUnitSelect] = useState(false)
  const [openPositionSelect, setOpenPositionSelect] = useState(false)
  const [openCategorySelect, setOpenCategorySelect] = useState(false)
  const [openStatusSelect, setOpenStatusSelect] = useState(false)

  const [openEditUnitSelect, setOpenEditUnitSelect] = useState(false)
  const [openEditPositionSelect, setOpenEditPositionSelect] = useState(false)
  const [openEditStatusSelect, setOpenEditStatusSelect] = useState(false)
  const [openEditRankSelect, setOpenEditRankSelect] = useState(false)
  const [openEditCategorySelect, setOpenEditCategorySelect] = useState(false)
  const [openEditVusSelect, setOpenEditVusSelect] = useState(false)
  const [openMoveUnitSelect, setOpenMoveUnitSelect] = useState(false)

  const [physicalPersonOptions, setPhysicalPersonOptions] = useState<any[]>([])
  const [isSearchingPeople, setIsSearchingPeople] = useState(false)
  const [currentMember, setCurrentMember] = useState<any>(null)

  const [formErrors, setFormErrors] = useState<any>({})
  const [form, setForm] = useState({
    personId: "",
    pnr: "",
    rankId: "",
    unitId: lockedUnitId || "",
    positionId: "",
    vusId: "",
    category: "Офицер",
    status: "active" as "active" | "reserve" | "retired"
  })

  // --- Helpers & Handlers ---

  const t = useCallback((ru: string, uzL: string, uzC: string) => {
    if (locale === "ru") return ru;
    if (locale === "uzLatn") return uzL;
    return uzC;
  }, [locale])

  const getLocalizedName = useCallback((item: any) => {
    if (!item) return ""
    if (typeof item === 'string') return item
    const nameData = item.name;
    if (nameData && typeof nameData === 'object') {
      if (locale === "uzLatn") return nameData.uz || nameData.ru || ""
      if (locale === "uzCyrl") return nameData.uzk || nameData.ru || ""
      return nameData.ru || ""
    }
    if (locale === "uzLatn") return item.nameUzLatn || item.name || item.title || item.label || ""
    if (locale === "uzCyrl") return item.nameUzCyrl || item.name || item.title || item.label || ""
    return item.nameRu || item.name || item.title || item.label || ""
  }, [locale])

  const getUnitName = useCallback((unit: any) => {
    if (!unit) return ""
    if (unit.name && typeof unit.name === 'object') {
      return locale === 'ru' ? unit.name.ru : (locale === 'uzLatn' ? unit.name.uz : unit.name.uzk)
    }
    return getLocalizedName(unit)
  }, [locale, getLocalizedName])

  const getUnitDistrict = useCallback((unit: any) => {
    if (!unit) return "—"
    if (unit.district) {
      if (typeof unit.district.shortName === 'object' && unit.district.shortName) {
        const sn = unit.district.shortName
        if (locale === "uzLatn") return sn.uz || sn.ru
        if (locale === "uzCyrl") return sn.uzk || sn.ru
        return sn.ru
      }
      if (typeof unit.district.name === 'object' && unit.district.name) {
        const n = unit.district.name
        if (locale === "uzLatn") return n.uz || n.ru
        if (locale === "uzCyrl") return n.uzk || n.ru
        return n.ru
      }
      return unit.district.shortName || unit.district.name || "—"
    }
    return "—"
  }, [locale])

  const getUnitLocation = useCallback((unit: any) => {
    if (!unit) return "—"
    if (unit.area) {
      const n = unit.area.name
      if (n && typeof n === 'object') {
        if (locale === "uzLatn") return n.uz || n.ru
        if (locale === "uzCyrl") return n.uzk || n.ru
        return n.ru
      }
      return unit.area.name || unit.location || "—"
    }
    return unit.location || "—"
  }, [locale])

  const getUnitRegion = useCallback((unit: any) => {
    if (!unit) return ""
    if (unit.area?.region) {
      const n = unit.area.region.name
      if (n && typeof n === 'object') {
        if (locale === "uzLatn") return n.uz || n.ru
        if (locale === "uzCyrl") return n.uzk || n.ru
        return n.ru
      }
      return unit.area.region.name || ""
    }
    return ""
  }, [locale])

  const getAvatarColor = useCallback((id: number) => {
    const colors = [
      "bg-blue-100 text-blue-600 border-blue-200",
      "bg-emerald-100 text-emerald-600 border-emerald-200",
      "bg-violet-100 text-violet-600 border-violet-200",
      "bg-amber-100 text-amber-600 border-amber-200",
      "bg-rose-100 text-rose-600 border-rose-200",
      "bg-slate-100 text-slate-600 border-slate-200",
    ]
    return colors[(id || 0) % colors.length]
  }, [])

  const getInitials = useCallback((person: any) => {
    if (!person) return "?"
    return `${person.lastName?.[0] || ''}${person.firstName?.[0] || ''}`
  }, [])

  const router = useRouter()
  const pathname = usePathname()
  const fetchPersonnel = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', (pagination.pageIndex + 1).toString())
      params.set('limit', pagination.pageSize.toString())

      if (globalFilter) params.set('search', globalFilter)
      if (sorting.length > 0) {
        params.set('sort', sorting[0].id)
        params.set('order', sorting[0].desc ? 'desc' : 'asc')
      }

      // Add column filters
      Object.entries(columnFiltersObj).forEach(([id, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(id, value.toString())
        }
      })

      // Special handling for lockedUnitId
      if (lockedUnitId) params.set('unitId', lockedUnitId)

      // Add cache buster to URL to ensure fresh data
      params.set('_t', Date.now().toString())

      const response = await fetch(`/api/personnel?${params.toString()}`, { cache: 'no-store' })
      const rawResult = await response.json()

      // Map snake_case to camelCase and resolve localization objects
      const mappedData = (rawResult.data || []).map((m: any) => {
        const physicalPerson = m.ref_physical_persons ? {
          ...m.ref_physical_persons,
          lastName: m.ref_physical_persons.last_name,
          firstName: m.ref_physical_persons.first_name,
          middleName: m.ref_physical_persons.middle_name,
          pinfl: m.ref_physical_persons.pinfl,
        } : null;

        return {
          ...m,
          physicalPersonId: m.physical_person_id,
          rankId: m.rank_id,
          unitId: m.unit_id,
          positionId: m.position_id,
          vusId: m.vus_id,
          physicalPerson,
          rank: getLocalizedName(m.ref_ranks),
          position: getLocalizedName(m.ref_positions),
          unit: m.ref_units ? {
            ...m.ref_units,
            unitId: m.ref_units.unit_id,
            name: m.ref_units.name,
            district: m.ref_units.ref_military_districts,
            area: m.ref_units.ref_areas
          } : null,
          vus: m.ref_vus_list,
          dislocation: m.dislocation || (m.ref_units?.ref_areas ? getLocalizedName(m.ref_units.ref_areas) : "")
        }
      })

      setPersonnel(mappedData)
      setTotalCount(rawResult.total || 0)
    } catch (error) {
      console.error("Failed to fetch personnel", error)
      toast.error("Ошибка при загрузке данных")
    } finally {
      setIsLoading(false)
    }
  }, [pagination, sorting, columnFiltersObj, globalFilter, lockedUnitId, getLocalizedName])

  const isPersonnelPage = pathname?.includes('/personnel/personnel')

  const handleViewCard = useCallback((member: any) => {
    if (navigateOnView) {
      router.push(`/personnel/view/${member.id}?mode=personnel`)
    } else {
      setCurrentMember(member)
      setIsCardOpen(true)
    }
  }, [navigateOnView, router])

  const handleEditInit = useCallback((member: any) => {
    setCurrentMember(member)
    setFormErrors({})
    setForm({
      personId: member.physicalPersonId?.toString() || member.personId?.toString(),
      pnr: member.pnr,
      rankId: member.rankId?.toString() || "",
      unitId: member.unitId?.toString() || "",
      positionId: member.positionId?.toString() || "",
      vusId: member.vusId?.toString() || "",
      category: member.category,
      status: member.status
    })
    setIsEditOpen(true)
  }, [])

  const handleDelete = useCallback(async (id: number) => {
    if (confirm(t("Вы уверены, что хотите уволить этого сотрудника?", "Haqiqatan ham bu xodimni bo'shatmoqchimisiz?", "Ҳақиқатан ҳам бу ходимни бўшатмоқчимисиз?"))) {
      try {
        await deletePersonnel(id);
        fetchPersonnel(); // Reload from server
        toast.success(t("Сотрудник успешно уволен", "Xodim muvaffaqiyatli bo'shatildi", "Ходим муваффақиятли бўшатилди"))
      } catch (error: any) {
        console.error(error);
        toast.error("Ошибка при удалении");
      }
    }
  }, [t, fetchPersonnel])


  useEffect(() => {
    fetchPersonnel()
  }, [fetchPersonnel])

  // Fetch Physical Persons (debounced or on open)
  const fetchPhysicalPersons = async (query: string = "") => {
    setIsSearchingPeople(true)
    try {
      const response = await fetch(`/api/physical-persons?search=${encodeURIComponent(query)}`)
      const result = await response.json()
      // Map snake_case to camelCase
      const mappedData = (result.data || []).map((p: any) => ({
        ...p,
        lastName: p.last_name,
        firstName: p.first_name,
        middleName: p.middle_name
      }))
      setPhysicalPersonOptions(mappedData || [])
    } catch (error) {
      console.error("Failed to fetch people", error)
    } finally {
      setIsSearchingPeople(false)
    }
  }

  // Load initial options when dialog opens
  useEffect(() => {
    if (isAddOpen || isEditOpen) {
      fetchPhysicalPersons()
    }
  }, [isAddOpen, isEditOpen])


  const resetForm = useCallback(() => {
    setFormErrors({})
    setForm({
      personId: "",
      pnr: "",
      rankId: "",
      unitId: "",
      positionId: "",
      vusId: "",
      category: "Офицер",
      status: "active" as "active" | "reserve" | "retired"
    })
  }, [])

  const handleAdd = useCallback(async () => {
    const result = personnelSchema.safeParse(form)
    if (!result.success) {
      setFormErrors(result.error.format())
      toast.error(t("Проверьте правильность заполнения полей", "Maydonlarni to'ldirishda xatolik", "Майдонларни тўлдиришда хатолик"))
      return
    }

    setIsLoading(true)
    try {
      await savePersonnel({
        pnr: form.pnr,
        personId: form.personId,
        rankId: form.rankId,
        unitId: form.unitId,
        positionId: form.positionId,
        vusId: form.vusId,
        category: form.category,
        status: form.status,
      });

      setIsAddOpen(false)
      resetForm()
      fetchPersonnel()
      toast.success(t("Военнослужащий принят на службу", "Harbiy xizmatchi xizmatga qabul qilindi", "Ҳарбий хизматчи хизматга қабул қилинди"))
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Ошибка при сохранении");
    } finally {
      setIsLoading(false)
    }
  }, [form, t, resetForm, fetchPersonnel])

  const handleEditSave = useCallback(async () => {
    const result = personnelSchema.safeParse(form)
    if (!result.success) {
      setFormErrors(result.error.format())
      toast.error(t("Проверьте правильность заполнения полей", "Maydonlarni to'ldirishda xatolik", "Майдонларни тўлдиришда хатолик"))
      return
    }

    if (!currentMember?.id) {
      toast.error("Invalid personnel item");
      return;
    }

    setIsLoading(true);
    try {
      await savePersonnel({
        id: currentMember.id,
        pnr: form.pnr,
        personId: form.personId,
        rankId: form.rankId,
        unitId: form.unitId,
        positionId: form.positionId,
        vusId: form.vusId,
        category: form.category,
        status: form.status,
      });

      toast.success(t("Данные успешно обновлены", "Ma'lumotlar muvaffaqiyatli yangilandi", "Маълумотлар муваффақиятли янгиланди"))
      setIsEditOpen(false)
      fetchPersonnel()
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Ошибка при сохранении");
    } finally {
      setIsLoading(false);
    }
  }, [form, currentMember, t, fetchPersonnel])

  const handleMoveInit = useCallback((member: any) => {
    setCurrentMember(member)
    setForm({ ...form, unitId: member.unitId?.toString() || "" })
    setIsMoveOpen(true)
  }, [form])

  const handleMoveSave = useCallback(async () => {
    if (!form.unitId) {
      toast.error(t("Выберите новую часть", "Yangi qismni tanlang", "Янги қисмни танланг"))
      return
    }

    setIsLoading(true)
    try {
      await savePersonnel({
        id: currentMember.id,
        unitId: form.unitId,
      });

      setIsMoveOpen(false)
      fetchPersonnel()
      toast.success(t("Военнослужащий успешно перемещен", "Harbiy xizmatchi muvaffaqiyatli ko'chirildi", "Ҳарбий хизматчи муваффақиятли кўчирилди"))
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Ошибка при перемещении");
    } finally {
      setIsLoading(false)
    }
  }, [form.unitId, currentMember, t, fetchPersonnel])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-none shadow-xl shadow-primary/5 bg-white/60 backdrop-blur-xl overflow-hidden text-slate-900">
        <CardHeader className="relative pb-8 border-b border-border/50">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <UserCheck className="h-32 w-32" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shadow-inner">
                  <UserCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-3xl font-extrabold tracking-tight">
                  {lockedUnitId === "208"
                    ? t("Реестр инспекторов", "Inspektorlar reyestri", "Инспекторлар реестри")
                    : t("Реестр личного состава", "Shaxsiy tarkib reyestri", "Шахсий таркиб реестри")}
                </CardTitle>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 flex-1 justify-end">
              <TechnicalNameBadge name="Personnel" />
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("Принять на службу", "Xizmatga qabul qilish", "Хизматга қабул қилиш")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl rounded-3xl border-none shadow-2xl backdrop-blur-2xl bg-white/95 z-[9999]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{t("Прием на военную службу", "Harbiy xizmatga qabul qilish", "Ҳарбий хизматга қабул қилиш")}</DialogTitle>
                    <DialogDescription className="text-base font-medium">
                      {t(
                        "Свяжите физическое лицо с должностью и воинской частью",
                        "Jismoniy shaxsni lavozim va harbiy qism bilan bog'lang",
                        "Жисмоний шахсни лавозим ва ҳарбий қисм билан боғланг"
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-6 font-medium">
                    <div className="space-y-2.5">
                      <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("Выберите физическое лицо", "Jismoniy shaxsni tanlang", "Жисмоний шахсни танланг")}</Label>
                      <Popover open={openPersonSelect} onOpenChange={setOpenPersonSelect}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openPersonSelect}
                            className="w-full justify-between h-12 rounded-xl bg-muted/30 border-none font-normal hover:bg-muted/50"
                          >
                            {form.personId
                              ? (() => {
                                const p = physicalPersonOptions.find((p: PhysicalPerson) => p.id?.toString() || "" === form.personId);
                                return p ? `${p.lastName} ${p.firstName} (${maskPINFL(p.pinfl)})` : t("Физическое лицо не выбрано", "Jismoniy shaxs tanlanmadi", "Жисмоний шахс танланмади")
                              })()
                              : t("Поиск по ФИО или ПИНФЛ", "FIO yoki PINFL bo'yicha qidirish", "ФИО ёки ПИНФЛ бўйича қидириш")}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[450px] p-0 rounded-2xl border-none shadow-2xl z-[10000]" align="start">
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder={t("Поиск физического лица...", "Jismoniy shaxsni qidirish...", "Жисмоний шахсни қидириш...")}
                              onValueChange={(val) => fetchPhysicalPersons(val)}
                            />
                            <CommandList>
                              <CommandEmpty>{isSearchingPeople ? "Поиск..." : t("Ничего не найдено.", "Hech narsa topilmadi.", "Ҳеч нарса топилмади.")}</CommandEmpty>
                              <CommandGroup>
                                {physicalPersonOptions.map((p: PhysicalPerson) => (
                                  <CommandItem
                                    key={p.id}
                                    value={`${p.lastName} ${p.firstName} ${p.middleName || ""} ${p.pinfl}`}
                                    onSelect={() => {
                                      setForm({ ...form, personId: p.id?.toString() || "" })
                                      setOpenPersonSelect(false)
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        form.personId === p.id?.toString() || "" ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-bold">{p.lastName} {p.firstName} <span className="text-muted-foreground font-normal ml-1">{p.middleName}</span></span>
                                      <span className="text-xs text-muted-foreground font-mono">ПИНФЛ: {maskPINFL(p.pinfl)}</span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {formErrors?.personId && (
                        <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.personId._errors[0]}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("Личный номер (ПНР)", "Shaxsiy raqam (PNR)", "Шахсий рақам (ПНР)")}</Label>
                        <Input
                          placeholder="Щ-123456"
                          value={form.pnr}
                          onChange={(e) => setForm({ ...form, pnr: e.target.value })}
                          className="h-12 rounded-xl bg-muted/30 border-none font-mono font-bold"
                        />
                        {formErrors?.pnr && (
                          <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.pnr._errors[0]}</p>
                        )}
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("Воинское звание", "Harbiy unvon", "Ҳарбий унвон")}</Label>
                        <Popover open={openRankSelect} onOpenChange={setOpenRankSelect}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openRankSelect}
                              className="w-full justify-between h-12 rounded-xl bg-muted/30 border-none font-normal"
                            >
                              {form.rankId
                                ? getLocalizedName(rankOptions.find((r: any) => r.title === form.rankId || r.code === form.rankId) || form.rankId)
                                : t("Выберите звание", "Unvonni tanlang", "Унвонни танланг")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0 rounded-2xl border-none shadow-2xl z-[10000]" align="start">
                            <Command>
                              <CommandInput placeholder={t("Поиск звания...", "Unvonni qidirish...", "Унвонни қидириш...")} />
                              <CommandList>
                                <CommandEmpty>{t("Ничего не найдено.", "Hech narsa topilmadi.", "Ҳеч нарса топилмади.")}</CommandEmpty>
                                <CommandGroup>
                                  {rankOptions.map((rank: any) => (
                                    <CommandItem
                                      key={rank.rank_id || rank.rankId || rank.id || rank.code}
                                      value={getLocalizedName(rank)}
                                      onSelect={() => {
                                        setForm({ ...form, rankId: rank.rankId?.toString() || "" })
                                        setOpenRankSelect(false)
                                      }}
                                      className="cursor-pointer"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          form.rankId === (rank.title || rank.nameRu) ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {getLocalizedName(rank)}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {formErrors?.rank && (
                          <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.rank._errors[0]}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("Категория", "Toifa", "Категория")}</Label>
                        <Popover open={openCategorySelect} onOpenChange={setOpenCategorySelect}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openCategorySelect}
                              className="w-full justify-between h-12 rounded-xl bg-muted/30 border-none font-normal hover:bg-muted/50 text-slate-900"
                            >
                              {form.category || t("Выберите категорию", "Toifani tanlang", "Тоифани танланг")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0 rounded-2xl border-none shadow-2xl z-[10000]" align="start">
                            <Command>
                              <CommandList>
                                <CommandGroup>
                                  {["Офицер", "Сержант", "Рядовой"].map((cat) => (
                                    <CommandItem
                                      key={cat}
                                      value={cat}
                                      onSelect={() => {
                                        setForm({ ...form, category: cat as any })
                                        setOpenCategorySelect(false)
                                      }}
                                      className="rounded-xl cursor-pointer"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          form.category === cat ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {cat}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {formErrors?.category && (
                          <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.category._errors[0]}</p>
                        )}
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("ВУС", "HHRM", "ВУС")}</Label>
                        <Popover open={openVusSelect} onOpenChange={setOpenVusSelect}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openVusSelect}
                              className="w-full justify-between h-12 rounded-xl bg-muted/30 border-none font-normal"
                            >
                              {form.vusId
                                ? (() => {
                                  const v = vusOptions.find((v: any) => v.code === form.vusId || v.id?.toString() === form.vusId);
                                  return v ? `${v.code} - ${getLocalizedName(v)}` : form.vusId
                                })()
                                : t("Выберите ВУС", "HHRMni tanlang", "ВУСни танланг")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[450px] p-0 rounded-2xl border-none shadow-2xl z-[10000]" align="start">
                            <Command>
                              <CommandInput placeholder={t("Поиск ВУС...", "HHRMni qidirish...", "ВУСни қидириш...")} />
                              <CommandList>
                                <CommandEmpty>{t("Ничего не найдено.", "Hech narsa topilmadi.", "Ҳеч нарса топилмади.")}</CommandEmpty>
                                <CommandGroup>
                                  {vusOptions.map((v: any) => (
                                    <CommandItem
                                      key={v.id}
                                      value={`${v.code} ${getLocalizedName(v)}`}
                                      onSelect={() => {
                                        setForm({ ...form, vusId: v.id?.toString() || "" })
                                        setOpenVusSelect(false)
                                      }}
                                      className="cursor-pointer"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          form.vusId === (v.code || v.id?.toString()) ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <div className="flex flex-col gap-0.5">
                                        <span className="font-bold underline decoration-primary/30 decoration-2 underline-offset-2">
                                          {v.code}
                                        </span>
                                        <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                          {getLocalizedName(v)}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {formErrors?.vus && (
                          <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.vus._errors[0]}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("Воинская часть", "Harbiy qism", "Ҳарбий қисм")}</Label>
                        <Popover open={openUnitSelect} onOpenChange={setOpenUnitSelect}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openUnitSelect}
                              className="w-full justify-between h-12 rounded-xl bg-muted/30 border-none font-normal"
                            >
                              {form.unitId
                                ? (() => {
                                  const u = unitOptions.find((u: any) => u.unitId?.toString() === form.unitId);
                                  return u ? `${u.unitId} ${getUnitName(u)}` : form.unitId
                                })()
                                : t("Выберите часть", "Qismni tanlang", "Қисмни танланг")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[450px] p-0 rounded-2xl border-none shadow-2xl z-[10000]" align="start">
                            <Command>
                              <CommandInput placeholder={t("Поиск части...", "Qismni qidirish...", "Қисмни қидириш...")} />
                              <CommandList>
                                <CommandEmpty>{t("Ничего не найдено.", "Hech narsa topilmadi.", "Ҳеч нарса топилмади.")}</CommandEmpty>
                                <CommandGroup>
                                  {unitOptions.slice(0, 50).map((u: any) => (
                                    <CommandItem
                                      key={u.unit_id || u.unitId || u.id}
                                      value={`${u.unitId || u.unit_code} ${getUnitName(u)}`}
                                      onSelect={() => {
                                        setForm({ ...form, unitId: u.unitId?.toString() || "" })
                                        setOpenUnitSelect(false)
                                      }}
                                      className="cursor-pointer"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          form.unitId === u.unitId?.toString() ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <span className="font-bold mr-2 text-primary">{u.unitId}</span>
                                      <span className="text-xs text-muted-foreground">{getUnitName(u)}</span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {formErrors?.unitStateId && (
                          <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.unitStateId._errors[0]}</p>
                        )}
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("Текущая должность", "Joriy lavozim", "Жорий лавозим")}</Label>
                        <Popover open={openPositionSelect} onOpenChange={setOpenPositionSelect}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openPositionSelect}
                              className="w-full justify-between h-12 rounded-xl bg-muted/30 border-none font-normal"
                            >
                              {form.positionId
                                ? (() => {
                                  const p = positionOptions.find((p: any) => p.name === form.positionId || p.nameRu === form.positionId);
                                  return p ? getLocalizedName(p) : form.positionId
                                })()
                                : t("Выберите должность", "Lavozimni tanlang", "Лавозимни танланг")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[450px] p-0 rounded-2xl border-none shadow-2xl z-[10000]" align="start">
                            <Command>
                              <CommandInput placeholder={t("Поиск должности...", "Lavozimni qidirish...", "Лавозимни қидириш...")} />
                              <CommandList>
                                <CommandEmpty>{t("Ничего не найдено.", "Hech narsa topilmadi.", "Ҳеч нарса топилмади.")}</CommandEmpty>
                                <CommandGroup>
                                  {positionOptions.map((p: any) => (
                                    <CommandItem
                                      key={p.id}
                                      value={`${getLocalizedName(p)}`}
                                      onSelect={() => {
                                        setForm({ ...form, positionId: p.id?.toString() || "" })
                                        setOpenPositionSelect(false)
                                      }}
                                      className="cursor-pointer"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          form.positionId === (p.nameRu || p.name) ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {getLocalizedName(p)}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {formErrors?.position && (
                          <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.position._errors[0]}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("Статус", "Status", "Статус")}</Label>
                      <Popover open={openStatusSelect} onOpenChange={setOpenStatusSelect}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openStatusSelect}
                            className="w-full justify-between h-12 rounded-xl bg-muted/30 border-none font-normal hover:bg-muted/50 text-slate-900"
                          >
                            {(() => {
                              const statuses = [
                                { val: "active", label: t("Активен", "Faol", "Актив") },
                                { val: "reserve", label: t("В запасе", "Zaxirada", "Захирада") },
                                { val: "retired", label: t("В отставке", "Iste'fodagi", "Истеъфодаги") },
                              ]
                              return statuses.find((s: any) => s.val === form.status)?.label || form.status
                            })()}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0 rounded-2xl border-none shadow-2xl z-[10000]" align="start">
                          <Command>
                            <CommandList>
                              <CommandGroup>
                                {[
                                  { val: "active", label: t("Активен", "Faol", "Актив") },
                                  { val: "reserve", label: t("В запасе", "Zaxirada", "Захирада") },
                                  { val: "retired", label: t("В отставке", "Iste'fodagi", "Истеъфодаги") },
                                ].map((s: any) => (
                                  <CommandItem
                                    key={s.val}
                                    value={s.label}
                                    onSelect={() => {
                                      setForm({ ...form, status: s.val as any })
                                      setOpenStatusSelect(false)
                                    }}
                                    className="rounded-xl cursor-pointer"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        form.status === s.val ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {s.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {formErrors?.status && (
                        <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.status._errors[0]}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6">
                    <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl h-11 px-6 font-bold">
                      {t("Отмена", "Bekor qilish", "Бекор қилиш")}
                    </Button>
                    <Button onClick={handleAdd} className="rounded-xl h-11 px-8 shadow-lg shadow-primary/20 font-bold transition-all hover:scale-[1.02]">
                      {t("Принять на службу", "Qabul qilish", "Қабул қилиш")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div >
        </CardHeader >

        <CardContent className="p-0">
          <PersonnelTable
            data={personnel}
            totalCount={totalCount}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortingChange={setSorting}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            isLoading={isLoading}
            onView={handleViewCard}
            onEdit={handleEditInit}
            onMove={handleMoveInit}
            onDelete={handleDelete}
            rankOptions={rankOptions}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(val) => { setIsEditOpen(val); if (!val) resetForm(); }}>
        <DialogContent className="max-w-2xl rounded-3xl border-none shadow-2xl backdrop-blur-2xl bg-white/95 z-[9999]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                <Edit className="h-5 w-5" />
              </div>
              <DialogTitle className="text-2xl font-bold">{t("Редактирование данных", "Ma'lumotlarni tahrirlash", "Маълумотларни таҳрирлаш")}</DialogTitle>
            </div>
            <DialogDescription className="text-base font-medium">
              {currentMember?.person?.lastName} {currentMember?.person?.firstName} {currentMember?.person?.middleName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6 font-medium">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("Личный номер", "Shaxsiy raqam", "Шахсий рақам")}</Label>
                <Input
                  value={form.pnr}
                  onChange={(e) => setForm({ ...form, pnr: e.target.value })}
                  className="h-12 rounded-xl bg-muted/30 border-none font-bold font-mono text-slate-900"
                />
                {formErrors?.pnr && (
                  <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.pnr._errors[0]}</p>
                )}
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("Воинское звание", "Harbiy unvon", "Ҳарбий унвон")}</Label>
                <Popover open={openEditRankSelect} onOpenChange={setOpenEditRankSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openEditRankSelect}
                      className="w-full justify-between h-12 rounded-xl bg-muted/30 border-none font-normal hover:bg-muted/50"
                    >
                      {form.rankId ? getLocalizedName(rankOptions.find((r: any) => (r.rank_id || r.rankId || r.id)?.toString() === form.rankId)) : <span className="text-muted-foreground">{t("Выберите звание", "Unvonni tanlang", "Унвонни танланг")}</span>}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={t("Поиск звания...", "Unvon qidirish...", "Унвон қидириш...")} />
                      <CommandList>
                        <CommandEmpty>{t("Звание не найдено", "Unvon topilmadi", "Унвон топилмади")}</CommandEmpty>
                        <CommandGroup>
                          {rankOptions.map((r: any) => (
                            <CommandItem
                              key={r.rank_id || r.rankId || r.id || r.code}
                              value={getLocalizedName(r)}
                              onSelect={() => {
                                setForm({ ...form, rankId: (r.rank_id || r.rankId || r.id)?.toString() || "" })
                                setOpenEditRankSelect(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  form.rankId === (r.rank_id || r.rankId || r.id)?.toString() ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {getLocalizedName(r)}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formErrors?.rank && (
                  <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.rank._errors[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("Категория", "Toifa", "Категория")}</Label>
                <Popover open={openEditCategorySelect} onOpenChange={setOpenEditCategorySelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openEditCategorySelect}
                      className="w-full justify-between h-12 rounded-xl bg-muted/30 border-none font-normal hover:bg-muted/50"
                    >
                      {form.category ? form.category : <span className="text-muted-foreground">{t("Выберите категорию", "Toifani tanlang", "Тоифани танланг")}</span>}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={t("Поиск категории...", "Toifa qidirish...", "Тоифа қидириш...")} />
                      <CommandList>
                        <CommandEmpty>{t("Категория не найдена", "Toifa topilmadi", "Тоифа топилмади")}</CommandEmpty>
                        <CommandGroup>
                          {["Офицер", "Сержант", "Рядовой"].map((cat) => (
                            <CommandItem
                              key={cat}
                              value={cat}
                              onSelect={(currentValue) => {
                                setForm({ ...form, category: currentValue })
                                setOpenEditCategorySelect(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  form.category === cat ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {cat}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formErrors?.category && (
                  <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.category._errors[0]}</p>
                )}
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("ВУС", "HHRM", "ВУС")}</Label>
                <Popover open={openEditVusSelect} onOpenChange={setOpenEditVusSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openEditVusSelect}
                      className="w-full justify-between h-12 rounded-xl bg-muted/30 border-none font-normal hover:bg-muted/50"
                    >
                      {form.vusId ? (
                        (() => {
                          const v = vusOptions.find((v: any) => v.code === form.vusId || v.id?.toString() === form.vusId)
                          return v ? v.code : form.vusId
                        })()
                      ) : (
                        <span className="text-muted-foreground">{t("Выберите ВУС", "HHRMni tanlang", "ВУСни танланг")}</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={t("Поиск ВУС...", "HHRM qidirish...", "ВУС қидириш...")} />
                      <CommandList>
                        <CommandEmpty>{t("ВУС не найден", "HHRM topilmadi", "ВУС топилмади")}</CommandEmpty>
                        <CommandGroup>
                          {vusOptions.map((v: any) => (
                            <CommandItem
                              key={v.id || v.code}
                              value={`${v.code} ${getLocalizedName(v)}`}
                              onSelect={() => {
                                setForm({ ...form, vusId: v.id?.toString() || "" })
                                setOpenEditVusSelect(false)
                              }}
                              className="flex flex-col items-start gap-1 py-2"
                            >
                              <div className="flex items-center gap-2 w-full">
                                <Check
                                  className={cn(
                                    "h-4 w-4 shrink-0",
                                    form.vusId === (v.code || v.id?.toString()) ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <span className="font-bold font-mono">{v.code}</span>
                              </div>
                              <span className="text-xs text-muted-foreground pl-6 line-clamp-2">
                                {getLocalizedName(v)}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formErrors?.vus && (
                  <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.vus._errors[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("Воинская часть", "Harbiy qism", "Ҳарбий қисм")}</Label>
                <Popover open={openEditUnitSelect} onOpenChange={setOpenEditUnitSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openEditUnitSelect}
                      className="w-full justify-between h-12 rounded-xl bg-muted/30 border-none font-normal hover:bg-muted/50"
                    >
                      {form.unitId ? (
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold text-primary">{form.unitId}</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {(() => {
                              const u = unitOptions.find((u: any) => (u.unit_id || u.unitId)?.toString() === form.unitId)
                              return u ? getUnitName(u) : ""
                            })()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">{t("Выберите часть", "Qismni tanlang", "Қисмни танланг")}</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={t("Поиск части...", "Qism qidirish...", "Қисм қидириш...")} />
                      <CommandList>
                        <CommandEmpty>{t("Часть не найдена", "Qism topilmadi", "Қисм топилмади")}</CommandEmpty>
                        <CommandGroup>
                          {unitOptions.slice(0, 50).map((u: any) => (
                            <CommandItem
                              key={u.unit_id || u.unitId || u.id}
                              value={`${u.unitId || u.unit_code} ${getUnitName(u)}`}
                              onSelect={() => {
                                setForm({ ...form, unitId: (u.unit_id || u.unitId)?.toString() || "" })
                                setOpenEditUnitSelect(false)
                              }}
                              className="flex flex-col items-start gap-1 py-2"
                            >
                              <div className="flex items-center gap-2 w-full">
                                <Check
                                  className={cn(
                                    "h-4 w-4 shrink-0",
                                    form.unitId === (u.unit_id || u.unitId)?.toString() ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <span className="font-bold text-primary">{u.unitId}</span>
                                <span className="truncate flex-1">{getUnitName(u)}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formErrors?.unitStateId && (
                  <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.unitStateId._errors[0]}</p>
                )}
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("Текущая должность", "Joriy lavozim", "Жорий лавозим")}</Label>
                <Popover open={openEditPositionSelect} onOpenChange={setOpenEditPositionSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openEditPositionSelect}
                      className="w-full justify-between h-12 rounded-xl bg-muted/30 border-none font-normal hover:bg-muted/50"
                    >
                      {form.positionId ? (
                        (() => {
                          const p = positionOptions.find((p: any) => p.id?.toString() === form.positionId)
                          return p ? getLocalizedName(p) : form.positionId
                        })()
                      ) : (
                        <span className="text-muted-foreground">{t("Выберите должность", "Lavozimni tanlang", "Лавозимни танланг")}</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={t("Поиск должности...", "Lavozim qidirish...", "Лавозим қидириш...")} />
                      <CommandList>
                        <CommandEmpty>{t("Должность не найдена", "Lavozim topilmadi", "Лавозим топилмади")}</CommandEmpty>
                        <CommandGroup>
                          {positionOptions.map((p: any) => (
                            <CommandItem
                              key={p.id}
                              value={getLocalizedName(p)}
                              onSelect={() => {
                                setForm({ ...form, positionId: p.id?.toString() || "" })
                                setOpenEditPositionSelect(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  form.positionId === p.id?.toString() ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {getLocalizedName(p)}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formErrors?.position && (
                  <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.position._errors[0]}</p>
                )}
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider uppercase tracking-wider">{t("Статус", "Status", "Статус")}</Label>
                <Popover open={openEditStatusSelect} onOpenChange={setOpenEditStatusSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openEditStatusSelect}
                      className="w-full justify-between h-12 rounded-xl bg-muted/30 border-none font-normal hover:bg-muted/50"
                    >
                      {form.status ? (
                        (() => {
                          const statuses = [
                            { val: "active", label: t("Активен", "Faol", "Актив") },
                            { val: "reserve", label: t("В запасе", "Zaxirada", "Захирада") },
                            { val: "retired", label: t("В отставке", "Iste'fodagi", "Истеъфодаги") },
                          ]
                          return statuses.find((s: any) => s.val === form.status)?.label || form.status
                        })()
                      ) : (
                        <span className="text-muted-foreground">{t("Выберите статус", "Statusni tanlang", "Статусни танланг")}</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {[
                            { val: "active", label: t("Активен", "Faol", "Актив") },
                            { val: "reserve", label: t("В запасе", "Zaxirada", "Захирада") },
                            { val: "retired", label: t("В отставке", "Iste'fodagi", "Истеъфодаги") },
                          ].map((s: any) => (
                            <CommandItem
                              key={s.val}
                              value={s.label}
                              onSelect={() => {
                                setForm({ ...form, status: s.val as any })
                                setOpenEditStatusSelect(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  form.status === s.val ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {s.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formErrors?.status && (
                  <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.status._errors[0]}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setIsEditOpen(false)} className="rounded-xl h-11 px-6 font-bold">
                {t("Отмена", "Bekor qilish", "Бекор қилиш")}
              </Button>
              <Button onClick={handleEditSave} className="rounded-xl h-11 px-8 shadow-lg shadow-primary/20 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                {t("Сохранить изменения", "O'zgarishlarni saqlash", "Ўзгаришларни сақлаш")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog >

      {/* Move Dialog */}
      < Dialog open={isMoveOpen} onOpenChange={setIsMoveOpen} >
        <DialogContent className="max-w-md rounded-3xl border-none shadow-2xl backdrop-blur-2xl bg-white/95 z-[9999]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                <MapPin className="h-5 w-5" />
              </div>
              <DialogTitle className="text-2xl font-bold">{t("Перемещение", "Ko'chirish", "Кўчириш")}</DialogTitle>
            </div>
            <DialogDescription className="text-base font-medium">
              {t(
                "Перевод военнослужащего в другую воинскую часть",
                "Harbiy xizmatchini boshqa harbiy qismga o'tkazish",
                "Ҳарбий хизматчини бошқа ҳарбий қисмга ўтказиш"
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6 font-medium">
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 shadow-inner">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-md border-2",
                  currentMember ? getAvatarColor(currentMember.id) : ""
                )}>
                  {currentMember ? getInitials(currentMember.person) : "?"}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-black text-primary/70 uppercase tracking-[0.2em] mb-1">{currentMember?.rank}</div>
                  <div className="font-extrabold text-lg truncate leading-tight">
                    {currentMember?.person?.lastName} {currentMember?.person?.firstName}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider pl-1">
                {t("Новая воинская часть", "Yangi harbiy qism", "Янги ҳарбий қисм")}
              </Label>
              <Popover open={openMoveUnitSelect} onOpenChange={setOpenMoveUnitSelect}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={openMoveUnitSelect}
                    className="h-16 pl-4 w-full justify-start text-left rounded-2xl bg-muted/30 hover:bg-muted/50 border-none font-bold text-xl text-slate-900"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Landmark className="h-5 w-5 text-emerald-600 shrink-0" />
                      <div className="flex-1 truncate">
                        {form.unitId ? (
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-base">
                              {form.unitId}
                            </span>
                            <span className="text-lg truncate">
                              {(() => {
                                const u = unitOptions.find((u: any) => (u.unit_id || u.unitId)?.toString() === form.unitId)
                                return u ? getUnitName(u) : ""
                              })()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground font-normal text-base">
                            {t("Выберите новую часть", "Yangi qismni tanlang", "Янги қисмни танланг")}
                          </span>
                        )}
                      </div>
                      <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t("Поиск части...", "Qism qidirish...", "Қисм қидириш...")} />
                    <CommandList>
                      <CommandEmpty>{t("Часть не найдена", "Qism topilmadi", "Қисм топилмади")}</CommandEmpty>
                      <CommandGroup>
                        {unitOptions.slice(0, 50).map((u: any) => (
                          <CommandItem
                            key={u.unit_id || u.unitId || u.id}
                            value={`${u.unitId || u.unit_code} ${getUnitName(u)}`}
                            onSelect={() => {
                              setForm({ ...form, unitId: (u.unit_id || u.unitId)?.toString() || "" })
                              setOpenMoveUnitSelect(false)
                            }}
                            className="flex flex-col items-start gap-1 py-3"
                          >
                            <div className="flex items-center gap-2 w-full">
                              <Check
                                className={cn(
                                  "h-4 w-4 shrink-0",
                                  form.unitId === u.unitId?.toString() || "" ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">{u.unitId}</span>
                              <span className="truncate flex-1 font-medium">{getUnitName(u)}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {formErrors?.unitStateId && (
                <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.unitStateId._errors[0]}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsMoveOpen(false)} className="rounded-xl h-11 px-6 font-bold">
                {t("Отмена", "Bekor qilish", "Бекор қилиш")}
              </Button>
              <Button onClick={handleMoveSave} className="rounded-xl h-11 px-8 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                {t("Подтвердить перевод", "O'tkazishni tasdiqlash", "Ўтказишни тасдиқлаш")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog >
      <Dialog open={isCardOpen} onOpenChange={setIsCardOpen}>
        <DialogContent className="max-w-3xl rounded-3xl border-none shadow-2xl backdrop-blur-2xl bg-white/95 z-[9999] p-0 overflow-hidden text-slate-900">
          <div className="relative h-32 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="absolute -bottom-12 left-8 flex items-end gap-6">
              <div className={cn(
                "h-24 w-24 rounded-3xl flex items-center justify-center font-bold text-3xl shadow-2xl border-4 border-white",
                currentMember ? getAvatarColor(currentMember.id) : ""
              )}>
                {currentMember ? getInitials(currentMember.physicalPerson || currentMember.person) : "?"}
              </div>
              <div className="pb-2">
                <span className="text-xs font-black text-primary/70 uppercase tracking-widest">{getLocalizedName(currentMember?.rank)}</span>
                <h2 className="text-2xl font-black leading-tight">
                  {currentMember?.physicalPerson?.lastName} {currentMember?.physicalPerson?.firstName}
                </h2>
              </div>
            </div>
          </div>
          <div className="p-8 pt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-900">
            <div className="space-y-6">
              <div>
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-2">{t("Личные данные", "Shaxsiy ma'lumotlar", "Шахсий маълумотлар")}</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <span className="text-sm font-medium text-muted-foreground">{t("ПНР", "PNR", "ПНР")}</span>
                    <span className="text-sm font-bold font-mono">{currentMember?.pnr}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <span className="text-sm font-medium text-muted-foreground">{t("ПИНФЛ", "PINFL", "ПИНФЛ")}</span>
                    <span className="text-sm font-bold font-mono">{maskPINFL(currentMember?.physicalPerson?.pinfl)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-2">{t("Служба", "Xizmat", "Хизмат")}</Label>
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-muted/30">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">{t("Воинская часть", "Harbiy qism", "Ҳарбий қисм")}</span>
                    <span className="text-sm font-bold">
                      {(() => {
                        const code = currentMember?.unit?.unitCode;
                        const id = currentMember?.unit?.unitId;
                        const name = getUnitName(currentMember?.unit);
                        if (code && !isNaN(Number(code))) return `В/Ч ${code} - ${name}`;
                        if (id && !isNaN(Number(id))) return `В/Ч ${id} - ${name}`;
                        return name || "—";
                      })()}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">{t("Должность", "Lavozim", "Лавозим")}</span>
                    <span className="text-sm font-bold">{getLocalizedName(currentMember?.position)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t border-border/50 flex justify-end">
            <Button onClick={() => setIsCardOpen(false)} className="rounded-xl px-8 font-bold">
              {t("Закрыть", "Yopish", "Ёпиш")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  )
}

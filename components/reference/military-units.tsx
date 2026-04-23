"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, MapPin, ClipboardList, CheckCircle2, XCircle, MoreHorizontal, Building2, Tag, Hash, Shield, Globe2, Layers, Info, ChevronsUpDown, Clock } from "lucide-react"
import { TechnicalNameBadge } from "./technical-name-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

import { cn } from "@/lib/utils"
import { getUnits, saveUnit, deleteUnit as dbDeleteUnit, getDistricts, getRegions, getAreas } from "@/lib/services/reference-db-service"
import { useI18n } from "@/lib/i18n/context"
import { toast } from "sonner"
import { z } from "zod"
import { Lang } from "@/lib/types/i18n"
import useSWR from "swr"

export type MilitaryUnit = {
  unitId: number
  unitCode?: string | null
  stateId?: string
  stateNumber?: string | null
  name: any // JSON
  name_uz_latn?: string | null
  name_uz_cyrl?: string | null
  type?: string
  unitType?: any // Related model
  location?: string | null
  location_uz_latn?: string | null
  location_uz_cyrl?: string | null
  district?: any // Related model
  militaryDistrictId?: number | null
  areaId?: number | null
  area?: any // Related model
  status?: string | null
  isActive?: boolean
  id?: number
}

// Validation Schema
const militaryUnitSchema = z.object({
  stateId: z.string()
    .min(1, { message: "Условный номер (ID) обязателен" })
    .max(10, { message: "Условный номер слишком длинный" }),
  stateNumber: z.string().optional(),
  name: z.string().min(3, { message: "Название должно быть не короче 3 символов" }),
  type: z.string().min(1, { message: "Выберите тип подразделения" }),
  militaryDistrictId: z.number().optional(),
  areaId: z.number().optional(),
  location: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional().default("active"),
  name_uz_latn: z.string().optional(),
  name_uz_cyrl: z.string().optional(),
  location_uz_latn: z.string().optional(),
  location_uz_cyrl: z.string().optional(),
})

import { useUITranslations } from "@/lib/hooks/use-ui-translations"

export function MilitaryUnits() {
  const { locale } = useI18n()
  const { t: ui } = useUITranslations()
  const fetcher = (url: string) => fetch(url).then(res => res.json())
  const swrConfig = { dedupingInterval: 600000, revalidateOnFocus: false }

  const { data: districtsList = [] } = useSWR('/api/military-districts', fetcher, swrConfig)
  const { data: regionsList = [] } = useSWR('/api/regions', fetcher, swrConfig)
  const { data: areasList = [] } = useSWR('/api/areas', fetcher, swrConfig)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [unitsList, setUnitsList] = useState<MilitaryUnit[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const searchTimer = useRef<number | null>(null)

  // Stable getName helper
  const getName = useCallback((nameObj: any) => {
    if (typeof nameObj === 'string') return nameObj;
    if (!nameObj) return "";
    if (locale === 'uzLatn') return nameObj[Lang.UZ_LATN] || nameObj[Lang.RU] || "";
    if (locale === 'uzCyrl') return nameObj[Lang.UZ_CYRL] || nameObj[Lang.RU] || "";
    return nameObj[Lang.RU] || "";
  }, [locale]);

  // Fetch Units List
  const fetchUnits = useCallback(async () => {
    setIsLoading(true)
    try {
      const skip = (page - 1) * pageSize;
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: pageSize.toString(),
        search: debouncedSearch
      })

      const response = await fetch(`/api/units?${params.toString()}`)
      const result = await response.json()

      setUnitsList(result.data || [])
      setTotalCount(result.total || 0)
    } catch (error) {
      console.error("Failed to fetch units", error)
      toast.error("Ошибка при загрузке данных")
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize, debouncedSearch])

  // Search debounce
  useEffect(() => {
    if (searchTimer.current) window.clearTimeout(searchTimer.current)
    searchTimer.current = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
      setPage(1)
    }, 400)
    return () => {
      if (searchTimer.current) window.clearTimeout(searchTimer.current)
    }
  }, [searchTerm])

  useEffect(() => {
    fetchUnits()
  }, [fetchUnits])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<MilitaryUnit | null>(null)

  const [openMilitaryDistrict, setOpenMilitaryDistrict] = useState(false)
  const [openRegion, setOpenRegion] = useState(false)
  const [openArea, setOpenArea] = useState(false)

  const [formErrors, setFormErrors] = useState<any>({})
  const [form, setForm] = useState<Partial<MilitaryUnit> & { regionId?: number }>({
    id: 0,
    stateId: "",
    stateNumber: "",
    name: "",
    name_uz_latn: "",
    name_uz_cyrl: "",
    type: "Воинская часть",
    location: "",
    location_uz_latn: "",
    location_uz_cyrl: "",
    district: "",
    militaryDistrictId: undefined,
    areaId: undefined,
    regionId: undefined,
    status: "active"
  })

  const t = (ru: string, uzL: string, uzC: string) => {
    if (locale === "ru") return ru;
    if (locale === "uzLatn") return uzL;
    return uzC;
  }

  const getLocalizedName = (item: any) => {
    if (!item) return ""
    if (typeof item.name === 'object' && item.name !== null) {
      if (locale === "ru") return item.name[Lang.RU] || ""
      if (locale === "uzLatn") return item.name[Lang.UZ_LATN] || ""
      if (locale === "uzCyrl") return item.name[Lang.UZ_CYRL] || ""
      return item.name[Lang.RU] || ""
    }
    if (locale === "uzLatn") return item.name_uz_latn || item.name || ""
    if (locale === "uzCyrl") return item.name_uz_cyrl || item.name || ""
    return item.name || ""
  }

  const handleAddClick = () => {
    setEditingUnit(null)
    setForm({
      id: 0,
      stateId: "",
      stateNumber: "",
      name: "",
      name_uz_latn: "",
      name_uz_cyrl: "",
      type: "Воинская часть",
      location: "",
      location_uz_latn: "",
      location_uz_cyrl: "",
      district: "",
      militaryDistrictId: undefined,
      areaId: undefined,
      regionId: undefined,
      status: "active"
    })
    setFormErrors({})
    setIsDialogOpen(true)
  }

  const handleEditClick = (u: MilitaryUnit) => {
    setEditingUnit(u)
    let regionId = undefined
    if (u.areaId) {
      const area = areasList.find((a: any) => a.id === u.areaId)
      if (area) {
        regionId = area.regionId
      }
    }
    setForm({
      ...u,
      id: u.unitId,
      stateId: u.unitCode || "",
      name: (u as any).nameRu || u.name,
      name_uz_latn: u.name_uz_latn || "",
      name_uz_cyrl: u.name_uz_cyrl || "",
      regionId,
      militaryDistrictId: u.militaryDistrictId || undefined,
      areaId: u.areaId || undefined,
      status: u.isActive !== false ? "active" : "inactive"
    })
    setFormErrors({})
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    const result = militaryUnitSchema.safeParse(form)
    if (!result.success) {
      toast.error("Проверьте правильность заполнения полей")
      setFormErrors(result.error.format())
      return
    }
    setFormErrors({})

    try {
      await saveUnit({
        unitId: form.id || undefined,
        unitCode: form.stateId,
        name: form.name,
        name_uz_latn: form.name_uz_latn,
        name_uz_cyrl: form.name_uz_cyrl,
        unitType: form.type,
        military_district_id: form.militaryDistrictId,
        area_id: form.areaId,
        isActive: form.status === 'active'
      })
      await fetchUnits()
      toast.success(editingUnit ? "Обновлено успешно" : "Добавлено успешно")
      setIsDialogOpen(false)
    } catch (error) {
      console.error(error)
      toast.error("Ошибка при сохранении")
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены?")) {
      try {
        await dbDeleteUnit(id)
        await fetchUnits()
        toast.success("Удалено успешно")
      } catch (error) {
        toast.error("Ошибка при удалении")
      }
    }
  }

  const filteredAreas = useMemo(() =>
    areasList.filter((a: any) => !form.regionId || a.regionId === form.regionId),
    [areasList, form.regionId])

  const unitsText = t(
    `Справочник дислокации подразделений (Всего: ${totalCount})`,
    `Bo'linmalarning joylashuv ma'lumotnomasi (Jami: ${totalCount})`,
    `Бўлинмаларнинг жойлашув маълумотномаси (Жами: ${totalCount})`
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1.5">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            {ui("ref.units.title", "Воинские части")}
          </h2>
        </div>
        <p className="text-lg font-medium text-muted-foreground/80 leading-relaxed pl-1">
          {ui("ref.units.description", "Справочник дислокации подразделений")} (Всего: {totalCount})
        </p>
      </div>

        <div className="flex items-center gap-4">
          <TechnicalNameBadge name="RefUnit" />
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
            <Input
              placeholder={ui("common.search_placeholder", "Поиск...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 w-full md:w-88 rounded-2xl bg-white border-none shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm"
            />
          </div>
          <Button
            onClick={handleAddClick}
            className="h-12 rounded-2xl px-6 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 font-black uppercase tracking-widest text-[11px] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 mr-2" />
            {ui("common.add", "Добавить")}
          </Button>
        </div>



      <Card className="border-none shadow-2xl shadow-primary/5 bg-white/60 backdrop-blur-xl rounded-4xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto min-w-250">
            <div className="flex flex-col">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b border-slate-100 h-20 bg-slate-50/50">
                        <TableHead className="w-20 px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">ID</TableHead>
                        <TableHead className="w-30 px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{ui("ref.units.field.state_id", "Штат ID")}</TableHead>
                        <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{ui("ref.units.field.name", "Наименование")}</TableHead>
                        <TableHead className="w-45 px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{ui("ref.units.field.region", "Область")}</TableHead>
                        <TableHead className="w-45 px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{ui("ref.units.field.district", "Район")}</TableHead>
                        <TableHead className="w-40 px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{ui("ref.units.field.military_district", "Округ")}</TableHead>
                        <TableHead className="w-30 px-6 font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">{ui("ref.units.field.status", "Статус")}</TableHead>
                        <TableHead className="w-40 px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 text-right">{ui("common.actions", "Действия")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unitsList.length > 0 ? (
                        unitsList.map((unit, index) => (
                          <TableRow
                            key={unit.unitId}
                            className="hover:bg-slate-50/80 border-b border-slate-100 group transition-all duration-200"
                          >
                            <TableCell className="px-8 font-mono text-xs font-bold text-slate-500 text-center">
                              {((page - 1) * pageSize + index + 1).toString().padStart(3, '0')}
                            </TableCell>
                            <TableCell className="px-6 font-mono text-xs font-bold text-slate-700">
                              {unit.unitCode || unit.stateNumber || "-"}
                            </TableCell>
                            <TableCell className="px-6 flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shadow-sm shrink-0">
                                <Building2 className="h-5 w-5" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-extrabold text-sm text-slate-800 tracking-tight truncate">
                                  {getName(unit.name)}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Badge variant="outline" className="rounded-md px-1.5 py-0 text-[10px] uppercase font-bold bg-white text-slate-500 border-slate-200">
                                    {unit.type || t("Часть", "Qism", "Қисм")}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 text-xs text-slate-600 font-medium whitespace-nowrap">
                              {unit.areaId ? (
                                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                  <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                  <span className="truncate">{getName(unit.area?.region?.name) || "-"}</span>
                                </div>
                              ) : (
                                <span className="text-slate-300">-</span>
                              )}
                            </TableCell>
                            <TableCell className="px-6 text-xs text-slate-600 font-medium whitespace-nowrap">
                              {unit.areaId ? (
                                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                  <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                                  <span className="truncate">{getName(unit.area?.name) || "-"}</span>
                                </div>
                              ) : unit.location ? (
                                <div className="flex items-center gap-1.5 font-medium text-slate-500 italic">
                                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                  <span className="truncate">
                                    {locale === 'uzLatn' ? (unit.location_uz_latn || unit.location) : 
                                     locale === 'uzCyrl' ? (unit.location_uz_cyrl || unit.location) : 
                                     unit.location}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-300">-</span>
                              )}
                            </TableCell>
                            <TableCell className="px-6">
                              {unit.militaryDistrictId ? (
                                <Badge variant="secondary" className="rounded-lg px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 border-0 font-bold text-[10px] uppercase tracking-wide">
                                  {(() => {
                                    const d = districtsList.find((d: any) => d.districtId === unit.militaryDistrictId)
                                    return getName(d?.shortName || d?.name) || "-"
                                  })()}
                                </Badge>
                              ) : (
                                <span className="text-slate-300">-</span>
                              )}
                            </TableCell>
                            <TableCell className="px-6 text-center">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "rounded-lg px-2 py-1 font-bold text-[10px] uppercase tracking-wide border",
                                  unit.isActive !== false ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"
                                )}
                              >
                                {unit.isActive !== false ? <CheckCircle2 className="h-3 w-3 mr-1.5" /> : <XCircle className="h-3 w-3 mr-1.5" />}
                                {unit.isActive !== false ? t("Активна", "Faol", "Актив") : t("Nofaol", "Nofaol", "Нофаол")}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-8 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEditClick(unit)}
                                  className="h-9 rounded-xl flex items-center gap-2 px-3 transition-all bg-indigo-50/50 text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-100/50 group/edit"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="text-[10px] font-black uppercase tracking-wider">{t("Ред.", "Tahrir", "Таҳрир")}</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDelete(unit.unitId)}
                                  className="h-9 w-9 rounded-xl transition-all bg-red-50/50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100/50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow className="h-64">
                          <TableCell colSpan={7} className="text-center py-20">
                            <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                              <div className="p-6 rounded-full bg-slate-100">
                                <Building2 className="h-12 w-12 text-slate-400" />
                              </div>
                              <p className="font-black text-xl text-slate-600 tracking-tight">{t("Данные не найдены", "Ma'lumotlar topilmadi", "Маълумотлар топилмади")}</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400">
                      {t("Показано", "Ko'rsatildi", "Кўрсатилди")} <span className="text-slate-900">{(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalCount)}</span> {t("из", "dan", "дан")} <span className="text-slate-900">{totalCount}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="h-9 rounded-xl px-4 border-slate-200 font-bold text-xs"
                      >
                        {t("Назад", "Orqaga", "Орқага")}
                      </Button>
                      <div className="flex gap-1">
                        {[...Array(Math.ceil(totalCount / pageSize))].map((_, i) => (
                          <Button
                            key={i}
                            variant={page === i + 1 ? "default" : "outline"}
                            size="icon"
                            onClick={() => setPage(i + 1)}
                            className={cn(
                              "h-9 w-9 rounded-xl text-xs font-bold transition-all",
                              page === i + 1 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "border-slate-200 hover:bg-slate-50"
                            )}
                          >
                            {i + 1}
                          </Button>
                        )).slice(Math.max(0, page - 3), Math.min(Math.ceil(totalCount / pageSize), page + 2))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(Math.ceil(totalCount / pageSize), p + 1))}
                        disabled={page >= Math.ceil(totalCount / pageSize)}
                        className="h-9 rounded-xl px-4 border-slate-200 font-bold text-xs"
                      >
                        {t("Далее", "Keyingi", "Кейинги")}
                      </Button>
                    </div>
                  </div>
                </div>

          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl rounded-[28px] overflow-hidden p-0">
          <DialogHeader className="p-8 pb-0">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 leading-none mb-1.5">
                  {editingUnit ? t("Редактировать часть", "Qismni tahrirlash", "Қисмни таҳрирлаш") : t("Добавить новую часть", "Yangi qism qo'shish", "Янги қўшиш")}
                </DialogTitle>
                <DialogDescription className="text-[15px] font-medium text-muted-foreground/80">
                  {t("Контроль дислокации и характеристик подразделения", "Bo'linmaning joylashuvi va xususiyatlarini nazorat qilish", "Бўлинманинг жойлашуви")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 pt-6 max-h-[70vh] overflow-y-auto space-y-8">
            <div className="space-y-8">
              {/* Section 1: Official Data */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                  <span className="text-[11px] font-black uppercase tracking-[0.15em] text-indigo-600">{t("Официальные данные", "Rasmiy ma'lumotlar", "Расмий маълумотлар")}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Условный номер (ID)", "Shartli raqam (ID)", "Шартли рақам (ID)")} *</Label>
                    <div className="relative group">
                      <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-indigo-600 transition-colors" />
                      <Input
                        value={form.stateId}
                        onChange={(e) => setForm({ ...form, stateId: e.target.value })}
                        placeholder="00000"
                        className={cn(
                          "h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-black font-mono",
                          formErrors.stateId ? "ring-2 ring-red-500/50" : ""
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Номер штата", "Shtat raqami", "Штат рақами")}</Label>
                    <div className="relative group">
                      <ClipboardList className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-indigo-600 transition-colors" />
                      <Input
                        value={form.stateNumber || ""}
                        onChange={(e) => setForm({ ...form, stateNumber: e.target.value })}
                        placeholder="00/000-00"
                        className="h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-black font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Name */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-1 w-6 bg-blue-600 rounded-full" />
                  <span className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600">{t("Наименование и тип", "Nomi va turi", "Номи ва тури")}</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Название (RU)", "Nomi (RU)", "Номи (RU)")} *</Label>
                    <Input
                      value={form.name || ""}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="h-12 rounded-2xl bg-muted/40 border-none px-4 focus:bg-white transition-all font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">UZ Latin</Label>
                      <Input
                        value={form.name_uz_latn || ""}
                        onChange={(e) => setForm({ ...form, name_uz_latn: e.target.value })}
                        className="h-12 rounded-2xl bg-muted/40 border-none px-4 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">UZ Cyrl</Label>
                      <Input
                        value={form.name_uz_cyrl || ""}
                        onChange={(e) => setForm({ ...form, name_uz_cyrl: e.target.value })}
                        className="h-12 rounded-2xl bg-muted/40 border-none px-4 focus:bg-white transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Тип подразделения", "Bo'linma turi", "Бўлинма тури")} *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-12 rounded-2xl bg-muted/40 border-none justify-between pl-4 hover:bg-white transition-all">
                          <span className="font-bold">{form.type || t("Выберите...", "Tanlang...", "Танланг...")}</span>
                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-50 p-0 rounded-2xl border-none shadow-2xl z-10000">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {["Воинская часть", "Учреждение", "Управление", "Центр"].map(t => (
                                <CommandItem key={t} onSelect={() => setForm({ ...form, type: t })} className="px-4 py-3 cursor-pointer mb-1 rounded-xl">
                                  <span className="font-bold">{t}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Section 3: Location */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-1 w-6 bg-emerald-600 rounded-full" />
                  <span className="text-[11px] font-black uppercase tracking-[0.15em] text-emerald-600">{t("Локация и управление", "Joylashuv va boshqaruv", "Локация ва бошқарув")}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Область", "Viloyat", "Вилоят")}</Label>
                    <Popover open={openRegion} onOpenChange={setOpenRegion}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-12 rounded-2xl bg-muted/40 border-none justify-between pl-4 hover:bg-white transition-all">
                          <span className="font-bold truncate">
                            {regionsList.find((r: any) => r.id === form.regionId)?.name?.[Lang.RU] || t("Выберите...", "Tanlang...", "Танланг...")}
                          </span>
                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-50 p-0 rounded-2xl border-none shadow-2xl z-10000">
                        <Command>
                          <CommandInput placeholder="Поиск..." />
                          <CommandList>
                            <CommandGroup>
                              {regionsList.map((r: any) => (
                                <CommandItem key={r.id} onSelect={() => { setForm({ ...form, regionId: r.id, areaId: undefined }); setOpenRegion(false) }} className="px-4 py-3 cursor-pointer mb-1 rounded-xl">
                                  <span className="font-bold">{r.name?.[Lang.RU]}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Район", "Tuman", "Туман")}</Label>
                    <Popover open={openArea} onOpenChange={setOpenArea}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" disabled={!form.regionId} className="w-full h-12 rounded-2xl bg-muted/40 border-none justify-between pl-4 hover:bg-white transition-all">
                          <span className="font-bold truncate">
                            {areasList.find((a: any) => a.id === form.areaId)?.name?.[Lang.RU] || t("Выберите...", "Tanlang...", "Танланг...")}
                          </span>
                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-50 p-0 rounded-2xl border-none shadow-2xl z-10000">
                        <Command>
                          <CommandInput placeholder="Поиск..." />
                          <CommandList>
                            <CommandGroup>
                              {filteredAreas.map((a: any) => (
                                <CommandItem key={a.id} onSelect={() => { setForm({ ...form, areaId: a.id }); setOpenArea(false) }} className="px-4 py-3 cursor-pointer mb-1 rounded-xl">
                                  <span className="font-bold">{a.name?.[Lang.RU]}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Военный округ", "Harbiy okrug", "Ҳарбий округ")} *</Label>
                  <Popover open={openMilitaryDistrict} onOpenChange={setOpenMilitaryDistrict}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-12 rounded-2xl bg-muted/40 border-none justify-between pl-4 hover:bg-white transition-all">
                        <span className="font-bold">
                          {(() => {
                            const d = districtsList.find((d: any) => d.districtId === form.militaryDistrictId)
                            if (!d) return t("Выберите...", "Tanlang...", "Танланг...")
                            if (locale === "uzLatn") return d.shortName_uz_latn || d.shortName
                            if (locale === "uzCyrl") return d.shortName_uz_cyrl || d.shortName
                            return d.shortName
                          })()}
                        </span>
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-0 rounded-2xl border-none shadow-2xl z-10000">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {districtsList.map((d: any) => (
                              <CommandItem key={d.districtId} onSelect={() => { setForm({ ...form, militaryDistrictId: d.districtId }); setOpenMilitaryDistrict(false) }} className="px-4 py-3 cursor-pointer mb-1 rounded-xl">
                                <span className="font-bold">{getLocalizedName(d)}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-muted/20 border-t border-border/40 gap-3">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 rounded-2xl px-6 font-black uppercase tracking-widest text-[11px] hover:bg-white transition-all">
              {t("Отмена", "Bekor qilish", "Бекор қилиш")}
            </Button>
            <Button onClick={handleSave} className="h-12 rounded-2xl px-10 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 font-black uppercase tracking-widest text-[11px] text-white transition-all hover:scale-[1.02] active:scale-[0.98]">
              {t("Сохранить", "Saqlash", "Сақлаш")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

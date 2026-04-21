"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Map, MoreHorizontal, Globe, Building2, CheckCircle2, XCircle, MapPin, Hash, Shield, Layers, Info } from "lucide-react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { getDistricts, saveDistrict, deleteDistrict as dbDeleteDistrict } from "@/lib/services/reference-db-service"
import { useI18n } from "@/lib/i18n/context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { useEffect } from "react"

export type MilitaryDistrict = {
  districtId: number
  code: string
  name: string
  name_uz_latn?: string | null
  name_uz_cyrl?: string | null
  shortName?: string | null
  shortName_uz_latn?: string | null
  shortName_uz_cyrl?: string | null
  headquarters?: string | null
  status?: string | null
}

// Validation Schema
const districtSchema = z.object({
  code: z.string().min(1, { message: "Код округа обязателен" }),
  name: z.string().min(3, { message: "Название должно быть не короче 3 символов" }),
  shortName: z.string().optional(),
  shortName_uz_latn: z.string().optional(),
  shortName_uz_cyrl: z.string().optional(),
  headquarters: z.string().min(1, { message: "Укажите местонахождение штаба" }),
  status: z.enum(["active", "inactive"]).optional().default("active"),
  // Localized names
  name_uz_latn: z.string().optional(),
  name_uz_cyrl: z.string().optional(),
})

export function MilitaryDistricts() {
  const { locale } = useI18n()
  const [searchTerm, setSearchTerm] = useState("")
  const [districtsList, setDistrictsList] = useState<MilitaryDistrict[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getDistricts()
      setDistrictsList(data.map((d: any) => ({
        ...d,
        districtId: d.districtId,
        id: d.districtId // Для совместимости с текущим кодом UI
      })) as any)
    } catch (error) {
      toast.error("Ошибка при загрузке округов")
    } finally {
      setLoading(false)
    }
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDistrict, setEditingDistrict] = useState<MilitaryDistrict | null>(null)
  const [openStatus, setOpenStatus] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({})

  const [form, setForm] = useState<Partial<MilitaryDistrict>>({
    districtId: 0,
    code: "",
    name: "",
    name_uz_latn: "",
    name_uz_cyrl: "",
    shortName: "",
    shortName_uz_latn: "",
    shortName_uz_cyrl: "",
    headquarters: "",
    status: "active"
  })

  const getLocalizedName = (item: any) => {
    if (!item) return ""
    if (locale === "uzLatn") return item.name_uz_latn || item.name || ""
    if (locale === "uzCyrl") return item.name_uz_cyrl || item.name || ""
    return item.name || ""
  }

  const getSubtextNames = (item: any, fieldProps: { latn: string, cyrl: string, ru: string } = { latn: 'name_uz_latn', cyrl: 'name_uz_cyrl', ru: 'name' }) => {
    if (!item) return ""
    const names = []
    if (locale !== "ru" && item[fieldProps.ru]) names.push(item[fieldProps.ru])
    if (locale !== "uzLatn" && item[fieldProps.latn]) names.push(item[fieldProps.latn])
    if (locale !== "uzCyrl" && item[fieldProps.cyrl]) names.push(item[fieldProps.cyrl])
    return names.filter(Boolean).join(" / ")
  }

  const filteredDistricts = districtsList.filter(
    (district) =>
      (district.code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (district.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  )

  const handleAddClick = () => {
    setEditingDistrict(null)
    setFormErrors({})
    setForm({
      districtId: 0,
      code: "",
      name: "",
      name_uz_latn: "",
      name_uz_cyrl: "",
      shortName: "",
      shortName_uz_latn: "",
      shortName_uz_cyrl: "",
      headquarters: "",
      status: "active"
    })
    setIsDialogOpen(true)
  }

  const handleEditClick = (district: MilitaryDistrict) => {
    setEditingDistrict(district)
    setFormErrors({})
    setForm({ ...district })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    // Validate with Zod
    const result = districtSchema.safeParse({
      ...form,
      status: form.status || "active"
    })

    if (!result.success) {
      toast.error(result.error.errors[0].message)
      setFormErrors(result.error.format())
      return
    }
    setFormErrors({})

    try {
      if (editingDistrict) {
        await saveDistrict({
          districtId: editingDistrict.districtId,
          ...form
        } as any)
        toast.success(t("Обновлено успешно", "Muvaffaqiyatli yangilandi", "Муваффақиятли янгиланди"))
      } else {
        const { districtId, ...insertData } = form
        await saveDistrict(insertData as any)
        toast.success(t("Добавлено успешно", "Muvaffaqiyatli qo'shildi", "Муваффақиятли қўшилди"))
      }
      await loadData()
      setIsDialogOpen(false)
      setEditingDistrict(null)
    } catch (error) {
      toast.error("Ошибка при сохранении")
    }
  }

  const handleDelete = async (districtId: number) => {
    if (confirm(t("Вы уверены?", "Ishonchingiz komilmi?", "Ишончингиз комилми?"))) {
      try {
        await dbDeleteDistrict(districtId)
        await loadData()
        toast.success(t("Удалено успешно", "Muvaffaqiyatli o'chirildi", "Муваффақиятли ўчирилди"))
      } catch (error) {
        toast.error("Ошибка при удалении")
      }
    }
  }

  const t = (ru: string, uzL: string, uzC: string) => {
    if (locale === "ru") return ru;
    if (locale === "uzLatn") return uzL;
    return uzC;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-none shadow-xl shadow-primary/5 bg-white/60 backdrop-blur-xl overflow-hidden">
        <CardHeader className="relative pb-8 border-b border-border/50">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Globe className="h-32 w-32" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shadow-inner">
                  <Map className="h-6 w-6" />
                </div>
                <CardTitle className="text-3xl font-extrabold tracking-tight">
                  {t("Военные округа", "Harbiy okruglar", "Ҳарбий округлар")}
                </CardTitle>
              </div>
              <CardDescription className="text-lg font-medium text-muted-foreground/80 max-w-2xl leading-relaxed pl-1">
                {t("Справочник военных округов", "Harbiy okruglar ma'lumotnomasi", "Ҳарбий округлар маълумотномаси")}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <TechnicalNameBadge name="RefMilitaryDistrict" />
              <div className="relative group w-full md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder={t("Поиск по коду, названию...", "Kod yoki nom bo'yicha qidirish...", "Код ёки ном бўйича қидириш...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 bg-white/50 border-border/40 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-muted-foreground/50 shadow-sm text-sm"
                />
              </div>
              <Button onClick={handleAddClick} className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold">
                <Plus className="h-4 w-4 mr-2" />
                {t("Добавить округ", "Okrug qo'shish", "Округ қўшиш")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/50 h-16 bg-muted/20">
                  <TableHead className="w-[80px] px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">ID</TableHead>
                  <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{t("Код", "Kod", "Код")}</TableHead>
                  <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{t("Наименование", "Nomlanishi", "Номланиши")}</TableHead>
                  <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{t("Краткое", "Qisqa", "Қисқа")}</TableHead>
                  <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{t("Штаб", "Shtab", "Штаб")}</TableHead>
                  <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{t("Статус", "Status", "Статус")}</TableHead>
                  <TableHead className="text-right px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{t("Действия", "Harakatlar", "Ҳаракатлар")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDistricts.length > 0 ? (
                  filteredDistricts.map((district, idx) => (
                    <TableRow key={district.districtId} className="group h-20 hover:bg-primary/5 transition-all duration-300 border-b border-border/40">
                      <TableCell className="px-6 font-mono text-xs font-bold text-muted-foreground/40 leading-none">{(idx + 1).toString().padStart(3, '0')}</TableCell>
                      <TableCell className="px-6 border-l border-border/5 font-medium text-sm text-slate-700">{district.code}</TableCell>
                      <TableCell className="px-6 border-l border-border/5">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-[15px] text-slate-900 group-hover:text-primary transition-colors">{getLocalizedName(district)}</span>
                          <span className="text-[11px] font-medium text-muted-foreground/60 line-clamp-1">
                            {getSubtextNames(district)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 border-l border-border/5">
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wide bg-white/50 border-slate-200 text-slate-600 w-fit">
                            {locale === "uzLatn" ? district.shortName_uz_latn || district.shortName :
                              locale === "uzCyrl" ? district.shortName_uz_cyrl || district.shortName :
                                district.shortName}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground/50 font-medium">
                            {getSubtextNames(district, { ru: 'shortName', latn: 'shortName_uz_latn', cyrl: 'shortName_uz_cyrl' })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 border-l border-border/5">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <Building2 className="h-3.5 w-3.5 text-primary/60" />
                          {district.headquarters}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 border-l border-border/5">
                        <Badge
                          variant={district.status === 'inactive' ? "secondary" : "default"}
                          className={cn(
                            "px-2.5 py-1 rounded-lg border-none text-[10px] font-bold shadow-sm",
                            district.status === 'inactive' ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            {district.status === 'inactive' ? <XCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                            {district.status === 'inactive' ? t("Неактивен", "Faol emas", "Фаол эмас") : t("Активен", "Faol", "Актив")}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 border-l border-border/5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-2xl border-none">
                            <DropdownMenuLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground/60">{t("Управление", "Boshqarish", "Бошқариш")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditClick(district)} className="rounded-xl py-2.5 cursor-pointer focus:bg-primary/5">
                              <Edit className="h-4 w-4 mr-2.5 text-primary" />
                              {t("Редактировать", "Tahrirlash", "Таҳрирлаш")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(district.districtId)} className="rounded-xl py-2.5 cursor-pointer text-destructive focus:bg-destructive/5 font-medium">
                              <Trash2 className="h-4 w-4 mr-2.5" />
                              {t("Удалить", "O'chirish", "Ўчириш")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-full bg-muted/30">
                          <Search className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <div className="text-sm font-medium">{t("Ничего не найдено", "Hech narsa topilmadi", "Ҳеч нарса топилмади")}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-3xl border-none shadow-2xl backdrop-blur-2xl bg-white/95">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shadow-inner">
                <Map className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                  {editingDistrict ? t("Редактировать округ", "Tahrirlash", "Таҳрирлаш") : t("Добавить округ", "Qo'shish", "Қўшиш")}
                </DialogTitle>
                <DialogDescription className="font-medium">
                  {t("Заполните данные о военном округе", "Harbiy okrug ma'lumotlarini to'ldiring", "Ҳарбий округ маълумотларини тўлдиринг")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Код округа", "Okrug kodi", "Округ коди")}</Label>
                <Input className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-bold font-mono" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="ВО-001" />
                {formErrors?.code && (
                  <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.code._errors[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Краткое (RU)", "Qisqa (RU)", "Қисқа (RU)")}</Label>
                <Input className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-bold" value={form.shortName || ""} onChange={e => setForm({ ...form, shortName: e.target.value })} placeholder="ЦВО" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Краткое (UZ Lat)", "Qisqa (UZ Lat)", "Қисқа (UZ Lat)")}</Label>
                <Input className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-bold" value={form.shortName_uz_latn || ""} onChange={e => setForm({ ...form, shortName_uz_latn: e.target.value })} placeholder="MHO" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Краткое (UZ Kir)", "Qisqa (UZ Kir)", "Қисқа (UZ Kir)")}</Label>
                <Input className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-bold" value={form.shortName_uz_cyrl || ""} onChange={e => setForm({ ...form, shortName_uz_cyrl: e.target.value })} placeholder="МҲО" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Полное наименование (RU)", "To'liq nomi (RU)", "Тўлиқ номи (RU)")}</Label>
              <Input className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-medium" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Центральный военный округ" />
              {formErrors?.name && (
                <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.name._errors[0]}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Полное наименование (UZ Lat)", "To'liq nomi (UZ Lat)", "Тўлиқ номи (UZ Lat)")}</Label>
                <Input className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-medium" value={form.name_uz_latn || ""} onChange={e => setForm({ ...form, name_uz_latn: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Полное наименование (UZ Cyr)", "To'liq nomi (UZ Kir)", "Тўлиқ номи (UZ Kir)")}</Label>
                <Input className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-medium" value={form.name_uz_cyrl || ""} onChange={e => setForm({ ...form, name_uz_cyrl: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Штаб", "Shtab", "Штаб")}</Label>
                <Input className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-medium" value={form.headquarters || ""} onChange={e => setForm({ ...form, headquarters: e.target.value })} placeholder="г. Джизак" />
                {formErrors?.headquarters && (
                  <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.headquarters._errors[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Статус", "Status", "Статус")}</Label>
                <Popover open={openStatus} onOpenChange={setOpenStatus}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openStatus}
                      className="h-11 w-full justify-between rounded-xl bg-muted/40 border-none focus:ring-0 font-medium"
                    >
                      {form.status === "active" ? (
                        <div className="flex items-center gap-2 text-slate-900">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          {t("Активный", "Faol", "Актив")}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-900">
                          <div className="h-2 w-2 rounded-full bg-slate-400" />
                          {t("Неактивный", "Faol emas", "Фаол эмас")}
                        </div>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 rounded-2xl border-none shadow-2xl" align="start">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {[
                            { value: "active", label: t("Активный", "Faol", "Актив"), color: "bg-emerald-500" },
                            { value: "inactive", label: t("Неактивный", "Faol emas", "Фаол эмас"), color: "bg-slate-400" },
                          ].map((s) => (
                            <CommandItem
                              key={s.value}
                              value={s.value}
                              onSelect={() => {
                                setForm({ ...form, status: s.value as any })
                                setOpenStatus(false)
                              }}
                              className="rounded-xl flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <div className={cn("h-2 w-2 rounded-full", s.color)} />
                                {s.label}
                              </div>
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  form.status === s.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold">
                {t("Отмена", "Bekor qilish", "Бекор қилиш")}
              </Button>
              <Button onClick={handleSave} className="rounded-xl font-bold shadow-lg shadow-primary/20">
                {t("Сохранить", "Saqlash", "Сақлаш")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

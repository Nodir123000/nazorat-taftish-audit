"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, CheckCircle2, XCircle, MoreHorizontal, Compass, FileText, LayoutGrid, Check, ChevronsUpDown, Target, Activity, TextQuote } from "lucide-react"
import { TechnicalNameBadge } from "./technical-name-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { useI18n } from "@/lib/i18n/context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { getClassifiersByType, saveClassifier, deleteClassifier } from "@/lib/services/reference-db-service"

// Validation Schema
const controlDirectionSchema = z.object({
  code: z.string()
    .min(1, { message: "Код обязателен" })
    .max(5, { message: "Код не должен превышать 5 символов" }),
  name: z.string().min(3, { message: "Название должно быть не короче 3 символов" }),
  name_uz_latn: z.string().optional(),
  name_uz_cyrl: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional().default("active"),
})

export function ControlDirections() {
  const { locale } = useI18n()
  const [searchTerm, setSearchTerm] = useState("")
  const [directionsList, setDirectionsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDirection, setEditingDirection] = useState<any | null>(null)
  const [openStatus, setOpenStatus] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({})

  const [form, setForm] = useState({
    code: "",
    name: "",
    name_uz_latn: "",
    name_uz_cyrl: "",
    description: "",
    status: "active" as "active" | "inactive"
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getClassifiersByType("RefControlDirection")
      setDirectionsList(data.map((d: any) => ({
        id: d.id,
        code: d.code,
        name: d.nameRu || d.name,
        name_uz_latn: d.nameUzLatn || "",
        name_uz_cyrl: d.nameUzCyrl || "",
        description: d.description || "",
        status: d.status || "active"
      })))
    } catch (error) {
      console.error("Load error:", error)
      toast.error("Ошибка при загрузке данных")
    } finally {
      setLoading(false)
    }
  }

  const filteredDirections = directionsList.filter(
    (dir) =>
      dir.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dir.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dir.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  )

  const handleAddClick = () => {
    setEditingDirection(null)
    setFormErrors({})
    setForm({
      code: "",
      name: "",
      name_uz_latn: "",
      name_uz_cyrl: "",
      description: "",
      status: "active"
    })
    setIsDialogOpen(true)
  }

  const handleEditClick = (dir: any) => {
    setEditingDirection(dir)
    setFormErrors({})
    setForm({ ...dir })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    const result = controlDirectionSchema.safeParse(form)

    if (!result.success) {
      toast.error("Проверьте заполнение полей")
      setFormErrors(result.error.format())
      return
    }
    setFormErrors({})

    try {
      await saveClassifier("RefControlDirection", {
        id: editingDirection?.id,
        code: form.code,
        name: form.name,
        name_uz_latn: form.name_uz_latn,
        name_uz_cyrl: form.name_uz_cyrl,
        description: form.description,
        status: form.status
      })

      await loadData()
      toast.success(editingDirection ? "Обновлено успешно" : "Добавлено успешно")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Ошибка при сохранении")
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm(locale === "ru" ? "Вы уверены?" : "Ishonchingiz komilmi?")) {
      try {
        await deleteClassifier("RefControlDirection", id)
        await loadData()
        toast.success("Удалено успешно")
      } catch (error) {
        console.error("Delete error:", error)
        toast.error("Ошибка при удалении")
      }
    }
  }

  const getSubtextNames = (item: any) => {
    if (!item) return ""
    const names = []
    if (locale !== "ru" && item.name) names.push(item.name)
    if (locale !== "uzLatn" && item.name_uz_latn) names.push(item.name_uz_latn)
    if (locale !== "uzCyrl" && item.name_uz_cyrl) names.push(item.name_uz_cyrl)
    return names.filter(Boolean).join(" / ")
  }

  const t = (ru: string, uzL: string) => locale === "ru" ? ru : uzL

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-none shadow-xl shadow-primary/5 bg-white/60 backdrop-blur-xl overflow-hidden">
        <CardHeader className="relative pb-8 border-b border-border/50">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Compass className="h-32 w-32" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 shadow-inner">
                  <Compass className="h-6 w-6" />
                </div>
                <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {t("Направления контроля", "Nazorat yo'nalishlari")}
                </CardTitle>
              </div>
              <CardDescription className="text-lg font-medium text-muted-foreground/80 max-w-2xl leading-relaxed pl-1">
                {t("Справочник ключевых направлений ревизионного контроля и надзора", "Nazorat taftish yo'nalishlari ma'lumotnomasi")}
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <TechnicalNameBadge name="RefControlDirection" />
              <div className="relative group w-full md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  placeholder={t("Поиск...", "Qidirish...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 bg-white/50 border-border/40 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-muted-foreground/50 shadow-sm text-sm"
                />
              </div>
              <Button onClick={handleAddClick} className="rounded-xl h-11 px-6 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 bg-indigo-600 hover:bg-indigo-700 transition-all font-black uppercase tracking-widest text-[11px] text-white">
                <Plus className="h-4 w-4 mr-2" />
                {t("Добавить направление", "Yangi qo'shish")}
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
                  <TableHead className="w-[120px] px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{t("Код", "Kod")}</TableHead>
                  <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{t("Наименование", "Nomlanishi")}</TableHead>
                  <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{t("Статус", "Status")}</TableHead>
                  <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 text-right">{t("Действия", "Harakatlar")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-muted-foreground animate-pulse font-medium">
                      {t("Загрузка...", "Yuklanmoqda...")}
                    </TableCell>
                  </TableRow>
                ) : filteredDirections.length > 0 ? (
                  filteredDirections.map((dir: any, idx) => (
                    <TableRow key={dir.id} className="group h-20 hover:bg-indigo-500/5 transition-all duration-300 border-b border-border/40">
                      <TableCell className="px-6">
                        <span className="font-mono text-xs font-bold text-muted-foreground/40 leading-none">{(idx + 1).toString().padStart(3, '0')}</span>
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge variant="outline" className="bg-indigo-50/50 text-indigo-600 border-indigo-200 font-mono text-xs px-2.5 py-0.5 rounded-lg shadow-sm">
                          {dir.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-indigo-50/50 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all scale-90 border border-indigo-100/50">
                            <LayoutGrid className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-[15px] text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {locale === "ru" ? dir.name : locale === "uzLatn" ? dir.name_uz_latn : dir.name_uz_cyrl}
                            </span>
                            <span className="text-[11px] font-medium text-muted-foreground/60 line-clamp-1">
                              {getSubtextNames(dir)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          variant={dir.status === 'inactive' ? "secondary" : "default"}
                          className={cn(
                            "px-2.5 py-1 rounded-lg border-none text-[10px] font-bold shadow-sm",
                            dir.status === 'active' ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            {dir.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {dir.status === 'active' ? t("Активен", "Faol") : t("Неактивен", "Faol emas")}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-2xl border-none p-2">
                            <DropdownMenuLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground/60 px-3 py-2">{t("Управление", "Boshqarish")}</DropdownMenuLabel>
                            <DropdownMenuSeparator className="opacity-50" />
                            <DropdownMenuItem onClick={() => handleEditClick(dir)} className="rounded-xl py-2.5 cursor-pointer focus:bg-indigo-500/5">
                              <Edit className="h-4 w-4 mr-2.5 text-blue-600" />
                              <span className="font-semibold">{t("Редактировать", "Tahrirlash")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(dir.id)} className="rounded-xl py-2.5 cursor-pointer text-destructive focus:bg-destructive/5 font-medium">
                              <Trash2 className="h-4 w-4 mr-2.5" />
                              <span className="font-semibold">{t("Удалить", "O'chirish")}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-muted-foreground font-medium italic">
                      {t("Ничего не найдено", "Hech narsa topilmadi")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl rounded-[28px] overflow-hidden p-0">
          <DialogHeader className="p-8 pb-0">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 leading-none mb-1.5">
                  {editingDirection ? t("Редактировать направление", "Yo'nalishni tahrirlash") : t("Новое направление", "Yangi yo'nalish")}
                </DialogTitle>
                <DialogDescription className="text-[15px] font-medium text-muted-foreground/80">
                  {t("Укажите параметры направления контроля", "Nazorat yo'nalishi parametrlarini kiriting")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 pt-6 space-y-8">
            {/* Section 1: Identification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-indigo-600">{t("Идентификация", "Identifikatsiya")}</span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Код направления *", "Yo'nalish kodi *")}</Label>
                  <div className="relative group">
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-indigo-600 transition-colors" />
                    <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} maxLength={5} placeholder="FIN" className="h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-mono font-bold" />
                  </div>
                  {formErrors?.code && (
                    <p className="text-sm text-destructive mt-1 font-bold ml-1">{formErrors.code?._errors?.[0] || "Ошибка"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Наименование (RU) *", "Nomi (RU) *")}</Label>
                  <div className="relative group">
                    <LayoutGrid className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-indigo-600 transition-colors" />
                    <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={t("Название на русском", "Nomi rus tilida")} className="h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-bold" />
                  </div>
                  {formErrors?.name && (
                    <p className="text-sm text-destructive mt-1 font-bold ml-1">{formErrors.name?._errors?.[0] || "Ошибка"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Localization */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-6 bg-blue-600 rounded-full" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600">{t("Локализация", "Lokalizatsiya")}</span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Наименование (UZ Latn)", "Nomi (lotin)")}</Label>
                  <Input value={form.name_uz_latn} onChange={e => setForm({ ...form, name_uz_latn: e.target.value })} placeholder="Nomi (lotin)" className="h-12 rounded-2xl bg-muted/40 border-none px-4 focus:bg-white transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Наименование (UZ Cyrl)", "Nomi (kirill)")}</Label>
                  <Input value={form.name_uz_cyrl} onChange={e => setForm({ ...form, name_uz_cyrl: e.target.value })} placeholder="Номи (кирилл)" className="h-12 rounded-2xl bg-muted/40 border-none px-4 focus:bg-white transition-all font-medium" />
                </div>
              </div>
            </div>

            {/* Section 3: Status & Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-6 bg-emerald-600 rounded-full" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-emerald-600">{t("Описание и статус", "Tavsif va holat")}</span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Статус *", "Holati *")}</Label>
                  <Popover open={openStatus} onOpenChange={setOpenStatus}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between h-12 rounded-2xl bg-muted/40 border-none px-4 hover:bg-muted/60 transition-all font-bold"
                      >
                        <div className="flex items-center gap-2.5">
                          <Activity className={cn("h-4 w-4 shrink-0", form.status === 'active' ? "text-emerald-500" : "text-slate-400")} />
                          <span>{form.status === "active" ? t("Активный", "Faol") : t("Неактивный", "Faol emas")}</span>
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 rounded-2xl border-none shadow-2xl z-[10000]" align="start">
                      <Command className="rounded-2xl">
                        <CommandList>
                          <CommandGroup>
                            {[
                              { value: "active", label: t("Активный", "Faol") },
                              { value: "inactive", label: t("Неактивный", "Faol emas") },
                            ].map((s) => (
                              <CommandItem
                                key={s.value}
                                value={s.value}
                                onSelect={() => {
                                  setForm({ ...form, status: s.value as any })
                                  setOpenStatus(false)
                                }}
                                className="rounded-xl mx-2 my-1 h-11"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 text-emerald-600 font-bold",
                                    form.status === s.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <span className="font-bold">{s.label}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Краткое описание", "Qisqacha tavsif")}</Label>
                  <div className="relative group">
                    <TextQuote className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-indigo-600 transition-colors" />
                    <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder={t("Детали направления", "Yo'nalish tafsilotlari")} className="h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-medium" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-muted/20 border-t border-border/40 gap-3">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 rounded-2xl px-6 font-black uppercase tracking-widest text-[11px] hover:bg-white transition-all">
              {t("Отмена", "Bekor qilish")}
            </Button>
            <Button onClick={handleSave} className="h-12 rounded-2xl px-10 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 font-black uppercase tracking-widest text-[11px] text-white transition-all hover:scale-[1.02] active:scale-[0.98]">
              {t("Сохранить изменения", "Saqlash")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

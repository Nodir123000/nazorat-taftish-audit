"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, CheckCircle2, XCircle, MoreHorizontal, Settings2, FileText, Check, ChevronsUpDown, Sliders, Target, Activity, TextQuote, LayoutGrid } from "lucide-react"
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
const controlTypeSchema = z.object({
  name: z.string().min(3, { message: "Название должно быть не короче 3 символов" }),
  name_uz_latn: z.string().optional(),
  name_uz_cyrl: z.string().optional(),
  description: z.string().optional(),
  description_uz_latn: z.string().optional(),
  description_uz_cyrl: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional().default("active"),
})

export function ControlTypes() {
  const { locale } = useI18n()
  const [searchTerm, setSearchTerm] = useState("")
  const [typesList, setTypesList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<any | null>(null)
  const [openStatus, setOpenStatus] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({})

  const [form, setForm] = useState({
    name: "",
    name_uz_latn: "",
    name_uz_cyrl: "",
    description: "",
    description_uz_latn: "",
    description_uz_cyrl: "",
    status: "active" as "active" | "inactive"
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getClassifiersByType("RefControlType")
      setTypesList(data.map((d: any) => ({
        id: d.id,
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

  const getLocalizedName = (item: any) => {
    if (!item) return ""
    if (locale === "uzLatn") return item.name_uz_latn || item.name
    if (locale === "uzCyrl") return item.name_uz_cyrl || item.name
    return item.name
  }

  const getLocalizedDescription = (item: any) => {
    if (!item) return ""
    if (locale === "uzLatn") return item.description_uz_latn || item.description
    if (locale === "uzCyrl") return item.description_uz_cyrl || item.description
    return item.description
  }

  const filteredTypes = typesList.filter(
    (type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.name_uz_latn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAddClick = () => {
    setEditingType(null)
    setFormErrors({})
    setForm({
      name: "",
      name_uz_latn: "",
      name_uz_cyrl: "",
      description: "",
      description_uz_latn: "",
      description_uz_cyrl: "",
      status: "active"
    })
    setIsDialogOpen(true)
  }

  const handleEditClick = (type: any) => {
    setEditingType(type)
    setFormErrors({})
    setForm({ ...type })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    const result = controlTypeSchema.safeParse(form)

    if (!result.success) {
      toast.error("Проверьте заполнение полей")
      setFormErrors(result.error.format())
      return
    }
    setFormErrors({})

    try {
      await saveClassifier("RefControlType", {
        id: editingType?.id,
        name: form.name,
        name_uz_latn: form.name_uz_latn,
        name_uz_cyrl: form.name_uz_cyrl,
        description: form.description,
        status: form.status
      })

      await loadData()
      toast.success(editingType ? "Обновлено успешно" : "Добавлено успешно")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Ошибка при сохранении")
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

  const handleDelete = async (id: number) => {
    if (confirm(locale === "ru" ? "Вы уверены?" : "Ishonchingiz komilmi?")) {
      try {
        await deleteClassifier("RefControlType", id)
        await loadData()
        toast.success("Удалено успешно")
      } catch (error) {
        console.error("Delete error:", error)
        toast.error("Ошибка при удалении")
      }
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-none shadow-xl shadow-primary/5 bg-white/60 backdrop-blur-xl overflow-hidden">
        <CardHeader className="relative pb-8 border-b border-border/50">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Sliders className="h-32 w-32" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 shadow-inner">
                  <Sliders className="h-6 w-6" />
                </div>
                <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {locale === "ru" ? "Виды контроля" : locale === "uzLatn" ? "Nazorat turlari" : "Назорат турлари"}
                </CardTitle>
              </div>
              <CardDescription className="text-lg font-medium text-muted-foreground/80 max-w-2xl leading-relaxed pl-1">
                {locale === "ru" ? "Справочник классификации видов ревизионных мероприятий" : "Nazorat taftish turlari ma'lumotnomasi"}
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <TechnicalNameBadge name="RefControlType" />
              <div className="relative group w-full md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-amber-600 transition-colors" />
                <Input
                  placeholder={locale === "ru" ? "Поиск..." : "Qidirish..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 bg-white/50 border-border/40 rounded-xl focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all font-medium placeholder:text-muted-foreground/50 shadow-sm text-sm"
                />
              </div>
              <Button onClick={handleAddClick} className="rounded-xl h-11 px-6 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 bg-amber-600 hover:bg-amber-700 transition-all font-black uppercase tracking-widest text-[11px] text-white">
                <Plus className="h-4 w-4 mr-2" />
                {locale === "ru" ? "Добавить вид" : "Yangi qo'shish"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/50 h-16 bg-muted/20">
                  <TableHead className="w-[80px] px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 text-center">ID</TableHead>
                  <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{locale === "ru" ? "Наименование" : "Nomlanishi"}</TableHead>
                  <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{locale === "ru" ? "Описание" : "Tavsifi"}</TableHead>
                  <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{locale === "ru" ? "Статус" : "Status"}</TableHead>
                  <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 text-right">{locale === "ru" ? "Действия" : "Harakatlar"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-muted-foreground animate-pulse font-medium">
                      {locale === "ru" ? "Загрузка..." : "Yuklanmoqda..."}
                    </TableCell>
                  </TableRow>
                ) : filteredTypes.length > 0 ? (
                  filteredTypes.map((type, idx) => (
                    <TableRow key={type.id} className="group h-20 hover:bg-amber-500/5 transition-all duration-300 border-b border-border/40">
                      <TableCell className="px-6 text-center">
                        <span className="font-mono text-xs font-bold text-muted-foreground/40 leading-none">{(idx + 1).toString().padStart(3, '0')}</span>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-amber-50/50 text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all scale-90 border border-amber-100/50">
                            <Settings2 className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-[15px] text-slate-900 group-hover:text-amber-600 transition-colors">
                              {getLocalizedName(type)}
                            </span>
                            <span className="text-[11px] font-medium text-muted-foreground/60 line-clamp-1">
                              {getSubtextNames(type)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/80 bg-muted/30 px-3 py-1.5 rounded-lg w-fit">
                          <FileText className="h-3.5 w-3.5 text-amber-500" />
                          {getLocalizedDescription(type)}
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          variant={type.status === 'inactive' ? "secondary" : "default"}
                          className={cn(
                            "px-2.5 py-1 rounded-lg border-none text-[10px] font-bold shadow-sm",
                            type.status === 'active' ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            {type.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {type.status === 'active' ? (locale === "ru" ? "Активен" : "Faol") : (locale === "ru" ? "Неактивен" : "Faol emas")}
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
                            <DropdownMenuLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground/60 px-3 py-2">{locale === "ru" ? "Управление" : "Boshqarish"}</DropdownMenuLabel>
                            <DropdownMenuSeparator className="opacity-50" />
                            <DropdownMenuItem onClick={() => handleEditClick(type)} className="rounded-xl py-2.5 cursor-pointer focus:bg-amber-500/5">
                              <Edit className="h-4 w-4 mr-2.5 text-blue-600" />
                              <span className="font-semibold">{locale === "ru" ? "Редактировать" : "Tahrirlash"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="opacity-50" />
                            <DropdownMenuItem onClick={() => handleDelete(type.id)} className="rounded-xl py-2.5 cursor-pointer text-destructive focus:bg-destructive/5 font-medium">
                              <Trash2 className="h-4 w-4 mr-2.5" />
                              <span className="font-semibold">{locale === "ru" ? "Удалить" : "O'chirish"}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-muted-foreground font-medium italic">
                      {locale === "ru" ? "Ничего не найдено" : "Hech narsa topilmadi"}
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
              <div className="p-3.5 rounded-2xl bg-amber-600 text-white shadow-xl shadow-amber-600/20">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 leading-none mb-1.5">
                  {editingType ? "Редактировать вид контроля" : "Новый вид контроля"}
                </DialogTitle>
                <DialogDescription className="text-[15px] font-medium text-muted-foreground/80">
                  Классифицируйте тип контрольного мероприятия
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 pt-6 space-y-8">
            {/* Section 1: Identification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-6 bg-amber-600 rounded-full" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-amber-600">Основная информация</span>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Наименование (RU) *</Label>
                <div className="relative group">
                  <LayoutGrid className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-amber-600 transition-colors" />
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Предварительный контроль" className="h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-bold" />
                </div>
                {formErrors?.name && (
                  <p className="text-sm text-destructive mt-1 font-bold ml-1">{formErrors.name?._errors?.[0] || "Ошибка валидации"}</p>
                )}
              </div>
            </div>

            {/* Section 2: Localization */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-6 bg-blue-600 rounded-full" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600">Локализация</span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Наименование (UZ Latn)</Label>
                  <Input value={form.name_uz_latn} onChange={e => setForm({ ...form, name_uz_latn: e.target.value })} placeholder="Dastlabki nazorat" className="h-12 rounded-2xl bg-muted/40 border-none px-4 focus:bg-white transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Наименование (UZ Cyrl)</Label>
                  <Input value={form.name_uz_cyrl} onChange={e => setForm({ ...form, name_uz_cyrl: e.target.value })} placeholder="Дастлабки назорат" className="h-12 rounded-2xl bg-muted/40 border-none px-4 focus:bg-white transition-all font-medium" />
                </div>
              </div>
            </div>

            {/* Section 3: Status & Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-6 bg-emerald-600 rounded-full" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-emerald-600">Описание и статус</span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Статус *</Label>
                  <Popover open={openStatus} onOpenChange={setOpenStatus}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between h-12 rounded-2xl bg-muted/40 border-none px-4 hover:bg-muted/60 transition-all font-bold"
                      >
                        <div className="flex items-center gap-2.5">
                          <Activity className={cn("h-4 w-4 shrink-0", form.status === 'active' ? "text-emerald-500" : "text-slate-400")} />
                          <span>{form.status === "active" ? "Активный" : "Неактивный"}</span>
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 rounded-2xl border-none shadow-2xl z-[10000]" align="start">
                      <Command className="rounded-2xl">
                        <CommandList>
                          <CommandGroup>
                            {[
                              { value: "active", label: "Активный" },
                              { value: "inactive", label: "Неактивный" },
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
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Краткое описание</Label>
                  <div className="relative group">
                    <TextQuote className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-amber-600 transition-colors" />
                    <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Описание вида" className="h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-medium" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-muted/20 border-t border-border/40 gap-3">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 rounded-2xl px-6 font-black uppercase tracking-widest text-[11px] hover:bg-white transition-all">
              {locale === "ru" ? "Отмена" : "Bekor qilish"}
            </Button>
            <Button onClick={handleSave} className="h-12 rounded-2xl px-10 bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-600/20 font-black uppercase tracking-widest text-[11px] text-white transition-all hover:scale-[1.02] active:scale-[0.98]">
              {locale === "ru" ? "Сохранить изменения" : "Saqlash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

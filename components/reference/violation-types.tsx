"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, CheckCircle2, XCircle, AlertTriangle, MoreHorizontal, ShieldAlert, FileText, LayoutList, Check, ChevronsUpDown, Hash, Type, Globe2, Layers, Info, Filter, Download } from "lucide-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { VIOLATION_TYPES } from "@/lib/constants/violation-types"
import { useI18n } from "@/lib/i18n/context"
import { toast } from "sonner"
import { z } from "zod"

// Define Validation Schema
const violationSchema = z.object({
  code: z.string()
    .min(3, { message: "Код должен содержать минимум 3 символа" })
    .regex(/^[A-Za-z0-9-]+$/, { message: "Код может содержать только буквы, цифры и дефис" }),
  name: z.string().min(3, { message: "Наименование должно быть не короче 3 символов" }),
  category: z.string().min(1, { message: "Выберите категорию" }),
  severity: z.string().min(1, { message: "Выберите степень серьезности" }),
  description: z.string().optional(),
  status: z.string(),
  // Optional localized fields
  name_uz_latn: z.string().optional(),
  name_uz_cyrl: z.string().optional(),
  description_uz_latn: z.string().optional(),
  description_uz_cyrl: z.string().optional(),
})

interface ViolationType {
  id: number
  code: string
  name: string
  name_uz_latn: string
  name_uz_cyrl: string
  category: string
  category_uz_latn?: string
  category_uz_cyrl?: string
  severity: string
  description: string
  description_uz_latn?: string
  description_uz_cyrl?: string
  status: string
}

const initialViolationTypes: ViolationType[] = VIOLATION_TYPES.map(v => ({ ...v, status: 'active' }))

import { getClassifiersByType, saveClassifier, deleteClassifier } from "@/lib/services/reference-db-service"
import { useEffect } from "react"

export function ViolationTypes() {
  const { locale } = useI18n()
  const [searchTerm, setSearchTerm] = useState("")
  const [violationsList, setViolationsList] = useState<ViolationType[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingViolation, setEditingViolation] = useState<ViolationType | null>(null)

  const [openCategory, setOpenCategory] = useState(false)
  const [openSeverity, setOpenSeverity] = useState(false)
  const [openStatus, setOpenStatus] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getClassifiersByType("RefViolation")
      setViolationsList(data.map((v: any) => ({
        id: v.id,
        code: v.code,
        name: v.name || v.nameRu,
        name_uz_latn: v.name_uz_latn || v.nameUzLatn || "",
        name_uz_cyrl: v.name_uz_cyrl || v.nameUzCyrl || "",
        category: v.category || "",
        severity: v.severity || "",
        description: v.description || "",
        status: v.status || "active"
      })))
    } catch (error) {
      toast.error("Ошибка при загрузке данных")
    } finally {
      setLoading(false)
    }
  }
  const [formErrors, setFormErrors] = useState<any>({})

  const [form, setForm] = useState<Partial<ViolationType>>({
    code: "",
    name: "",
    name_uz_latn: "",
    name_uz_cyrl: "",
    category: "Финансовые нарушения",
    severity: "medium",
    description: "",
    status: "active"
  })

  const t = (ru: string, uzL: string, uzC: string) => {
    if (locale === "ru") return ru;
    if (locale === "uzLatn") return uzL;
    return uzC;
  }

  const getLocalizedName = (item: any) => {
    if (!item) return ""
    if (locale === "uzLatn") return item.name_uz_latn || item.name
    if (locale === "uzCyrl") return item.name_uz_cyrl || item.name
    return item.name
  }

  const getSubtextNames = (item: any) => {
    if (!item) return ""
    const names = []
    if (locale !== "ru") names.push(item.name)
    if (locale !== "uzLatn" && item.name_uz_latn) names.push(item.name_uz_latn)
    if (locale !== "uzCyrl" && item.name_uz_cyrl) names.push(item.name_uz_cyrl)
    return names.filter(Boolean).join(" / ")
  }

  const filteredViolations = violationsList.filter(
    (v) =>
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddClick = () => {
    setEditingViolation(null)
    setFormErrors({})
    setForm({
      code: "",
      name: "",
      name_uz_latn: "",
      name_uz_cyrl: "",
      category: "Финансовые нарушения",
      severity: "medium",
      description: "",
      status: "active"
    })
    setIsDialogOpen(true)
  }

  const handleEditClick = (v: ViolationType) => {
    setEditingViolation(v)
    setFormErrors({})
    setForm({ ...v })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    const result = violationSchema.safeParse(form)

    if (!result.success) {
      const errors: any = {}
      result.error.errors.forEach(err => {
        errors[err.path[0]] = err.message
      })
      setFormErrors(errors)
      toast.error("Проверьте правильность заполнения полей")
      return
    }
    setFormErrors({})

    try {
      await saveClassifier("RefViolation", form)
      await loadData()
      toast.success(editingViolation ? "Обновлено успешно" : "Добавлено успешно")
      setIsDialogOpen(false)
    } catch (error) {
      toast.error("Ошибка при сохранении")
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить эту запись?")) {
      try {
        await deleteClassifier("RefViolation", id)
        await loadData()
        toast.success("Запись удалена")
      } catch (error) {
        toast.error("Ошибка при удалении")
      }
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 rounded-full font-black text-[10px] uppercase tracking-widest">{t("Низкая", "Past", "Паст")}</Badge>
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-100 rounded-full font-black text-[10px] uppercase tracking-widest">{t("Средняя", "O'rta", "Ўрта")}</Badge>
      case 'high':
        return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-100 rounded-full font-black text-[10px] uppercase tracking-widest">{t("Высокая", "Yuqori", "Юқори")}</Badge>
      case 'critical':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-100 rounded-full font-black text-[10px] uppercase tracking-widest">{t("Критич.", "Kritik", "Критик")}</Badge>
      default: return null
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-600 text-white shadow-xl shadow-rose-600/20">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              {t("Виды нарушений", "Qoidabuzarlik turlari", "Қоидабузарлик турлари")}
            </h2>
          </div>
          <p className="text-lg font-medium text-muted-foreground/80 leading-relaxed pl-1">
            {t("Классификатор выявленных нарушений и отклонений", "Aniqlangan qoidabuzarliklar klassifikatori", "Аниқланган қоидабузарликлар классификатори")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <TechnicalNameBadge name="RefViolation" />
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-rose-600 transition-colors" />
            <Input
              placeholder={t("Поиск по коду, названию...", "Kod yoki nom bo'yicha qidirish...", "Код ёки ном бўйича қидириш...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 w-full md:w-[300px] rounded-2xl bg-white border-none shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-rose-500/10 transition-all font-bold text-sm"
            />
          </div>
          <Button
            onClick={handleAddClick}
            className="h-12 rounded-2xl px-6 bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-600/20 font-black uppercase tracking-widest text-[11px] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("Добавить", "Qo'shish", "Қўшиш")}
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100 h-20 bg-slate-50/50">
                  <TableHead className="w-[80px] px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">ID</TableHead>
                  <TableHead className="w-[120px] px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{t("Код", "Kod", "Код")}</TableHead>
                  <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{t("Наименование", "Nomlanishi", "Номи")}</TableHead>
                  <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{t("Категория", "Toifa", "Тоифа")}</TableHead>
                  <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">{t("Тяжесть", "Og'irligi", "Оғирлиги")}</TableHead>
                  <TableHead className="w-[80px] px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 text-right">{t("Действия", "Harakatlar", "Ҳаракатлар")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredViolations.map((v) => (
                  <TableRow key={v.id} className="group h-24 hover:bg-rose-50/30 transition-all duration-300 border-b border-slate-50 last:border-none">
                    <TableCell className="px-8 text-center text-slate-300 font-mono text-[13px] font-black group-hover:text-rose-300 transition-colors">
                      {v.id.toString().padStart(3, '0')}
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-100 font-mono text-[12px] px-3 py-1 rounded-xl shadow-sm">
                        {v.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex flex-col">
                        <span className="font-black text-[16px] text-slate-800 group-hover:text-rose-600 transition-colors tracking-tight">
                          {getLocalizedName(v)}
                        </span>
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
                          {getSubtextNames(v)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex flex-col items-start gap-1">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-black text-[10px] uppercase tracking-tighter rounded-lg px-2">
                          {v.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 text-center">
                      {getSeverityBadge(v.severity)}
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-lg">
                            <MoreHorizontal className="h-5 w-5 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl border-none shadow-2xl p-2 bg-white/95 backdrop-blur-xl">
                          <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("Действия", "Harakatlar", "Ҳаракатлар")}</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleEditClick(v)}
                            className="rounded-xl px-3 py-2.5 focus:bg-rose-50 focus:text-rose-600 cursor-pointer transition-colors font-bold"
                          >
                            <Edit className="h-4 w-4 mr-2.5" />
                            {t("Редактировать", "Tahrirlash", "Таҳрирлаш")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-100 my-1" />
                          <DropdownMenuItem
                            onClick={() => handleDelete(v.id)}
                            className="rounded-xl px-3 py-2.5 focus:bg-red-50 focus:text-red-600 text-red-500 cursor-pointer transition-colors font-bold"
                          >
                            <Trash2 className="h-4 w-4 mr-2.5" />
                            {t("Удалить вид", "O'chirish", "Ўчириш")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl rounded-[28px] overflow-hidden p-0">
          <DialogHeader className="p-8 pb-0">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-rose-600 text-white shadow-xl shadow-rose-600/20">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 leading-none mb-1.5">
                  {editingViolation ? t("Редактировать вид", "Tahrirlash", "Таҳрирлаш") : t("Новый вид нарушения", "Yangi tur", "Янги тур")}
                </DialogTitle>
                <DialogDescription className="text-[15px] font-medium text-muted-foreground/80">
                  {t("Конфигурация типа нарушения и степени его серьезности", "Qoidabuzarlik turi va darajasini sozlash", "Қоидабузарлик тури ва даражасини созлаш")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 pt-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-6 bg-rose-600 rounded-full" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-rose-600">{t("Основные данные", "Asosiy ma'lumotlar", "Асосий маълумотлар")}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Код нарушения", "Kod", "Код")} *</Label>
                  <div className="relative group">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-rose-600 transition-colors" />
                    <Input
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      placeholder="FIN-001"
                      className={cn(
                        "h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-black font-mono",
                        formErrors.code ? "ring-2 ring-red-500/50" : ""
                      )}
                    />
                  </div>
                  {formErrors.code && <p className="text-[10px] font-bold text-red-500 pl-1">{formErrors.code}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Категория", "Toifa", "Тоифа")} *</Label>
                  <Popover open={openCategory} onOpenChange={setOpenCategory}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn(
                        "w-full h-12 rounded-2xl bg-muted/40 border-none justify-between pl-4 hover:bg-white transition-all",
                        formErrors.category ? "ring-2 ring-red-500/50" : ""
                      )}>
                        <div className="flex items-center gap-2.5">
                          <Layers className="h-4 w-4 text-rose-500" />
                          <span className="font-bold">{form.category || t("Выберите...", "Tanlang...", "Танланг...")}</span>
                        </div>
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0 rounded-2xl border-none shadow-2xl overflow-hidden z-[10000]">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {["Финансовые нарушения", "Нарушения снабжения", "Растрата имущества", "Нецелевое использование"].map((cat) => (
                              <CommandItem key={cat} onSelect={() => { setForm({ ...form, category: cat }); setOpenCategory(false); }} className="px-4 py-3 cursor-pointer">
                                <span className="font-bold">{cat}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {formErrors.category && <p className="text-[10px] font-bold text-red-500 pl-1">{formErrors.category}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Наименование (RU)", "Nomi (RU)", "Номи (RU)")} *</Label>
                <div className="relative group">
                  <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-rose-600 transition-colors" />
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="..."
                    className={cn(
                      "h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-bold",
                      formErrors.name ? "ring-2 ring-red-500/50" : ""
                    )}
                  />
                </div>
                {formErrors.name && <p className="text-[10px] font-bold text-red-500 pl-1">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">UZ Latin</Label>
                  <Input value={form.name_uz_latn} onChange={e => setForm({ ...form, name_uz_latn: e.target.value })} className="h-12 rounded-2xl bg-muted/40 border-none px-4 focus:bg-white transition-all font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">UZ Cyrillic</Label>
                  <Input value={form.name_uz_cyrl} onChange={e => setForm({ ...form, name_uz_cyrl: e.target.value })} className="h-12 rounded-2xl bg-muted/40 border-none px-4 focus:bg-white transition-all font-bold" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-6 bg-orange-600 rounded-full" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-orange-600">{t("Серьезность и статус", "Jiddiylik va holati", "Жиддийлик ва ҳолати")}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Уровень тяжести", "Og'irlik darajasi", "Оғирлик даражаси")} *</Label>
                  <Popover open={openSeverity} onOpenChange={setOpenSeverity}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-12 rounded-2xl bg-muted/40 border-none justify-between pl-4 hover:bg-white transition-all">
                        <div className="flex items-center gap-2.5">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="font-bold">{form.severity ? t(
                            form.severity === 'low' ? "Низкая" : form.severity === 'medium' ? "Средняя" : form.severity === 'high' ? "Высокая" : "Критическая",
                            form.severity === 'low' ? "Past" : form.severity === 'medium' ? "O'rta" : form.severity === 'high' ? "Yuqori" : "Kritik",
                            form.severity === 'low' ? "Паст" : form.severity === 'medium' ? "Ўрта" : form.severity === 'high' ? "Юқори" : "Критик"
                          ) : t("Выберите...", "Tanlang...", "Танланг...")}</span>
                        </div>
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 rounded-2xl border-none shadow-2xl z-[10000]">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {[
                              { id: 'low', name: 'Низкая (Low)' },
                              { id: 'medium', name: 'Средняя (Medium)' },
                              { id: 'high', name: 'Высокая (High)' },
                              { id: 'critical', name: 'Критическая (Critical)' }
                            ].map((s) => (
                              <CommandItem key={s.id} onSelect={() => { setForm({ ...form, severity: s.id }); setOpenSeverity(false); }} className="px-4 py-3 cursor-pointer">
                                <span className="font-bold">{s.name}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Статус", "Holati", "Ҳолати")}</Label>
                  <Popover open={openStatus} onOpenChange={setOpenStatus}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-12 rounded-2xl bg-muted/40 border-none justify-between pl-4 hover:bg-white transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", form.status === 'active' ? "bg-emerald-500" : "bg-slate-400")} />
                          <span className="font-bold">
                            {form.status === 'active' ? t("Активный", "Faol", "Фаол") : t("Пассивный", "Nofaol", "Пассив")}
                          </span>
                        </div>
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 rounded-2xl border-none shadow-2xl z-[10000]">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            <CommandItem onSelect={() => { setForm({ ...form, status: 'active' }); setOpenStatus(false); }} className="px-4 py-3 cursor-pointer">
                              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 mr-2.5" />
                              <span className="font-bold text-emerald-600">{t("Активный", "Faol", "Фаол")}</span>
                            </CommandItem>
                            <CommandItem onSelect={() => { setForm({ ...form, status: 'inactive' }); setOpenStatus(false); }} className="px-4 py-3 cursor-pointer">
                              <div className="h-2.5 w-2.5 rounded-full bg-slate-400 mr-2.5" />
                              <span className="font-bold text-slate-500">{t("Пассивный", "Nofaol", "Пассив")}</span>
                            </CommandItem>
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
            <Button onClick={handleSave} className="h-12 rounded-2xl px-10 bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-600/20 font-black uppercase tracking-widest text-[11px] text-white transition-all hover:scale-[1.02] active:scale-[0.98]">
              {t("Сохранить", "Saqlash", "Сақлаш")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

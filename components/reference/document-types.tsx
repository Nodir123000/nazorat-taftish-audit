"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Search, MoreHorizontal, Files, Check, ChevronsUpDown, Hash, Type, Globe2, FileCode2, LayoutGrid, Info } from "lucide-react"
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useI18n } from "@/lib/i18n/context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { getClassifiersByType, saveClassifier, deleteClassifier } from "@/lib/services/reference-db-service"

// Validation Schema
const documentTypeSchema = z.object({
  code: z.string().min(1, { message: "Код обязателен" }),
  name: z.string().min(3, { message: "Название должно быть не короче 3 символов" }),
  category: z.string().min(1, { message: "Категория обязательна" }),
  template: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional().default("active"),
  // Optional localized fields
  name_uz_latn: z.string().optional(),
  name_uz_cyrl: z.string().optional(),
  abbreviation: z.string().optional(),
  abbreviation_uz_latn: z.string().optional(),
  abbreviation_uz_cyrl: z.string().optional(),
  description_uz_latn: z.string().optional(),
  description_uz_cyrl: z.string().optional(),
})

interface DocumentType {
  id: number
  code: string
  name: string
  name_uz_latn: string
  name_uz_cyrl: string
  abbreviation: string
  abbreviation_uz_latn: string
  abbreviation_uz_cyrl: string
  category: string
  category_uz_latn?: string
  category_uz_cyrl?: string
  template: string
  description: string
  description_uz_latn?: string
  description_uz_cyrl?: string
  status: string
}

export function DocumentTypes() {
  const { locale } = useI18n()
  const [searchTerm, setSearchTerm] = useState("")
  const [documentsList, setDocumentsList] = useState<DocumentType[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState<DocumentType | null>(null)

  const [openCategory, setOpenCategory] = useState(false)
  const [openTemplate, setOpenTemplate] = useState(false)
  const [openStatus, setOpenStatus] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({})

  const [form, setForm] = useState<Partial<DocumentType>>({
    code: "",
    name: "",
    name_uz_latn: "",
    name_uz_cyrl: "",
    category: "Основные",
    template: "Да",
    description: "",
    description_uz_latn: "",
    description_uz_cyrl: "",
    status: "active"
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getClassifiersByType("RefDocumentType")
      setDocumentsList(data.map((d: any) => ({
        id: d.id,
        code: d.code,
        name: d.nameRu || d.name,
        name_uz_latn: d.nameUzLatn || "",
        name_uz_cyrl: d.nameUzCyrl || "",
        category: d.category || "Основные",
        status: d.status || "active",
        template: "Нет",
        description: ""
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

  const getSubtextNames = (item: any) => {
    if (!item) return ""
    const names = []
    if (locale !== "ru") names.push(item.name)
    if (locale !== "uzLatn" && item.name_uz_latn) names.push(item.name_uz_latn)
    if (locale !== "uzCyrl" && item.name_uz_cyrl) names.push(item.name_uz_cyrl)
    return names.filter(Boolean).join(" / ")
  }

  const filteredDocs = documentsList.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.name_uz_latn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.name_uz_cyrl?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddClick = () => {
    setEditingDoc(null)
    setFormErrors({})
    setForm({
      code: "",
      name: "",
      name_uz_latn: "",
      name_uz_cyrl: "",
      abbreviation: "",
      abbreviation_uz_latn: "",
      abbreviation_uz_cyrl: "",
      category: "Основные",
      template: "Да",
      description: "",
      description_uz_latn: "",
      description_uz_cyrl: "",
      status: "active"
    })
    setIsDialogOpen(true)
  }

  const handleEditClick = (doc: DocumentType) => {
    setEditingDoc(doc)
    setFormErrors({})
    setForm({ ...doc })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    const result = documentTypeSchema.safeParse(form)

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

    const isDuplicateCode = documentsList.some(d =>
      d.code === form.code && (!editingDoc || d.id !== editingDoc.id)
    )

    if (isDuplicateCode) {
      toast.error("Документ с таким кодом уже существует")
      return
    }

    try {
      await saveClassifier("RefDocumentType", {
        id: editingDoc?.id,
        code: form.code,
        name: form.name,
        name_uz_latn: form.name_uz_latn,
        name_uz_cyrl: form.name_uz_cyrl,
        abbreviation: form.abbreviation,
        abbreviation_uz_latn: form.abbreviation_uz_latn,
        abbreviation_uz_cyrl: form.abbreviation_uz_cyrl,
        category: form.category,
        status: form.status
      })

      await loadData()
      toast.success(editingDoc ? "Обновлено успешно" : "Добавлено успешно")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Ошибка при сохранении")
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm(t("Вы уверены?", "Ishonchingiz komilmi?", "Ишончингиз комилми?"))) {
      try {
        await deleteClassifier("RefDocumentType", id)
        await loadData()
        toast.success("Удалено успешно")
      } catch (error) {
        console.error("Delete error:", error)
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
              <Files className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              {t("Типы документов", "Hujjat turlari", "Ҳужжат турлари")}
            </h2>
          </div>
          <p className="text-lg font-medium text-muted-foreground/80 leading-relaxed pl-1">
            {t("Справочник формализованных документов и шаблонов", "Hujjat turlari va shablonlar ma'lumotnomasi", "Ҳужжат турлари ва шаблонлар маълумотномаси")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <TechnicalNameBadge name="RefDocumentType" />
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
            <Input
              placeholder={t("Поиск документа...", "Hujjatni qidirish...", "Ҳужжатни қидириш...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 w-full md:w-75 rounded-2xl bg-white border-none shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-sm"
            />
          </div>
          <Button
            onClick={handleAddClick}
            className="h-12 rounded-2xl px-6 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 font-black uppercase tracking-widest text-[11px] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("Добавить", "Qo'shish", "Қўшиш")}
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl rounded-4xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100 h-20 bg-slate-50/50">
                  <TableHead className="w-20 px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">ID</TableHead>
                  <TableHead className="w-30 px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{t("Код", "Kod", "Код")}</TableHead>
                  <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{t("Наименование", "Nomlanishi", "Номи")}</TableHead>
                  <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{t("Категория", "Toifa", "Тоифа")}</TableHead>
                  <TableHead className="w-30 px-6 font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">{t("Статус", "Holati", "Ҳолати")}</TableHead>
                  <TableHead className="w-20 px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 text-right">{t("Действия", "Harakatlar", "Ҳаракатлар")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground animate-pulse">
                      {t("Загрузка...", "Yuklanmoqda...", "Загрузка...")}
                    </TableCell>
                  </TableRow>
                ) : filteredDocs.length > 0 ? (
                  filteredDocs.map((doc) => (
                    <TableRow key={doc.id} className="group h-24 hover:bg-blue-50/30 transition-all duration-300 border-b border-slate-50 last:border-none">
                      <TableCell className="px-8 text-center text-slate-300 font-mono text-[13px] font-black group-hover:text-blue-300 transition-colors">
                        {doc.id.toString().padStart(3, '0')}
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 font-mono text-[12px] px-3 py-1 rounded-xl shadow-sm">
                          {(locale === "ru" ? doc.abbreviation : locale === "uzLatn" ? doc.abbreviation_uz_latn : doc.abbreviation_uz_cyrl) || doc.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-col">
                          <span className="font-black text-[16px] text-slate-800 group-hover:text-blue-600 transition-colors tracking-tight">
                            {getLocalizedName(doc)}
                          </span>
                          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
                            {getSubtextNames(doc)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-col items-start gap-1">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-black text-[10px] uppercase tracking-tighter rounded-lg px-2">
                            {doc.category}
                          </Badge>
                          <div className="flex items-center gap-1.5 pl-1">
                            <div className={cn("h-1.5 w-1.5 rounded-full", doc.template === "Да" ? "bg-emerald-400" : "bg-slate-300")} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {doc.template === "Да" ? t("Шаблон есть", "Shablon mavjud", "Шаблон бор") : t("Без шаблона", "Shablonsiz", "Шаблонсиз")}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full px-3 py-1 font-bold text-[11px]",
                            doc.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"
                          )}
                        >
                          {doc.status === 'active' ? <CheckCircle2 className="h-3 w-3 mr-1.5" /> : <XCircle className="h-3 w-3 mr-1.5" />}
                          {doc.status === 'active' ? t("Актив", "Faol", "Фаол") : t("Пассив", "Nofaol", "Пассив")}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-lg">
                              <MoreHorizontal className="h-5 w-5 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-2xl border-none shadow-2xl p-2 bg-white/95 backdrop-blur-xl">
                            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("Управление", "Boshqarish", "Бошқариш")}</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditClick(doc)}
                              className="rounded-xl px-3 py-2.5 focus:bg-blue-50 focus:text-blue-600 cursor-pointer transition-colors font-bold"
                            >
                              <Edit className="h-4 w-4 mr-2.5" />
                              {t("Редактировать", "Tahrirlash", "Таҳрирлаш")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-100 my-1" />
                            <DropdownMenuItem
                              onClick={() => handleDelete(doc.id)}
                              className="rounded-xl px-3 py-2.5 focus:bg-red-50 focus:text-red-600 text-red-500 cursor-pointer transition-colors font-bold"
                            >
                              <Trash2 className="h-4 w-4 mr-2.5" />
                              {t("Удалить тип", "O'chirish", "Ўчириш")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                      {t("Ничего не найдено", "Hech narsa topilmadi", "Ҳеч нарса топилмади")}
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
              <div className="p-3.5 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
                <Files className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 leading-none mb-1.5">
                  {editingDoc ? t("Редактировать тип", "Turni tahrirlash", "Турни таҳрирлаш") : t("Новый тип документа", "Yangi hujjat turi", "Янги ҳужжат тури")}
                </DialogTitle>
                <DialogDescription className="text-[15px] font-medium text-muted-foreground/80">
                  {t("Заполните информацию о типе документа и его категории", "Hujjat turi va toifasi haqida ma'lumotni to'ldiring", "Ҳужжат тури ва тоифаси ҳақида маълумотни тўлдиринг")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 pt-6 space-y-8">
            {/* Section 1: Identification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-6 bg-blue-600 rounded-full" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600">{t("Идентификация", "Identifikatsiya", "Идентификация")}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Код типа", "Tur kodi", "Тур коди")} *</Label>
                  <div className="relative group">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      placeholder="DOC-001"
                      className={cn(
                        "h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-bold",
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
                          <LayoutGrid className="h-4 w-4 text-blue-500" />
                          <span className={cn("font-bold", !form.category && "text-muted-foreground/50 font-medium")}>
                            {form.category || t("Выберите...", "Tanlang...", "Танланг...")}
                          </span>
                        </div>
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-75 p-0 rounded-2xl border-none shadow-2xl overflow-hidden z-10000">
                      <Command>
                        <CommandInput placeholder={t("Поиск категории...", "Toifani qidirish...", "Тоифани қидириш...")} className="h-11" />
                        <CommandList>
                          <CommandEmpty>{t("Категория не найдена", "Toifa topilmadi", "Тоифа топилмади")}</CommandEmpty>
                          <CommandGroup>
                            {["Основные", "Распорядительные", "Отчетные", "Дополнительные"].map((cat) => (
                              <CommandItem
                                key={cat}
                                value={cat}
                                onSelect={() => {
                                  setForm({ ...form, category: cat })
                                  setOpenCategory(false)
                                }}
                                className="px-4 py-3 cursor-pointer"
                              >
                                <Check className={cn("mr-2 h-4 w-4 text-blue-600", form.category === cat ? "opacity-100" : "opacity-0")} />
                                <span className="font-bold text-slate-700">{cat}</span>
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
            </div>

            {/* Section 2: Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-6 bg-blue-600 rounded-full" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600">{t("Наименование", "Nomlanishi", "Номи")}</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Название (RU)", "Nomi (RU)", "Номи (RU)")} *</Label>
                  <div className="relative group">
                    <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Акт проверки"
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
                    <div className="relative group">
                      <Globe2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        value={form.name_uz_latn}
                        onChange={(e) => setForm({ ...form, name_uz_latn: e.target.value })}
                        placeholder="Tekshiruv dalolatnomasi"
                        className="h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">UZ Cyrillic</Label>
                    <div className="relative group">
                      <Globe2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        value={form.name_uz_cyrl}
                        onChange={(e) => setForm({ ...form, name_uz_cyrl: e.target.value })}
                        placeholder="Текширув далолатномаси"
                        className="h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-6 bg-blue-600 rounded-full" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600">{t("Конфигурация", "Konfiguratsiya", "Конфигурация")}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Наличие шаблона", "Shablon mavjudligi", "Шаблон борлиги")}</Label>
                  <Popover open={openTemplate} onOpenChange={setOpenTemplate}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-12 rounded-2xl bg-muted/40 border-none justify-between pl-4 hover:bg-white transition-all">
                        <div className="flex items-center gap-2.5">
                          <FileCode2 className="h-4 w-4 text-blue-500" />
                          <span className="font-bold">
                            {form.template === "Да" ? t("Есть шаблон", "Shablon bor", "Шаблон бор") : t("Без шаблона", "Shablonsiz", "Шаблонсиз")}
                          </span>
                        </div>
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-50 p-0 rounded-2xl border-none shadow-2xl z-10000">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            <CommandItem onSelect={() => { setForm({ ...form, template: "Да" }); setOpenTemplate(false); }} className="px-4 py-3 cursor-pointer">
                              <CheckCircle2 className="h-4 w-4 mr-2.5 text-emerald-500" />
                              <span className="font-bold text-emerald-600">{t("Шаблон есть", "Shablon bor", "Шаблон бор")}</span>
                            </CommandItem>
                            <CommandItem onSelect={() => { setForm({ ...form, template: "Нет" }); setOpenTemplate(false); }} className="px-4 py-3 cursor-pointer">
                              <XCircle className="h-4 w-4 mr-2.5 text-slate-400" />
                              <span className="font-bold text-slate-500">{t("Без шаблона", "Shablonsiz", "Шаблонсиз")}</span>
                            </CommandItem>
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
                    <PopoverContent className="w-50 p-0 rounded-2xl border-none shadow-2xl z-10000">
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

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Описание", "Tavsif", "Тавсиф")}</Label>
                <div className="relative group">
                  <Info className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder={t("Краткое описание...", "Qisqacha tavsif...", "Қисқача тавсиф...")}
                    className="h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-muted/20 border-t border-border/40 gap-3">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 rounded-2xl px-6 font-black uppercase tracking-widest text-[11px] hover:bg-white transition-all">
              {t("Отмена", "Bekor qilish", "Бекор қилиш")}
            </Button>
            <Button onClick={handleSave} className="h-12 rounded-2xl px-10 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 font-black uppercase tracking-widest text-[11px] text-white transition-all hover:scale-[1.02] active:scale-[0.98]">
              {t("Сохранить", "Saqlash", "Сақлаш")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

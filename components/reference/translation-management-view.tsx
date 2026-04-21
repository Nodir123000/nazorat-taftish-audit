"use client"

import { useState, useMemo } from "react"
import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { TechnicalNameBadge } from "@/components/reference/technical-name-badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Languages,
    Plus,
    Edit,
    Trash2,
    Search,
    Loader2,
    Key,
    FileText,
    MoreVertical,
    AlertCircle
} from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface UITranslationData {
    id: string
    key: string
    name: Record<string, string>
    description?: string
    tags: string[]
    status: string
}

const systemModules = [
    { id: "dashboard", name: "Главная" },
    { id: "planning", name: "Планирование КРР" },
    { id: "audit", name: "Проведение ревизии" },
    { id: "kpi", name: "KPI Сотрудников" },
    { id: "violations", name: "Учёт нарушений" },
    { id: "cards", name: "Карточки" },
    { id: "reports", name: "Отчётность" },
    { id: "reference", name: "Справочники" },
    { id: "admin", name: "Администрирование" },
    { id: "training", name: "Обучение системе" },
    { id: "common", name: "Общие ресурсы" },
]

export function TranslationManagementView({ selectedModule: propModule }: { selectedModule?: string }) {
    const { locale } = useI18n()
    const { data, mutate, isLoading } = useSWR<{ ok: boolean, data: UITranslationData[] }>(
        `/api/ui-translations`,
        fetcher
    )

    const [searchQuery, setSearchQuery] = useState("")
    const selectedModule = propModule || "all"
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<UITranslationData | null>(null)

    // ... rest of state

    const [form, setForm] = useState({
        key: "",
        ru: "",
        uz_latn: "",
        uz_cyrl: "",
        description: "",
        module: "common"
    })

    const filteredData = useMemo(() => {
        if (!data?.ok || !data.data) return []
        return data.data.filter(item => {
            const nameValues = Object.values(item.name).join(" ").toLowerCase()
            const matchesSearch = item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                nameValues.includes(searchQuery.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
            const matchesModule = selectedModule === "all" || item.tags.includes(selectedModule)
            return matchesSearch && matchesModule
        })
    }, [data, searchQuery, selectedModule])

    const handleSave = async () => {
        if (!form.key || !form.ru) {
            toast.error(locale === "ru" ? "Ключ и русский перевод обязательны" : "Kalit va ruscha tarjima majburiy")
            return
        }

        try {
            const response = await fetch('/api/ui-translations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: form.key,
                    description: form.description,
                    tags: [form.module],
                    name: {
                        ru: form.ru,
                        uz_latn: form.uz_latn,
                        uz_cyrl: form.uz_cyrl,
                    }
                })
            })
            const result = await response.json()
            if (result.ok) {
                toast.success(editingItem
                    ? (locale === "ru" ? "Обновлено" : "Yangilandi")
                    : (locale === "ru" ? "Создано" : "Yaratildi")
                )
                mutate()
                setIsDialogOpen(false)
            } else {
                toast.error("Ошибка: " + result.error)
            }
        } catch (e) {
            toast.error(locale === "ru" ? "Ошибка сети" : "Tarmoq xatosi")
        }
    }

    const handleDelete = async (key: string) => {
        try {
            const response = await fetch(`/api/ui-translations/${key}`, { method: 'DELETE' })
            const result = await response.json()
            if (result.ok) {
                toast.success(locale === "ru" ? "Удалено" : "O'chirildi")
                mutate()
            } else {
                toast.error("Ошибка удаления")
            }
        } catch (e) {
            toast.error("Ошибка сети")
        }
    }

    const openAdd = () => {
        setEditingItem(null)
        setForm({ key: "", ru: "", uz_latn: "", uz_cyrl: "", description: "", module: "common" })
        setIsDialogOpen(true)
    }

    const openEdit = (item: UITranslationData) => {
        setEditingItem(item)
        setForm({
            key: item.key,
            ru: item.name.ru || "",
            uz_latn: item.name.uz_latn || "",
            uz_cyrl: item.name.uz_cyrl || "",
            description: item.description || "",
            module: item.tags[0] || "common"
        })
        setIsDialogOpen(true)
    }

    const getSubtextNames = (item: UITranslationData) => {
        const names = []
        const dbLocale = locale === 'uzLatn' ? 'uz_latn' : locale === 'uzCyrl' ? 'uz_cyrl' : 'ru'

        if (dbLocale !== "ru" && item.name.ru) names.push(item.name.ru)
        if (dbLocale !== "uz_latn" && item.name.uz_latn) names.push(item.name.uz_latn)
        if (dbLocale !== "uz_cyrl" && item.name.uz_cyrl) names.push(item.name.uz_cyrl)

        return names.filter(Boolean).join(" / ")
    }

    const getCurrentName = (item: UITranslationData) => {
        const dbLocale = locale === 'uzLatn' ? 'uz_latn' : locale === 'uzCyrl' ? 'uz_cyrl' : 'ru'
        return item.name[dbLocale] || item.name.ru || item.key
    }

    return (
        <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="border-none shadow-2xl shadow-primary/5 bg-white/60 backdrop-blur-xl overflow-hidden">
                <CardHeader className="relative pb-8 border-b border-border/50">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Languages className="h-32 w-32" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shadow-inner">
                                    <Languages className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-3xl font-extrabold tracking-tight">
                                    {locale === "ru" ? "Управление переводами" : "Tarjimalarni boshqarish"}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-lg font-medium text-muted-foreground/80 max-w-2xl leading-relaxed pl-1">
                                {locale === "ru" ? "Справочник текстовых ресурсов и локализации интерфейса системы"
                                    : "Tizim interfeysini mahalliylashtirish va matnli resurslar ma'lumotnomasi"}
                            </CardDescription>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <TechnicalNameBadge name="UITranslations" />
                            <div className="relative group w-full md:w-64">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder={locale === "ru" ? "Поиск ключа или текста..." : "Kalit yoki matnni qidirish..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-11 bg-white/50 border-border/40 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-muted-foreground/50 shadow-sm text-sm"
                                />
                            </div>
                            <Button onClick={openAdd} className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 bg-primary hover:bg-primary/90 transition-all font-bold">
                                <Plus className="h-4 w-4 mr-2" />
                                {locale === "ru" ? "Добавить" : "Qo'shish"}
                            </Button>
                        </div>
                    </div>
                </CardHeader>


                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-border/50 h-12 bg-muted/10">
                                    <TableHead className="w-[60px] px-6 font-bold text-[10px] uppercase tracking-wider text-muted-foreground/70 text-center">№</TableHead>
                                    <TableHead className="w-[180px] px-6 font-bold text-[10px] uppercase tracking-wider text-muted-foreground/70">{locale === "ru" ? "Ключ ресурса" : "Resurs kaliti"}</TableHead>
                                    <TableHead className="px-6 font-bold text-[10px] uppercase tracking-wider text-muted-foreground/70">
                                        {locale === "ru" ? "Значение (3 языка)" : "Qiymati (3 til)"}
                                    </TableHead>
                                    <TableHead className="w-[150px] px-6 font-bold text-[10px] uppercase tracking-wider text-muted-foreground/70">{locale === "ru" ? "Модуль" : "Modul"}</TableHead>
                                    <TableHead className="w-[100px] px-6 font-bold text-[10px] uppercase tracking-wider text-muted-foreground/70 text-right">{locale === "ru" ? "Действия" : "Harakatlar"}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
                                                <span className="text-muted-foreground font-medium animate-pulse">{locale === "ru" ? "Загрузка данных..." : "Ma'mulotlar yuklanmoqda..."}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredData.length > 0 ? (
                                    filteredData.map((item, idx) => (
                                        <TableRow key={item.id} className="group hover:bg-primary/5 transition-all duration-300 border-b border-border/40">
                                            <TableCell className="px-6 py-4 text-center">
                                                <span className="font-mono text-[10px] font-bold text-muted-foreground/40 italic">{(idx + 1).toString().padStart(3, '0')}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                                                        <Key className="h-3 w-3" />
                                                    </div>
                                                    <code className="text-[11px] font-bold text-primary/80 bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10 truncate max-w-[160px]" title={item.key}>
                                                        {item.key}
                                                    </code>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-1 bg-gradient-to-b from-primary/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-bold text-[15px] group-hover:text-primary transition-colors leading-tight whitespace-pre-line">
                                                            {getCurrentName(item)}
                                                        </span>
                                                        <span className="text-[11px] text-muted-foreground/60 font-medium tracking-tight whitespace-pre-line">
                                                            {getSubtextNames(item)}
                                                        </span>
                                                        {item.description && (
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <FileText className="h-3 w-3 text-muted-foreground/40" />
                                                                <span className="text-[10px] text-muted-foreground/40 italic truncate max-w-[400px]">{item.description}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <Badge variant="outline" className="rounded-lg px-2 py-0.5 bg-muted/50 border-border font-bold text-[9px] uppercase tracking-tighter text-muted-foreground">
                                                    {systemModules.find(m => m.id === item.tags[0])?.name || item.tags[0]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreVertical className="h-5 w-5 text-muted-foreground" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-2xl border-none">
                                                        <DropdownMenuLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground/60">{locale === "ru" ? "Управление" : "Boshqarish"}</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => openEdit(item)} className="rounded-xl py-2.5 cursor-pointer focus:bg-primary/5">
                                                            <Edit className="h-4 w-4 mr-2.5 text-blue-600" />
                                                            {locale === "ru" ? "Редактировать" : "Tahrirlash"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <div className="flex items-center w-full px-2 py-2.5 rounded-xl cursor-pointer text-destructive focus:bg-destructive/5 font-medium text-sm">
                                                                        <Trash2 className="h-4 w-4 mr-2.5" />
                                                                        {locale === "ru" ? "Удалить" : "O'chirish"}
                                                                    </div>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent className="rounded-2xl border-none">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle className="flex items-center gap-2">
                                                                            <AlertCircle className="h-5 w-5 text-destructive" />
                                                                            {locale === "ru" ? "Удалить перевод?" : "Tarjimani o'chirish?"}
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            {locale === "ru"
                                                                                ? `Вы уверены, что хотите удалить ключ "${item.key}"? Это действие невозможно отменить.`
                                                                                : `Haqiqatan ham "${item.key}" kalitini o'chirmoqchimisiz? Ushbu amalni bekor qilib bo'lmaydi.`}
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel className="rounded-xl font-bold">{locale === "ru" ? "Отмена" : "Bekor qilish"}</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => handleDelete(item.key)} className="bg-destructive hover:bg-destructive/90 rounded-xl font-bold">
                                                                            {locale === "ru" ? "Удалить" : "O'chirish"}
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-32 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-40">
                                                <Search className="h-16 w-16 text-muted-foreground" />
                                                <span className="text-xl font-bold text-muted-foreground">{locale === "ru" ? "Ничего не найдено" : "Hech narsa topilmadi"}</span>
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
                <DialogContent className="max-w-xl rounded-3xl border-none shadow-2xl backdrop-blur-2xl bg-white/95 p-0 overflow-hidden">
                    <div className="p-8 space-y-6">
                        <DialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    {editingItem ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                </div>
                                <DialogTitle className="text-2xl font-bold tracking-tight">
                                    {editingItem
                                        ? (locale === "ru" ? "Редактирование ресурса" : "Resursni tahrirlash")
                                        : (locale === "ru" ? "Новый ключ локализации" : "Yangi mahalliylashtirish kaliti")}
                                </DialogTitle>
                            </div>
                            <DialogDescription className="text-[15px] font-medium text-muted-foreground leading-relaxed">
                                {locale === "ru" ? "Укажите уникальный ключ и переводы для всех поддерживаемых языков системы"
                                    : "Tizimning barcha qo'llab-quvvatlanadigan tillari uchun noyob kalit va tarjimalarni ko'rsating"}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{locale === "ru" ? "Уникальный ключ" : "Noyob kalit"}</Label>
                                    <Input
                                        disabled={!!editingItem}
                                        value={form.key}
                                        onChange={e => setForm({ ...form, key: e.target.value })}
                                        placeholder="common.button.save"
                                        className="rounded-xl h-11 bg-muted/30 border-none focus:bg-white transition-all shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{locale === "ru" ? "Модуль системы" : "Tizim moduli"}</Label>
                                    <Select value={form.module} onValueChange={v => setForm({ ...form, module: v })}>
                                        <SelectTrigger className="rounded-xl h-11 bg-muted/30 border-none focus:bg-white transition-all shadow-inner">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-none shadow-xl">
                                            {systemModules.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center justify-between">
                                    <span>{locale === "ru" ? "Русский текст (по умолчанию)" : "Ruscha matn (standart)"}</span>
                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none rounded-md text-[9px] h-4">RU</Badge>
                                </Label>
                                <Textarea
                                    value={form.ru}
                                    onChange={e => setForm({ ...form, ru: e.target.value })}
                                    className="rounded-xl min-h-[60px] bg-muted/30 border-none focus:bg-white transition-all shadow-inner text-lg font-bold resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center justify-between">
                                        <span>O'zbekcha matn</span>
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none rounded-md text-[9px] h-4">LAT</Badge>
                                    </Label>
                                    <Textarea
                                        value={form.uz_latn}
                                        onChange={e => setForm({ ...form, uz_latn: e.target.value })}
                                        className="rounded-xl min-h-[50px] bg-muted/30 border-none focus:bg-white transition-all shadow-inner font-semibold resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center justify-between">
                                        <span>Ўзбекча матн</span>
                                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none rounded-md text-[9px] h-4">КИР</Badge>
                                    </Label>
                                    <Textarea
                                        value={form.uz_cyrl}
                                        onChange={e => setForm({ ...form, uz_cyrl: e.target.value })}
                                        className="rounded-xl min-h-[50px] bg-muted/30 border-none focus:bg-white transition-all shadow-inner font-semibold resize-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{locale === "ru" ? "Описание контекста" : "Kontekst tavsifi"}</Label>
                                <Textarea
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder={locale === "ru" ? "Например: Заголовок в модальном окне редактирования" : "Masalan: Tahrirlash modal oynasidagi sarlavha"}
                                    className="rounded-xl min-h-[80px] bg-muted/30 border-none focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/10 px-8 py-5 border-t border-border/50 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-11 px-6 font-bold hover:bg-muted/50 transition-all">
                            {locale === "ru" ? "Отмена" : "Bekor qilish"}
                        </Button>
                        <Button onClick={handleSave} className="rounded-xl h-11 px-10 shadow-lg shadow-primary/20 font-bold transition-all hover:scale-[1.02] bg-primary hover:bg-primary/90 text-white leading-none">
                            {locale === "ru" ? "Сохранить" : "Saqlash"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

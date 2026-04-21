
"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import {
    Building2,
    Plus,
    Search,
    Edit,
    Trash2,
    MoreHorizontal,
    CheckCircle2,
    Settings2,
    XCircle,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"
import { getClassifiersByType, saveClassifier, deleteClassifier } from "@/lib/services/reference-db-service"
import { toast } from "sonner"
import { TechnicalNameBadge } from "./technical-name-badge"

export function SupplyDepartments() {
    const { locale } = useI18n()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [departments, setDepartments] = useState<any[]>([])

    // Dialog & Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingDept, setEditingDept] = useState<any>(null)
    const [form, setForm] = useState({
        id: "",
        code: "",
        nameRu: "",
        nameUzLatn: "",
        nameUzCyrl: "",
        shortName: "",
        shortNameUzLatn: "",
        shortNameUzCyrl: "",
        status: "active"
    })

    const fetchDepartments = async () => {
        setIsLoading(true)
        try {
            const data = await getClassifiersByType("RefSupplyDepartment")
            setDepartments(data || [])
        } catch (error) {
            console.error("Failed to fetch supply departments:", error)
            toast.error(locale === "ru" ? "Ошибка при загрузке данных" : "Ma'mulotlarni yuklashda xatolik")
            setDepartments([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDepartments()
    }, [])

    const getLocalizedName = (dept: any) => {
        if (!dept) return ""
        if (locale === "uzLatn") return dept.nameUzLatn || (typeof dept.name === 'string' ? dept.name : dept.name?.uz) || ""
        if (locale === "uzCyrl") return dept.nameUzCyrl || (typeof dept.name === 'string' ? dept.name : dept.name?.uzk) || ""
        return dept.nameRu || (typeof dept.name === 'string' ? dept.name : dept.name?.ru) || ""
    }

    const getLocalizedShortName = (dept: any) => {
        if (!dept) return ""
        if (locale === "uzLatn") return dept.short_name_uz_latn || (typeof dept.short_name === 'string' ? dept.short_name : dept.shortName?.uz) || ""
        if (locale === "uzCyrl") return dept.short_name_uz_cyrl || (typeof dept.short_name === 'string' ? dept.short_name : dept.shortName?.uzk) || ""
        return dept.short_name || (typeof dept.short_name === 'string' ? dept.short_name : dept.shortName?.ru) || ""
    }

    const filteredDepartments = useMemo(() => {
        if (!searchQuery) return departments
        const query = searchQuery.toLowerCase()
        return departments.filter(
            (dept) => {
                const code = (dept.code || "").toLowerCase()
                const nameRu = (dept.nameRu || (typeof dept.name === 'string' ? dept.name : dept.name?.ru) || "").toLowerCase()
                const nameUz = (dept.nameUzLatn || (typeof dept.name === 'object' ? dept.name?.uz : "") || "").toLowerCase()
                const nameUzk = (dept.nameUzCyrl || (typeof dept.name === 'object' ? dept.name?.uzk : "") || "").toLowerCase()

                return code.includes(query) || nameRu.includes(query) || nameUz.includes(query) || nameUzk.includes(query)
            }
        )
    }, [searchQuery, departments])

    const getSubtextNames = (dept: any) => {
        const names = []
        const current = getLocalizedName(dept)

        const ru = (dept.nameRu || (typeof dept.name === 'object' ? dept.name?.ru : ""))
        const uz = (dept.nameUzLatn || (typeof dept.name === 'object' ? dept.name?.uz : ""))
        const uzk = (dept.nameUzCyrl || (typeof dept.name === 'object' ? dept.name?.uzk : ""))

        if (ru && ru !== current) names.push(ru)
        if (uz && uz !== current) names.push(uz)
        if (uzk && uzk !== current) names.push(uzk)

        return names.filter(Boolean).join(" / ")
    }

    const handleAddClick = () => {
        setEditingDept(null)
        setForm({
            id: "",
            code: "",
            nameRu: "",
            nameUzLatn: "",
            nameUzCyrl: "",
            shortName: "",
            shortNameUzLatn: "",
            shortNameUzCyrl: "",
            status: "active"
        })
        setIsDialogOpen(true)
    }

    const handleEditClick = (dept: any) => {
        setEditingDept(dept)
        setForm({
            id: dept.id.toString(),
            code: dept.code,
            nameRu: dept.nameRu || (typeof dept.name === 'object' ? dept.name?.ru : "") || "",
            nameUzLatn: dept.nameUzLatn || (typeof dept.name === 'object' ? dept.name?.uz : "") || "",
            nameUzCyrl: dept.nameUzCyrl || (typeof dept.name === 'object' ? dept.name?.uzk : "") || "",
            shortName: dept.short_name || (typeof dept.shortName === 'object' ? dept.shortName?.ru : "") || "",
            shortNameUzLatn: dept.short_name_uz_latn || (typeof dept.shortName === 'object' ? dept.shortName?.uz : "") || "",
            shortNameUzCyrl: dept.short_name_uz_cyrl || (typeof dept.shortName === 'object' ? dept.shortName?.uzk : "") || "",
            status: dept.status || "active"
        })
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        if (!form.code || !form.nameRu) {
            toast.error(locale === "ru" ? "Заполните обязательные поля" : "Majburiy maydonlarni to'ldiring")
            return
        }

        try {
            await saveClassifier("RefSupplyDepartment", {
                id: form.id,
                code: form.code,
                nameRu: form.nameRu,
                nameUzLatn: form.nameUzLatn,
                nameUzCyrl: form.nameUzCyrl,
                shortName: form.shortName,
                shortNameUzLatn: form.shortNameUzLatn,
                shortNameUzCyrl: form.shortNameUzCyrl,
                status: form.status
            })

            toast.success(editingDept
                ? (locale === "ru" ? "Обновлено успешно" : "Muvaffaqiyatli yangilandi")
                : (locale === "ru" ? "Добавлено успешно" : "Muvaffaqiyatli qo'shildi")
            )
            setIsDialogOpen(false)
            fetchDepartments()
        } catch (error) {
            console.error("Save error:", error)
            toast.error(locale === "ru" ? "Ошибка при сохранении" : "Saqlashda xatolik")
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm(locale === "ru" ? "Вы уверены, что хотите удалить это управление?" : "Ushbu boshqarmani o'chirib tashlamoqchimisiz?")) {
            try {
                await deleteClassifier("RefSupplyDepartment", id)
                toast.success(locale === "ru" ? "Удалено" : "O'chirildi")
                fetchDepartments()
            } catch (error) {
                console.error("Delete error:", error)
                toast.error(locale === "ru" ? "Ошибка при удалении" : "O'chirishda xatolik")
            }
        }
    }

    return (
        <Card className="border-none shadow-2xl shadow-primary/5 bg-white/60 backdrop-blur-xl rounded-[32px] overflow-hidden">
            <CardHeader className="bg-white/40 pb-8 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-indigo-600 rounded-[22px] text-white shadow-xl shadow-indigo-600/20">
                        <Building2 className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-1">
                            <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                            {locale === "ru" ? "Службы МО" : "Vazirlik xizmatlari"}
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                            {locale === "ru" ? "Довольствующие управления" : "Dovollantiruvchi boshqarmalar"}
                            <TechnicalNameBadge name="RefSupplyDepartment" className="ml-2 inline-flex" />
                        </CardTitle>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                        <Input
                            placeholder={locale === "ru" ? "Поиск по коду или названию..." : "Kod yoki nom bo'yicha qidirish..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 h-12 rounded-2xl bg-white/80 border-none transition-all shadow-sm font-bold text-sm focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>
                    <Button
                        onClick={handleAddClick}
                        className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98] text-white"
                    >
                        <Plus className="h-4 w-4 mr-2.5" />
                        {locale === "ru" ? "Добавить" : "Qo'shish"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-border/50 h-20 bg-slate-50/50">
                                <TableHead className="w-[80px] px-8 font-black text-[11px] uppercase tracking-widest text-muted-foreground/60 text-center">ID</TableHead>
                                <TableHead className="w-[140px] px-8 font-black text-[11px] uppercase tracking-widest text-muted-foreground/60">{locale === "ru" ? "Код" : "Kod"}</TableHead>
                                <TableHead className="w-[180px] px-8 font-black text-[11px] uppercase tracking-widest text-muted-foreground/60 text-center">{locale === "ru" ? "Аббревиатура" : "Qisqartma"}</TableHead>
                                <TableHead className="px-8 font-black text-[11px] uppercase tracking-widest text-muted-foreground/60">{locale === "ru" ? "Наименование управления" : "Boshqarma nomi"}</TableHead>
                                <TableHead className="w-[150px] px-8 font-black text-[11px] uppercase tracking-widest text-muted-foreground/60 text-center">{locale === "ru" ? "Статус" : "Status"}</TableHead>
                                <TableHead className="w-[100px] px-8 font-black text-[11px] uppercase tracking-widest text-muted-foreground/60 text-right">{locale === "ru" ? "Действия" : "Harakat"}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                                {locale === "ru" ? "Загрузка данных..." : "Yuklanmoqda..."}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredDepartments.map((dept, index) => (
                                <TableRow key={dept.id || index} className="group h-24 hover:bg-indigo-50/30 transition-all duration-300 border-b border-border/30">
                                    <TableCell className="px-8 text-center">
                                        <span className="font-mono text-[13px] font-black text-slate-300 group-hover:text-indigo-300 transition-colors">{(dept.id || index + 1).toString().padStart(3, '0')}</span>
                                    </TableCell>
                                    <TableCell className="px-8">
                                        <Badge className="font-mono text-[14px] font-black bg-white text-indigo-600 border border-indigo-100 px-4 py-1.5 rounded-xl shadow-sm group-hover:shadow-indigo-500/10 transition-all">
                                            {dept.code}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-8 text-center border-l border-indigo-50/20">
                                        <Badge className="font-black text-[12px] bg-indigo-600 text-white px-4 py-1.5 rounded-xl shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-all">
                                            {getLocalizedShortName(dept)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-8 border-l border-indigo-50/20 min-w-[400px]">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm shrink-0">
                                                <Settings2 className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-black text-[16px] text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight leading-tight uppercase">
                                                    {getLocalizedName(dept)}
                                                </span>
                                                <span className="text-[11px] font-bold text-muted-foreground/50 line-clamp-1 italic">
                                                    {getSubtextNames(dept)}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 text-center border-l border-indigo-50/20">
                                        <Badge
                                            className={cn(
                                                "px-3 py-1.5 rounded-xl border-none text-[10px] font-black shadow-sm uppercase tracking-wider",
                                                dept.status === 'active' ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                                            )}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                {dept.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                {dept.status === 'active' ? (locale === "ru" ? "Активно" : "Faol") : (locale === "ru" ? "Неактив" : "Faol emas")}
                                            </div>
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-8 text-right border-l border-indigo-50/20">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white shadow-sm border border-transparent hover:border-indigo-400">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-[24px] shadow-2xl border-none p-2 backdrop-blur-2xl bg-white/95 ring-1 ring-black/5">
                                                <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 px-4 py-3">{locale === "ru" ? "Управление записью" : "Yozuvni boshqarish"}</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-slate-100/80 mx-2" />
                                                <DropdownMenuItem onClick={() => handleEditClick(dept)} className="rounded-xl py-4 px-4 cursor-pointer focus:bg-indigo-50 group/item transition-all">
                                                    <Edit className="h-5 w-5 mr-4 text-indigo-600 transition-transform group-hover/item:scale-110" />
                                                    <span className="font-black text-slate-800 text-sm uppercase tracking-wide">{locale === "ru" ? "Редактировать" : "Tahrirlash"}</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(dept.id)} className="rounded-xl py-4 px-4 cursor-pointer text-destructive focus:bg-destructive/5 font-black group/item transition-all">
                                                    <Trash2 className="h-5 w-5 mr-4 transition-transform group-hover/item:scale-110" />
                                                    <span className="text-sm uppercase tracking-wide">{locale === "ru" ? "Удалить" : "O'chirish"}</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {!isLoading && filteredDepartments.length === 0 && (
                        <div className="py-24 text-center">
                            <div className="inline-flex p-6 rounded-full bg-slate-50 mb-4">
                                <Search className="h-10 w-10 text-slate-200" />
                            </div>
                            <div className="text-slate-400 font-black text-lg">
                                {locale === "ru" ? "Ничего не найдено" : "Hech narsa topilmadi"}
                            </div>
                            <div className="text-slate-300 text-sm font-bold">
                                {locale === "ru" ? "Попробуйте изменить параметры поиска" : "Qidiruv parametrlarini o'zgartirib ko'ring"}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
                    <DialogHeader className="p-8 bg-indigo-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight">
                                    {editingDept ? (locale === "ru" ? "Редактировать управление" : "Boshqarmani tahrirlash") : (locale === "ru" ? "Добавить управление" : "Boshqarma qo'shish")}
                                </DialogTitle>
                                <DialogDescription className="text-white/70 font-bold mt-1">
                                    {locale === "ru" ? "Введите данные довольствующего управления" : "Dovollash boshqarmasi ma'lumotlarini kiriting"}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    {locale === "ru" ? "Код управления" : "Boshqarma kodi"} *
                                </Label>
                                <Input
                                    value={form.code}
                                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                                    placeholder="000"
                                    className="h-12 rounded-2xl bg-slate-50 border-none font-bold focus:ring-4 focus:ring-indigo-100 transition-all text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    {locale === "ru" ? "Статус" : "Status"}
                                </Label>
                                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
                                    <Button
                                        variant={form.status === 'active' ? 'default' : 'ghost'}
                                        onClick={() => setForm({ ...form, status: 'active' })}
                                        className={cn("flex-1 h-10 rounded-xl font-bold text-xs uppercase tracking-wider", form.status === 'active' && "bg-indigo-600 shadow-md")}
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        {locale === "ru" ? "Активно" : "Faol"}
                                    </Button>
                                    <Button
                                        variant={form.status === 'inactive' ? 'destructive' : 'ghost'}
                                        onClick={() => setForm({ ...form, status: 'inactive' })}
                                        className={cn("flex-1 h-10 rounded-xl font-bold text-xs uppercase tracking-wider", form.status === 'inactive' && "bg-rose-600 shadow-md")}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        {locale === "ru" ? "Неактив" : "Noao'l"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    {locale === "ru" ? "Название (RU)" : "Nomi (RU)"} *
                                </Label>
                                <Input
                                    value={form.nameRu}
                                    onChange={(e) => setForm({ ...form, nameRu: e.target.value })}
                                    className="h-12 rounded-2xl bg-slate-50 border-none font-bold focus:ring-4 focus:ring-indigo-100 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    {locale === "ru" ? "Название (UZ Latn)" : "Nomi (UZ Latn)"}
                                </Label>
                                <Input
                                    value={form.nameUzLatn}
                                    onChange={(e) => setForm({ ...form, nameUzLatn: e.target.value })}
                                    className="h-12 rounded-2xl bg-slate-50 border-none font-bold focus:ring-4 focus:ring-indigo-100 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    {locale === "ru" ? "Название (UZ Cyrl)" : "Nomi (UZ Cyrl)"}
                                </Label>
                                <Input
                                    value={form.nameUzCyrl}
                                    onChange={(e) => setForm({ ...form, nameUzCyrl: e.target.value })}
                                    className="h-12 rounded-2xl bg-slate-50 border-none font-bold focus:ring-4 focus:ring-indigo-100 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-t pt-6 border-slate-100">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    {locale === "ru" ? "Аббр. (RU)" : "Qisq. (RU)"}
                                </Label>
                                <Input
                                    value={form.shortName}
                                    onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                                    className="h-10 rounded-xl bg-slate-50 border-none font-black text-xs focus:ring-4 focus:ring-indigo-100 transition-all text-center"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    {locale === "ru" ? "Аббр. (UZ Latn)" : "Qisq. (UZ Latn)"}
                                </Label>
                                <Input
                                    value={form.shortNameUzLatn}
                                    onChange={(e) => setForm({ ...form, shortNameUzLatn: e.target.value })}
                                    className="h-10 rounded-xl bg-slate-50 border-none font-black text-xs focus:ring-4 focus:ring-indigo-100 transition-all text-center"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    {locale === "ru" ? "Аббр. (UZ Cyrl)" : "Qisq. (UZ Cyrl)"}
                                </Label>
                                <Input
                                    value={form.shortNameUzCyrl}
                                    onChange={(e) => setForm({ ...form, shortNameUzCyrl: e.target.value })}
                                    className="h-10 rounded-xl bg-slate-50 border-none font-black text-xs focus:ring-4 focus:ring-indigo-100 transition-all text-center"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="flex-1 h-14 rounded-[22px] font-black uppercase tracking-widest text-[11px] border-slate-200 hover:bg-slate-50 transition-all"
                            >
                                {locale === "ru" ? "Отмена" : "Bekor qilish"}
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="flex-[2] h-14 rounded-[22px] font-black uppercase tracking-widest text-[11px] bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 text-white transition-all transform active:scale-95"
                            >
                                {editingDept ? (locale === "ru" ? "Сохранить изменения" : "O'zgarishlarni saqlash") : (locale === "ru" ? "Добавить управление" : "Qo'shish")}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

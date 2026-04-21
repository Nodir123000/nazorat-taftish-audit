"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Edit, Trash2, Tag, Building2, Plus, CheckCircle2, XCircle, MoreHorizontal, ShieldCheck } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { getClassifiersByType, saveClassifier, deleteClassifier } from "@/lib/services/reference-db-service"
import { useI18n } from "@/lib/i18n/context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { z } from "zod"

// Validation Schema
const unitNameSchema = z.object({
    id: z.string()
        .min(1, { message: "Код обязателен" })
        .regex(/^\d+$/, { message: "Код должен быть числом" }),
    name: z.string().min(1, { message: "Название (RU) обязательно" }),
    name_uz_latn: z.string().optional(),
    name_uz_cyrl: z.string().optional(),
    status: z.enum(["active", "inactive"]).optional().default("active"),
})

export function UnitNamesTable() {
    const { locale } = useI18n()
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    // Initialize state from DB
    const [unitList, setUnitList] = useState<any[]>([])

    const fetchData = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await getClassifiersByType("RefSubdivisionName")
            setUnitList(data)
        } catch (error) {
            console.error("Error fetching unit names:", error)
            toast.error("Ошибка при загрузке данных")
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [openStatus, setOpenStatus] = useState(false)
    const [editingUnit, setEditingUnit] = useState<any>(null)
    const [formErrors, setFormErrors] = useState<any>({})
    const [form, setForm] = useState({
        id: "",
        name: "",
        name_uz_latn: "",
        name_uz_cyrl: "",
        status: "active"
    })

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
        if (locale !== "uzLatn") names.push(item.name_uz_latn)
        if (locale !== "uzCyrl") names.push(item.name_uz_cyrl)
        return names.filter(Boolean).join(" / ")
    }

    const filteredValues = unitList.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v as any).name_uz_latn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v as any).name_uz_cyrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.id.toString().includes(searchTerm)
    )

    const handleAddClick = () => {
        setEditingUnit(null)
        setForm({
            id: "",
            name: "",
            name_uz_latn: "",
            name_uz_cyrl: "",
            status: "active"
        })
        setIsDialogOpen(true)
    }

    const handleEditClick = (unit: any) => {
        setEditingUnit(unit)
        setForm({
            id: unit.id.toString(),
            name: unit.name || "",
            name_uz_latn: unit.name_uz_latn || "",
            name_uz_cyrl: unit.name_uz_cyrl || "",
            status: unit.status || "active"
        })
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        const result = unitNameSchema.safeParse(form)

        if (!result.success) {
            toast.error(result.error.errors[0].message)
            setFormErrors(result.error.format())
            return
        }
        setFormErrors({})

        try {
            const dataToSave = {
                id: editingUnit ? editingUnit.id : (form.id ? parseInt(form.id) : undefined),
                code: form.id,
                name: form.name,
                name_uz_latn: form.name_uz_latn,
                name_uz_cyrl: form.name_uz_cyrl,
                status: form.status
            }

            await saveClassifier("RefSubdivisionName", dataToSave)
            await fetchData()

            toast.success(editingUnit
                ? t("Обновлено успешно", "Muvaffaqiyatli yangilandi", "Муваффақиятли янгиланди")
                : t("Добавлено успешно", "Muvaffaqiyatli qo'shildi", "Муваффақиятли қўшилди")
            )
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Save error:", error)
            toast.error("Ошибка при сохранении")
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm(locale === "ru" ? "Вы уверены?" : "Ishonchingiz komilmi?")) {
            try {
                await deleteClassifier("RefSubdivisionName", id)
                await fetchData()
                toast.success(locale === "ru" ? "Удалено" : "O'chirildi")
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
            <Card className="border-none shadow-xl shadow-primary/5 bg-white/60 backdrop-blur-xl overflow-hidden">
                <CardHeader className="relative pb-8 border-b border-border/50">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Building2 className="h-32 w-32" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shadow-inner">
                                    <Tag className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-3xl font-extrabold tracking-tight">
                                    {t("Наименование подразделений", "Bo'linma nomlari", "Бўлинма номлари")}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-lg font-medium text-muted-foreground/80 max-w-2xl leading-relaxed pl-1">
                                {t(
                                    "Справочник отделов, служб и подразделений воинских частей",
                                    "Harbiy qismlarning bo'lim, xizmat va bo'linmalari ma'lumotnomasi",
                                    "Ҳарбий қисмларнинг бўлим, хизмат ва бўлинмалари маълумотномаси"
                                )}
                            </CardDescription>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <TechnicalNameBadge name="RefSubdivisionName" />
                            <div className="relative group w-full md:w-64">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder={t("Поиск по названию...", "Nomi bo'yicha qidirish...", "Номи бўйича қидириш...")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-11 bg-white/50 border-border/40 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-muted-foreground/50 shadow-sm text-sm"
                                />
                            </div>
                            <Button onClick={handleAddClick} className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold">
                                <Plus className="h-4 w-4 mr-2" />
                                {t("Добавить", "Qo'shish", "Қўшиш")}
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
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 w-[120px]">{t("Код", "Kod", "Код")}</TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-3.5 w-3.5 text-primary/70" />
                                            {t("Наименование подразделения", "Bo'linma nomi", "Бўлинма номи")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 w-[120px]">{t("Статус", "Status", "Статус")}</TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 text-right">{t("Действия", "Harakatlar", "Ҳаракатлар")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredValues.length > 0 ? (
                                    filteredValues.map((v, idx) => (
                                        <TableRow key={v.id} className="group h-20 hover:bg-primary/5 transition-all duration-300 border-b border-border/40">
                                            <TableCell className="px-6">
                                                <span className="font-mono text-xs font-bold text-muted-foreground/40 leading-none">{(idx + 1).toString().padStart(3, '0')}</span>
                                            </TableCell>
                                            <TableCell className="px-6 border-l border-border/5">
                                                <Badge variant="outline" className="font-mono text-xs font-bold bg-white/50 text-slate-700 border-slate-200">
                                                    {v.id}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 border-l border-border/5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-[15px] text-slate-900 group-hover:text-primary transition-colors">
                                                            {getLocalizedName(v)}
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] font-medium text-muted-foreground/60 line-clamp-1">
                                                        {getSubtextNames(v)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 border-l border-border/5">
                                                <Badge
                                                    variant={v.status === 'inactive' ? "secondary" : "default"}
                                                    className={cn(
                                                        "px-2.5 py-1 rounded-lg border-none text-[10px] font-bold shadow-sm",
                                                        v.status === 'inactive' ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        {v.status === 'inactive' ? <XCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                                                        {v.status === 'inactive' ? t("Неактивно", "Faol emas", "Фаол эмас") : t("Активно", "Faol", "Актив")}
                                                    </div>
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 text-right border-l border-border/5">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-2xl border-none">
                                                        <DropdownMenuLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground/60">{t("Управление", "Boshqarish", "Бошқариш")}</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleEditClick(v)} className="rounded-xl py-2.5 cursor-pointer focus:bg-primary/5">
                                                            <Edit className="h-4 w-4 mr-2.5 text-primary" />
                                                            {t("Редактировать", "Tahrirlash", "Таҳрирлаш")}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(v.id)} className="rounded-xl py-2.5 cursor-pointer text-destructive focus:bg-destructive/5 font-medium">
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
                                        <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
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
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                                    {editingUnit
                                        ? t("Редактировать подразделение", "Bo'linmani tahrirlash", "Бўлинмани таҳрирлаш")
                                        : t("Добавить подразделение", "Bo'linma qo'shish", "Бўлинма қўшиш")}
                                </DialogTitle>
                                <DialogDescription className="font-medium">
                                    {t("Заполните данные о подразделении", "Bo'linma ma'lumotlarini to'ldiring", "Бўлинма маълумотларини тўлдиринг")}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Код", "Kod", "Код")}</Label>
                                <Input
                                    value={form.id}
                                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                                    placeholder="1201"
                                    className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-bold font-mono"
                                />
                                {formErrors?.id && (
                                    <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.id._errors[0]}</p>
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
                                            className="w-full justify-between h-11 rounded-xl bg-muted/40 border-none font-normal"
                                        >
                                            {form.status === 'active' ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                    {t("Активно", "Faol", "Актив")}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                                                    {t("Неактивно", "Faol emas", "Фаол эмас")}
                                                </div>
                                            )}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0 z-[10000]" align="start">
                                        <Command>
                                            <CommandList>
                                                <CommandGroup>
                                                    {[
                                                        { value: "active", label: t("Активно", "Faol", "Актив"), color: "bg-emerald-500" },
                                                        { value: "inactive", label: t("Неактивно", "Faol emas", "Фаол эмас"), color: "bg-slate-400" }
                                                    ].map((item) => (
                                                        <CommandItem
                                                            key={item.value}
                                                            value={item.value}
                                                            onSelect={(currentValue: string) => {
                                                                setForm({ ...form, status: currentValue as any })
                                                                setOpenStatus(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    form.status === item.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex items-center gap-2">
                                                                <div className={cn("h-2 w-2 rounded-full", item.color)} />
                                                                {item.label}
                                                            </div>
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

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Название (RU)", "Nomi (RU)", "Номи (RU)")}</Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Командование"
                                    className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-medium"
                                />
                                {formErrors?.name && (
                                    <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.name._errors[0]}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Название (UZ Lat)", "Nomi (UZ Lat)", "Номи (UZ Lat)")}</Label>
                                    <Input
                                        value={form.name_uz_latn}
                                        onChange={(e) => setForm({ ...form, name_uz_latn: e.target.value })}
                                        placeholder="Qo'mondonlik"
                                        className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Название (UZ Cyr)", "Nomi (UZ Kir)", "Номи (UZ Kir)")}</Label>
                                    <Input
                                        value={form.name_uz_cyrl}
                                        onChange={(e) => setForm({ ...form, name_uz_cyrl: e.target.value })}
                                        placeholder="Қўмондонлик"
                                        className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold">
                            {t("Отмена", "Bekor qilish", "Бекор қилиш")}
                        </Button>
                        <Button onClick={handleSave} className="rounded-xl font-bold shadow-lg shadow-primary/20">
                            {t("Сохранить", "Saqlash", "Сақлаш")}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

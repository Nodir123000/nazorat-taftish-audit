"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Edit, Trash2, Hash, BookOpen, Plus, CheckCircle2, XCircle, MoreHorizontal, FileSearch } from "lucide-react"
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
import { classifiers } from "./classifiers"
import { useI18n } from "@/lib/i18n/context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { useVus, useCreateVus, useUpdateVus, useDeleteVus } from "@/lib/hooks/use-reference"

// Validation Schema
const vusSchema = z.object({
    id: z.string()
        .min(1, { message: "Код обязателен" })
        .regex(/^\d+$/, { message: "Код должен быть числом" }),
    name: z.string().min(1, { message: "Название (RU) обязательно" }),
    name_uz_latn: z.string().optional(),
    name_uz_cyrl: z.string().optional(),
    status: z.enum(["active", "inactive"]).optional().default("active"),
})

interface LocalizedName {
    ru?: string;
    uz?: string;
    uzk?: string;
}

interface ReferenceItem {
    id: string | number;
    code?: string;
    name: string | LocalizedName;
    status?: "active" | "inactive";
}

export function VusTable() {
    const { locale } = useI18n()
    const [searchTerm, setSearchTerm] = useState("")

    const { data: vusList = [], isLoading } = useVus()
    const createVus = useCreateVus()
    const updateVus = useUpdateVus()
    const deleteVus = useDeleteVus()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [openStatus, setOpenStatus] = useState(false)
    const [editingVus, setEditingVus] = useState<any>(null)
    const [formErrors, setFormErrors] = useState<any>({})
    const [form, setForm] = useState({
        id: "",
        code: "",
        name: "",
        name_uz_latn: "",
        name_uz_cyrl: "",
        status: "active"
    })

    const getLocalizedName = (item: ReferenceItem) => {
        if (!item) return ""
        if (typeof item.name === 'string') return item.name;
        const nameObj = item.name as LocalizedName;
        if (locale === "uzLatn") return nameObj.uz || nameObj.ru || ""
        if (locale === "uzCyrl") return nameObj.uzk || nameObj.ru || ""
        return nameObj.ru || ""
    }

    const getSubtextNames = (item: ReferenceItem) => {
        if (!item) return ""
        if (typeof item.name === 'string') return ""
        const nameObj = item.name as LocalizedName;
        const names = []
        if (locale !== "ru") names.push(nameObj.ru)
        if (locale !== "uzLatn") names.push(nameObj.uz)
        if (locale !== "uzCyrl") names.push(nameObj.uzk)
        return names.filter(Boolean).join(" / ")
    }

    const filteredValues = (Array.isArray(vusList) ? vusList : []).filter((v: ReferenceItem) => {
        const name = v.name;
        const code = (v.code || v.id.toString()).toLowerCase()
        const s = searchTerm.toLowerCase()
        
        if (typeof name === 'string') {
            return name.toLowerCase().includes(s) || code.includes(s)
        }
        
        return (
            name.ru?.toLowerCase().includes(s) ||
            name.uz?.toLowerCase().includes(s) ||
            name.uzk?.toLowerCase().includes(s) ||
            code.includes(s)
        )
    })

    const formatVusCode = (id: string | number) => {
        const s = id.toString().padStart(6, '0');
        return s;
    }

    const handleAddClick = () => {
        setEditingVus(null)
        setForm({
            id: "",
            code: "",
            name: "",
            name_uz_latn: "",
            name_uz_cyrl: "",
            status: "active"
        })
        setIsDialogOpen(true)
    }

    const handleEditClick = (vus: ReferenceItem) => {
        setEditingVus(vus)
        const nameObj = vus.name as any
        setForm({
            id: vus.id.toString(),
            code: vus.code || vus.id.toString(),
            name: nameObj.ru || "",
            name_uz_latn: nameObj.uz || "",
            name_uz_cyrl: nameObj.uzk || "",
            status: vus.status || "active"
        })
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        const result = vusSchema.safeParse({
            id: form.id || form.code, // Use code as ID for validation if needed, but we mostly care about code
            name: form.name,
            name_uz_latn: form.name_uz_latn,
            name_uz_cyrl: form.name_uz_cyrl,
            status: form.status as any
        })

        if (!result.success) {
            toast.error(result.error.errors[0].message)
            return
        }

        try {
            const vusData = {
                id: form.id,
                code: form.code || form.id,
                name: {
                    ru: form.name,
                    uz: form.name_uz_latn,
                    uzk: form.name_uz_cyrl
                },
                status: form.status
            }

            if (editingVus) {
                await updateVus.mutateAsync({ id: form.id, data: vusData })
            } else {
                await createVus.mutateAsync(vusData)
            }

            toast.success(editingVus ? "Обновлено" : "Добавлено")
            setIsDialogOpen(false)
        } catch (error) {
            toast.error(locale === "ru" ? "Ошибка сохранения" : locale === "uzLatn" ? "Saqlashda xatolik" : "Сақлашда хатолик")
        }
    }

    const handleDelete = async (id: string | number) => {
        if (confirm(locale === "ru" ? "Вы уверены?" : "Ishonchingiz komilmi?")) {
            try {
                await deleteVus.mutateAsync(id.toString())
                toast.success(locale === "ru" ? "Удалено" : "O'chirildi")
            } catch (error) {
                toast.error(locale === "ru" ? "Ошибка удаления" : locale === "uzLatn" ? "O'chirishda xatolik" : "Ўчиришда хатолик")
            }
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="border-none shadow-xl shadow-primary/5 bg-white/60 backdrop-blur-xl overflow-hidden">
                <CardHeader className="relative pb-8 border-b border-border/50">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Hash className="h-32 w-32" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 shadow-inner">
                                    <Hash className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-3xl font-extrabold tracking-tight">
                                    {locale === "ru" ? "Справочник ВУС" : locale === "uzLatn" ? "Mutaxassisliklar (VUS)" : "Мутахасссисликлар (ВУС)"}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-lg font-medium text-muted-foreground/80 max-w-2xl leading-relaxed pl-1">
                                {locale === "ru" ? "Справочник цифровых обозначений специальностей и должностей (Военно-учетные специальности)"
                                    : locale === "uzLatn" ? "Mutaxassislik va lavozimlarning raqamli belgilari ma'lumotnomasi"
                                        : "Мутахассислик ва лавозимларнинг рақамли белгилари маълумотномаси"}
                            </CardDescription>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <TechnicalNameBadge name="RefVus" />
                            <div className="relative group w-full md:w-64">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                                <Input
                                    placeholder={locale === "ru" ? "Поиск..." : "Qidirish..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-11 bg-white/50 border-border/40 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-muted-foreground/50 shadow-sm text-sm"
                                />
                            </div>
                            <Button onClick={handleAddClick} className="rounded-xl h-11 px-6 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 bg-indigo-600 hover:bg-indigo-700 transition-all font-bold">
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
                                <TableRow className="hover:bg-transparent border-b border-border/50 h-16 bg-muted/20">
                                    <TableHead className="w-20 px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">ID</TableHead>
                                    <TableHead className="w-30 px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{locale === "ru" ? "Код ВУС" : "VUS kodi"}</TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">
                                        {locale === "ru" ? "Наименование специальности" : "Mutaxassislik nomi"}
                                    </TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{locale === "ru" ? "Статус" : "Status"}</TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 text-right">{locale === "ru" ? "Действия" : "Harakatlar"}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                                <span className="text-muted-foreground font-medium">
                                                    {locale === "ru" ? "Загрузка данных..." : locale === "uzLatn" ? "Ma'lumotlar yuklanmoqda..." : "Маълумотлар юкланмоқда..."}
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredValues.length > 0 ? (
                                    filteredValues.map((v: ReferenceItem, idx: number) => (
                                        <TableRow key={v.id} className="group h-20 hover:bg-indigo-500/5 transition-all duration-300 border-b border-border/40">
                                            <TableCell className="px-6">
                                                <span className="font-mono text-xs font-bold text-muted-foreground/40 leading-none">{(idx + 1).toString().padStart(3, '0')}</span>
                                            </TableCell>
                                            <TableCell className="px-6">
                                                <Badge variant="outline" className="bg-indigo-50/50 text-indigo-600 border-indigo-200 font-mono text-xs px-2.5 py-0.5 rounded-lg shadow-sm">
                                                    {v.code || v.id}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 text-slate-900 border-l border-border/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all scale-90 border border-indigo-100/50">
                                                        <FileSearch className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-[15px] group-hover:text-indigo-600 transition-colors">
                                                            {getLocalizedName(v)}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-tighter">
                                                            {getSubtextNames(v)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 border-l border-border/5">
                                                <Badge
                                                    variant={v.status === 'inactive' ? "secondary" : "default"}
                                                    className={cn(
                                                        "px-2.5 py-1 rounded-lg border-none text-[10px] font-bold shadow-sm",
                                                        v.status === 'active' ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        {v.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                        {v.status === 'active' ? (locale === "ru" ? "Активно" : "Faol") : (locale === "ru" ? "Неактивно" : "Faol emas")}
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
                                                        <DropdownMenuLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground/60">{locale === "ru" ? "Управление" : "Boshqarish"}</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleEditClick(v)} className="rounded-xl py-2.5 cursor-pointer focus:bg-indigo-500/5">
                                                            <Edit className="h-4 w-4 mr-2.5 text-blue-600" />
                                                            {locale === "ru" ? "Редактировать" : "Tahrirlash"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(v.id)} className="rounded-xl py-2.5 cursor-pointer text-destructive focus:bg-destructive/5 font-medium">
                                                            <Trash2 className="h-4 w-4 mr-2.5" />
                                                            {locale === "ru" ? "Удалить" : "O'chirish"}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
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
                <DialogContent className="max-w-2xl rounded-3xl border-none shadow-2xl backdrop-blur-2xl bg-white/95">
                    <DialogHeader>
                        <DialogTitle>
                            {editingVus
                                ? (locale === "ru" ? "Редактировать ВУС" : "VUS tahrirlash")
                                : (locale === "ru" ? "Добавить ВУС" : "VUS qo'shish")}
                        </DialogTitle>
                        <DialogDescription>
                            {locale === "ru" ? "Заполните данные военно-учетной специальности" : "Harbiy hisob mutaxassisligi ma'lumotlarini to'ldiring"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{locale === "ru" ? "Код" : "Kod"}</Label>
                                <Input
                                    value={form.id}
                                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                                    placeholder="100915"
                                    className="rounded-xl h-11"
                                />
                                {formErrors?.id && (
                                    <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.id._errors[0]}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ru" ? "Статус" : "Status"}</Label>
                                <Popover open={openStatus} onOpenChange={setOpenStatus}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openStatus}
                                            className="w-full justify-between h-11 rounded-xl bg-transparent border-input font-normal"
                                        >
                                            {form.status === 'active' ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                                    {locale === "ru" ? "Активно" : "Faol"}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                                                    {locale === "ru" ? "Неактивно" : "Faol emas"}
                                                </div>
                                            )}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-50 p-0 z-10000" align="start">
                                        <Command>
                                            <CommandList>
                                                <CommandGroup>
                                                    {[
                                                        { value: "active", label: locale === "ru" ? "Активно" : "Faol", color: "bg-green-500" },
                                                        { value: "inactive", label: locale === "ru" ? "Неактивно" : "Faol emas", color: "bg-slate-400" }
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
                        <div className="space-y-2">
                            <Label>{locale === "ru" ? "Название (RU)" : "Nomi (RU)"}</Label>
                            <Input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Стрелок"
                                className="rounded-xl h-11"
                            />
                            {formErrors?.name && (
                                <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.name._errors[0]}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{locale === "ru" ? "Название (UZ Lat)" : "Nomi (UZ Lat)"}</Label>
                                <Input
                                    value={form.name_uz_latn}
                                    onChange={(e) => setForm({ ...form, name_uz_latn: e.target.value })}
                                    placeholder="O'qchi"
                                    className="rounded-xl h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ru" ? "Название (UZ Cyr)" : "Nomi (UZ Kir)"}</Label>
                                <Input
                                    value={form.name_uz_cyrl}
                                    onChange={(e) => setForm({ ...form, name_uz_cyrl: e.target.value })}
                                    placeholder="Ўқчи"
                                    className="rounded-xl h-11"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-11 px-6 font-bold">
                            {locale === "ru" ? "Отмена" : "Bekor qilish"}
                        </Button>
                        <Button onClick={handleSave} className="rounded-xl h-11 px-8 shadow-lg shadow-indigo-500/20 font-bold transition-all hover:scale-[1.02] bg-indigo-600 hover:bg-indigo-700 text-white">
                            {locale === "ru" ? "Сохранить" : "Saqlash"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

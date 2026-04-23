"use client"

import React, { useState, useMemo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { classifiers } from "./classifiers"
import { Badge } from "@/components/ui/badge"
import { Search, ShieldCheck, Plus, Edit, Trash2, MoreHorizontal, Swords, Waves, Filter, CheckCircle2, XCircle, Check, ChevronsUpDown, Shield, UserCircle2, Settings2, Sliders, LayoutGrid, Type, Hash, Globe2 } from "lucide-react"
import { TechnicalNameBadge } from "./technical-name-badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getClassifiersByType, saveClassifier, deleteClassifier } from "@/lib/services/reference-db-service"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { z } from "zod"
import { getMilitaryRanksTableData } from "@/lib/actions/military-ranks"

interface RankClassifierValue {
    id: number;
    name: {
        ru: string;
        uz?: string;
        uzk?: string;
    };
    compositionId?: number;
    type?: 'army' | 'navy' | string;
    status?: 'active' | 'inactive';
    level?: number;
}

const rankSchema = z.object({
    id: z.string()
        .min(1, { message: "Код/ID обязателен" })
        .regex(/^\d+$/, { message: "Код должен быть числом" }),
    name: z.string().min(1, { message: "Наименование (RU) обязательно" }),
    name_uz_latn: z.string().optional(),
    name_uz_cyrl: z.string().optional(),
    type: z.enum(["army", "navy"], { errorMap: () => ({ message: "Выберите тип" }) }),
    compositionId: z.string().min(1, { message: "Выберите состав" }),
    status: z.enum(["active", "inactive"]),
})

export function MilitaryRanksTable() {
    const { locale } = useI18n()
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingRank, setEditingRank] = useState<RankClassifierValue | null>(null)

    // Combobox states
    const [openComposition, setOpenComposition] = useState(false)
    const [openType, setOpenType] = useState(false)
    const [openStatus, setOpenStatus] = useState(false)

    const [formErrors, setFormErrors] = useState<any>({})

    // Form state
    const [form, setForm] = useState({
        id: "",
        name: "",
        name_uz_latn: "",
        name_uz_cyrl: "",
        type: "army",
        compositionId: "",
        status: "active"
    })

    const t = (ru: string, uzL: string, uzC: string) => {
        if (locale === "ru") return ru;
        if (locale === "uzLatn") return uzL;
        return uzC;
    }

    const compositionClassifier = classifiers.find(c => c.id === 11)
    const initialRanks = classifiers.find(c => c.id === 6)?.values || []

    const [compositionsData, setCompositionsData] = useState<any[]>([])
    const [ranksData, setRanksData] = useState<RankClassifierValue[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Fetch data
    const fetchRanks = React.useCallback(async () => {
        setIsLoading(true)
        try {
            // Use specialized server action
            const { compositions, ranks } = await getMilitaryRanksTableData();

            console.log("Specialized API Data:", { compositions, ranks });

            setRanksData(ranks.map((r: any) => ({
                id: r.id,
                name: r.name, // Pass the clean name object
                compositionId: r.compositionId,
                type: r.type?.toLowerCase(),
                status: r.status,
                level: r.level
            })))

            setCompositionsData(compositions.map((c: any) => ({
                id: c.id,
                name: c.name, // Pass the clean name object
            })))
        } catch (error) {
            console.error("Error fetching ranks:", error)
            toast.error("Ошибка при загрузке званий")
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchRanks()
    }, [fetchRanks])

    const getLocalizedName = (item: any) => {
        if (!item) return ""
        const nameObj = typeof item.name === 'object' ? item.name : item;
        if (locale === "uzLatn") return nameObj.uz || nameObj.ru || ""
        if (locale === "uzCyrl") return nameObj.uzk || nameObj.ru || ""
        return nameObj.ru || nameObj.name || ""
    }

    const getSubtextNames = (item: any) => {
        if (!item) return ""
        const nameObj = typeof item.name === 'object' ? item.name : item;
        const names = []
        if (locale !== "ru") names.push(nameObj.ru)
        if (locale !== "uzLatn") names.push(nameObj.uz)
        if (locale !== "uzCyrl") names.push(nameObj.uzk)
        return names.filter(Boolean).join(" / ")
    }

    const resetForm = () => {
        setForm({
            id: "",
            name: "",
            name_uz_latn: "",
            name_uz_cyrl: "",
            type: "army",
            compositionId: "",
            status: "active"
        })
        setFormErrors({})
        setEditingRank(null)
    }

    const handleSave = async () => {
        const result = rankSchema.safeParse(form)

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
            const dataToSave = {
                id: form.id,
                rankId: form.id, // Ensure rankId is passed
                code: form.id,
                name: form.name,
                name_uz_latn: form.name_uz_latn,
                name_uz_cyrl: form.name_uz_cyrl,
                type: form.type,
                compositionId: parseInt(form.compositionId),
                status: form.status
            }

            await saveClassifier("RefRank", dataToSave)

            toast.success(editingRank ? "Данные обновлены" : "Звание добавлено")
            setIsDialogOpen(false)
            resetForm()
            fetchRanks()
        } catch (error) {
            console.error("Save error:", error)
            toast.error("Ошибка при сохранении")
        }
    }

    const handleEditClick = (rank: RankClassifierValue) => {
        setEditingRank(rank)
        // Helper to extract localized string safely
        const getName = (obj: any, key: string) => {
            return obj?.[key] || obj?.name?.[key] || "";
        }

        setForm({
            id: rank.id.toString(),
            name: getName(rank.name, 'ru'),
            name_uz_latn: getName(rank.name, 'uz'),
            name_uz_cyrl: getName(rank.name, 'uzk'),
            type: (rank.type as any) || "army",
            compositionId: rank.compositionId?.toString() || "",
            status: rank.status || "active"
        })
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm(t("Вы уверены?", "Ishonchingiz komilmi?", "Ишончингиз комилми?"))) return

        try {
            await deleteClassifier("RefRank", id)
            toast.success(t("Звание удалено", "Unvon o'chirildi", "Унвон ўчирилди"))
            fetchRanks()
        } catch (error) {
            console.error("Delete error:", error)
            toast.error("Ошибка при удалении")
        }
    }

    const tableRows = useMemo(() => {
        if (!compositionsData.length) return []
        const rows: Array<{
            composition: { id: number, name: string, nameUzLatn?: string, nameUzCyrl?: string },
            armyRank?: RankClassifierValue,
            navyRank?: RankClassifierValue
        }> = []

        const sortedCompositions = [...compositionsData].sort((a, b) => a.id - b.id)

        sortedCompositions.forEach((comp: any) => {
            // Loose comparison for composition ID (string/number safe)
            const armyRanks = ranksData.filter(r => r.compositionId == comp.id && (r.type === 'army' || (r.type as string) === 'military'))
            const navyRanks = ranksData.filter(r => r.compositionId == comp.id && r.type === 'navy')

            // Allow for manual matching if types are ambiguous
            // Sort ranks by level to ensure correct hierarchy
            armyRanks.sort((a, b) => (a.level || 0) - (b.level || 0))
            navyRanks.sort((a, b) => (a.level || 0) - (b.level || 0))

            const maxLen = Math.max(armyRanks.length, navyRanks.length)

            for (let i = 0; i < (maxLen || 1); i++) {
                if (maxLen === 0 && !searchTerm) {
                    rows.push({ composition: comp })
                } else if (maxLen > 0) {
                    rows.push({
                        composition: comp,
                        armyRank: armyRanks[i],
                        navyRank: navyRanks[i]
                    })
                }
            }
        })
        return rows
    }, [ranksData, compositionsData, searchTerm])

    const filteredRows = useMemo(() => {
        return tableRows.filter(row => {
            if (!searchTerm) return true
            const s = searchTerm.toLowerCase()
            return (
                row.armyRank?.name.ru?.toLowerCase().includes(s) ||
                row.armyRank?.name.uz?.toLowerCase().includes(s) ||
                row.armyRank?.name.uzk?.toLowerCase().includes(s) ||
                row.navyRank?.name.ru?.toLowerCase().includes(s) ||
                row.navyRank?.name.uz?.toLowerCase().includes(s) ||
                row.navyRank?.name.uzk?.toLowerCase().includes(s) ||
                getLocalizedName(row.composition).toLowerCase().includes(s)
            )
        })
    }, [tableRows, searchTerm])


    if (isLoading && !ranksData.length) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="border-none shadow-xl shadow-primary/5 bg-white/60 backdrop-blur-xl overflow-hidden">
                <CardHeader className="relative pb-8 border-b border-border/50">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Shield className="h-32 w-32" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 shadow-inner">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-3xl font-extrabold tracking-tight">
                                    {t("Воинские звания", "Harbiy unvonlar", "Ҳарбий унвонлар")}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-lg font-medium text-muted-foreground/80 max-w-2xl leading-relaxed pl-1">
                                {t("Классификатор званий по составам и родам войск", "Tarkib va qo'shin turlari bo'yicha unvonlar klassifikatori", "Таркиб ва қўшин турлари бўйича унвонлар классификатори")}
                            </CardDescription>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <TechnicalNameBadge name="RefRank" />
                            <div className="relative group w-full md:w-64">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                                <Input
                                    placeholder={t("Поиск...", "Qidirish...", "Қидириш...")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-11 bg-white/50 border-border/40 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-muted-foreground/50 shadow-sm text-sm"
                                />
                            </div>
                            <Button
                                onClick={() => { resetForm(); setIsDialogOpen(true); }}
                                className="rounded-xl h-11 px-6 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 bg-indigo-600 hover:bg-indigo-700 transition-all font-bold"
                            >
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
                                    <TableHead className="w-20 px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 text-center">ID</TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{t("Состав", "Tarkib", "Таркиб")}</TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">
                                        <div className="flex items-center gap-2">
                                            <Swords className="h-3.5 w-3.5 text-indigo-500" />
                                            {t("Войсковое звание", "Quruqlikdagi unvon", "Қуруқликдаги унвон")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">
                                        <div className="flex items-center gap-2">
                                            <Waves className="h-3.5 w-3.5 text-blue-500" />
                                            {t("Корабельное звание", "Kema unvoni", "Кема унвони")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="w-30 px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 text-center">{t("Статус", "Holati", "Ҳолати")}</TableHead>
                                    <TableHead className="w-20 px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 text-right">{t("Действия", "Harakatlar", "Ҳаракатлар")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRows.map((row, idx) => (
                                    <TableRow key={`${row.composition.id}-${idx}`} className="group h-20 hover:bg-indigo-500/5 transition-all duration-300 border-b border-border/40">
                                        <TableCell className="px-6">
                                            <span className="font-mono text-xs font-bold text-muted-foreground/40 leading-none">
                                                {(row.armyRank?.id || row.navyRank?.id || "---").toString().padStart(3, '0')}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6">
                                            <div className="flex flex-col">
                                                <Badge
                                                    variant="secondary"
                                                    className="w-fit mb-1 bg-indigo-500/10 text-indigo-600 border-none font-bold text-[10px] uppercase tracking-tighter rounded-lg"
                                                >
                                                    {getLocalizedName(row.composition).replace(/ состав| tarkibi/gi, "")}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-tighter">
                                                    {getSubtextNames(row.composition).replace(/ состав| tarkibi/gi, "")}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 border-l border-border/5">
                                            {row.armyRank ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all scale-90 border border-indigo-100/50">
                                                        <Swords className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-[15px] group-hover:text-indigo-600 transition-colors">
                                                            {getLocalizedName(row.armyRank)}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-tighter">
                                                            {getSubtextNames(row.armyRank)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-200 italic text-sm pl-12">---</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-6 border-l border-border/5">
                                            {row.navyRank ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-xl bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all scale-90 border border-blue-100/50">
                                                        <Waves className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-[15px] group-hover:text-blue-600 transition-colors">
                                                            {getLocalizedName(row.navyRank)}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-tighter">
                                                            {getSubtextNames(row.navyRank)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-200 italic text-sm pl-12">---</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-6 text-center border-l border-border/5">
                                            <Badge
                                                variant={(row.armyRank?.status === 'inactive' || row.navyRank?.status === 'inactive') ? "secondary" : "default"}
                                                className={cn(
                                                    "px-2.5 py-1 rounded-lg border-none text-[10px] font-bold shadow-sm",
                                                    (row.armyRank?.status !== 'inactive' && row.navyRank?.status !== 'inactive')
                                                        ? "bg-emerald-500/10 text-emerald-600"
                                                        : "bg-slate-100 text-slate-500"
                                                )}
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    {(row.armyRank?.status !== 'inactive' && row.navyRank?.status !== 'inactive')
                                                        ? <CheckCircle2 className="h-3 w-3" />
                                                        : <XCircle className="h-3 w-3" />}
                                                    {(row.armyRank?.status !== 'inactive' && row.navyRank?.status !== 'inactive')
                                                        ? (locale === "ru" ? "Актив" : "Faol")
                                                        : (locale === "ru" ? "Неактив" : "Nofaol")}
                                                </div>
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
                                                    <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("Действия", "Harakatlar", "Ҳаракатлар")}</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => handleEditClick(row.armyRank || row.navyRank!)}
                                                        className="rounded-xl px-3 py-2.5 focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer transition-colors font-bold"
                                                    >
                                                        <Edit className="h-4 w-4 mr-2.5" />
                                                        {t("Редактировать", "Tahrirlash", "Таҳрирлаш")}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-slate-100 my-1" />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete((row.armyRank?.id || row.navyRank?.id)!)}
                                                        className="rounded-xl px-3 py-2.5 focus:bg-red-50 focus:text-red-600 text-red-500 cursor-pointer transition-colors font-bold"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2.5" />
                                                        {t("Удалить звание", "O'chirish", "Ўчириш")}
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

            <Dialog open={isDialogOpen} onOpenChange={(val) => { setIsDialogOpen(val); if (!val) resetForm(); }}>
                <DialogContent className="max-w-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl rounded-[28px] overflow-hidden p-0">
                    <DialogHeader className="p-8 pb-0">
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 leading-none mb-1.5">
                                    {editingRank ? t("Редактировать звание", "Unvonni tahrirlash", "Унвонни таҳрирлаш") : t("Новое звание", "Yangi unvon", "Янги унвон")}
                                </DialogTitle>
                                <DialogDescription className="text-[15px] font-medium text-muted-foreground/80">
                                    {t("Заполните информацию о воинском звании", "Harbiy unvon haqida ma'lumotni to'ldiring", "Ҳарбий унвон ҳақида маълумотни тўлдиринг")}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-8 pt-6 space-y-8">
                        {/* Section 1: Classification */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-indigo-600">{t("Классификация", "Tasniflash", "Таснифлаш")}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Код / ID", "Kod / ID", "Код / ID")} *</Label>
                                    <div className="relative group">
                                        <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-indigo-600 transition-colors" />
                                        <Input
                                            value={form.id}
                                            onChange={(e) => setForm({ ...form, id: e.target.value })}
                                            placeholder="601"
                                            className={cn(
                                                "h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-bold",
                                                formErrors.id ? "ring-2 ring-red-500/50" : ""
                                            )}
                                        />
                                    </div>
                                    {formErrors.id && <p className="text-[10px] font-bold text-red-500 pl-1">{formErrors.id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Состав", "Tarkib", "Таркиб")} *</Label>
                                    <Popover open={openComposition} onOpenChange={setOpenComposition}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn(
                                                "w-full h-12 rounded-2xl bg-muted/40 border-none justify-between pl-4 hover:bg-white transition-all",
                                                formErrors.compositionId ? "ring-2 ring-red-500/50" : ""
                                            )}>
                                                <div className="flex items-center gap-2.5">
                                                    <UserCircle2 className="h-4 w-4 text-indigo-500" />
                                                    <span className={cn("font-bold", !form.compositionId && "text-muted-foreground/50 font-medium")}>
                                                        {form.compositionId
                                                            ? getLocalizedName(compositionsData.find((c: any) => c.id.toString() === form.compositionId))
                                                            : t("Выберите состав", "Tarkibni tanlang", "Таркибни танланг")}
                                                    </span>
                                                </div>
                                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-75 p-0 rounded-2xl border-none shadow-2xl overflow-hidden z-10000">
                                            <Command>
                                                <CommandInput placeholder={t("Поиск состава...", "Tarkibni qidirish...", "Таркибни қидириш...")} className="h-11" />
                                                <CommandList>
                                                    <CommandEmpty>{t("Данные не найдены", "Ma'lumot topilmadi", "Маълумот топилмади")}</CommandEmpty>
                                                    <CommandGroup>
                                                        {compositionsData.map((c: any) => (
                                                            <CommandItem
                                                                key={c.id}
                                                                value={getLocalizedName(c)}
                                                                onSelect={() => {
                                                                    setForm({ ...form, compositionId: c.id.toString() })
                                                                    setOpenComposition(false)
                                                                }}
                                                                className="px-4 py-3 cursor-pointer"
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4 text-indigo-600", form.compositionId === c.id.toString() ? "opacity-100" : "opacity-0")} />
                                                                <span className="font-bold text-slate-700">{getLocalizedName(c)}</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {formErrors.compositionId && <p className="text-[10px] font-bold text-red-500 pl-1">{formErrors.compositionId}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Род войск", "Qo'shin turi", "Қўшин тури")} *</Label>
                                    <Popover open={openType} onOpenChange={setOpenType}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full h-12 rounded-2xl bg-muted/40 border-none justify-between pl-4 hover:bg-white transition-all">
                                                <div className="flex items-center gap-2.5">
                                                    {form.type === 'army' ? <Swords className="h-4 w-4 text-indigo-500" /> : <Waves className="h-4 w-4 text-blue-500" />}
                                                    <span className="font-bold">
                                                        {form.type === 'army' ? t("Войсковое", "Quruqlikdagi", "Қуруқликдаги") : t("Корабельное", "Kema", "Кема")}
                                                    </span>
                                                </div>
                                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-50 p-0 rounded-2xl border-none shadow-2xl z-10000">
                                            <Command>
                                                <CommandList>
                                                    <CommandGroup>
                                                        <CommandItem onSelect={() => { setForm({ ...form, type: 'army' }); setOpenType(false); }} className="px-4 py-3 cursor-pointer">
                                                            <Swords className="h-4 w-4 mr-2.5 text-indigo-500" />
                                                            <span className="font-bold">{t("Войсковое", "Quruqlikdagi", "Қуруқликдаги")}</span>
                                                        </CommandItem>
                                                        <CommandItem onSelect={() => { setForm({ ...form, type: 'navy' }); setOpenType(false); }} className="px-4 py-3 cursor-pointer">
                                                            <Waves className="h-4 w-4 mr-2.5 text-blue-500" />
                                                            <span className="font-bold">{t("Корабельное", "Kema", "Кема")}</span>
                                                        </CommandItem>
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Статус", "Holati", "Ҳолати")} *</Label>
                                    <Popover open={openStatus} onOpenChange={setOpenStatus}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full h-12 rounded-2xl bg-muted/40 border-none justify-between pl-4 hover:bg-white transition-all">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", form.status === 'active' ? "bg-emerald-500" : "bg-slate-400")} />
                                                    <span className="font-bold">
                                                        {form.status === 'active' ? t("Активный", "Faol", "Фаол") : t("Неактивный", "Nofaol", "Нофаол")}
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
                                                            <span className="font-bold text-slate-500">{t("Неактивный", "Nofaol", "Нофаол")}</span>
                                                        </CommandItem>
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Localization */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <div className="h-1 w-6 bg-blue-600 rounded-full" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600">{t("Локализация", "Mahalliylashtirish", "Маҳаллийлаштириш")}</span>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">{t("Название (RU)", "Nomi (RU)", "Номи (RU)")} *</Label>
                                    <div className="relative group">
                                        <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-blue-600 transition-colors" />
                                        <Input
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder="Лейтенант"
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
                                                placeholder="Leytenant"
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
                                                placeholder="Лейтенант"
                                                className="h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-bold"
                                            />
                                        </div>
                                    </div>
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
        </div >
    )
}

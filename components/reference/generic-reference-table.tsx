"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Edit, Trash2, Tag, BookOpen, Plus, CheckCircle2, XCircle, MoreHorizontal, Settings2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getClassifiersByType, saveClassifier, deleteClassifier } from "@/lib/services/reference-db-service"
import { classifiers } from "./classifiers"
import { useI18n } from "@/lib/i18n/context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { TechnicalNameBadge } from "./technical-name-badge"

const CLASSIFIER_TYPE_MAP: Record<number, string> = {
    1: "RefInspectionStatus",
    2: "RefInspectionType",
    3: "RefViolationSeverity",
    4: "RefViolationStatus",
    5: "RefDecisionStatus",
    6: "RefRank",
    7: "RefUnitType",
    8: "RefGender",
    9: "RefNationality",
    10: "RefSpecialization",
    11: "RefComposition",
    12: "RefSubdivisionName",
    13: "RefPosition",
    14: "RefVus",
    15: "RefFinancingSource",
    16: "RefTmcType",
    17: "RefViolationReason",
    18: "RefEducationLevel",
    19: "RefSecurityClearance",
    20: "RefFitnessCategory",
    21: "RefAwardPenalty",
    22: "RefAuditObject",
    23: "RefInspectionKind",
};

interface GenericReferenceTableProps {
    classifierId: number
    icon?: React.ReactNode
    titleOverride?: string
    descriptionOverride?: string
}

export function GenericReferenceTable({
    classifierId,
    icon = <Tag className="h-6 w-6 text-primary" />,
    titleOverride,
    descriptionOverride
}: GenericReferenceTableProps) {
    const { locale } = useI18n()
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    // Initialize state from DB
    const [valuesList, setValuesList] = useState<any[]>([])
    const [classifierMetadata, setClassifierMetadata] = useState<any>(null)

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const type = CLASSIFIER_TYPE_MAP[classifierId]
                if (type) {
                    const data = await getClassifiersByType(type)
                    setValuesList(data)

                    // Находим метаданные классификатора (название и описание)
                    const staticClassifier = classifiers.find(c => c.id === classifierId)
                    setClassifierMetadata(staticClassifier)
                }
            } catch (error) {
                console.error("Error fetching classifier data:", error)
                toast.error("Ошибка при загрузке данных из БД")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [classifierId])

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingValue, setEditingValue] = useState<any>(null)
    const [form, setForm] = useState({
        id: "",
        name: "",
        name_uz_latn: "",
        name_uz_cyrl: "",
        status: "active"
    })

    const getLocalizedValue = (item: any) => {
        if (!item) return ""
        
        // Handle name object if present
        if (item.name && typeof item.name === 'object') {
            if (locale === "uzLatn") return item.name.uz || item.name.ru || ""
            if (locale === "uzCyrl") return item.name.uzk || item.name.ru || ""
            return item.name.ru || ""
        }
        
        if (locale === "uzLatn") return item.name_uz_latn || item.name || ""
        if (locale === "uzCyrl") return item.name_uz_cyrl || item.name || ""
        return item.name || ""
    }

    const filteredValues = valuesList.filter(v =>
        getLocalizedValue(v).toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.id.toString().includes(searchTerm)
    )

    const formatCode = (id: number) => {
        if (classifierId === 14) return id.toString().padStart(6, '0')
        return id.toString()
    }

    const handleAddClick = () => {
        setEditingValue(null)
        setForm({
            id: "",
            name: "",
            name_uz_latn: "",
            name_uz_cyrl: "",
            status: "active"
        })
        setIsDialogOpen(true)
    }

    const handleEditClick = (val: any) => {
        setEditingValue(val)
        setForm({
            id: val.id.toString(),
            name: val.name || "",
            name_uz_latn: val.name_uz_latn || "",
            name_uz_cyrl: val.name_uz_cyrl || "",
            status: val.status || "active"
        })
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        if (!form.id || !form.name) {
            toast.error(locale === "ru" ? "Заполните обязательные поля" : "Majburiy maydonlarni to'ldiring")
            return
        }

        try {
            const type = CLASSIFIER_TYPE_MAP[classifierId]
            if (!type) throw new Error("Unknown classifier type")

            const dataToSave = {
                id: form.id,
                code: form.id,
                name: form.name,
                name_uz_latn: form.name_uz_latn,
                name_uz_cyrl: form.name_uz_cyrl,
                status: form.status
            }

            await saveClassifier(type, dataToSave)

            // Refresh local list
            const updatedData = await getClassifiersByType(type)
            setValuesList(updatedData)

            toast.success(editingValue
                ? (locale === "ru" ? "Обновлено успешно" : "Muvaffaqiyatli yangilandi")
                : (locale === "ru" ? "Добавлено успешно" : "Muvaffaqiyatli qo'shildi")
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
                const type = CLASSIFIER_TYPE_MAP[classifierId]
                if (!type) throw new Error("Unknown classifier type")

                // find the actual DB id if it differs from the displayed code-id
                // But for now we assume they match or we find by code
                const itemToDelete = valuesList.find(v => v.id === id)
                if (!itemToDelete) return

                await deleteClassifier(type, id)

                setValuesList(prev => prev.filter(v => v.id !== id))
                toast.success(locale === "ru" ? "Удалено" : "O'chirildi")
            } catch (error) {
                console.error("Delete error:", error)
                toast.error("Ошибка при удалении")
            }
        }
    }

    const title = titleOverride || getLocalizedValue(classifierMetadata) || (locale === "ru" ? "Справочник" : locale === "uzLatn" ? "Ma'lumotnoma" : "Маълумотнома")
    const description = descriptionOverride || (locale === "ru" ? classifierMetadata?.description : locale === "uzLatn" ? (classifierMetadata as any)?.description_uz_latn || classifierMetadata?.description : (classifierMetadata as any)?.description_uz_cyrl || classifierMetadata?.description) || (locale === "ru" ? "Управление системными данными" : locale === "uzLatn" ? "Tizim ma'mulotlarini boshqarish" : "Тизим маълумотларини бошқариш")

    const getSubtextNames = (item: any) => {
        if (!item) return ""
        const names = []

        const nameRu = (typeof item.name === 'object') ? item.name.ru : item.name;
        const nameUzL = (typeof item.name === 'object') ? item.name.uz : item.name_uz_latn;
        const nameUzC = (typeof item.name === 'object') ? item.name.uzk : item.name_uz_cyrl;

        if (locale !== "ru" && nameRu) names.push(nameRu)
        if (locale !== "uzLatn" && nameUzL) names.push(nameUzL)
        if (locale !== "uzCyrl" && nameUzC) names.push(nameUzC)

        return names.filter(Boolean).join(" / ")
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="border-none shadow-xl shadow-primary/5 bg-white/60 backdrop-blur-xl overflow-hidden">
                <CardHeader className="relative pb-8 border-b border-border/50">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        {icon}
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shadow-inner">
                                    {icon}
                                </div>
                                <CardTitle className="text-3xl font-extrabold tracking-tight">
                                    {title}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-lg font-medium text-muted-foreground/80 max-w-2xl leading-relaxed pl-1">
                                {description}
                            </CardDescription>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <TechnicalNameBadge name={CLASSIFIER_TYPE_MAP[classifierId] || "RefClassifier"} />
                            <div className="relative group w-full md:w-64">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder={locale === "ru" ? "Поиск..." : "Qidirish..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-11 bg-white/50 border-border/40 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-muted-foreground/50 shadow-sm text-sm"
                                />
                            </div>
                            <Button onClick={handleAddClick} className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold">
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
                                    <TableHead className="w-30 px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{locale === "ru" ? "Код" : "Kod"}</TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">
                                        {locale === "ru" ? "Наименование значения" : "Qiymat nomi"}
                                    </TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">{locale === "ru" ? "Статус" : "Status"}</TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 text-right">{locale === "ru" ? "Действия" : "Harakatlar"}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredValues.length > 0 ? (
                                    filteredValues.map((v, idx) => (
                                        <TableRow key={v.id} className="group h-20 hover:bg-primary/5 transition-all duration-300 border-b border-border/40">
                                            <TableCell className="px-6">
                                                <span className="font-mono text-xs font-bold text-muted-foreground/40 leading-none">{(idx + 1).toString().padStart(3, '0')}</span>
                                            </TableCell>
                                            <TableCell className="px-6">
                                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-mono text-xs px-2.5 py-0.5 rounded-lg shadow-sm">
                                                    {formatCode(v.id)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 text-slate-900 border-l border-border/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all scale-90">
                                                        <Settings2 className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-bold text-[15px] group-hover:text-primary transition-colors">
                                                            {getLocalizedValue(v)}
                                                        </span>
                                                        <span className="text-[11px] font-medium text-muted-foreground/60 line-clamp-1">
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
                                                        <DropdownMenuItem onClick={() => handleEditClick(v)} className="rounded-xl py-2.5 cursor-pointer focus:bg-primary/5">
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
                            {editingValue
                                ? (locale === "ru" ? "Редактировать запись" : "Yozuvni tahrirlash")
                                : (locale === "ru" ? "Добавить запись" : "Yozuv qo'shish")}
                        </DialogTitle>
                        <DialogDescription>
                            {locale === "ru" ? "Заполните необходимые данные справочника" : "Ma'lumotnoma uchun zarur ma'lumotlarni to'ldiring"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>ID/Код</Label>
                                <Input
                                    value={form.id}
                                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                                    placeholder="101"
                                    className="rounded-xl h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ru" ? "Статус" : "Status"}</Label>
                                <Select
                                    value={form.status}
                                    onValueChange={(val) => setForm({ ...form, status: val })}
                                >
                                    <SelectTrigger className="rounded-xl h-11">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                                        <SelectItem value="active" className="rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                                {locale === "ru" ? "Активно" : "Faol"}
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="inactive" className="rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-slate-400" />
                                                {locale === "ru" ? "Неактивно" : "Faol emas"}
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>{locale === "ru" ? "Название (RU)" : "Nomi (RU)"}</Label>
                            <Input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Наименование"
                                className="rounded-xl h-11"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{locale === "ru" ? "Название (UZ Lat)" : "Nomi (UZ Lat)"}</Label>
                                <Input
                                    value={form.name_uz_latn}
                                    onChange={(e) => setForm({ ...form, name_uz_latn: e.target.value })}
                                    className="rounded-xl h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ru" ? "Название (UZ Cyr)" : "Nomi (UZ Kir)"}</Label>
                                <Input
                                    value={form.name_uz_cyrl}
                                    onChange={(e) => setForm({ ...form, name_uz_cyrl: e.target.value })}
                                    className="rounded-xl h-11"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-11 px-6 font-bold">
                            {locale === "ru" ? "Отмена" : "Bekor qilish"}
                        </Button>
                        <Button onClick={handleSave} className="rounded-xl h-11 px-8 shadow-lg shadow-primary/20 font-bold transition-all hover:scale-[1.02]">
                            {locale === "ru" ? "Сохранить" : "Saqlash"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

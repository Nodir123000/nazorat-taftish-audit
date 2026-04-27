"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Fingerprint, CreditCard, Phone, CheckCircle2, XCircle, MoreHorizontal, User, MapPin, Calendar, Users, Globe, UserCircle2, Check, ChevronsUpDown, RefreshCw, DatabaseZap } from "lucide-react"
import { TechnicalNameBadge } from "./technical-name-badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { physicalPersons as initialPersons, type PhysicalPerson } from "./physical-persons-data"
import { useI18n } from "@/lib/i18n/context"
import { toast } from "sonner"
import { cn, maskPINFL } from "@/lib/utils"
import { getTerritories, getPhysicalPersons, getPhysicalPersonsCount, savePhysicalPerson, deletePhysicalPerson } from "@/lib/services/reference-db-service"
import { Lang } from "@/lib/types/i18n"
import { z } from "zod"

// Validation Schema
const physicalPersonSchema = z.object({

    pinfl: z.string()
        .length(14, { message: "ПИНФЛ должен состоять из 14 цифр" })
        .regex(/^\d+$/, { message: "ПИНФЛ должен содержать только цифры" }),
    passport: z.string()
        .regex(/^[A-Z]{2}\d{7}$/, { message: "Паспорт должен быть в формате AA1234567" }),
    lastName: z.string().min(2, { message: "Фамилия обязательна (минимум 2 символа)" }),
    firstName: z.string().min(2, { message: "Имя обязательно (минимум 2 символа)" }),
    middleName: z.string().optional(),
    birthDate: z.string().min(1, { message: "Дата рождения обязательна" }),
    gender: z.enum(["Мужской", "Женский"], { errorMap: () => ({ message: "Выберите пол" }) }),
    nationality: z.string().min(1, { message: "Национальность обязательна" }),
    region: z.string().min(1, { message: "Выберите регион" }),
    district: z.string().min(1, { message: "Выберите район" }),
    streetHouse: z.string().min(5, { message: "Адрес обязателен (минимум 5 символов)" }),
    phone: z.string()
        .regex(/^\+998 \d{2} \d{3}-\d{2}-\d{2}$/, { message: "Телефон должен быть в формате +998 XX XXX-XX-XX" })
        .or(z.string().regex(/^\+998\d{9}$/))
        .or(z.literal("")),
    status: z.enum(["active", "inactive"]),
});



export function PhysicalPersons() {
    const { locale } = useI18n()
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const searchTimer = useRef<number | null>(null)
    const [personsList, setPersonsList] = useState<PhysicalPerson[]>([])
    const [loading, setLoading] = useState(true)
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [regions, setRegions] = useState<{ id: number, name: string }[]>([])
    const [districts, setDistricts] = useState<{ id: number, name: string, region: string }[]>([])

    // Stable getName helper
    const getName = useCallback((nameObj: any) => {
        if (typeof nameObj === 'string') return nameObj;
        if (!nameObj) return "";
        if (locale === 'uzLatn') return nameObj[Lang.UZ_LATN] || nameObj[Lang.RU] || "";
        if (locale === 'uzCyrl') return nameObj[Lang.UZ_CYRL] || nameObj[Lang.RU] || "";
        return nameObj[Lang.RU] || "";
    }, [locale]);

    // Search debounce logic
    useEffect(() => {
        if (searchTimer.current) window.clearTimeout(searchTimer.current)
        searchTimer.current = window.setTimeout(() => {
            setDebouncedSearch(searchTerm.trim())
            setPage(1) // Reset to page 1 on search
        }, 300)
        return () => {
            if (searchTimer.current) window.clearTimeout(searchTimer.current)
        }
    }, [searchTerm])

    const loadTerritories = async () => {
        try {
            const data = await getTerritories()

            const regs = data.filter((t: any) => t.type !== 'District').map((r: any) => ({
                id: r.id,
                name: getName(r.name)
            }))

            const dists = data.filter((t: any) => t.type === 'District').map((d: any) => ({
                id: d.id,
                name: getName(d.name),
                region: d.region ? getName(d.region.name) : ""
            }))

            setRegions(regs)
            setDistricts(dists)
        } catch (e) {
            console.error("Failed to load territories", e)
        }
    }

    const loadData = async () => {
        setLoading(true)
        try {
            const skip = (page - 1) * pageSize;
            const take = pageSize;

            // Parallel fetch for data and count
            const [data, count] = await Promise.all([
                getPhysicalPersons({ skip, take, search: debouncedSearch }),
                getPhysicalPersonsCount({ search: debouncedSearch })
            ]);

            setTotalCount(count);

            const mappedData = data.map((p: any) => {
                const regionName = p.ref_regions ? getName(p.ref_regions.name) : "";
                const districtName = p.ref_areas ? getName(p.ref_areas.name) : "";
                const streetHouse = p.address || "";

                return {
                    id: p.id,
                    pinfl: p.pinfl,
                    passport: (p.passport_series || "") + (p.passport_number || ""),
                    lastName: p.last_name,
                    firstName: p.first_name,
                    middleName: p.middle_name || "",
                    gender: p.ref_genders ? getName(p.ref_genders.name) : "",
                    nationality: p.ref_nationalities ? getName(p.ref_nationalities.name) : "",
                    birthDate: p.birth_date ? new Date(p.birth_date).toLocaleDateString("ru-RU") : "",
                    region: regionName,
                    district: districtName,
                    streetHouse: streetHouse,
                    phone: p.contact_phone || "",
                    status: 'active'
                };
            });
            setPersonsList(mappedData as any)
        } catch (error) {
            console.error(error)
            toast.error("Ошибка при загрузке данных")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTerritories()
    }, [locale])

    useEffect(() => {
        loadData()
    }, [debouncedSearch, page, pageSize])

    useEffect(() => {
        loadData()
    }, [])


    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingPerson, setEditingPerson] = useState<PhysicalPerson | null>(null)

    const [selectedRegion, setSelectedRegion] = useState<string>("")
    const [selectedDistrict, setSelectedDistrict] = useState<string>("")

    const [form, setForm] = useState<Partial<PhysicalPerson & { status: string }>>({
        pinfl: "",
        passport: "",
        lastName: "",
        firstName: "",
        middleName: "",
        gender: "Мужской",
        nationality: "Узбек",
        birthDate: "",
        region: "",
        district: "",
        streetHouse: "",
        phone: "",
        status: "active"
    })

    const [formErrors, setFormErrors] = useState<any>({})
    const [openGender, setOpenGender] = useState(false)
    const [openStatus, setOpenStatus] = useState(false)

    const [openRegion, setOpenRegion] = useState(false)
    const [openDistrict, setOpenDistrict] = useState(false)



    const filteredDistrictsForSelection = useMemo(() => {
        return districts.filter((d) => d.region === selectedRegion)
    }, [districts, selectedRegion])

    const filteredPersons = personsList; // Server-side search implemented

    const handleRegionChange = useCallback((value: string) => {
        setSelectedRegion(value)
        setForm(prev => ({ ...prev, region: value, district: "" }))
    }, [])

    const handleAddClick = useCallback(() => {
        setEditingPerson(null)
        setForm({
            pinfl: "",
            passport: "",
            lastName: "",
            firstName: "",
            middleName: "",
            gender: "Мужской",
            nationality: "Узбек",
            birthDate: "",
            region: "",
            district: "",
            streetHouse: "",
            phone: "",
            status: "active"
        })
        setSelectedRegion("")
        setIsDialogOpen(true)
    }, [])

    const handleEditClick = useCallback((person: PhysicalPerson) => {
        setEditingPerson(person)
        const personWithStatus = { ...person, status: (person as any).status || 'active' }
        setForm(personWithStatus)
        setSelectedRegion(person.region)
        setIsDialogOpen(true)
    }, [])

    const handleSave = async () => {
        // Validate form data
        const result = physicalPersonSchema.safeParse({
            ...form,
            pinfl: form.pinfl || "",
            passport: form.passport || "",
            status: form.status || "active"
        })

        if (!result.success) {
            toast.error(result.error.errors[0].message)
            setFormErrors(result.error.format())
            return
        }
        setFormErrors({})

        try {
            // Map form to DB data
            const dbData = {
                id: editingPerson?.id,
                pinfl: form.pinfl,
                lastName: form.lastName,
                firstName: form.firstName,
                middleName: form.middleName,
                passport: form.passport,
                birthDate: form.birthDate,
                gender: form.gender,
                regionId: regions.find(r => r.name === form.region)?.id,
                districtId: districts.find(d => d.name === form.district)?.id,
                streetHouse: form.streetHouse,
                phone: form.phone
            }

            await savePhysicalPerson(dbData)
            toast.success(editingPerson ? "Обновлено успешно" : "Добавлено успешно")
            setIsDialogOpen(false)
            loadData() // Reload current page
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Ошибка при сохранении")
        }
    }

    const [isSyncing, setIsSyncing] = useState(false)

    const handlePinflSync = useCallback(async () => {
        if (!form.pinfl || form.pinfl.length !== 14) {
            toast.error(t("Введите корректный ПИНФЛ (14 цифр)", "To'g'ri PINFL kiriting (14 raqam)", "Тўғри ПИНФЛ киритинг (14 рақам)"))
            return
        }

        setIsSyncing(true)
        // Simulate API call to Centralized Registry
        await new Promise(resolve => setTimeout(resolve, 1500))

        try {
            // Mock data based on PINFL (in real system this would be a fetch)
            const mockData = {
                lastName: "Ахмедов",
                firstName: "Сардор",
                middleName: "Бахтиёрович",
                passport: "AA" + Math.floor(1000000 + Math.random() * 9000000),
                birthDate: "15.05.1985",
                gender: "Мужской",
                nationality: "Узбек",
                region: "Ташкент",
                district: "Юнусабадский район",
                streetHouse: "ул. Амира Темура, д. 10",
                status: "active"
            }

            setForm(prev => ({
                ...prev,
                ...mockData
            }))

            if (mockData.region) {
                setSelectedRegion(mockData.region)
            }

            toast.success(t("Данные синхронизированы", "Ma'lumotlar sinxronlandi", "Маълумотлар синхронланди"))
        } catch (error) {
            toast.error("Ошибка при синхронизации")
        } finally {
            setIsSyncing(false)
        }
    }, [form.pinfl, t])

    const handleDelete = async (id: number) => {
        if (confirm("Вы уверены?")) {
            try {
                await deletePhysicalPerson(id)
                toast.success("Удалено")
                loadData()
            } catch (error: any) {
                console.error(error)
                toast.error(error.message || "Ошибка при удалении")
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
                        <Users className="h-32 w-32" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 shadow-inner">
                                    <Users className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-3xl font-extrabold tracking-tight">
                                    {t("Реестр физических лиц", "Jismoniy shaxslar reestri", "Жисмоний шахслар реестри")}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-lg font-medium text-muted-foreground/80 max-w-2xl leading-relaxed pl-1">
                                {t("Персональные данные граждан со структурированными адресами", "Fuqarolarning shaxsiy ma'lumotlari va manzillari", "Фуқароларнинг шахсий маълумотлари ва манзиллари")}
                            </CardDescription>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <TechnicalNameBadge name="RefPhysicalPerson" />
                            <div className="relative group w-full md:w-80">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    placeholder={t("Поиск по ПИНФЛ, ФИО...", "Qidirish...", "Қидириш...")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-11 bg-white/50 border-border/40 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-muted-foreground/50 shadow-sm text-sm"
                                />
                            </div>
                            <Button onClick={handleAddClick} className="rounded-xl h-11 px-6 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 bg-blue-600 hover:bg-blue-700 transition-all font-bold">
                                <Plus className="h-4 w-4 mr-2" />
                                {t("Добавить лицо", "Shaxs qo'shish", "Шахс қўшиш")}
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-6 bg-slate-200 rounded w-1/3" />
                                    <div className="h-48 bg-slate-100 rounded" />
                                    <div className="h-48 bg-slate-100 rounded" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-b border-border/50 h-16 bg-muted/20">
                                            <TableHead className="w-20 px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">ID</TableHead>
                                            <TableHead className="w-45 px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 border-l border-border/5">
                                                <div className="flex items-center gap-1.5 font-bold">
                                                    <Fingerprint className="h-3.5 w-3.5 text-blue-500/70" />
                                                    ПИНФЛ / Паспорт
                                                </div>
                                            </TableHead>
                                            <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 border-l border-border/5">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="h-3.5 w-3.5 text-primary/70" />
                                                    {t("ФИО и персональные данные", "FIO va shaxsiy ma'lumotlar", "ФИО ва шахсий маълумотлар")}
                                                </div>
                                            </TableHead>
                                            <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 border-l border-border/5">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5 text-emerald-500/70" />
                                                    {t("Адрес проживания", "Yashash manzili", "Яшаш манзили")}
                                                </div>
                                            </TableHead>
                                            <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 border-l border-border/5 w-35">{t("Статус", "Holati", "Ҳолати")}</TableHead>
                                            <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 border-l border-border/5 text-right">{t("Действия", "Harakatlar", "Ҳаракатлар")}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPersons.length > 0 ? (
                                            filteredPersons.map((person, idx) => (
                                                <TableRow key={person.id} className="group h-20 hover:bg-blue-500/5 transition-all duration-300 border-b border-border/40">
                                                    <TableCell className="px-6">
                                                        <span className="font-mono text-xs font-bold text-muted-foreground/40 leading-none">{((page - 1) * pageSize + idx + 1).toString().padStart(3, '0')}</span>
                                                    </TableCell>
                                                    <TableCell className="px-6 border-l border-border/5">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-100 font-mono text-xs px-2 rounded-md shadow-sm">
                                                                    {maskPINFL(person.pinfl)}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold px-1">
                                                                <CreditCard className="h-3 w-3 opacity-60" />
                                                                {person.passport}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 border-l border-border/5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:bg-blue-600 group-hover:text-white transition-all scale-90">
                                                                {person.gender === "Мужской" ? <UserCircle2 className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-[15px] text-slate-900 group-hover:text-blue-600 transition-colors">
                                                                    {person.lastName} {person.firstName} {person.middleName}
                                                                </span>
                                                                <div className="flex items-center gap-3 mt-0.5">
                                                                    <span className="text-[10px] text-muted-foreground/70 font-bold uppercase tracking-wider flex items-center gap-1">
                                                                        <Globe className="h-2.5 w-2.5" />
                                                                        {person.nationality}
                                                                    </span>
                                                                    <span className="text-[10px] text-muted-foreground/70 font-bold uppercase tracking-wider flex items-center gap-1">
                                                                        <Calendar className="h-2.5 w-2.5" />
                                                                        {person.birthDate}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 border-l border-border/5">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-700">
                                                                {person.region}
                                                            </span>
                                                            <span className="text-[11px] text-muted-foreground leading-tight">
                                                                {person.district}, {person.streetHouse}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 border-l border-border/5">
                                                        <Badge
                                                            variant={person.status === 'inactive' ? "secondary" : "default"}
                                                            className={cn(
                                                                "px-2.5 py-1 rounded-lg border-none text-[10px] font-bold shadow-sm",
                                                                person.status === 'active' ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-1.5">
                                                                {person.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                                {person.status === 'active' ? t("Активен", "Faol", "Актив") : t("Неактивен", "Faol emas", "Фаол эмас")}
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
                                                                <DropdownMenuItem onClick={() => handleEditClick(person)} className="rounded-xl py-2.5 cursor-pointer focus:bg-blue-500/5">
                                                                    <Edit className="h-4 w-4 mr-2.5 text-blue-600" />
                                                                    {t("Редактировать", "Tahrirlash", "Таҳрирлаш")}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleDelete(person.id)} className="rounded-xl py-2.5 cursor-pointer text-destructive focus:bg-destructive/5 font-medium">
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
                                                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Search className="h-10 w-10 opacity-20" />
                                                        <span className="font-medium">{t("Ничего не найдено", "Hech narsa topilmadi", "Ҳеч нарса топилмади")}</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                {/* Pagination Controls */}
                                <div className="border-t border-border/50 px-6 py-4 bg-muted/5 flex items-center justify-between">
                                    <div className="text-xs text-muted-foreground font-medium">
                                        {t("Показано", "Ko'rsatildi", "Кўрсатилди")} <span className="text-foreground">{(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalCount)}</span> {t("из", "dan", "дан")} <span className="text-foreground">{totalCount}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="h-8 rounded-lg text-[11px] font-bold"
                                        >
                                            {t("Назад", "Orqaga", "Орқага")}
                                        </Button>
                                        <div className="flex gap-1">
                                            {[...Array(Math.ceil(totalCount / pageSize))].map((_, i) => (
                                                <Button
                                                    key={i}
                                                    variant={page === i + 1 ? "default" : "outline"}
                                                    size="icon"
                                                    onClick={() => setPage(i + 1)}
                                                    className={cn(
                                                        "h-8 w-8 rounded-lg text-[11px] font-bold transition-all",
                                                        page === i + 1 ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" : "hover:bg-primary/5"
                                                    )}
                                                >
                                                    {i + 1}
                                                </Button>
                                            )).slice(Math.max(0, page - 3), Math.min(Math.ceil(totalCount / pageSize), page + 2))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.min(Math.ceil(totalCount / pageSize), p + 1))}
                                            disabled={page >= Math.ceil(totalCount / pageSize)}
                                            className="h-8 rounded-lg text-[11px] font-bold"
                                        >
                                            {t("Далее", "Keyingi", "Кейинги")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl rounded-3xl border-none shadow-2xl backdrop-blur-2xl bg-white/95">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
                                <UserCircle2 className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                                    {editingPerson ? t("Редактирование данных", "Tahrirlash", "Таҳрирлаш") : t("Регистрация физлица", "Ro'yxatdan o'tkazish", "Рўйхатдан ўтказиш")}
                                </DialogTitle>
                                <DialogDescription className="font-medium">
                                    {t("Персональные данные и адреса граждан", "Fuqaro shaxsiy ma'lumotlari va manzili", "Фуқаро шахсий маълумотлари ва манзили")}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="space-y-4">
                            <div className="text-[11px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                <span className="h-1 w-8 bg-blue-600 rounded-full" />
                                {t("Основные данные", "Asosiy ma'lumotlar", "Асосий маълумотлар")}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("ПИНФЛ", "PINFL", "ПИНФЛ")}</Label>
                                    <div className="relative group flex gap-2">
                                        <div className="relative flex-1">
                                            <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                                            <Input
                                                value={form.pinfl}
                                                onChange={e => setForm({ ...form, pinfl: e.target.value })}
                                                className="h-11 rounded-xl bg-muted/40 border-none pl-10 focus:bg-white transition-all font-mono"
                                                maxLength={14}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={handlePinflSync}
                                            disabled={isSyncing || !form.pinfl || form.pinfl.length !== 14}
                                            className={cn(
                                                "h-11 px-4 rounded-xl shadow-md transition-all font-bold shrink-0",
                                                isSyncing ? "bg-slate-100 text-slate-400" : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                            )}
                                            title={t("Синхронизировать с реестром", "Reyestr bilan sinxronlash", "Реестр билан синхронлаш")}
                                        >
                                            {isSyncing ? (
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <DatabaseZap className="h-4 w-4" />
                                            )}
                                            <span className="ml-2 hidden sm:inline">{t("Синхро", "Sinxro", "Синхро")}</span>
                                        </Button>
                                    </div>
                                    {formErrors?.pinfl && (
                                        <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.pinfl._errors[0]}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Паспорт", "Pasport", "Паспорт")}</Label>
                                    <div className="relative group">
                                        <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                                        <Input
                                            value={form.passport}
                                            onChange={e => setForm({ ...form, passport: e.target.value })}
                                            className="h-11 rounded-xl bg-muted/40 border-none pl-10 focus:bg-white transition-all font-bold"
                                        />
                                    </div>
                                    {formErrors?.passport && (
                                        <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.passport._errors[0]}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Фамилия", "Familiya", "Фамилия")}</Label>
                                    <Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-bold" />
                                    {formErrors?.lastName && (
                                        <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.lastName._errors[0]}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Имя", "Ism", "Исм")}</Label>
                                    <Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-bold" />
                                    {formErrors?.firstName && (
                                        <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.firstName._errors[0]}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Отчество", "Sharifi", "Шарифи")}</Label>
                                    <Input value={form.middleName} onChange={e => setForm({ ...form, middleName: e.target.value })} className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-bold" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Пол", "Jinsi", "Жинси")}</Label>
                                    <Popover open={openGender} onOpenChange={setOpenGender}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openGender}
                                                className="w-full justify-between h-11 rounded-xl bg-muted/40 border-none font-normal"
                                            >
                                                {form.gender || t("Выберите пол", "Jinsni tanlang", "Жинсини танланг")}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40 p-0 z-10000" align="start">
                                            <Command>
                                                <CommandList>
                                                    <CommandGroup>
                                                        {[
                                                            { value: "Мужской", label: t("Мужской", "Erkak", "Эркак") },
                                                            { value: "Женский", label: t("Женский", "Ayol", "Аёл") }
                                                        ].map((item) => (
                                                            <CommandItem
                                                                key={item.value}
                                                                value={item.value}
                                                                onSelect={(currentValue: string) => {
                                                                    setForm({ ...form, gender: currentValue as any })
                                                                    setOpenGender(false)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        form.gender === item.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {item.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {formErrors?.gender && (
                                        <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.gender._errors[0]}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Национальность", "Millati", "Миллати")}</Label>
                                    <Input value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Дата рождения", "Tug'ilgan sana", "Туғилган сана")}</Label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                                        <Input
                                            type="text"
                                            value={form.birthDate}
                                            onChange={e => setForm({ ...form, birthDate: e.target.value })}
                                            className="h-11 rounded-xl bg-muted/40 border-none pl-10 focus:bg-white transition-all font-medium"
                                            placeholder="ДД.ММ.ГГГГ"
                                        />
                                    </div>
                                    {formErrors?.birthDate && (
                                        <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.birthDate._errors[0]}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="text-[11px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                                <span className="h-1 w-8 bg-emerald-600 rounded-full" />
                                {t("Адрес и контакты", "Manzil va kontaktlar", "Манзил ва контактлар")}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Область", "Viloyat", "Вилоят")}</Label>
                                    <Popover open={openRegion} onOpenChange={setOpenRegion}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openRegion}
                                                className="w-full justify-between h-11 rounded-xl bg-muted/40 border-none font-normal hover:bg-muted/60"
                                            >
                                                {form.region
                                                    ? regions.find((r) => r.name === form.region)?.name
                                                    : t("Выберите область", "Viloyatni tanlang", "Вилоятни танланг")}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-75 p-0 rounded-xl" align="start">
                                            <Command>
                                                <CommandInput placeholder={t("Поиск области...", "Viloyatni qidirish...", "Вилоятни қидириш...")} />
                                                <CommandList>
                                                    <CommandEmpty>{t("Область не найдена.", "Viloyat topilmadi.", "Вилоят топилмади.")}</CommandEmpty>
                                                    <CommandGroup>
                                                        {regions.map((region) => (
                                                            <CommandItem
                                                                key={region.id}
                                                                value={region.name}
                                                                onSelect={(currentValue: string) => {
                                                                    handleRegionChange(currentValue === form.region ? "" : currentValue)
                                                                    setOpenRegion(false)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        form.region === region.name ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {region.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {formErrors?.region && (
                                        <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.region._errors[0]}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Район", "Tuman", "Туман")}</Label>
                                    <Popover open={openDistrict} onOpenChange={setOpenDistrict}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openDistrict}
                                                className="w-full justify-between h-11 rounded-xl bg-muted/40 border-none font-normal hover:bg-muted/60"
                                                disabled={!form.region}
                                            >
                                                {form.district
                                                    ? districts.find((d) => d.name === form.district)?.name
                                                    : t("Выберите район", "Tumanni tanlang", "Туманни танланг")}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-75 p-0 rounded-xl" align="start">
                                            <Command>
                                                <CommandInput placeholder={t("Поиск района...", "Tumanni qidirish...", "Туманни қидириш...")} />
                                                <CommandList>
                                                    <CommandEmpty>{t("Район не найден.", "Tuman topilmadi.", "Туман топилмади.")}</CommandEmpty>
                                                    <CommandGroup>
                                                        {filteredDistrictsForSelection.map((district) => (
                                                            <CommandItem
                                                                key={district.id}
                                                                value={district.name}
                                                                onSelect={(currentValue: string) => {
                                                                    setForm({ ...form, district: currentValue === form.district ? "" : currentValue })
                                                                    setOpenDistrict(false)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        form.district === district.name ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {district.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {formErrors?.district && (
                                        <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.district._errors[0]}</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Адрес (Улица, дом)", "Manzil (Ko'cha, uy)", "Манзил (Кўча, уй)")}</Label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                                        <Input
                                            value={form.streetHouse}
                                            onChange={e => setForm({ ...form, streetHouse: e.target.value })}
                                            className="h-11 rounded-xl bg-muted/40 border-none pl-10 focus:bg-white transition-all font-medium"
                                        />
                                    </div>
                                    {formErrors?.streetHouse && (
                                        <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.streetHouse._errors[0]}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Телефон", "Telefon", "Телефон")}</Label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                                        <Input
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            className="h-11 rounded-xl bg-muted/40 border-none pl-10 focus:bg-white transition-all font-medium"
                                            placeholder="+998"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{t("Статус", "Holati", "Ҳолати")}</Label>
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
                                                {t("Активен", "Faol", "Актив")}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-slate-400" />
                                                {t("Неактивен", "Faol emas", "Фаол эмас")}
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
                                                    { value: "active", label: t("Активен", "Faol", "Актив"), color: "bg-emerald-500" },
                                                    { value: "inactive", label: t("Неактивен", "Faol emas", "Фаол эмас"), color: "bg-slate-400" }
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

                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-11 px-6 font-bold">
                            {t("Отмена", "Bekor qilish", "Бекор қилиш")}
                        </Button>
                        <Button onClick={handleSave} className="rounded-xl h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 font-bold transition-all hover:scale-[1.02]">
                            {t("Сохранить", "Saqlash", "Сақлаш")}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

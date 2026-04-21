"use client"

import { useState, useEffect, useMemo } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n/hooks"
import { Lang } from "@/lib/types/i18n"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { z } from "zod"
import { toast } from "sonner"
import { saveUnit } from "@/lib/services/reference-db-service"
import useSWR from "swr"

const militaryUnitSchema = z.object({
    unitCode: z.string().min(1, { message: "Код штата обязателен" }),
    name_ru: z.string().min(3, { message: "Название RU должно быть не короче 3 символов" }),
    name_uz_latn: z.string().optional(),
    name_uz_cyrl: z.string().optional(),
    type: z.string().min(1, { message: "Выберите тип" }),
    militaryDistrictId: z.number({ required_error: "Выберите округ" }),
    areaId: z.number().optional(),
    isActive: z.boolean().default(true)
})

interface UnitDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    unit?: any
    onSuccess: () => void
}

export function UnitDialog({ open, onOpenChange, unit, onSuccess }: UnitDialogProps) {
    const { t, locale } = useTranslation()
    const fetcher = (url: string) => fetch(url).then(res => res.json())
    const swrConfig = { dedupingInterval: 600000, revalidateOnFocus: false }

    const { data: districtsList = [] } = useSWR('/api/military-districts', fetcher, swrConfig)
    const { data: regionsList = [] } = useSWR('/api/regions', fetcher, swrConfig)
    const { data: areasList = [] } = useSWR('/api/areas', fetcher, swrConfig)

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<any>({})

    const [form, setForm] = useState<any>({
        unitId: null,
        unitCode: "",
        name_ru: "",
        name_uz_latn: "",
        name_uz_cyrl: "",
        type: "Воинская часть",
        militaryDistrictId: null,
        regionId: null,
        areaId: null,
        isActive: true
    })

    const [openDistrict, setOpenDistrict] = useState(false)
    const [openRegion, setOpenRegion] = useState(false)
    const [openArea, setOpenArea] = useState(false)
    const [openType, setOpenType] = useState(false)

    useEffect(() => {
        if (unit) {
            setForm({
                unitId: unit.unitId,
                unitCode: unit.unitCode || "",
                name_ru: typeof unit.name === 'object' ? unit.name?.[Lang.RU] || "" : unit.name || "",
                name_uz_latn: typeof unit.name === 'object' ? unit.name?.[Lang.UZ_LATN] || "" : unit.name_uz_latn || "",
                name_uz_cyrl: typeof unit.name === 'object' ? unit.name?.[Lang.UZ_CYRL] || "" : unit.name_uz_cyrl || "",
                type: unit.unitType || unit.type || "Воинская часть",
                militaryDistrictId: unit.militaryDistrictId || null,
                regionId: unit.area?.regionId || null,
                areaId: unit.areaId || null,
                isActive: unit.isActive !== false
            })
        } else {
            setForm({
                unitId: null,
                unitCode: "",
                name_ru: "",
                name_uz_latn: "",
                name_uz_cyrl: "",
                type: "Воинская часть",
                militaryDistrictId: null,
                regionId: null,
                areaId: null,
                isActive: true
            })
        }
        setErrors({})
    }, [unit, open])

    const filteredAreas = useMemo(() =>
        areasList.filter((a: any) => !form.regionId || a.regionId === form.regionId),
        [areasList, form.regionId])

    const handleSave = async () => {
        const validation = militaryUnitSchema.safeParse(form)
        if (!validation.success) {
            const formattedErrors = validation.error.format()
            setErrors(formattedErrors)
            toast.error("Пожалуйста, заполните обязательные поля")
            return
        }

        setLoading(true)
        try {
            await saveUnit({
                unitId: form.unitId,
                unitCode: form.unitCode,
                name: {
                    ru: form.name_ru,
                    uz: form.name_uz_latn,
                    uzk: form.name_uz_cyrl
                },
                unitType: form.type,
                military_district_id: form.militaryDistrictId,
                area_id: form.areaId,
                is_active: form.isActive
            })
            toast.success(unit ? "Данные обновлены" : "Часть добавлена")
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error(error)
            toast.error("Ошибка при сохранении")
        } finally {
            setLoading(false)
        }
    }

    const getLocalizedName = (item: any) => {
        if (!item) return ""
        if (typeof item.name === 'object') {
            if (locale === "ru") return item.name[Lang.RU] || ""
            if (locale === "uzLatn") return item.name[Lang.UZ_LATN] || ""
            return item.name[Lang.UZ_CYRL] || ""
        }
        return item.name || ""
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl overflow-hidden p-0 border-none shadow-2xl rounded-[24px]">
                <DialogHeader className="p-6 bg-slate-50 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                            <Icons.Building className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight">
                                {unit ? "Редактировать часть" : "Добавить воинскую часть"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Управление данными дислокации и характеристиками подразделения
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Код штата (ID) *</Label>
                            <Input
                                value={form.unitCode}
                                onChange={(e) => setForm({ ...form, unitCode: e.target.value })}
                                className={cn("rounded-xl h-11 border-slate-200 font-bold focus:ring-blue-500/10", errors.unitCode && "border-rose-500")}
                                placeholder="00000"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Тип подразделения *</Label>
                            <Popover open={openType} onOpenChange={setOpenType}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full h-11 rounded-xl border-slate-200 justify-between font-bold text-slate-700">
                                        {form.type || "Выберите тип"}
                                        <Icons.ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0 rounded-xl shadow-2xl border-none">
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {["Воинская часть", "Учреждение", "Управление", "Центр"].map(t => (
                                                    <CommandItem key={t} onSelect={() => { setForm({ ...form, type: t }); setOpenType(false) }} className="cursor-pointer font-bold">
                                                        {t}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Names */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Наименование (RU) *</Label>
                            <Input
                                value={form.name_ru}
                                onChange={(e) => setForm({ ...form, name_ru: e.target.value })}
                                className={cn("rounded-xl h-11 border-slate-200 font-bold", errors.name_ru && "border-rose-500")}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">UZ Latin</Label>
                                <Input
                                    value={form.name_uz_latn}
                                    onChange={(e) => setForm({ ...form, name_uz_latn: e.target.value })}
                                    className="rounded-xl h-11 border-slate-200 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">UZ Cyrl</Label>
                                <Input
                                    value={form.name_uz_cyrl}
                                    onChange={(e) => setForm({ ...form, name_uz_cyrl: e.target.value })}
                                    className="rounded-xl h-11 border-slate-200 font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Привязка к территории</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Военный округ *</Label>
                                <Popover open={openDistrict} onOpenChange={setOpenDistrict}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("w-full h-11 rounded-xl border-slate-200 justify-between font-bold", errors.militaryDistrictId && "border-rose-500")}>
                                            <span className="truncate">
                                                {districtsList.find((d: any) => d.districtId === form.militaryDistrictId)?.short_name?.ru || "Выберите округ"}
                                            </span>
                                            <Icons.ChevronDown className="h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0 rounded-xl shadow-2xl border-none">
                                        <Command>
                                            <CommandInput placeholder="Поиск округа..." />
                                            <CommandList>
                                                <CommandGroup>
                                                    {districtsList.map((d: any) => (
                                                        <CommandItem key={d.districtId} onSelect={() => { setForm({ ...form, militaryDistrictId: d.district_id }); setOpenDistrict(false) }} className="cursor-pointer font-bold">
                                                            {d.name?.ru || d.short_name?.ru}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Область</Label>
                                    <Popover open={openRegion} onOpenChange={setOpenRegion}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full h-11 rounded-xl border-slate-200 justify-between font-bold">
                                                <span className="truncate">
                                                    {regionsList.find((r: any) => r.id === form.regionId)?.name?.[Lang.RU] || "Выберите..."}
                                                </span>
                                                <Icons.ChevronDown className="h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[250px] p-0 rounded-xl shadow-2xl border-none">
                                            <Command>
                                                <CommandInput placeholder="Поиск области..." />
                                                <CommandList>
                                                    <CommandGroup>
                                                        {regionsList.map((r: any) => (
                                                            <CommandItem key={r.id} onSelect={() => { setForm({ ...form, regionId: r.id, areaId: null }); setOpenRegion(false) }} className="cursor-pointer font-bold">
                                                                {r.name?.[Lang.RU]}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Район</Label>
                                    <Popover open={openArea} onOpenChange={setOpenArea}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" disabled={!form.regionId} className="w-full h-11 rounded-xl border-slate-200 justify-between font-bold">
                                                <span className="truncate">
                                                    {areasList.find((a: any) => a.id === form.areaId)?.name?.[Lang.RU] || "Выберите..."}
                                                </span>
                                                <Icons.ChevronDown className="h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[250px] p-0 rounded-xl shadow-2xl border-none">
                                            <Command>
                                                <CommandInput placeholder="Поиск района..." />
                                                <CommandList>
                                                    <CommandGroup>
                                                        {filteredAreas.map((a: any) => (
                                                            <CommandItem key={a.id} onSelect={() => { setForm({ ...form, areaId: a.id }); setOpenArea(false) }} className="cursor-pointer font-bold">
                                                                {a.name?.[Lang.RU]}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-slate-50 border-t gap-3">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">
                        Отмена
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="rounded-xl px-8 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold uppercase tracking-widest text-[10px]">
                        {loading && <Icons.Spinner className="h-3 w-3 mr-2 animate-spin" />}
                        {unit ? "Сохранить изменения" : "Добавить часть"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

"use client"

import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Shield, MapPin, Plus } from "lucide-react"
import { TechnicalNameBadge } from "@/components/reference/technical-name-badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
    type MRT_PaginationState,
    type MRT_SortingState,
    type MRT_ColumnFiltersState,
    type MRT_Updater,
} from "material-react-table"
import useSWR from "swr"
import { UnitsTable, type UnitRow } from "@/components/military-units/units-table"
import { useTranslation } from "@/lib/i18n/hooks"

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch")
    return res.json()
}

function buildUrl(
    pagination: MRT_PaginationState,
    sorting: MRT_SortingState,
    columnFilters: MRT_ColumnFiltersState,
    globalFilter: string
) {
    const params = new URLSearchParams()
    params.set("skip", String(pagination.pageIndex * pagination.pageSize))
    params.set("limit", String(pagination.pageSize))
    if (globalFilter) params.set("search", globalFilter)
    if (sorting.length > 0) {
        params.set("sortBy", sorting[0].id)
        params.set("sortDir", sorting[0].desc ? "desc" : "asc")
    }
    columnFilters.forEach((f) => {
        if (f.id === "militaryDistrict") params.set("districtId", String(f.value))
    })
    return `/api/units?${params.toString()}`
}

function mapUnits(raw: any[], locale: string): UnitRow[] {
    const getVal = (obj: any) => {
        if (obj == null) return null
        if (typeof obj === 'string') return obj
        if (typeof obj === 'object') {
            const keyMap: Record<string, string> = {
                ru: 'ru',
                uzLatn: 'uz',
                uzCyrl: 'uzk'
            }
            const targetKey = keyMap[locale] || 'ru'
            return obj[targetKey] ?? obj.ru ?? obj.name ?? obj.uz ?? null
        }
        return obj
    }

    return raw.map((u) => {
        const detected = u.detectedAmount || u.totalAmount || 0
        const repaid = u.repaidAmount || u.recovered || 0
        const balance = detected - repaid

        const numAsCode = u.unitNumber || u.unitCode;
        return {
            id: String(u.id ?? u.unitId ?? ""),
            unitNumber: numAsCode && !isNaN(Number(numAsCode)) ? numAsCode : "—",
            name: getVal(u.name) || "—",
            militaryDistrict: getVal(u.district?.name) || getVal(u.district?.shortName) || getVal(u.militaryDistrict) || "—",
            region: getVal(u.region) || getVal(u.area?.region?.name) || "—",
            city: getVal(u.city) || getVal(u.area?.name) || "—",
            commander: getVal(u.commander) || getVal(u.commander_name) || "—",
            detected,
            repaid,
            balance,
            auditsCount: u.auditsCount || 0,
            isActive: u.isActive ?? true,
            __raw: u
        } as UnitRow
    })
}

export default function MilitaryUnitsPage() {
    const { locale } = useTranslation()
    const [pagination, setPagination] = useState<MRT_PaginationState>({ pageIndex: 0, pageSize: 50 })
    const [sorting, setSorting] = useState<MRT_SortingState>([])
    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState("")

    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [newUnitData, setNewUnitData] = useState({
        unitNumber: "",
        name: "",
        militaryDistrictId: "",
        areaId: ""
    })
    const [editUnitData, setEditUnitData] = useState({
        id: "",
        unitNumber: "",
        name: "",
        militaryDistrictId: "",
        areaId: "",
        isActive: true
    })

    const url = buildUrl(pagination, sorting, columnFilters, globalFilter)
    const { data, isLoading, mutate } = useSWR(url, fetcher, { keepPreviousData: true })
    const { data: districtsData } = useSWR("/api/military-districts", fetcher)
    const districts = Array.isArray(districtsData) ? districtsData : []
    const { data: areasData } = useSWR("/api/areas", fetcher)
    const areas = Array.isArray(areasData) ? areasData : []

    const rows: UnitRow[] = useMemo(() => data?.data ? mapUnits(data.data, locale) : [], [data, locale])
    const totalCount: number = data?.total ?? 0

    const handlePaginationChange = useCallback(
        (updater: MRT_Updater<MRT_PaginationState>) => {
            setPagination((prev) => (typeof updater === "function" ? updater(prev) : updater))
        },
        []
    )
    const handleSortingChange = useCallback(
        (updater: MRT_Updater<MRT_SortingState>) => {
            setSorting((prev) => (typeof updater === "function" ? updater(prev) : updater))
            setPagination((prev) => ({ ...prev, pageIndex: 0 }))
        },
        []
    )
    const handleColumnFiltersChange = useCallback(
        (updater: MRT_Updater<MRT_ColumnFiltersState>) => {
            setColumnFilters((prev) => (typeof updater === "function" ? updater(prev) : updater))
            setPagination((prev) => ({ ...prev, pageIndex: 0 }))
        },
        []
    )
    const searchTimer = useRef<number | null>(null)
    const handleGlobalFilterChange = useCallback((value: string) => {
        if (searchTimer.current) window.clearTimeout(searchTimer.current)
        searchTimer.current = window.setTimeout(() => {
            setGlobalFilter(value ?? "")
            setPagination((prev) => ({ ...prev, pageIndex: 0 }))
        }, 350)
    }, [])

    useEffect(() => {
        return () => {
            if (searchTimer.current) window.clearTimeout(searchTimer.current)
        }
    }, [])

    const handleAddUnit = async () => {
        if (!newUnitData.unitNumber || !newUnitData.name) {
            toast.error("Пожалуйста, заполните необходимые поля")
            return
        }

        try {
            setIsAdding(true)
            const response = await fetch("/api/units", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUnitData)
            })

            if (!response.ok) {
                throw new Error("Failed to create unit")
            }

            toast.success("Воинская часть успешно добавлена")
            setIsAddOpen(false)
            setNewUnitData({ unitNumber: "", name: "", militaryDistrictId: "", areaId: "" })
            mutate()
        } catch (error) {
            console.error(error)
            toast.error("Ошибка при добавлении воинской части")
        } finally {
            setIsAdding(false)
        }
    }

    const openEditDialog = (unit: UnitRow) => {
        const raw = (unit as any).__raw
        const districtId = raw ? String(raw.military_district_id ?? raw.militaryDistrictId ?? "") : ""
        const areaId = raw ? String(raw.area_id ?? raw.areaId ?? "") : ""

        setEditUnitData({
            id: String(unit.id),
            unitNumber: unit.unitNumber !== "—" ? unit.unitNumber : "",
            name: unit.name !== "—" ? unit.name : "",
            militaryDistrictId: districtId,
            areaId: areaId,
            isActive: typeof unit.isActive === 'boolean' ? unit.isActive : true
        })
        setIsEditOpen(true)
    }

    const handleEditUnit = async () => {
        if (!editUnitData.unitNumber || !editUnitData.name) {
            toast.error("Пожалуйста, заполните необходимые поля")
            return
        }

        try {
            setIsSaving(true)
            const response = await fetch(`/api/units/${editUnitData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editUnitData)
            })

            if (!response.ok) {
                throw new Error("Failed to update unit")
            }

            toast.success("Данные успешно обновлены")
            setIsEditOpen(false)
            mutate()
        } catch (error) {
            console.error(error)
            toast.error("Ошибка при обновлении воинской части")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="border-none shadow-xl shadow-primary/5 bg-white/60 backdrop-blur-xl overflow-hidden text-slate-900">
                <CardHeader className="relative pb-6 border-b border-border/50">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Building2 className="h-32 w-32" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shadow-inner">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-3xl font-extrabold tracking-tight">Реестр воинских частей с привязкой к округам и территориям</CardTitle>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 flex-1 justify-end">
                            <TechnicalNameBadge name="UnitsList" />

                            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                <DialogTrigger asChild>
                                    <Button className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Добавить воинскую часть
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl rounded-3xl border-none shadow-2xl backdrop-blur-2xl bg-white/95">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold">Добавление воинской части</DialogTitle>
                                        <DialogDescription className="text-base font-medium">
                                            Заполните данные для создания новой воинской части в системе.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={(e) => { e.preventDefault(); handleAddUnit() }}>
                                        <div className="grid gap-6 py-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Номер части</Label>
                                                    <Input
                                                        placeholder="Например: 12345"
                                                        value={newUnitData.unitNumber}
                                                        onChange={(e) => setNewUnitData({ ...newUnitData, unitNumber: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Название</Label>
                                                    <Input
                                                        placeholder="Введите название части"
                                                        value={newUnitData.name}
                                                        onChange={(e) => setNewUnitData({ ...newUnitData, name: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2 flex flex-col justify-end">
                                                    <Label>Военный округ / Учреждение</Label>
                                                    <Select
                                                        value={newUnitData.militaryDistrictId}
                                                        onValueChange={(val) => setNewUnitData({ ...newUnitData, militaryDistrictId: val })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Выберите..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {districts.map((d: any) => (
                                                                <SelectItem key={String(d.districtId)} value={d.districtId ? String(d.districtId) : ""}>
                                                                    {typeof d.name === 'object' ? (d.name[locale === 'uzCyrl' ? 'uzk' : locale === 'uzLatn' ? 'uz' : 'ru'] || d.name.ru) : d.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2 flex flex-col justify-end">
                                                    <Label>Место дислокации</Label>
                                                    <Select
                                                        value={newUnitData.areaId}
                                                        onValueChange={(val) => setNewUnitData({ ...newUnitData, areaId: val })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Выберите район/город..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {areas.map((a: any) => {
                                                                const name = typeof a.name === 'object' ? (a.name[locale === 'uzCyrl' ? 'uzk' : locale === 'uzLatn' ? 'uz' : 'ru'] || a.name.ru) : a.name;
                                                                const regionName = a.region ? (typeof a.region.name === 'object' ? (a.region.name[locale === 'uzCyrl' ? 'uzk' : locale === 'uzLatn' ? 'uz' : 'ru'] || a.region.name.ru) : a.region.name) : '';
                                                                return (
                                                                    <SelectItem key={String(a.id)} value={a.id ? String(a.id) : ""}>
                                                                        {name || 'Неизвестно'} {regionName ? `(${regionName})` : ''}
                                                                    </SelectItem>
                                                                )
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 mt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={isAdding}>Отмена</Button>
                                            <Button type="submit" disabled={isAdding}>
                                                {isAdding ? "Добавление..." : "Добавить часть"}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                                <DialogContent className="max-w-2xl rounded-3xl border-none shadow-2xl backdrop-blur-2xl bg-white/95">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold">Редактирование воинской части</DialogTitle>
                                        <DialogDescription className="text-base font-medium">
                                            Измените данные воинской части.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={(e) => { e.preventDefault(); handleEditUnit() }}>
                                        <div className="grid gap-6 py-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Номер части</Label>
                                                    <Input
                                                        placeholder="Например: 12345"
                                                        value={editUnitData.unitNumber}
                                                        onChange={(e) => setEditUnitData({ ...editUnitData, unitNumber: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Название</Label>
                                                    <Input
                                                        placeholder="Введите название части"
                                                        value={editUnitData.name}
                                                        onChange={(e) => setEditUnitData({ ...editUnitData, name: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2 flex flex-col justify-end">
                                                    <Label>Военный округ / Учреждение</Label>
                                                    <Select
                                                        value={editUnitData.militaryDistrictId}
                                                        onValueChange={(val) => setEditUnitData({ ...editUnitData, militaryDistrictId: val })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Выберите..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {districts.map((d: any) => (
                                                                <SelectItem key={String(d.districtId)} value={d.districtId ? String(d.districtId) : ""}>
                                                                    {typeof d.name === 'object' ? (d.name[locale === 'uzCyrl' ? 'uzk' : locale === 'uzLatn' ? 'uz' : 'ru'] || d.name.ru) : d.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2 flex flex-col justify-end">
                                                    <Label>Место дислокации</Label>
                                                    <Select
                                                        value={editUnitData.areaId}
                                                        onValueChange={(val) => setEditUnitData({ ...editUnitData, areaId: val })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Выберите район/город..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {areas.map((a: any) => {
                                                                const name = typeof a.name === 'object' ? (a.name[locale === 'uzCyrl' ? 'uzk' : locale === 'uzLatn' ? 'uz' : 'ru'] || a.name.ru) : a.name;
                                                                const regionName = a.region ? (typeof a.region.name === 'object' ? (a.region.name[locale === 'uzCyrl' ? 'uzk' : locale === 'uzLatn' ? 'uz' : 'ru'] || a.region.name.ru) : a.region.name) : '';
                                                                return (
                                                                    <SelectItem key={String(a.id)} value={a.id ? String(a.id) : ""}>
                                                                        {name || 'Неизвестно'} {regionName ? `(${regionName})` : ''}
                                                                    </SelectItem>
                                                                )
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 mt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>Отмена</Button>
                                            <Button type="submit" disabled={isSaving}>
                                                {isSaving ? "Сохранение..." : "Сохранить изменения"}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <UnitsTable
                        data={rows}
                        totalCount={totalCount}
                        isLoading={isLoading}
                        pagination={pagination}
                        sorting={sorting}
                        columnFilters={columnFilters}
                        globalFilter={globalFilter}
                        onPaginationChange={handlePaginationChange}
                        onSortingChange={handleSortingChange}
                        onColumnFiltersChange={handleColumnFiltersChange}
                        onGlobalFilterChange={handleGlobalFilterChange}
                        onEdit={openEditDialog}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

import React, { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker, ConfigProvider } from "antd"
import dayjs from "dayjs"
import ruRU from "antd/locale/ru_RU"
import enUS from "antd/locale/en_US"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { UnitSelect } from "@/components/reference/unit-select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandGroup, CommandItem, CommandInput, CommandList, CommandEmpty } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n/hooks"
import { getLocalizedAuthorityName, getLocalizedDistrictName, toSafeString, Locale } from "@/lib/utils/localization"
import { militaryUnits, militaryDistricts, controlAuthorities, controlDirections } from "@/lib/data/military-data"

interface CreatePlanDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (data: any) => Promise<any>
    initialData?: any
    isEditing?: boolean
    locale: Locale
    militaryPersonnel: any[]
    physicalPersons: any[]
    supplyDepartments: any[]
    isSubmitting: boolean
}

export function CreatePlanDialog({
    open,
    onOpenChange,
    onSave,
    initialData,
    isEditing = false,
    locale,
    militaryPersonnel,
    physicalPersons,
    supplyDepartments,
    isSubmitting,
}: CreatePlanDialogProps) {
    const { t } = useTranslation()
    const [formData, setFormData] = useState<any>({
        year: new Date().getFullYear(),
        incomingNumber: "",
        unit: "",
        unitLocation: "",
        unitDistrict: "",
        controlAuthority: "",
        inspectionDirection: "",
        inspectionType: "2301",
        startDate: "",
        endDate: "",
        responsible: "",
        objectsTotal: 0,
        objectsFS: 0,
        objectsOS: 0,
        subordinateUnitsOnAllowance: [],
    })

    const [newSubordinateUnit, setNewSubordinateUnit] = useState({ unitCode: "", unitName: "", allowanceType: "full" })
    const [openAuthoritySelect, setOpenAuthoritySelect] = useState(false)
    const [openDistrictSelect, setOpenDistrictSelect] = useState(false)
    const [openAllowanceTypeSelect, setOpenAllowanceTypeSelect] = useState(false)

    useEffect(() => {
        if (initialData) {
            setFormData({
                year: initialData.year || new Date().getFullYear(),
                incomingNumber: initialData.planNumber || "",
                unit: initialData.controlObject || "",
                unitLocation: initialData.location || "",
                startDate: initialData.periodCoveredStart || "",
                endDate: initialData.periodCoveredEnd || "",
                responsible: initialData.responsible || "",
                controlAuthority: initialData.controlAuthority || "",
                inspectionDirection: initialData.inspectionDirection || "",
                inspectionType: initialData.inspectionType || "2301",
                objectsTotal: initialData.objectsTotal || 0,
                objectsFS: initialData.objectsFS || 0,
                objectsOS: initialData.objectsOS || 0,
                subordinateUnitsOnAllowance: initialData.subordinateUnitsOnAllowance || [],
            })
        } else {
            setFormData({
                year: new Date().getFullYear(),
                incomingNumber: "",
                unit: "",
                startDate: "",
                endDate: "",
                responsible: "",
                controlAuthority: "",
                inspectionDirection: "",
                inspectionType: "2301",
                objectsTotal: 0,
                objectsFS: 0,
                objectsOS: 0,
                subordinateUnitsOnAllowance: [],
            })
        }
    }, [initialData, open])

    const handleAddSubordinateUnit = () => {
        if (newSubordinateUnit.unitCode && newSubordinateUnit.unitName) {
            setFormData({
                ...formData,
                subordinateUnitsOnAllowance: [...formData.subordinateUnitsOnAllowance, newSubordinateUnit]
            })
            setNewSubordinateUnit({ unitCode: "", unitName: "", allowanceType: "full" })
        }
    }

    const handleRemoveSubordinateUnit = (index: number) => {
        const updated = [...formData.subordinateUnitsOnAllowance]
        updated.splice(index, 1)
        setFormData({ ...formData, subordinateUnitsOnAllowance: updated })
    }

    const handleSubmit = async () => {
        await onSave(formData)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-187.5 p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl border border-white/10 shadow-inner">
                            <Icons.PlusCircle className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight">
                                {isEditing
                                    ? (locale === "ru" ? "Редактировать план-график" : "Reja-grafikni tahrirlash")
                                    : t("annual.schedule.addTitle")}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400">
                                {t("annual.schedule.addDescription")}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 space-y-8 bg-background overflow-y-auto max-h-[70vh]">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label className="text-xs uppercase font-bold text-muted-foreground">{t("annual.table.year")}</Label>
                            <ConfigProvider locale={locale === "ru" ? ruRU : enUS}>
                                <DatePicker
                                    picker="year"
                                    className="w-full h-11 rounded-xl"
                                    placeholder="2025"
                                    value={formData.year ? dayjs(String(formData.year), 'YYYY') : null}
                                    onChange={(date) => setFormData({ ...formData, year: date ? date.year() : new Date().getFullYear() })}
                                />
                            </ConfigProvider>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs uppercase font-bold text-muted-foreground">{t("annual.table.incomingNumber")}</Label>
                            <Input
                                className="h-11 rounded-xl font-mono"
                                value={formData.incomingNumber || ""}
                                onChange={(e) => setFormData({ ...formData, incomingNumber: e.target.value })}
                                placeholder="№ 123"
                            />
                        </div>
                    </div>

                    {/* Unit Selection */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label className="text-xs uppercase font-bold text-muted-foreground">{t("annual.table.unit")}</Label>
                            <UnitSelect
                                value={formData.unit}
                                className="h-11"
                                onUnitChange={(unit) => {
                                    let fullUnit = unit;
                                    if (!unit.district || !unit.location) {
                                        const searchName = typeof unit.name === 'object' ? unit.name.ru : unit.name;
                                        const found = militaryUnits.find(u => 
                                            u.name === searchName || 
                                            u.stateNumber === searchName || 
                                            u.id?.toString() === unit.id?.toString()
                                        );
                                        if (found) fullUnit = { ...unit, ...found };
                                    }
                                    const unitName = typeof fullUnit.name === 'object' ? fullUnit.name.ru : fullUnit.name;
                                    setFormData({
                                        ...formData,
                                        unit: unitName,
                                        unitLocation: fullUnit.location || formData.unitLocation,
                                        unitDistrict: fullUnit.district || formData.unitDistrict
                                    });
                                }}
                                onValueChange={(value) => {
                                    if (!formData.unit) {
                                        setFormData((prev: any) => ({ ...prev, unit: value }));
                                    }
                                }}
                                placeholder={t("common.select")}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs uppercase font-bold text-muted-foreground">{t("common.district")}</Label>
                            <Popover open={openDistrictSelect} onOpenChange={setOpenDistrictSelect}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between h-11 rounded-xl font-normal">
                                        {formData.unitDistrict ? getLocalizedDistrictName(formData.unitDistrict, locale, true) : t("common.select")}
                                        <Icons.ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-75 p-0">
                                    <Command>
                                        <CommandInput placeholder={t("common.search")} />
                                        <CommandList>
                                            <CommandEmpty>{t("common.noResults")}</CommandEmpty>
                                            <CommandGroup>
                                                {militaryDistricts.map((district) => (
                                                    <CommandItem
                                                        key={district.id}
                                                        value={district.name}
                                                        onSelect={(val) => {
                                                            setFormData({ ...formData, unitDistrict: val })
                                                            setOpenDistrictSelect(false)
                                                        }}
                                                    >
                                                        <Icons.Check className={cn("mr-2 h-4 w-4", formData.unitDistrict === district.name ? "opacity-100" : "opacity-0")} />
                                                        {toSafeString(locale === "uzLatn" ? district.name_uz_latn : locale === "uzCyrl" ? district.name_uz_cyrl : district.name, locale as any)}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Authority & Direction */}
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label className="text-xs uppercase font-bold text-muted-foreground">{t("annual.approved.controlAuthority")}</Label>
                            <Popover open={openAuthoritySelect} onOpenChange={setOpenAuthoritySelect}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between h-11 rounded-xl font-normal">
                                        {formData.controlAuthority ? getLocalizedAuthorityName(formData.controlAuthority, locale as any, supplyDepartments) : t("common.select")}
                                        <Icons.ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-125 p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder={t("common.search")} />
                                        <CommandList className="max-h-75">
                                            <CommandEmpty>{t("common.noResults")}</CommandEmpty>
                                            <CommandGroup heading={locale === "ru" ? "Справочник БД" : "MB ma'lumotnomasi"}>
                                                {supplyDepartments.map((dept) => (
                                                    <CommandItem
                                                        key={dept.code}
                                                        value={`${dept.code} ${getLocalizedAuthorityName(dept.code, locale as any, supplyDepartments)}`}
                                                        onSelect={() => {
                                                            setFormData({ ...formData, controlAuthority: dept.code })
                                                            setOpenAuthoritySelect(false)
                                                        }}
                                                    >
                                                        <Icons.Check className={cn("mr-2 h-4 w-4", formData.controlAuthority === dept.code ? "opacity-100" : "opacity-0")} />
                                                        <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded mr-2">{dept.code}</span>
                                                        {getLocalizedAuthorityName(dept.code, locale as any, supplyDepartments)}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">{t("annual.table.inspectionDirection")}</Label>
                                <Select value={formData.inspectionDirection} onValueChange={(v) => setFormData({ ...formData, inspectionDirection: v })}>
                                    <SelectTrigger className="h-11 rounded-xl">
                                        <SelectValue placeholder={t("common.select")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {controlDirections.map((dir) => (
                                            <SelectItem key={dir.id} value={dir.code}>
                                                {toSafeString(locale === "uzLatn" ? dir.name_uz_latn : locale === "uzCyrl" ? dir.name_uz_cyrl : dir.name, locale as any)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">{t("annual.table.inspectionType")}</Label>
                                <Select value={formData.inspectionType} onValueChange={(v) => setFormData({ ...formData, inspectionType: v })}>
                                    <SelectTrigger className="h-11 rounded-xl">
                                        <SelectValue placeholder={t("common.select")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2301">2301 - {locale === "ru" ? "Комплексная проверка" : "Kompleks tekshiruv"}</SelectItem>
                                        <SelectItem value="2302">2302 - {locale === "ru" ? "Тематическая проверка" : "Mavzuli tekshiruv"}</SelectItem>
                                        <SelectItem value="2303">2303 - {locale === "ru" ? "Контрольная проверка" : "Nazorat tekshiruvi"}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Period & Responsible */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label className="text-xs uppercase font-bold text-muted-foreground">{t("annual.table.period")}</Label>
                            <ConfigProvider locale={locale === "ru" ? ruRU : enUS}>
                                <DatePicker.RangePicker
                                    className="w-full h-11 rounded-xl"
                                    value={formData.startDate && formData.endDate ? [dayjs(formData.startDate), dayjs(formData.endDate)] : null}
                                    onChange={(dates) => {
                                        setFormData({
                                            ...formData,
                                            startDate: dates && dates[0] ? dates[0].format("YYYY-MM-DD") : "",
                                            endDate: dates && dates[1] ? dates[1].format("YYYY-MM-DD") : ""
                                        })
                                    }}
                                    format="DD.MM.YYYY"
                                />
                            </ConfigProvider>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs uppercase font-bold text-muted-foreground">{t("annual.table.responsible")}</Label>
                            <Select value={formData.responsible} onValueChange={(v) => setFormData({ ...formData, responsible: v })}>
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder={t("common.select")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {militaryPersonnel.map((p) => {
                                        const phys = physicalPersons.find(pp => pp.id === p.personId);
                                        return (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                {phys ? `${phys.lastName} ${phys.firstName}` : p.id}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between gap-8">
                        <div className="grid gap-1.5 flex-1">
                            <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-tight">{t("annual.note.objectsCount")}</Label>
                            <Input
                                type="number"
                                className="h-10 rounded-lg border-slate-200 bg-white"
                                value={formData.objectsTotal}
                                onChange={(e) => setFormData({ ...formData, objectsTotal: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="grid gap-1.5 flex-1 text-blue-700">
                            <Label className="text-[10px] uppercase font-bold opacity-70 tracking-tight">{t("annual.note.fs")}</Label>
                            <Input
                                type="number"
                                className="h-10 rounded-lg border-blue-200 bg-blue-50/50"
                                value={formData.objectsFS}
                                onChange={(e) => setFormData({ ...formData, objectsFS: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="grid gap-1.5 flex-1 text-orange-700">
                            <Label className="text-[10px] uppercase font-bold opacity-70 tracking-tight">{t("annual.note.os")}</Label>
                            <Input
                                type="number"
                                className="h-10 rounded-lg border-orange-200 bg-orange-50/50"
                                value={formData.objectsOS}
                                onChange={(e) => setFormData({ ...formData, objectsOS: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    {/* Subordinate Units */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-bold flex items-center gap-2">
                                <Icons.Layers className="w-4 h-4 text-primary" />
                                {t("annual.approved.subordinateUnits")}
                            </Label>
                            <Badge variant="secondary" className="text-[10px] font-bold bg-slate-100">
                                {formData.subordinateUnitsOnAllowance.length} {locale === "ru" ? "объектов" : "ob'ekt"}
                            </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 min-h-10">
                            {formData.subordinateUnitsOnAllowance.map((unit: any, index: number) => (
                                <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 gap-1 h-8 rounded-lg bg-white border border-slate-200 shadow-sm animate-in zoom-in-95">
                                    <span className="font-mono text-[10px] text-slate-500 mr-1">{unit.unitCode}</span>
                                    <span className="text-xs font-medium">{unit.unitName}</span>
                                    <Button size="icon" variant="ghost" className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleRemoveSubordinateUnit(index)}>
                                        <Icons.X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>

                        <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-end bg-muted/20 p-4 rounded-2xl border border-dashed">
                            <div className="grid gap-2">
                                <UnitSelect
                                    value={newSubordinateUnit.unitName}
                                    className="h-10 rounded-lg"
                                    excludeUnits={formData.subordinateUnitsOnAllowance.map((u: any) => u.unitName)}
                                    onValueChange={(name) => {
                                        const unit = militaryUnits.find(u => u.name === name);
                                        setNewSubordinateUnit({ ...newSubordinateUnit, unitName: name, unitCode: unit?.stateNumber || "" });
                                    }}
                                    placeholder={t("common.search")}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Popover open={openAllowanceTypeSelect} onOpenChange={setOpenAllowanceTypeSelect}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="h-10 px-4 rounded-lg">
                                            {newSubordinateUnit.allowanceType === "full" ? (locale === "ru" ? "П" : "T") : (locale === "ru" ? "Ч" : "Q")}
                                            <Icons.ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40 p-0" align="end">
                                        <Command>
                                            <CommandGroup>
                                                <CommandItem onSelect={() => { setNewSubordinateUnit({ ...newSubordinateUnit, allowanceType: "full" }); setOpenAllowanceTypeSelect(false); }}>
                                                    {t("common.allowanceFull")}
                                                </CommandItem>
                                                <CommandItem onSelect={() => { setNewSubordinateUnit({ ...newSubordinateUnit, allowanceType: "partial" }); setOpenAllowanceTypeSelect(false); }}>
                                                    {t("common.allowancePartial")}
                                                </CommandItem>
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <Button type="button" variant="secondary" className="h-10 w-10 p-0 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary border-primary/20" onClick={handleAddSubordinateUnit} disabled={!newSubordinateUnit.unitCode || !newSubordinateUnit.unitName}>
                                <Icons.Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-muted/30 border-t flex items-center justify-between sm:justify-between">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-slate-900">
                        {t("common.cancel")}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !formData.unit} className="h-11 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-slate-500/20 transition-all">
                        {isSubmitting && <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Icons.Check className="mr-2 h-4 w-4" />
                        {t("common.save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


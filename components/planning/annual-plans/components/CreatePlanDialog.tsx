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
import { getLocalizedAuthorityName } from "@/lib/utils/localization"
import { militaryUnits, controlAuthorities, controlDirections } from "@/lib/data/military-data"

interface CreatePlanDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (data: any) => Promise<any>
    initialData?: any
    isEditing?: boolean
    locale: string
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
        controlAuthority: "",
        inspectionDirection: "",
        inspectionType: "2301", // Default value
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
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? (locale === "ru" ? "Редактировать план-график" : "Reja-grafikni tahrirlash")
                            : t("annual.schedule.addTitle")}
                    </DialogTitle>
                    <DialogDescription>{t("annual.schedule.addDescription")}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>{t("annual.table.year")}</Label>
                            <ConfigProvider locale={locale === "ru" ? ruRU : enUS}>
                                <DatePicker
                                    picker="year"
                                    className="w-full h-10"
                                    placeholder="2025"
                                    value={formData.year ? dayjs(String(formData.year), 'YYYY') : null}
                                    onChange={(date) => setFormData({ ...formData, year: date ? date.year() : new Date().getFullYear() })}
                                />
                            </ConfigProvider>
                        </div>
                        <div className="grid gap-2">
                            <Label>{t("annual.table.incomingNumber")}</Label>
                            <Input
                                value={formData.incomingNumber}
                                onChange={(e) => setFormData({ ...formData, incomingNumber: e.target.value })}
                                placeholder="№ 123"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>{t("annual.table.unit")}</Label>
                            <UnitSelect
                                value={formData.unit}
                                onUnitChange={(unit) => {
                                    setFormData({
                                        ...formData,
                                        unit: unit.name,
                                        unitLocation: unit.location || formData.unitLocation
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
                            <Label>{t("common.location") || (locale === "ru" ? "Локация" : "Joylashuvi")}</Label>
                            <Input
                                value={formData.unitLocation}
                                onChange={(e) => setFormData({ ...formData, unitLocation: e.target.value })}
                                placeholder={t("common.location") || (locale === "ru" ? "Место дислокации" : "Manzil")}
                                className="bg-muted/30"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>{t("annual.approved.controlAuthority")}</Label>
                        <Popover open={openAuthoritySelect} onOpenChange={setOpenAuthoritySelect}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between h-10 font-normal">
                                    {formData.controlAuthority ? getLocalizedAuthorityName(formData.controlAuthority, locale as any, supplyDepartments) : t("common.select")}
                                    <Icons.ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[500px] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder={t("common.search")} />
                                    <CommandList className="max-h-[300px]">
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
                                        <CommandGroup heading={locale === "ru" ? "Дополнительно" : "Qo'shimcha"}>
                                            {Object.entries(controlAuthorities).map(([code, auth]: [string, any]) => (
                                                <CommandItem
                                                    key={code}
                                                    value={`${code} ${locale === "uzLatn" ? auth.name_uz_latn : locale === "uzCyrl" ? auth.name_uz_cyrl : auth.name}`}
                                                    onSelect={() => {
                                                        setFormData({ ...formData, controlAuthority: code })
                                                        setOpenAuthoritySelect(false)
                                                    }}
                                                >
                                                    <Icons.Check className={cn("mr-2 h-4 w-4", formData.controlAuthority === code ? "opacity-100" : "opacity-0")} />
                                                    {locale === "uzLatn" ? auth.name_uz_latn : locale === "uzCyrl" ? auth.name_uz_cyrl : auth.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>{t("annual.table.inspectionDirection")}</Label>
                            <Select
                                value={formData.inspectionDirection}
                                onValueChange={(value) => setFormData({ ...formData, inspectionDirection: value })}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder={t("common.select")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {controlDirections.map((dir) => (
                                        <SelectItem key={dir.id} value={dir.code}>
                                            {locale === "uzLatn" ? dir.name_uz_latn : locale === "uzCyrl" ? dir.name_uz_cyrl : dir.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>{t("annual.table.inspectionType")}</Label>
                            <Select
                                value={formData.inspectionType}
                                onValueChange={(value) => setFormData({ ...formData, inspectionType: value })}
                            >
                                <SelectTrigger className="h-10">
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>{t("annual.table.period")}</Label>
                            <ConfigProvider locale={locale === "ru" ? ruRU : enUS}>
                                <DatePicker.RangePicker
                                    className="w-full h-10"
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
                            <Label>{t("annual.table.responsible")}</Label>
                            <Select
                                value={formData.responsible}
                                onValueChange={(value) => setFormData({ ...formData, responsible: value })}
                            >
                                <SelectTrigger className="h-10">
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

                    <div className="grid grid-cols-3 gap-4 border-t pt-4">
                        <div className="grid gap-2">
                            <Label className="text-xs uppercase text-muted-foreground">{t("annual.note.objectsCount")}</Label>
                            <Input
                                type="number"
                                value={formData.objectsTotal}
                                onChange={(e) => setFormData({ ...formData, objectsTotal: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs uppercase text-muted-foreground">{t("annual.note.fs")}</Label>
                            <Input
                                type="number"
                                value={formData.objectsFS}
                                onChange={(e) => setFormData({ ...formData, objectsFS: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs uppercase text-muted-foreground">{t("annual.note.os")}</Label>
                            <Input
                                type="number"
                                value={formData.objectsOS}
                                onChange={(e) => setFormData({ ...formData, objectsOS: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <Label className="text-base font-semibold">{t("annual.approved.subordinateUnits")}</Label>
                        <p className="text-sm text-muted-foreground mb-3">{t("annual.approved.subordinateUnitsDesc")}</p>

                        <div className="space-y-2 mb-4">
                            {formData.subordinateUnitsOnAllowance.map((unit: any, index: number) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                                    <Badge variant="outline" className="font-mono">{unit.unitCode}</Badge>
                                    <span className="text-sm flex-1">{unit.unitName}</span>
                                    <Badge variant={unit.allowanceType === "full" ? "default" : "secondary"} className="text-xs">
                                        {unit.allowanceType === "full" ? t("common.allowanceFull") : t("common.allowancePartial")}
                                    </Badge>
                                    <Button size="sm" variant="ghost" onClick={() => handleRemoveSubordinateUnit(index)} className="h-7 w-7 p-0">
                                        <Icons.X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-[2fr_1fr_auto] gap-2 items-end">
                            <div className="grid gap-2">
                                <Label className="text-xs font-medium">{t("common.select")}</Label>
                                <UnitSelect
                                    value={newSubordinateUnit.unitName}
                                    className="h-10"
                                    excludeUnits={formData.subordinateUnitsOnAllowance.map((u: any) => u.unitName)}
                                    onValueChange={(name) => {
                                        const unit = militaryUnits.find(u => u.name === name);
                                        setNewSubordinateUnit({
                                            ...newSubordinateUnit,
                                            unitName: name,
                                            unitCode: unit?.stateNumber || ""
                                        });
                                    }}
                                    placeholder={t("common.search")}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="allowanceType" className="text-xs">{t("common.type")}</Label>
                                <Popover open={openAllowanceTypeSelect} onOpenChange={setOpenAllowanceTypeSelect}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="w-full justify-between h-10 px-3">
                                            {newSubordinateUnit.allowanceType === "full" ? t("common.allowanceFull") : t("common.allowancePartial")}
                                            <Icons.ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandGroup>
                                                <CommandItem onSelect={() => { setNewSubordinateUnit({ ...newSubordinateUnit, allowanceType: "full" }); setOpenAllowanceTypeSelect(false); }}>
                                                    <Icons.Check className={cn("mr-2 h-4 w-4", newSubordinateUnit.allowanceType === "full" ? "opacity-100" : "opacity-0")} />
                                                    {t("common.allowanceFull")}
                                                </CommandItem>
                                                <CommandItem onSelect={() => { setNewSubordinateUnit({ ...newSubordinateUnit, allowanceType: "partial" }); setOpenAllowanceTypeSelect(false); }}>
                                                    <Icons.Check className={cn("mr-2 h-4 w-4", newSubordinateUnit.allowanceType === "partial" ? "opacity-100" : "opacity-0")} />
                                                    {t("common.allowancePartial")}
                                                </CommandItem>
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <Button type="button" variant="outline" className="h-10 w-10 p-0" onClick={handleAddSubordinateUnit} disabled={!newSubordinateUnit.unitCode || !newSubordinateUnit.unitName}>
                                <Icons.Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t("common.save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

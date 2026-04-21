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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { DatePicker, ConfigProvider } from "antd"
import type { Locale as AntdLocale } from "antd/es/locale"
import dayjs from "dayjs"
import quarterOfYear from "dayjs/plugin/quarterOfYear"
import ruRU from "antd/locale/ru_RU"
import enUS from "antd/locale/en_US"

// Регистрация плагина для работы с кварталами
dayjs.extend(quarterOfYear)

// Кастомная локализация для кварталов
const customRuRU: AntdLocale = {
    ...ruRU,
    DatePicker: {
        ...ruRU.DatePicker,
        lang: {
            ...ruRU.DatePicker?.lang,
            locale: 'ru',
            shortMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
            shortWeekDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            today: 'Сегодня',
            now: 'Сейчас',
            backToToday: 'Обратно к сегодня',
            ok: 'OK',
            clear: 'Очистить',
            month: 'Месяц',
            year: 'Год',
            timeSelect: 'Выбрать время',
            dateSelect: 'Выбрать дату',
            monthSelect: 'Выбрать месяц',
            yearSelect: 'Выбрать год',
            decadeSelect: 'Выбрать десятилетие',
            yearFormat: 'YYYY',
            dateFormat: 'D.M.YYYY',
            dayFormat: 'D',
            dateTimeFormat: 'D.M.YYYY HH:mm:ss',
            monthBeforeYear: true,
            previousMonth: 'Предыдущий месяц (PageUp)',
            nextMonth: 'Следующий месяц (PageDown)',
            previousYear: 'Предыдущий год (Control + left)',
            nextYear: 'Следующий год (Control + right)',
            previousDecade: 'Предыдущее десятилетие',
            nextDecade: 'Следующее десятилетие',
            previousCentury: 'Предыдущий век',
            nextCentury: 'Следующий век',
        }
    } as any
}

const customUzUZ: AntdLocale = {
    ...enUS,
    DatePicker: {
        ...enUS.DatePicker,
        lang: {
            ...enUS.DatePicker?.lang,
            locale: 'uz',
            shortMonths: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
            shortWeekDays: ['Ya', 'Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha'],
            today: 'Bugun',
            now: 'Hozir',
            backToToday: 'Bugunga qaytish',
            ok: 'OK',
            clear: 'Tozalash',
            month: 'Oy',
            year: 'Yil',
            timeSelect: 'Vaqtni tanlash',
            dateSelect: 'Sanani tanlash',
            monthSelect: 'Oyni tanlash',
            yearSelect: 'Yilni tanlash',
            decadeSelect: 'O\'n yillikni tanlash',
            yearFormat: 'YYYY',
            dateFormat: 'D.M.YYYY',
            dayFormat: 'D',
            dateTimeFormat: 'D.M.YYYY HH:mm:ss',
            monthBeforeYear: true,
            previousMonth: 'Oldingi oy (PageUp)',
            nextMonth: 'Keyingi oy (PageDown)',
            previousYear: 'Oldingi yil (Control + left)',
            nextYear: 'Keyingi yil (Control + right)',
            previousDecade: 'Oldingi o\'n yillik',
            nextDecade: 'Keyingi o\'n yillik',
            previousCentury: 'Oldingi asr',
            nextCentury: 'Keyingi asr',
        }
    } as any
}
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { UnitSelect } from "@/components/reference/unit-select"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n/hooks"
import { militaryUnits, militaryDistricts, controlAuthorities, controlDirections } from "@/lib/data/military-data"
import { classifiers } from "@/components/reference/classifiers"
import { getLocalizedAuthorityName, getLocalizedDirectionName, getLocalizedDistrictName, getInspectionTypeLabel, getStatusLabel, Locale } from "@/lib/utils/localization"

interface ApprovedPlanDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (data: any) => Promise<any>
    initialData?: any
    isEditing?: boolean
    locale: Locale
    supplyDepartments: any[]
    isSubmitting: boolean
    suggestedPlanNumber?: string
}

export function ApprovedPlanDialog({
    open,
    onOpenChange,
    onSave,
    initialData,
    isEditing = false,
    locale,
    supplyDepartments,
    isSubmitting,
    suggestedPlanNumber,
}: ApprovedPlanDialogProps) {
    const { t } = useTranslation()
    const isLocked = initialData?.orders && initialData.orders.length > 0

    const [formData, setFormData] = useState<any>({
        planNumber: "",
        year: new Date().getFullYear(),
        controlObject: "",
        controlObjectSubtitle: "",
        controlObjectLocation: "",
        controlAuthority: "",
        inspectionDirection: "",
        inspectionDirectionSubtitle: "",
        inspectionType: 2301,
        status: 101, // Default status
        periodCoveredStart: "",
        periodCoveredEnd: "",
        periodConducted: "",
        approvedBy: "",
        approvedDate: "",
        totalAudits: 1,
        subordinateUnitsOnAllowance: [],
    })
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isHistoryPopulated, setIsHistoryPopulated] = useState(false);

    // Popover states
    const [openAuthoritySelect, setOpenAuthoritySelect] = useState(false)
    const [openDistrictSelect, setOpenDistrictSelect] = useState(false)
    const [openDirectionSelect, setOpenDirectionSelect] = useState(false)
    const [openTypeSelect, setOpenTypeSelect] = useState(false)
    const [openStatusSelect, setOpenStatusSelect] = useState(false)
    const [openAllowanceTypeSelect, setOpenAllowanceTypeSelect] = useState(false)
    const [newSubordinateUnit, setNewSubordinateUnit] = useState({ unitCode: "", unitName: "", allowanceType: "full" })

    useEffect(() => {
        if (initialData) {
            const unitName = initialData.controlObject || "";
            const unit = militaryUnits.find(u => u.name === unitName);
            setFormData({
                planNumber: initialData.planNumber || "",
                year: initialData.year || new Date().getFullYear(),
                controlObject: unitName,
                controlObjectSubtitle: initialData.controlObjectSubtitle || (unit ? unit.district : ""),
                controlObjectLocation: initialData.controlObjectLocation || (unit ? unit.location : ""),
                controlAuthority: initialData.controlAuthority || "",
                inspectionDirection: initialData.inspectionDirection || "",
                inspectionDirectionSubtitle: initialData.inspectionDirectionSubtitle || "",
                inspectionType: initialData.inspectionType || 2301,
                status: initialData.status || 101,
                periodCoveredStart: initialData.periodCoveredStart || "",
                periodCoveredEnd: initialData.periodCoveredEnd || "",
                periodConducted: initialData.periodConducted || "",
                approvedBy: initialData.approvedBy || "",
                approvedDate: initialData.approvedDate || "",
                totalAudits: initialData.objectsTotal || 1,
                subordinateUnitsOnAllowance: initialData.subordinateUnitsOnAllowance || [],
            })
        } else {
            setFormData({
                planNumber: suggestedPlanNumber || "",
                year: new Date().getFullYear(),
                controlObject: "",
                controlObjectSubtitle: "",
                controlAuthority: "",
                inspectionDirection: "",
                inspectionDirectionSubtitle: "",
                inspectionType: 2301,
                status: 101,
                periodCoveredStart: "",
                periodCoveredEnd: "",
                periodConducted: "",
                approvedBy: "",
                approvedDate: "",
                totalAudits: 1,
                subordinateUnitsOnAllowance: [],
            })
        }
    }, [initialData, open, suggestedPlanNumber])

    // Автозаполнение периода предыдущего контроля
    useEffect(() => {
        const fetchPreviousPeriod = async () => {
            // Срабатывает только если выбраны и часть, и орган, и поля даты еще пусты
            if (formData.controlObject && formData.controlAuthority && !formData.periodCoveredStart && !formData.periodCoveredEnd) {
                setIsLoadingHistory(true);
                try {
                    const response = await fetch(`/api/planning/previous-period?unitName=${encodeURIComponent(formData.controlObject)}&authorityCode=${encodeURIComponent(formData.controlAuthority)}`);
                    const result = await response.json();
                    
                    if (result.success && result.data) {
                        setFormData((prev: any) => ({
                            ...prev,
                            periodCoveredStart: result.data.start,
                            periodCoveredEnd: result.data.end
                        }));
                        setIsHistoryPopulated(true);
                    } else {
                        setIsHistoryPopulated(false);
                    }
                } catch (error) {
                    console.error("Failed to fetch previous period:", error);
                } finally {
                    setIsLoadingHistory(false);
                }
            }
        };

        fetchPreviousPeriod();
    }, [formData.controlObject, formData.controlAuthority]);


    const inspectionTypes = classifiers.find(c => c.id === 23 || c.id === 2)?.values || []
    const statusOptions = classifiers.find(c => c.id === 1)?.values || []

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
            <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isEditing ? (locale === "ru" ? "Редактировать утвержденный план" : "Tasdiqlangan rejani tahrirlash") : t("annual.approved.addTitle")}
                        {isLocked && <Icons.Lock className="h-4 w-4 text-amber-500" />}
                    </DialogTitle>
                    <DialogDescription>{t("annual.approved.addDescription")}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <fieldset disabled={isLocked} className="grid gap-6 border-none p-0 m-0">
                        <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>{t("annual.approved.planNumber")}</Label>
                            <Input
                                value={formData.planNumber}
                                onChange={(e) => setFormData({ ...formData, planNumber: e.target.value })}
                                placeholder={locale === "ru" ? "Автоматически" : "Avtomatik"}
                                disabled={true}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>{t("annual.filter.year")}</Label>
                            <ConfigProvider locale={locale === "ru" ? ruRU : enUS}>
                                <DatePicker
                                    picker="year"
                                    className="w-full h-10"
                                    value={formData.year ? dayjs(String(formData.year), 'YYYY') : null}
                                    onChange={(date) => setFormData({ ...formData, year: date ? date.year() : new Date().getFullYear() })}
                                />
                            </ConfigProvider>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>{t("annual.approved.controlObject")}</Label>
                            <UnitSelect
                                value={formData.controlObject}
                                onUnitChange={(unit) => {
                                    setFormData({
                                        ...formData,
                                        controlObject: unit.name,
                                        controlObjectSubtitle: unit.district || formData.controlObjectSubtitle,
                                        controlObjectLocation: unit.location || formData.controlObjectLocation
                                    });
                                }}
                                onValueChange={(name) => {
                                    // Fallback for names not found in UnitSelect search but still passed
                                    if (!formData.controlObject) {
                                        setFormData((prev: any) => ({ ...prev, controlObject: name }));
                                    }
                                }}
                                placeholder={t("common.select")}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>{t("common.location") || (locale === "ru" ? "Локация" : "Joylashuvi")}</Label>
                            <Input
                                value={formData.controlObjectLocation}
                                onChange={(e) => setFormData({ ...formData, controlObjectLocation: e.target.value })}
                                placeholder={t("common.location") || (locale === "ru" ? "Место дислокации" : "Manzil")}
                                className="bg-muted/30"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>{t("common.district")}</Label>
                            <Popover open={openDistrictSelect} onOpenChange={setOpenDistrictSelect}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between h-10 font-normal" disabled={true}>
                                        {formData.controlObjectSubtitle ? getLocalizedDistrictName(formData.controlObjectSubtitle, locale, true) : t("common.select")}
                                        <Icons.ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
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
                                                            setFormData({ ...formData, controlObjectSubtitle: val })
                                                            setOpenDistrictSelect(false)
                                                        }}
                                                    >
                                                        <Icons.Check className={cn("mr-2 h-4 w-4", formData.controlObjectSubtitle === district.name ? "opacity-100" : "opacity-0")} />
                                                        {locale === "uzLatn" ? district.name_uz_latn : locale === "uzCyrl" ? district.name_uz_cyrl : district.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>{t("annual.approved.controlAuthority")}</Label>
                        <Popover open={openAuthoritySelect} onOpenChange={setOpenAuthoritySelect}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between h-10 font-normal">
                                    {formData.controlAuthority ? getLocalizedAuthorityName(formData.controlAuthority, locale, supplyDepartments) : t("common.select")}
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
                                                    value={`${dept.code} ${getLocalizedAuthorityName(dept.code, locale, supplyDepartments)}`}
                                                    onSelect={() => {
                                                        setFormData({ ...formData, controlAuthority: dept.code })
                                                        setOpenAuthoritySelect(false)
                                                    }}
                                                >
                                                    <Icons.Check className={cn("mr-2 h-4 w-4", formData.controlAuthority === dept.code ? "opacity-100" : "opacity-0")} />
                                                    <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded mr-2">{dept.code}</span>
                                                    {getLocalizedAuthorityName(dept.code, locale, supplyDepartments)}
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
                            <Label>{t("annual.approved.inspectionDirection")}</Label>
                            <Popover open={openDirectionSelect} onOpenChange={setOpenDirectionSelect}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between h-10 font-normal">
                                        {formData.inspectionDirection ? getLocalizedDirectionName(formData.inspectionDirection, locale) : t("common.select")}
                                        <Icons.ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0">
                                    <Command>
                                        <CommandInput placeholder={t("common.search")} />
                                        <CommandList>
                                            <CommandEmpty>{t("common.noResults")}</CommandEmpty>
                                            <CommandGroup>
                                                {controlDirections.map((dir) => (
                                                    <CommandItem
                                                        key={dir.id}
                                                        value={dir.name}
                                                        onSelect={(val) => {
                                                            setFormData({ ...formData, inspectionDirection: val })
                                                            setOpenDirectionSelect(false)
                                                        }}
                                                    >
                                                        <Icons.Check className={cn("mr-2 h-4 w-4", formData.inspectionDirection === dir.name ? "opacity-100" : "opacity-0")} />
                                                        {locale === "uzLatn" ? dir.name_uz_latn : locale === "uzCyrl" ? dir.name_uz_cyrl : dir.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid gap-2">
                            <Label>{t("annual.approved.inspectionType")}</Label>
                            <Popover open={openTypeSelect} onOpenChange={setOpenTypeSelect}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between h-10 font-normal">
                                        {getInspectionTypeLabel(formData.inspectionType, locale)}
                                        <Icons.ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {inspectionTypes.map((type) => (
                                                    <CommandItem
                                                        key={type.id}
                                                        value={type.id?.toString()}
                                                        onSelect={(val) => {
                                                            setFormData({ ...formData, inspectionType: val })
                                                            setOpenTypeSelect(false)
                                                        }}
                                                    >
                                                        <Icons.Check className={cn("mr-2 h-4 w-4", formData.inspectionType.toString() === type.id?.toString() ? "opacity-100" : "opacity-0")} />
                                                        {locale === "uzLatn" ? type.name_uz_latn : locale === "uzCyrl" ? type.name_uz_cyrl : type.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 p-3 bg-muted/20 border-l-4 border-primary rounded-r-md">
                        <Label className="flex items-center justify-between text-primary font-semibold mb-3 whitespace-pre-line leading-tight">
                            <div className="flex items-start gap-2">
                                <Icons.History className="w-4 h-4 mt-1" />
                                {t("annual.approved.periodCovered")}
                            </div>
                            {isLoadingHistory && (
                                <div className="flex items-center gap-1 text-[11px] font-normal text-muted-foreground animate-pulse">
                                    <Icons.Loader2 className="w-3 h-3 animate-spin" />
                                    {locale === "ru" ? "Поиск в архиве..." : "Arxivdan qidirilmoqda..."}
                                </div>
                            )}
                            {isHistoryPopulated && !isLoadingHistory && (
                                <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] h-5 py-0 px-1.5 border-primary/20">
                                    {locale === "ru" ? "Из архива" : "Arxivdan"}
                                </Badge>
                            )}
                        </Label>
                        <div className="flex gap-4 items-center">
                            <div className="grid gap-1.5 flex-1">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">{t("annual.approved.periodCoveredStart")}</span>
                                <ConfigProvider locale={locale === "ru" ? ruRU : enUS}>
                                    <DatePicker
                                        className="w-full h-10"
                                        placeholder={t("common.startDate") || (locale === "ru" ? "Начало" : "Boshlanishi")}
                                        value={formData.periodCoveredStart ? dayjs(formData.periodCoveredStart) : null}
                                        onChange={(date) => {
                                            setFormData({
                                                ...formData,
                                                periodCoveredStart: date ? date.format("YYYY-MM-DD") : ""
                                            })
                                        }}
                                        format="DD.MM.YYYY"
                                    />
                                </ConfigProvider>
                            </div>
                            <div className="pt-5">
                                <span className="text-muted-foreground text-xl">→</span>
                            </div>
                            <div className="grid gap-1.5 flex-1">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">{t("annual.approved.periodCoveredEnd")}</span>
                                <ConfigProvider locale={locale === "ru" ? ruRU : enUS}>
                                    <DatePicker
                                        className="w-full h-10"
                                        placeholder={t("common.endDate") || (locale === "ru" ? "Конец" : "Tugashi")}
                                        value={formData.periodCoveredEnd ? dayjs(formData.periodCoveredEnd) : null}
                                        onChange={(date) => {
                                            setFormData({
                                                ...formData,
                                                periodCoveredEnd: date ? date.format("YYYY-MM-DD") : ""
                                            })
                                        }}
                                        format="DD.MM.YYYY"
                                    />
                                </ConfigProvider>
                            </div>
                        </div>
                    </div>
                        <div className="grid gap-2">
                            <Label>{t("annual.approved.periodConducted")}</Label>
                            <ConfigProvider locale={locale === "ru" ? customRuRU : customUzUZ}>
                                <DatePicker
                                    picker="quarter"
                                    className="w-full h-10"
                                    value={formData.periodConducted ? (() => {
                                        // Parse "I-квартал 2024" format
                                        const parts = formData.periodConducted.split('-')
                                        if (parts.length >= 2) {
                                            const roman = parts[0].trim()
                                            const yearMatch = formData.periodConducted.match(/\d{4}/)
                                            const year = yearMatch ? parseInt(yearMatch[0]) : formData.year
                                            const qMap: Record<string, number> = { "I": 1, "II": 2, "III": 3, "IV": 4 }
                                            const q = qMap[roman]
                                            if (q && year) {
                                                return (dayjs() as any).year(year).quarter(q)
                                            }
                                        }
                                        return null
                                    })() : null}
                                    onChange={(date) => {
                                        if (date) {
                                            const q = (date as any).quarter()
                                            const year = date.year()
                                            const roman = ["I", "II", "III", "IV"][q - 1]
                                            const label = locale === "ru" ? "квартал" : locale === "uzCyrl" ? "чорак" : "chorak"
                                            const val = `${roman}-${label} ${year}`

                                            setFormData({
                                                ...formData,
                                                periodConducted: val,
                                                year: year
                                            })
                                        } else {
                                            setFormData({
                                                ...formData,
                                                periodConducted: ""
                                            })
                                        }
                                    }}
                                    format={(value) => {
                                        const q = (value as any).quarter()
                                        const year = value.year()
                                        const roman = ["I", "II", "III", "IV"][q - 1]
                                        const label = locale === "ru" ? "квартал" : locale === "uzCyrl" ? "чорак" : "chorak"
                                        return `${roman}-${label} ${year}`
                                    }}
                                    placeholder={locale === "ru" ? "Выберите квартал" : "Chorakni tanlang"}
                                />
                            </ConfigProvider>
                        </div>
                    <div className="grid gap-2">
                        <Label>{t("annual.approved.status")}</Label>
                        <Popover open={openStatusSelect} onOpenChange={setOpenStatusSelect}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between h-10 font-normal hover:border-indigo-400 transition-colors">
                                    <span className="flex items-center gap-2">
                                        {(() => {
                                            const statusId = formData.status?.toString();
                                            let className = "";
                                            if (statusId === "101" || statusId === "approved") className = "bg-green-500/10 text-green-600 border-green-200";
                                            else if (statusId === "102" || statusId === "in_progress") className = "bg-indigo-500/10 text-indigo-600 border-indigo-200";
                                            else if (statusId === "103") className = "bg-slate-500/10 text-slate-600 border-slate-200";
                                            else if (statusId === "104" || statusId === "completed") className = "bg-teal-500/10 text-teal-600 border-teal-200";
                                            else if (statusId === "105") className = "bg-red-500/10 text-red-600 border-red-200";
                                            else if (statusId === "106") className = "bg-amber-500/10 text-amber-600 border-amber-200";
                                            
                                            return (
                                                <Badge variant="outline" className={cn("whitespace-nowrap font-medium text-[10px]", className)}>
                                                    {getStatusLabel(formData.status, locale as any)}
                                                </Badge>
                                            );
                                        })()}
                                    </span>
                                    <Icons.ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0" align="start">
                                <Command>
                                    <CommandList>
                                        <CommandGroup>
                                            {statusOptions.map((status) => (
                                                <CommandItem
                                                    key={status.id}
                                                    value={status.id?.toString()}
                                                    onSelect={(val) => {
                                                        setFormData({ ...formData, status: val })
                                                        setOpenStatusSelect(false)
                                                    }}
                                                >
                                                    <Icons.Check className={cn("mr-2 h-4 w-4", formData.status.toString() === status.id?.toString() ? "opacity-100" : "opacity-0")} />
                                                    {locale === "uzLatn" ? status.name_uz_latn : locale === "uzCyrl" ? status.name_uz_cyrl : status.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    </div>
                    <div className="border-t pt-4">
                        <Label className="text-base font-semibold">{t("annual.approved.subordinateUnits")}</Label>
                        <p className="text-sm text-muted-foreground mb-3">{t("annual.approved.subordinateUnitsDesc")}</p>

                        <div className="space-y-2 mb-4">
                            {formData.subordinateUnitsOnAllowance && formData.subordinateUnitsOnAllowance.map((unit: any, index: number) => (
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
                                    excludeUnits={formData.subordinateUnitsOnAllowance ? formData.subordinateUnitsOnAllowance.map((u: any) => u.unitName) : []}
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
                    </fieldset>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    {isLocked && (
                        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-md border border-amber-200 text-sm mb-4 sm:mb-0 mr-auto">
                            <Icons.Lock className="h-4 w-4" />
                            <span>{t("annual.locked.description")}</span>
                        </div>
                    )}
                    <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
                    {!isLocked && (
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting && <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("common.save")}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

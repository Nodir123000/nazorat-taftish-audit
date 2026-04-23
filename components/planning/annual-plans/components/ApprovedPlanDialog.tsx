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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { getLocalizedAuthorityName, getLocalizedDirectionName, getLocalizedDistrictName, getInspectionTypeLabel, getStatusLabel, toSafeString, Locale } from "@/lib/utils/localization"

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
        unitId: null,
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
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    // Popover states
    const [openAuthoritySelect, setOpenAuthoritySelect] = useState(false)
    const [openDistrictSelect, setOpenDistrictSelect] = useState(false)
    const [openDirectionSelect, setOpenDirectionSelect] = useState(false)
    const [openTypeSelect, setOpenTypeSelect] = useState(false)
    const [openStatusSelect, setOpenStatusSelect] = useState(false)
    const [openAllowanceTypeSelect, setOpenAllowanceTypeSelect] = useState(false)
    const [newSubordinateUnit, setNewSubordinateUnit] = useState({ unitCode: "", unitName: "", allowanceType: "full" })
    
    const [collisionInfo, setCollisionInfo] = useState<any>(null)
    const [isCheckingCollision, setIsCheckingCollision] = useState(false)

    useEffect(() => {
        if (initialData) {
            const unitName = initialData.controlObject || "";
            const unit = militaryUnits.find(u => u.name === unitName);
            setFormData({
                planNumber: initialData.planNumber || "",
                year: initialData.year || new Date().getFullYear(),
                unitId: initialData.unitId || initialData.unit_id || (unit ? unit.id : null),
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
                unitId: null,
                controlObject: "",
                controlObjectSubtitle: "",
                controlObjectLocation: "",
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
        setCollisionInfo(null)
        setCurrentStep(1) // Reset to first step on open
    }, [initialData, open, suggestedPlanNumber])

    // Collision check effect
    useEffect(() => {
        const checkCollision = async () => {
            if (!formData.unitId || !formData.year || !open) {
                setCollisionInfo(null)
                return
            }

            setIsCheckingCollision(true)
            try {
                const url = `/api/planning/check-collision?unitId=${formData.unitId}&year=${formData.year}${isEditing && (initialData?.id || initialData?.planId) ? `&excludePlanId=${initialData.id || initialData.planId}` : ""}`
                const res = await fetch(url)
                const data = await res.json()
                setCollisionInfo(data)
            } catch (error) {
                console.error("Collision check failed:", error)
            } finally {
                setIsCheckingCollision(false)
            }
        }

        const timer = setTimeout(checkCollision, 500)
        return () => clearTimeout(timer)
    }, [formData.unitId, formData.year, open, isEditing, initialData?.id, initialData?.planId])

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

    const validateForStatus = (statusId: number | string) => {
        const errors: string[] = []
        if (!formData.controlObject) errors.push(locale === "ru" ? "Объект контроля" : "Nazorat ob'ekti")
        if (statusId.toString() === "101") {
            if (!formData.inspectionDirection) errors.push(locale === "ru" ? "Направление проверки" : "Tekshiruv yo'nalishi")
            if (!formData.periodConducted) errors.push(locale === "ru" ? "Период проведения (квартал)" : "O'tkazish davri (chorak)")
            if (!formData.periodCoveredStart || !formData.periodCoveredEnd) errors.push(locale === "ru" ? "Период охвата" : "Qamrab olingan davr")
        }
        return errors
    }

    const handleSubmit = async (targetStatus?: number) => {
        const finalStatus = targetStatus || formData.status
        const errors = validateForStatus(finalStatus)
        
        if (errors.length > 0) {
            // Можно добавить тост-уведомление здесь
            alert((locale === "ru" ? "Пожалуйста, заполните обязательные поля: " : "Iltimos, majburiy maydonlarni to'ldiring: ") + errors.join(", "))
            return
        }

        await onSave({ ...formData, status: finalStatus })
    }

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const stepLabels = [
        locale === "ru" ? "Основное" : "Asosiy",
        locale === "ru" ? "Орган" : "Organ",
        locale === "ru" ? "Сроки" : "Muddat",
        locale === "ru" ? "Объекты" : "O'byektlar"
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-187.5 max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2">
                        {isEditing ? (locale === "ru" ? "Редактировать утвержденный план" : "Tasdiqlangan rejani tahrirlash") : t("annual.approved.addTitle")}
                        {isLocked && <Icons.Lock className="h-4 w-4 text-amber-500" />}
                    </DialogTitle>
                    <DialogDescription>{t("annual.approved.addDescription")}</DialogDescription>
                </DialogHeader>

                {/* Stepper UI */}
                <div className="px-6 py-4 bg-muted/30 border-y flex items-center justify-between gap-2">
                    {stepLabels.map((label, idx) => {
                        const stepNum = idx + 1;
                        const isActive = currentStep === stepNum;
                        const isCompleted = currentStep > stepNum;
                        
                        return (
                            <React.Fragment key={idx}>
                                <div className="flex flex-col items-center gap-1.5 flex-1 relative">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10",
                                        isActive ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110" : 
                                        isCompleted ? "bg-green-500 text-white" : "bg-muted text-muted-foreground border-2"
                                    )}>
                                        {isCompleted ? <Icons.Check className="w-4 h-4" /> : stepNum}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] uppercase tracking-wider font-bold transition-colors duration-300",
                                        isActive ? "text-primary" : "text-muted-foreground"
                                    )}>
                                        {label}
                                    </span>
                                </div>
                                {idx < stepLabels.length - 1 && (
                                    <div className={cn(
                                        "h-0.5 flex-1 max-w-10 -mt-4 transition-colors duration-500",
                                        currentStep > stepNum ? "bg-green-500" : "bg-muted"
                                    )} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid gap-6">
                        {collisionInfo?.hasCollision && (
                            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive mb-2 animate-in fade-in slide-in-from-top-2">
                                <Icons.AlertTriangle className="h-4 w-4" />
                                <AlertTitle className="font-bold text-sm">
                                    {locale === "ru" ? "Внимание: Коллизия планов" : "Diqqat: Rejalar to'qnashuvi"}
                                </AlertTitle>
                                <AlertDescription className="text-xs mt-1">
                                    {locale === "ru" 
                                        ? `В ${formData.year} году для этой части уже запланированы проверки (${collisionInfo.plans.length}):`
                                        : `${formData.year}-yilda ushbu qism uchun rejalar mavjud (${collisionInfo.plans.length}):`}
                                    <ul className="list-disc list-inside mt-1 font-medium">
                                        {collisionInfo.plans?.map((p: any, i: number) => (
                                            <li key={i}>
                                                {toSafeString(p.authority, locale as any) || (locale === "ru" ? "Неизвестный орган" : "Noma'lum organ")} - {toSafeString(p.type, locale as any) || (locale === "ru" ? "Неизвестный тип" : "Noma'lum tur")} 
                                                ({p.startDate ? dayjs(p.startDate).format('DD.MM.YYYY') : '...'} - {p.endDate ? dayjs(p.endDate).format('DD.MM.YYYY') : '...'})
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <fieldset disabled={isLocked} className="grid gap-6 border-none p-0 m-0 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* STEP 1: Main Info */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>{t("annual.approved.planNumber")}</Label>
                                            <Input
                                                value={formData.planNumber || ""}
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

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="grid gap-2">
                                            <Label className="flex items-center gap-2">
                                                <Icons.Shield className="w-3.5 h-3.5" />
                                                {t("annual.approved.controlObject")}
                                            </Label>
                                            <div className="relative">
                                                <UnitSelect
                                                    value={formData.controlObject}
                                                    disabled={isLocked || !!formData.controlObject}
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

                                                        const unitName = locale === 'uzLatn' ? (fullUnit.name_uz_latn || (typeof fullUnit.name === 'object' ? (fullUnit.name as any).uz : fullUnit.name)) : locale === 'uzCyrl' ? (fullUnit.name_uz_cyrl || (typeof fullUnit.name === 'object' ? (fullUnit.name as any).uzk : fullUnit.name)) : (typeof fullUnit.name === 'object' ? (fullUnit.name as any).ru : fullUnit.name);
                                                        const districtName = locale === 'uzLatn' ? (fullUnit.district_uz_latn || fullUnit.district) : locale === 'uzCyrl' ? (fullUnit.district_uz_cyrl || fullUnit.district) : fullUnit.district;
                                                        const location = locale === 'uzLatn' ? (fullUnit.location_uz_latn || fullUnit.location) : locale === 'uzCyrl' ? (fullUnit.location_uz_cyrl || fullUnit.location) : fullUnit.location;

                                                        const foundDist = militaryDistricts.find(d => 
                                                            d.name === districtName || 
                                                            d.shortName === districtName || 
                                                            d.code === districtName ||
                                                            d.name_uz_latn === districtName ||
                                                            d.name_uz_cyrl === districtName
                                                        );

                                                        setFormData({
                                                            ...formData,
                                                            unitId: fullUnit.id || fullUnit.unitId,
                                                            controlObject: unitName,
                                                            controlObjectSubtitle: foundDist ? (locale === 'uzLatn' ? foundDist.name_uz_latn : locale === 'uzCyrl' ? foundDist.name_uz_cyrl : foundDist.name) : (districtName || formData.controlObjectSubtitle),
                                                            controlObjectLocation: location || formData.controlObjectLocation
                                                        });
                                                    }}
                                                    onValueChange={(name) => {
                                                        if (!formData.controlObject) {
                                                            setFormData((prev: any) => ({ ...prev, controlObject: name }));
                                                        }
                                                    }}
                                                    placeholder={t("common.select")}
                                                />
                                                {!!formData.controlObject && !isLocked && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="absolute right-10 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-destructive"
                                                        onClick={() => setFormData({
                                                            ...formData,
                                                            unitId: null,
                                                            controlObject: "",
                                                            controlObjectSubtitle: "",
                                                            controlObjectLocation: ""
                                                        })}
                                                    >
                                                        <Icons.X className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>{t("common.location") || (locale === "ru" ? "Локация" : "Joylashuvi")}</Label>
                                            <Input
                                                value={formData.controlObjectLocation || ""}
                                                onChange={(e) => setFormData({ ...formData, controlObjectLocation: e.target.value })}
                                                placeholder={t("common.location") || (locale === "ru" ? "Место дислокации" : "Manzil")}
                                                className="bg-muted/30"
                                                disabled={isLocked || !!formData.controlObject}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>{t("common.district")}</Label>
                                            <Popover open={openDistrictSelect} onOpenChange={setOpenDistrictSelect}>
                                                <PopoverTrigger asChild disabled={isLocked || !!formData.controlObject}>
                                                    <Button variant="outline" className="w-full justify-between h-10 font-normal" disabled={isLocked || !!formData.controlObject}>
                                                        {formData.controlObjectSubtitle ? getLocalizedDistrictName(formData.controlObjectSubtitle, locale, true) : t("common.select")}
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
                                                                            setFormData({ ...formData, controlObjectSubtitle: val })
                                                                            setOpenDistrictSelect(false)
                                                                        }}
                                                                    >
                                                                        <Icons.Check className={cn("mr-2 h-4 w-4", formData.controlObjectSubtitle === district.name ? "opacity-100" : "opacity-0")} />
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
                                </div>
                            )}

                            {/* STEP 2: Authority & Direction */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label className="flex items-center gap-2">
                                            <Icons.UserCheck className="w-3.5 h-3.5" />
                                            {t("annual.approved.controlAuthority")}
                                        </Label>
                                        <Popover open={openAuthoritySelect} onOpenChange={setOpenAuthoritySelect}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between h-10 font-normal ring-offset-background focus:ring-2 ring-primary/20">
                                                    {formData.controlAuthority ? getLocalizedAuthorityName(formData.controlAuthority, locale, supplyDepartments) : t("common.select")}
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
                                                                    value={`${code} ${toSafeString(locale === "uzLatn" ? auth.name_uz_latn : locale === "uzCyrl" ? auth.name_uz_cyrl : auth.name, locale as any)}`}
                                                                    onSelect={() => {
                                                                        setFormData({ ...formData, controlAuthority: code })
                                                                        setOpenAuthoritySelect(false)
                                                                    }}
                                                                >
                                                                    <Icons.Check className={cn("mr-2 h-4 w-4", formData.controlAuthority === code ? "opacity-100" : "opacity-0")} />
                                                                    {toSafeString(locale === "uzLatn" ? auth.name_uz_latn : locale === "uzCyrl" ? auth.name_uz_cyrl : auth.name, locale as any)}
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
                                                <PopoverContent className="w-100 p-0">
                                                    <Command>
                                                        <CommandInput placeholder={t("common.search")} />
                                                        <CommandList>
                                                            <CommandEmpty>{t("common.noResults")}</CommandEmpty>
                                                            <CommandGroup>
                                                                {controlDirections.map((dir) => (
                                                                    <CommandItem
                                                                        key={dir.id}
                                                                        value={dir.name}
                                                                        onSelect={() => {
                                                                            setFormData({ ...formData, inspectionDirection: dir.code })
                                                                            setOpenDirectionSelect(false)
                                                                        }}
                                                                    >
                                                                        <Icons.Check className={cn("mr-2 h-4 w-4", formData.inspectionDirection === dir.code ? "opacity-100" : "opacity-0")} />
                                                                        {toSafeString(locale === "uzLatn" ? dir.name_uz_latn : locale === "uzCyrl" ? dir.name_uz_cyrl : dir.name, locale as any)}
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
                                                <PopoverContent className="w-75 p-0">
                                                    <Command>
                                                        <CommandList>
                                                            <CommandGroup>
                                                                {inspectionTypes.map((type) => (
                                                                    <CommandItem
                                                                        key={type.id}
                                                                        value={type.id?.toString()}
                                                                        onSelect={() => {
                                                                            setFormData({ ...formData, inspectionType: type.code || type.id?.toString() })
                                                                            setOpenTypeSelect(false)
                                                                        }}
                                                                    >
                                                                        <Icons.Check className={cn("mr-2 h-4 w-4", (formData.inspectionType?.toString() === type.code || formData.inspectionType?.toString() === type.id?.toString()) ? "opacity-100" : "opacity-0")} />
                                                                        {toSafeString(locale === "uzLatn" ? type.name_uz_latn : locale === "uzCyrl" ? type.name_uz_cyrl : type.name, locale as any)}
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
                            )}

                            {/* STEP 3: Periods & Status */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg space-y-4">
                                        <Label className="flex items-center justify-between text-primary font-bold text-sm uppercase tracking-tight">
                                            <div className="flex items-center gap-2">
                                                <Icons.CalendarRange className="w-4 h-4" />
                                                {t("annual.approved.periodCovered")}
                                            </div>
                                            {isLoadingHistory && <Icons.Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                            {isHistoryPopulated && !isLoadingHistory && (
                                                <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] h-5">
                                                    {locale === "ru" ? "Авто-подбор" : "Avto-tanlov"}
                                                </Badge>
                                            )}
                                        </Label>
                                        <div className="flex gap-4 items-center">
                                            <div className="grid gap-1.5 flex-1">
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">{t("annual.approved.periodCoveredStart")}</span>
                                                <ConfigProvider locale={locale === "ru" ? ruRU : enUS}>
                                                    <DatePicker
                                                        className="w-full h-10"
                                                        placeholder={locale === "ru" ? "Начало" : "Boshlanishi"}
                                                        value={formData.periodCoveredStart ? dayjs(formData.periodCoveredStart) : null}
                                                        onChange={(date) => setFormData({...formData, periodCoveredStart: date ? date.format("YYYY-MM-DD") : ""})}
                                                        format="DD.MM.YYYY"
                                                    />
                                                </ConfigProvider>
                                            </div>
                                            <div className="pt-5">
                                                <Icons.ArrowRight className="text-muted-foreground w-4 h-4" />
                                            </div>
                                            <div className="grid gap-1.5 flex-1">
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">{t("annual.approved.periodCoveredEnd")}</span>
                                                <ConfigProvider locale={locale === "ru" ? ruRU : enUS}>
                                                    <DatePicker
                                                        className="w-full h-10"
                                                        placeholder={locale === "ru" ? "Конец" : "Tugashi"}
                                                        value={formData.periodCoveredEnd ? dayjs(formData.periodCoveredEnd) : null}
                                                        onChange={(date) => setFormData({...formData, periodCoveredEnd: date ? date.format("YYYY-MM-DD") : ""})}
                                                        format="DD.MM.YYYY"
                                                    />
                                                </ConfigProvider>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>{t("annual.approved.periodConducted")}</Label>
                                            <ConfigProvider locale={locale === "ru" ? customRuRU : customUzUZ}>
                                                <DatePicker
                                                    picker="quarter"
                                                    className="w-full h-10"
                                                    value={formData.periodConducted ? (() => {
                                                        const parts = formData.periodConducted.split('-')
                                                        if (parts.length >= 2) {
                                                            const roman = parts[0].trim()
                                                            const yearMatch = formData.periodConducted.match(/\d{4}/)
                                                            const year = yearMatch ? parseInt(yearMatch[0]) : formData.year
                                                            const qMap: Record<string, number> = { "I": 1, "II": 2, "III": 3, "IV": 4 }
                                                            const q = qMap[roman]
                                                            if (q && year) return (dayjs() as any).year(year).quarter(q)
                                                        }
                                                        return null
                                                    })() : null}
                                                    onChange={(date) => {
                                                        if (date) {
                                                            const q = (date as any).quarter()
                                                            const year = date.year()
                                                            const roman = ["I", "II", "III", "IV"][q - 1]
                                                            const label = locale === "ru" ? "квартал" : locale === "uzCyrl" ? "чорак" : "chorak"
                                                            setFormData({ ...formData, periodConducted: `${roman}-${label} ${year}`, year: year })
                                                        } else {
                                                            setFormData({ ...formData, periodConducted: "" })
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
                                                    <Button variant="outline" className="w-full justify-between h-10 font-normal">
                                                        <span className="flex items-center gap-2">
                                                            {(() => {
                                                                const statusId = formData.status?.toString();
                                                                let badgeClass = "";
                                                                if (statusId === "101" || statusId === "approved") badgeClass = "bg-green-500/10 text-green-600 border-green-200";
                                                                else if (statusId === "102" || statusId === "in_progress") badgeClass = "bg-indigo-500/10 text-indigo-600 border-indigo-200";
                                                                else if (statusId === "106") badgeClass = "bg-amber-500/10 text-amber-600 border-amber-200";
                                                                
                                                                return (
                                                                    <Badge variant="outline" className={cn("whitespace-nowrap font-medium text-[10px]", badgeClass)}>
                                                                        {getStatusLabel(formData.status, locale as any)}
                                                                    </Badge>
                                                                );
                                                            })()}
                                                        </span>
                                                        <Icons.ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-75 p-0" align="start">
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
                                                                        {toSafeString(locale === "uzLatn" ? status.name_uz_latn : locale === "uzCyrl" ? status.name_uz_cyrl : status.name, locale as any)}
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
                            )}

                            {/* STEP 4: Subordinate Units */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <div className="bg-muted/30 p-4 rounded-lg border">
                                        <Label className="text-base font-bold flex items-center gap-2 mb-1">
                                            <Icons.Box className="w-4 h-4" />
                                            {t("annual.approved.subordinateUnits")}
                                        </Label>
                                        <p className="text-xs text-muted-foreground mb-4">{t("annual.approved.subordinateUnitsDesc")}</p>

                                        <div className="space-y-2 mb-6 max-h-40 overflow-y-auto pr-2">
                                            {formData.subordinateUnitsOnAllowance && formData.subordinateUnitsOnAllowance.map((unit: any, index: number) => (
                                                <div key={index} className="flex items-center gap-2 p-2.5 bg-background border rounded-md shadow-sm animate-in zoom-in-95">
                                                    <Badge variant="outline" className="font-mono bg-muted/50">{unit.unitCode}</Badge>
                                                    <span className="text-sm flex-1 font-medium">{toSafeString(unit.unitName, locale as any)}</span>
                                                    <Badge variant={unit.allowanceType === "full" ? "default" : "secondary"} className="text-[9px] h-5 px-1.5">
                                                        {unit.allowanceType === "full" ? t("common.allowanceFull") : t("common.allowancePartial")}
                                                    </Badge>
                                                    <Button size="sm" variant="ghost" onClick={() => handleRemoveSubordinateUnit(index)} className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10">
                                                        <Icons.X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {(!formData.subordinateUnitsOnAllowance || formData.subordinateUnitsOnAllowance.length === 0) && (
                                                <div className="text-center py-6 border-2 border-dashed rounded-lg text-muted-foreground text-xs">
                                                    {locale === "ru" ? "Нет прикрепленных подразделений" : "Biriktirilgan bo'linmalar mavjud emas"}
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-[2fr_1.5fr_auto] gap-2 items-end">
                                            <div className="grid gap-1.5">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">{t("common.select")}</Label>
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
                                            <div className="grid gap-1.5">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">{t("common.type")}</Label>
                                                <Popover open={openAllowanceTypeSelect} onOpenChange={setOpenAllowanceTypeSelect}>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" role="combobox" className="w-full justify-between h-10 px-3 font-normal">
                                                            {newSubordinateUnit.allowanceType === "full" ? t("common.allowanceFull") : t("common.allowancePartial")}
                                                            <Icons.ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-50 p-0">
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
                                            <Button type="button" variant="outline" className="h-10 w-10 p-0 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary" onClick={handleAddSubordinateUnit} disabled={!newSubordinateUnit.unitCode || !newSubordinateUnit.unitName}>
                                                <Icons.Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </fieldset>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2 border-t bg-muted/20 flex flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        {currentStep > 1 && (
                            <Button variant="outline" onClick={prevStep} className="h-10 px-4">
                                <Icons.ChevronLeft className="mr-2 h-4 w-4" />
                                {locale === "ru" ? "Назад" : "Orqaga"}
                            </Button>
                        )}
                        <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-10 text-muted-foreground hover:text-foreground">
                            {t("common.cancel")}
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {currentStep < totalSteps ? (
                            <Button onClick={nextStep} className="h-10 px-6 shadow-md hover:shadow-lg transition-all">
                                {locale === "ru" ? "Далее" : "Keyingisi"}
                                <Icons.ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            !isLocked && (
                                <div className="flex items-center gap-2">
                                    {(formData.status.toString() === "106" || !isEditing) && (
                                        <Button 
                                            variant="secondary" 
                                            onClick={() => handleSubmit(106)} 
                                            disabled={isSubmitting || !formData.controlObject}
                                            className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700"
                                        >
                                            {isSubmitting && <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <Icons.Edit className="mr-2 h-4 w-4" />
                                            {locale === "ru" ? "Черновик" : "Qoralama"}
                                        </Button>
                                    )}
                                    <Button 
                                        onClick={() => handleSubmit(101)} 
                                        disabled={isSubmitting || !formData.controlObject}
                                        className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/20 transition-all"
                                    >
                                        {isSubmitting && <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        <Icons.Check className="mr-2 h-4 w-4" />
                                        {locale === "ru" ? "Утвердить" : "Tasdiqlash"}
                                    </Button>
                                </div>
                            )
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

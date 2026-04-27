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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { DatePicker, ConfigProvider } from "antd"
import dayjs from "dayjs"
import ruRU from "antd/locale/ru_RU"
import enUS from "antd/locale/en_US"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n/hooks"
import { militaryUnits, militaryDistricts, controlAuthorities, controlDirections } from "@/lib/data/military-data"
import { getLocalizedAuthorityName, getLocalizedDirectionName, toSafeString, Locale } from "@/lib/utils/localization"
import { cn } from "@/lib/utils"

interface AutoDistributionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onGenerate: (plans: any[]) => Promise<any>
    locale: Locale
    supplyDepartments: any[]
}

export function AutoDistributionDialog({
    open,
    onOpenChange,
    onGenerate,
    locale,
    supplyDepartments,
}: AutoDistributionDialogProps) {
    const { t } = useTranslation()
    const [year, setYear] = useState(new Date().getFullYear())
    const [count, setCount] = useState(10)
    const [controlAuthority, setControlAuthority] = useState("КРУ МО РУ")
    const [inspectionDirection, setInspectionDirection] = useState("FIN")
    const [isGenerating, setIsGenerating] = useState(false)
    const [previewPlans, setPreviewPlans] = useState<any[]>([])
    
    const [openAuthoritySelect, setOpenAuthoritySelect] = useState(false)
    const [openDirectionSelect, setOpenDirectionSelect] = useState(false)

    const [isLoadingHistory, setIsLoadingHistory] = useState(false)

    // Функция для генерации превью
    const generatePreview = () => {
        // 1. Группируем части по округам
        const districts: Record<string, any[]> = {}
        militaryUnits.forEach(unit => {
            const d = unit.district || "Другие"
            if (!districts[d]) districts[d] = []
            districts[d].push(unit)
        })

        const districtList = Object.keys(districts)
        const plansToCreate: any[] = []
        
        // 2. Рассчитываем сколько частей из каждого округа взять
        const countPerDistrict = Math.floor(count / districtList.length)
        let remainder = count % districtList.length

        districtList.forEach(dName => {
            const unitsInDist = [...districts[dName]]
            // Перемешиваем рандомно
            const shuffled = unitsInDist.sort(() => 0.5 - Math.random())
            
            const take = countPerDistrict + (remainder > 0 ? 1 : 0)
            if (remainder > 0) remainder--

            const selected = shuffled.slice(0, take)
            
            selected.forEach((unit, idx) => {
                // Распределяем по кварталам равномерно
                const quarterNum = (idx % 4) + 1
                const roman = ["I", "II", "III", "IV"][quarterNum - 1]
                const label = locale === "ru" ? "квартал" : "chorak"
                const periodConducted = `${roman}-${label} ${year}`

                plansToCreate.push({
                    unitId: unit.id,
                    controlObject: unit.name,
                    controlObjectSubtitle: unit.district,
                    controlObjectLocation: unit.location,
                    controlAuthority,
                    inspectionDirection,
                    inspectionType: 2301, // Плановая
                    year,
                    periodConducted,
                    status: 106, // Черновик
                    periodCoveredStart: dayjs(`${year-1}-01-01`).format("YYYY-MM-DD"),
                    periodCoveredEnd: dayjs(`${year-1}-12-31`).format("YYYY-MM-DD"),
                })
            })
        })

        setPreviewPlans(plansToCreate)
    }

    useEffect(() => {
        if (open) {
            generatePreview()
        }
    }, [open, count, year, controlAuthority, inspectionDirection])

    // Обогащение списка данными о предыдущих проверках
    useEffect(() => {
        const enrichHistory = async () => {
            if (previewPlans.length === 0 || !controlAuthority) return;
            
            // Если уже загружено или сейчас грузится, не повторяем для того же списка
            const needsLoading = previewPlans.some(p => !p.previousControl && !p.checkedHistory);
            if (!needsLoading) return;

            setIsLoadingHistory(true);
            try {
                const enriched = await Promise.all(previewPlans.map(async (plan) => {
                    if (plan.previousControl || plan.checkedHistory) return plan;

                    try {
                        const res = await fetch(`/api/planning/previous-period?unitId=${plan.unitId}&authorityCode=${controlAuthority}`);
                        const result = await res.json();
                        return { 
                            ...plan, 
                            previousControl: result.success ? result.data : null,
                            checkedHistory: true
                        };
                    } catch (e) {
                        return { ...plan, checkedHistory: true };
                    }
                }));
                setPreviewPlans(enriched);
            } finally {
                setIsLoadingHistory(false);
            }
        };

        const timer = setTimeout(enrichHistory, 300);
        return () => clearTimeout(timer);
    }, [previewPlans, controlAuthority]);

    const handleConfirm = async () => {
        setIsGenerating(true)
        try {
            await onGenerate(previewPlans)
            onOpenChange(false)
        } catch (error) {
            console.error("Auto generation failed:", error)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] max-h-[95vh] flex flex-col overflow-hidden p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Icons.Zap className="h-6 w-6 text-amber-500" />
                        {locale === "ru" ? "Автоматическое распределение проверок" : "Tekshiruvlarni avtomatik taqsimlash"}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        {locale === "ru" 
                            ? "Система выберет воинские части рандомно, распределяя их поровну между военными округами."
                            : "Tizim harbiy qismlarni tasodifiy tanlaydi va ularni harbiy okruglar o'rtasida teng taqsimlaydi."}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-[120px_150px_1fr] gap-6 px-6 py-4 border-y bg-muted/20">
                    <div className="grid gap-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("annual.filter.year")}</Label>
                        <Select value={year.toString()} onValueChange={(val) => setYear(parseInt(val))}>
                            <SelectTrigger className="h-10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[2024, 2025, 2026].map(y => (
                                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">{locale === "ru" ? "Кол-во проверок" : "Tekshiruvlar soni"}</Label>
                        <Input 
                            type="number" 
                            value={count} 
                            onChange={(e) => setCount(parseInt(e.target.value) || 0)}
                            min={1}
                            max={ militaryUnits.length }
                            className="h-10"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("annual.approved.controlAuthority")}</Label>
                        <Popover open={openAuthoritySelect} onOpenChange={setOpenAuthoritySelect}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between h-10 font-normal bg-background">
                                    <span className="truncate">
                                        {controlAuthority ? getLocalizedAuthorityName(controlAuthority, locale, supplyDepartments) : t("common.select")}
                                    </span>
                                    <Icons.ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder={t("common.search")} />
                                    <CommandList className="max-h-60">
                                        <CommandEmpty>{t("common.noResults")}</CommandEmpty>
                                        <CommandGroup>
                                            {supplyDepartments.map((dept) => (
                                                <CommandItem
                                                    key={dept.code}
                                                    onSelect={() => {
                                                        setControlAuthority(dept.code)
                                                        setOpenAuthoritySelect(false)
                                                    }}
                                                >
                                                    <Icons.Check className={cn("mr-2 h-4 w-4", controlAuthority === dept.code ? "opacity-100" : "opacity-0")} />
                                                    {getLocalizedAuthorityName(dept.code, locale, supplyDepartments)}
                                                </CommandItem>
                                            ))}
                                            {Object.entries(controlAuthorities).map(([code, auth]: [string, any]) => (
                                                <CommandItem
                                                    key={code}
                                                    onSelect={() => {
                                                        setControlAuthority(code)
                                                        setOpenAuthoritySelect(false)
                                                    }}
                                                >
                                                    <Icons.Check className={cn("mr-2 h-4 w-4", controlAuthority === code ? "opacity-100" : "opacity-0")} />
                                                    {toSafeString(locale === "uzLatn" ? auth.name_uz_latn : locale === "uzCyrl" ? auth.name_uz_cyrl : auth.name, locale as any)}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            {locale === "ru" ? "Предварительный список" : "Dastlabki ro'yxat"} ({previewPlans.length})
                        </h4>
                        {isLoadingHistory && (
                            <div className="flex items-center gap-2 text-[11px] font-medium text-amber-600 animate-pulse bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                <Icons.Loader2 className="h-3 w-3 animate-spin" />
                                {locale === "ru" ? "Загрузка истории..." : "Tarix yuklanmoqda..."}
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {previewPlans.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-xl bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200 group">
                                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-bold text-sm truncate">{p.controlObject}</span>
                                        {p.previousControl ? (
                                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] py-0 h-4.5 px-2 font-bold whitespace-nowrap">
                                                {locale === "ru" ? "Пред. контроль: " : "Oldingi nazorat: "}
                                                {dayjs(p.previousControl.start).format("DD.MM.YYYY")}
                                            </Badge>
                                        ) : p.checkedHistory && (
                                            <span className="text-[10px] text-muted-foreground italic bg-muted px-1.5 py-0.5 rounded">
                                                {locale === "ru" ? "Нет истории" : "Tarix yo'q"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <Icons.MapPin className="h-3 w-3" />
                                        <span className="truncate">{p.controlObjectSubtitle} • {p.controlObjectLocation}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 ml-4">
                                    <div className="px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-[11px] font-bold border border-primary/10 whitespace-nowrap">
                                        {p.periodConducted}
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                                        const next = [...previewPlans]
                                        next.splice(i, 1)
                                        setPreviewPlans(next)
                                    }}>
                                        <Icons.X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter className="border-t p-6 bg-muted/10">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="px-8">
                        {t("common.cancel")}
                    </Button>
                    <Button onClick={handleConfirm} disabled={isGenerating || previewPlans.length === 0} className="bg-amber-600 hover:bg-amber-700 px-8 shadow-lg shadow-amber-600/20">
                        {isGenerating && <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {locale === "ru" ? "Сгенерировать черновики" : "Qoralama rejalar yaratish"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

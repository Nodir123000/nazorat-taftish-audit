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
    const [inspectionDirection, setInspectionDirection] = useState("Финансово-хозяйственная деятельность")
    const [isGenerating, setIsGenerating] = useState(false)
    const [previewPlans, setPreviewPlans] = useState<any[]>([])
    
    const [openAuthoritySelect, setOpenAuthoritySelect] = useState(false)
    const [openDirectionSelect, setOpenDirectionSelect] = useState(false)

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
            <DialogContent className="sm:max-w-225 max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icons.Zap className="h-5 w-5 text-amber-500" />
                        {locale === "ru" ? "Автоматическое распределение проверок" : "Tekshiruvlarni avtomatik taqsimlash"}
                    </DialogTitle>
                    <DialogDescription>
                        {locale === "ru" 
                            ? "Система выберет воинские части рандомно, распределяя их поровну между военными округами."
                            : "Tizim harbiy qismlarni tasodifiy tanlaydi va ularni harbiy okruglar o'rtasida teng taqsimlaydi."}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-4 py-4 border-b">
                    <div className="grid gap-2">
                        <Label>{t("annual.filter.year")}</Label>
                        <Select value={year.toString()} onValueChange={(val) => setYear(parseInt(val))}>
                            <SelectTrigger>
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
                        <Label>{locale === "ru" ? "Количество проверок" : "Tekshiruvlar soni"}</Label>
                        <Input 
                            type="number" 
                            value={count} 
                            onChange={(e) => setCount(parseInt(e.target.value) || 0)}
                            min={1}
                            max={ militaryUnits.length }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>{t("annual.approved.controlAuthority")}</Label>
                        <Popover open={openAuthoritySelect} onOpenChange={setOpenAuthoritySelect}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between h-10 font-normal">
                                    <span className="truncate">
                                        {controlAuthority ? getLocalizedAuthorityName(controlAuthority, locale, supplyDepartments) : t("common.select")}
                                    </span>
                                    <Icons.ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-100 p-0" align="start">
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

                <div className="flex-1 overflow-y-auto py-4">
                    <h4 className="text-sm font-semibold mb-3">
                        {locale === "ru" ? "Предварительный список" : "Dastlabki ro'yxat"} ({previewPlans.length})
                    </h4>
                    <div className="grid gap-2">
                        {previewPlans.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-2 border rounded-md bg-muted/30 text-xs">
                                <div className="flex flex-col">
                                    <span className="font-bold">{p.controlObject}</span>
                                    <span className="text-muted-foreground">{p.controlObjectSubtitle} • {p.controlObjectLocation}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline">{p.periodConducted}</Badge>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => {
                                        const next = [...previewPlans]
                                        next.splice(i, 1)
                                        setPreviewPlans(next)
                                    }}>
                                        <Icons.X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter className="border-t pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t("common.cancel")}
                    </Button>
                    <Button onClick={handleConfirm} disabled={isGenerating || previewPlans.length === 0} className="bg-amber-600 hover:bg-amber-700">
                        {isGenerating && <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {locale === "ru" ? "Сгенерировать черновики" : "Qoralama rejalar yaratish"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { UnitCard } from "@/components/units/unit-card"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralTab } from "@/components/units/tabs/general-tab"
import { PersonnelTab } from "@/components/units/tabs/personnel-tab"
import { AuditsTab } from "@/components/units/tabs/audits-tab"
import { ViolationsTab } from "@/components/units/tabs/violations-tab"
import { CommandTab } from "@/components/units/tabs/command-tab"
import { LegalTab } from "@/components/units/tabs/legal-tab"
import { MilitaryUnitStats } from "@/components/units/military-unit-stats"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { Lang } from "@/lib/types/i18n"

interface UnitsViewClientProps {
    id: string
    unitData: any
}

// Lazy loaded tab content wrapper
function LazyTabContent({ value, activeTab, children }: { value: string, activeTab: string, children: React.ReactNode }) {
    const [hasBeenActive, setHasBeenActive] = useState(value === activeTab)

    if (value === activeTab && !hasBeenActive) {
        setHasBeenActive(true)
    }

    if (!hasBeenActive) return null

    return (
        <TabsContent value={value} className="mt-0 focus-visible:outline-none">
            {children}
        </TabsContent>
    )
}

export default function UnitsViewClient({ id, unitData }: UnitsViewClientProps) {
    const router = useRouter()
    const { locale } = useI18n()
    const [activeTab, setActiveTab] = useState("general")

    const getLocalizedValue = (val: any): string => {
        if (!val) return ""
        if (typeof val === "string") return val
        if (typeof val === "object") {
            const localized =
                locale === "ru" ? val.ru ?? val[Lang.RU]
                    : locale === "uzLatn" ? val.uzLatn ?? val.uz ?? val[Lang.UZ_LATN]
                        : locale === "uzCyrl" ? val.uzCyrl ?? val[Lang.UZ_CYRL]
                            : val.ru
            if (localized) return localized
            if (val.name) return getLocalizedValue(val.name)
            if (val.name_ru) return val.name_ru
        }
        return ""
    }

    const unit = useMemo(() => {
        if (!unitData || unitData.error) return null
        return {
            ...unitData,
            id: unitData.unitId || unitData.id,
            name: getLocalizedValue(unitData.name),
            fullName: unitData.fullName || getLocalizedValue(unitData.name),
            district: getLocalizedValue(unitData.district),
            region: getLocalizedValue(unitData.region) || getLocalizedValue(unitData.area?.region),
            city: getLocalizedValue(unitData.city) || getLocalizedValue(unitData.area),
            status: unitData.isActive ? 'active' : 'inactive'
        }
    }, [unitData, locale])

    if (!unitData || unitData.error || !unit) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 py-20 px-4 text-center">
                <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-rose-100/50 border border-rose-100">
                    <Icons.AlertCircle className="h-12 w-12 text-rose-500" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Воинская часть не найдена</h1>
                <p className="text-slate-500 max-w-md mb-8 font-medium">
                    К сожалению, запрашиваемая воинская часть не найдена в базе данных или произошла ошибка при загрузке.
                </p>
                <Link href="/units/list">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl rounded-2xl px-8 h-12 font-bold uppercase tracking-widest text-[10px]">
                        <Icons.ChevronLeft className="h-4 w-4 mr-2" />
                        Вернуться к списку
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-1">
                        {unit.unitNumber && unit.unitNumber !== "—" && !isNaN(Number(unit.unitNumber)) ? `В/Ч ${unit.unitNumber}` : unit.name}
                    </h1>
                    {unit.unitNumber && unit.unitNumber !== "—" && !isNaN(Number(unit.unitNumber)) && <p className="text-muted-foreground text-lg">{unit.name}</p>}
                </div>
                <div className="flex gap-2">
                    <Link href="/units/list">
                        <Button variant="outline" size="sm">
                            <Icons.ChevronLeft className="h-4 w-4 mr-1" />
                            Вернуться к списку
                        </Button>
                    </Link>
                    <Link href={`/units/${id}/edit`}>
                        <Button variant="default" size="sm" className="bg-amber-500 hover:bg-amber-600 text-white border-0 font-medium">
                            <Icons.Edit className="h-4 w-4 mr-1" />
                            Редактировать
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="border-b px-4 bg-slate-50/30">
                        <TabsList className="bg-transparent h-12 w-full justify-start gap-6 p-0 overflow-x-auto">
                            <TabsTrigger value="general" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 h-12 text-muted-foreground data-[state=active]:text-blue-600 shrink-0 font-medium transition-all">
                                <Icons.Info className="w-4 h-4 mr-2" />
                                Общая информация
                            </TabsTrigger>
                            <TabsTrigger value="command" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 h-12 text-muted-foreground data-[state=active]:text-blue-600 shrink-0 font-medium transition-all">
                                <Icons.User className="w-4 h-4 mr-2" />
                                Командование
                            </TabsTrigger>
                            <TabsTrigger value="personnel" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 h-12 text-muted-foreground data-[state=active]:text-blue-600 shrink-0 font-medium transition-all">
                                <Icons.Users className="w-4 h-4 mr-2" />
                                Личный состав
                            </TabsTrigger>
                            <TabsTrigger value="audits" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 h-12 text-muted-foreground data-[state=active]:text-blue-600 shrink-0 font-medium transition-all">
                                <Icons.History className="w-4 h-4 mr-2" />
                                Ревизии
                            </TabsTrigger>
                            <TabsTrigger value="violations" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 h-12 text-muted-foreground data-[state=active]:text-blue-600 shrink-0 font-medium transition-all">
                                <Icons.AlertTriangle className="w-4 h-4 mr-2" />
                                Нарушения
                            </TabsTrigger>
                            <TabsTrigger value="legal" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 h-12 text-muted-foreground data-[state=active]:text-blue-600 shrink-0 font-medium transition-all">
                                <Icons.ShieldAlert className="w-4 h-4 mr-2" />
                                Правовые меры
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-6 bg-white min-h-100">
                        <LazyTabContent value="general" activeTab={activeTab}>
                            <GeneralTab unit={unit} />
                        </LazyTabContent>

                        <LazyTabContent value="command" activeTab={activeTab}>
                            <CommandTab />
                        </LazyTabContent>

                        <LazyTabContent value="personnel" activeTab={activeTab}>
                            <PersonnelTab unitId={id} />
                        </LazyTabContent>

                        <LazyTabContent value="audits" activeTab={activeTab}>
                            <AuditsTab unitNumber={unit.unitNumber} unitName={unit.name} />
                        </LazyTabContent>

                        <LazyTabContent value="violations" activeTab={activeTab}>
                            <ViolationsTab unitName={unit.name} unitNumber={unit.unitNumber} />
                        </LazyTabContent>

                        <LazyTabContent value="legal" activeTab={activeTab}>
                            <LegalTab unitName={unit.name} unitNumber={unit.unitNumber} />
                        </LazyTabContent>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}

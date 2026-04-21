"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MilitaryUnit } from "@/lib/mock-data/units"
import { UnitNavigation, UnitSection } from "./unit-navigation"
import { UnitSectionContent } from "./unit-section-content"
import { useRouter } from "next/navigation"

interface UnitCardProps {
    unit: MilitaryUnit
}

export function UnitCard({ unit }: UnitCardProps) {
    const [activeSection, setActiveSection] = useState<UnitSection>("general")
    const router = useRouter()

    return (
        <div className="flex flex-col gap-6">
            {/* Top Header Card */}
            <Card className="border-none shadow-md bg-gradient-to-r from-blue-700 to-indigo-800 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Icons.Home className="h-32 w-32" />
                </div>
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl overflow-hidden">
                            <Icons.Home className="h-12 w-12 text-white" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <span className="bg-blue-500/50 backdrop-blur-sm text-xs font-bold px-2 py-0.5 rounded-full border border-blue-400/30 uppercase tracking-wider">
                                    Воинская часть
                                </span>
                                <span className="text-blue-200">•</span>
                                <span className="text-blue-100 font-medium">{unit.unitCode}</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-2 drop-shadow-md">{unit.name}</h1>
                            <p className="text-blue-100 text-lg opacity-90 max-w-2xl">{unit.fullName}</p>
                        </div>
                        <div className="flex flex-col gap-3 min-w-[200px]">
                            <Button
                                variant="outline"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm transition-all shadow-lg"
                                onClick={() => router.push('/units/list')}
                            >
                                <Icons.ChevronLeft className="h-4 w-4 mr-2" />
                                Вернуться к списку
                            </Button>
                            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold shadow-lg transition-all hover:scale-105">
                                <Icons.Edit className="h-4 w-4 mr-2" />
                                Редактировать
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12">
                {/* Sidebar Navigation */}
                <div className="md:col-span-3 space-y-4">
                    <UnitNavigation
                        activeSection={activeSection}
                        onSelectSection={setActiveSection}
                    />

                    <Card className="border-none shadow-md bg-white overflow-hidden">
                        <CardContent className="p-4 space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Статистика части</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm text-slate-500">Личный состав</span>
                                        <span className="text-lg font-bold text-slate-800">{unit.personnelCount}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full w-[85%]" />
                                    </div>

                                    <div className="flex justify-between items-end pt-2">
                                        <span className="text-sm text-slate-500">Ревизий (2024)</span>
                                        <span className="text-lg font-bold text-slate-800">2</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-amber-500 h-full w-[60%]" />
                                    </div>

                                    <div className="flex justify-between items-end pt-2">
                                        <span className="text-sm text-slate-500">KPI Рейтинг</span>
                                        <span className="text-lg font-bold text-emerald-600">92%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full w-[92%]" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button variant="outline" className="w-full text-xs font-semibold py-1 h-8 border-slate-200">
                                    Полная аналитика
                                    <Icons.ExternalLink className="ml-2 h-3 w-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-9 bg-white rounded-xl shadow-md border border-slate-100 p-6 min-h-[500px]">
                    <UnitSectionContent section={activeSection} unit={unit} />
                </div>
            </div>
        </div>
    )
}

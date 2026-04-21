"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export type UnitSection =
    | "general"
    | "location"
    | "command"
    | "personnel"
    | "audits"
    | "violations"
    | "kpi"

interface UnitNavigationProps {
    activeSection: UnitSection
    onSelectSection: (section: UnitSection) => void
}

const sections: { id: UnitSection; title: string; icon: any }[] = [
    { id: "general", title: "Общая информация", icon: Icons.FileText },
    { id: "location", title: "Расположение", icon: Icons.Map },
    { id: "command", title: "Командование", icon: Icons.User },
    { id: "personnel", title: "Личный состав", icon: Icons.Users },
    { id: "audits", title: "История ревизий", icon: Icons.Search },
    { id: "violations", title: "Нарушения", icon: Icons.Alert },
    { id: "kpi", title: "Показатели KPI", icon: Icons.Chart },
]

export function UnitNavigation({ activeSection, onSelectSection }: UnitNavigationProps) {
    return (
        <div className="space-y-2">
            {sections.map((section) => {
                const isActive = activeSection === section.id
                return (
                    <Card
                        key={section.id}
                        className={cn(
                            "cursor-pointer transition-all duration-200 hover:shadow-md py-0",
                            isActive
                                ? "bg-blue-50 border-blue-200 shadow-sm"
                                : "hover:bg-slate-50 border-transparent shadow-none"
                        )}
                        onClick={() => onSelectSection(section.id)}
                    >
                        <CardContent className="p-0">
                            <button
                                className="w-full flex items-center justify-between py-2 px-3 transition-colors"
                                onClick={() => onSelectSection(section.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-1.5 rounded-md transition-colors",
                                        isActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                                    )}>
                                        <section.icon className="h-4 w-4" />
                                    </div>
                                    <span className={cn(
                                        "text-sm font-medium transition-colors",
                                        isActive ? "text-blue-700" : "text-slate-600"
                                    )}>
                                        {section.title}
                                    </span>
                                </div>
                            </button>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

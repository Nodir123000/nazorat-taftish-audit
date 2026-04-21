"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface InspectorSection {
    id: string
    title: string
    icon: React.ComponentType<{ className?: string }>
    iconColor: string
}

interface InspectorNavigationProps {
    sections?: InspectorSection[]
    activeSection: string
    onSelectSection: (sectionId: string) => void
    mode?: "inspector" | "personnel"
}

const defaultSections: InspectorSection[] = [
    { id: "personal", title: "Основные данные", icon: Icons.User, iconColor: "text-blue-600" },
    { id: "military", title: "Военные данные", icon: Icons.Shield, iconColor: "text-red-600" },
    { id: "service", title: "Служебная информация", icon: Icons.Briefcase, iconColor: "text-emerald-600" },
    { id: "commission_assignments", title: "Назначения", icon: Icons.Users, iconColor: "text-purple-600" },
    { id: "my_revisions", title: "Мои ревизии", icon: Icons.Clipboard, iconColor: "text-blue-600" },
    { id: "audits", title: "История ревизий", icon: Icons.Clipboard, iconColor: "text-amber-600" },
    { id: "results", title: "Результаты проверок", icon: Icons.ListChecks, iconColor: "text-teal-600" },
    { id: "financial_violations", title: "Финансовые нарушения", icon: Icons.TrendingDown, iconColor: "text-orange-600" },
    { id: "asset_violations", title: "Имущественные нарушения", icon: Icons.Package, iconColor: "text-amber-700" },
    { id: "kpi", title: "KPI показатели", icon: Icons.Chart, iconColor: "text-green-600" },
]

export function InspectorNavigation({
    sections = defaultSections,
    activeSection,
    onSelectSection,
    mode = "personnel"
}: InspectorNavigationProps) {
    const filteredSections = sections.filter(section => {
        if (mode === "inspector") {
            // Инспектор: скрыть разделы нарушений (они для проверяемых)
            return !["financial_violations", "asset_violations"].includes(section.id)
        } else {
            // Персонал: скрыть KPI и историю ревизий (они для инспекторов КРУ)
            // Вкладка commission_assignments и my_revisions показываются в обоих режимах
            return !["audits", "results", "kpi"].includes(section.id)
        }
    })

    return (
        <div className="space-y-1">
            {filteredSections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id

                return (
                    <Card
                        key={section.id}
                        className={cn(
                            "cursor-pointer transition-all duration-200 hover:shadow-md py-0",
                            isActive
                                ? "bg-primary/10 border-primary/50 shadow-sm"
                                : "hover:bg-muted/50"
                        )}
                        onClick={() => onSelectSection(section.id)}
                    >
                        <CardContent className="p-0">
                            <button
                                className="w-full flex items-center justify-between py-1 px-2 transition-colors"
                                onClick={() => onSelectSection(section.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            "p-1 rounded-lg transition-all",
                                            isActive ? "bg-primary/20" : "bg-muted"
                                        )}
                                    >
                                        <Icon className={cn("h-4 w-4", section.iconColor)} />
                                    </div>
                                    <span
                                        className={cn(
                                            "font-medium text-sm transition-colors",
                                            isActive ? "text-primary font-semibold" : "text-foreground"
                                        )}
                                    >
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

export { defaultSections }
export type { InspectorSection }

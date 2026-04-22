"use client"

import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

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
    { id: "personal", title: "ОСНОВНЫЕ ДАННЫЕ", icon: Icons.User, iconColor: "text-blue-500" },
    { id: "military", title: "ВОЕННЫЕ ДАННЫЕ", icon: Icons.Shield, iconColor: "text-red-500" },
    { id: "service", title: "СЛУЖЕБНАЯ ИНФОРМАЦИЯ", icon: Icons.Briefcase, iconColor: "text-emerald-500" },
    { id: "commission_assignments", title: "НАЗНАЧЕНИЯ", icon: Icons.Users, iconColor: "text-purple-500" },
    { id: "my_revisions", title: "МОИ РЕВИЗИИ", icon: Icons.Clipboard, iconColor: "text-blue-500" },
    { id: "audits", title: "ИСТОРИЯ РЕВИЗИЙ", icon: Icons.Clipboard, iconColor: "text-amber-500" },
    { id: "results", title: "РЕЗУЛЬТАТЫ ПРОВЕРОК", icon: Icons.ListChecks, iconColor: "text-teal-500" },
    { id: "financial_violations", title: "ФИНАНСОВЫЕ НАРУШЕНИЯ", icon: Icons.TrendingDown, iconColor: "text-orange-500" },
    { id: "asset_violations", title: "ИМУЩЕСТВЕННЫЕ НАРУШЕНИЯ", icon: Icons.Package, iconColor: "text-amber-700" },
    { id: "kpi", title: "KPI ПОКАЗАТЕЛИ", icon: Icons.Chart, iconColor: "text-green-500" },
]

export function InspectorNavigation({
    sections = defaultSections,
    activeSection,
    onSelectSection,
    mode = "personnel"
}: InspectorNavigationProps) {
    const filteredSections = sections.filter(section => {
        if (mode === "inspector") {
            return !["financial_violations", "asset_violations"].includes(section.id)
        } else {
            return !["audits", "results", "kpi"].includes(section.id)
        }
    })

    return (
        <div className="flex flex-col py-2 px-1">
            {filteredSections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id

                return (
                    <button
                        key={section.id}
                        onClick={() => onSelectSection(section.id)}
                        className={cn(
                            "relative flex items-center gap-3 w-full px-4 py-3 mb-1 transition-all duration-200 group rounded-md outline-none",
                            isActive 
                                ? "bg-primary/10 text-primary" 
                                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        )}
                    >
                        {/* Active Indicator Bar */}
                        {isActive && (
                            <motion.div 
                                layoutId="activeNav"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                            />
                        )}

                        <div className={cn(
                            "p-1.5 rounded-sm transition-all",
                            isActive ? "bg-primary/20" : "bg-muted/40 group-hover:bg-muted/80"
                        )}>
                            <Icon className={cn("h-4 w-4", isActive ? "text-primary" : section.iconColor)} />
                        </div>
                        
                        <span className={cn(
                            "text-[11px] font-bold tracking-wider transition-all",
                            isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                        )}>
                            {section.title}
                        </span>

                        {isActive && (
                            <div className="ml-auto">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            </div>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

export { defaultSections }
export type { InspectorSection }

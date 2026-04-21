"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export interface ViolationStat {
    label: string
    value: string | number
    sub?: string
    color?: "blue" | "green" | "red" | "amber" | "purple" | "cyan"
    icon?: any
}

export interface ViolationTab {
    id: string
    label: string
    icon?: any
    content: React.ReactNode
}

interface ViolationPageLayoutProps {
    title: string
    subtitle: string
    accentColor?: "red" | "blue" | "amber" | "violet"
    icon?: any
    stats: ViolationStat[]
    tabs: ViolationTab[]
    actions?: React.ReactNode
}

const colorMap = {
    red: {
        banner: "from-red-950 to-red-900",
        badge: "bg-red-800/60 text-red-100",
        icon: "bg-red-500/20 text-red-300",
        tab: "bg-red-600 text-white",
        tabInactive: "text-red-200 hover:bg-red-800/50",
        nav: "border-red-800/50 bg-red-950/50",
    },
    blue: {
        banner: "from-blue-950 to-blue-900",
        badge: "bg-blue-800/60 text-blue-100",
        icon: "bg-blue-500/20 text-blue-300",
        tab: "bg-blue-600 text-white",
        tabInactive: "text-blue-200 hover:bg-blue-800/50",
        nav: "border-blue-800/50 bg-blue-950/50",
    },
    amber: {
        banner: "from-amber-950 to-amber-900",
        badge: "bg-amber-800/60 text-amber-100",
        icon: "bg-amber-500/20 text-amber-300",
        tab: "bg-amber-600 text-white",
        tabInactive: "text-amber-200 hover:bg-amber-800/50",
        nav: "border-amber-800/50 bg-amber-950/50",
    },
    violet: {
        banner: "from-violet-950 to-violet-900",
        badge: "bg-violet-800/60 text-violet-100",
        icon: "bg-violet-500/20 text-violet-300",
        tab: "bg-violet-600 text-white",
        tabInactive: "text-violet-200 hover:bg-violet-800/50",
        nav: "border-violet-800/50 bg-violet-950/50",
    },
}

const statColorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-900",
    green: "from-green-50 to-green-100 border-green-200 text-green-900",
    red: "from-red-50 to-red-100 border-red-200 text-red-900",
    amber: "from-amber-50 to-amber-100 border-amber-200 text-amber-900",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-900",
    cyan: "from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-900",
}

export function ViolationPageLayout({
    title,
    subtitle,
    accentColor = "red",
    icon: PageIcon = Icons.AlertTriangle,
    stats,
    tabs,
    actions,
}: ViolationPageLayoutProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState(tabs[0]?.id || "")
    const colors = colorMap[accentColor]
    const activeContent = tabs.find(t => t.id === activeTab)?.content

    return (
        <div className="flex flex-col h-full">
            {/* Banner Header */}
            <div className={cn("bg-gradient-to-r text-white p-6 pb-8 shadow-lg", colors.banner)}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-xl border border-white/10", colors.icon)}>
                            <PageIcon className="h-7 w-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={cn("text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full", colors.badge)}>
                                    Реестр нарушений
                                </span>
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-white">{title}</h1>
                            <p className="text-sm text-white/60 mt-0.5">{subtitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {actions}
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => window.print()}
                        >
                            <Icons.FileText className="h-4 w-4" />
                            Печать
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                            <Icons.ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                            Назад
                        </Button>
                    </div>
                </div>

                {/* Stats strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className={cn(
                                "rounded-xl p-3 border bg-gradient-to-br hover:scale-105 transition-all",
                                statColorClasses[stat.color ?? "blue"]
                            )}
                        >
                            <div className="text-xl font-black">{stat.value}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5 opacity-80">{stat.label}</div>
                            {stat.sub && <div className="text-[10px] opacity-60 mt-0.5">{stat.sub}</div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 h-full min-h-0">
                    {/* Left Navigation */}
                    <div className="h-fit">
                        <Card className={cn("border overflow-hidden", colors.nav)}>
                            <CardContent className="p-2">
                                <nav className="space-y-1">
                                    {tabs.map(tab => {
                                        const TabIcon = tab.icon ?? Icons.FileText
                                        const isActive = activeTab === tab.id
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left",
                                                    isActive ? colors.tab : colors.tabInactive
                                                )}
                                            >
                                                <TabIcon className="h-4 w-4 shrink-0" />
                                                <span>{tab.label}</span>
                                            </button>
                                        )
                                    })}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right content */}
                    <Card className="overflow-hidden">
                        <CardContent className="p-4 overflow-auto">
                            {activeContent}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

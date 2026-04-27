"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import type { Inspector } from "@/lib/types/inspector"
import { InspectorPhotoCard } from "./inspector-photo-card"
import { InspectorNavigation, defaultSections } from "./inspector-navigation"
import { InspectorSectionContent } from "./inspector-section-content"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/lib/i18n/hooks"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


interface InspectorCardProps {
    inspector: Inspector
    mode?: "inspector" | "personnel"
    initialSection?: string
    action?: string | null
    planId?: string | null
    onEdit?: () => void
}

export function InspectorCard({
    inspector,
    mode = "personnel",
    initialSection = "personal",
    action,
    planId,
    onEdit
}: InspectorCardProps) {
    const router = useRouter()
    const { t } = useTranslation()
    const [activeSection, setActiveSection] = useState(initialSection)


    const headerTitle = mode === "inspector" ? "КАРТОЧКА СОТРУДНИКА КРУ" : "ЛИЧНАЯ КАРТОЧКА"

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-full bg-slate-50/30"
        >
            {/* Header Area with Breadcrumbs */}
            <div className="p-4 md:p-8 pb-0 space-y-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">{t("common.home")}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/personnel">{t("sidebar.personnel")}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/personnel/personnel">{t("sidebar.cards.personnel")}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{inspector.fullName}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex justify-between items-center border-l-4 border-blue-600 pl-6 py-2 bg-white/40 backdrop-blur-sm rounded-r-2xl">
                    <div className="flex items-center gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-1">
                                <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">{headerTitle}</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent uppercase">
                                {inspector.fullName}
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="px-2 py-0.5 bg-blue-600/10 border border-blue-600/20 rounded-md text-[10px] font-bold text-blue-700 tracking-wider uppercase">
                                    {inspector.inspectorCategory}
                                </span>
                                <span className="text-xs text-slate-500 font-mono font-medium">
                                    ID: {inspector.serviceNumber || inspector.id.toString().padStart(6, '0')}
                                </span>
                            </div>
                        </div>
                        {onEdit && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={onEdit}
                                className="h-9 rounded-xl border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 font-bold gap-2 px-4 shadow-sm"
                            >
                                <Icons.Settings className="h-4 w-4" />
                                {t("common.edit")}
                            </Button>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 px-6">
                            <div className="text-right border-r border-slate-100 pr-6">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Эффективность</p>
                                <div className="flex items-center gap-2 justify-end">
                                    <span className="text-xl font-black text-slate-900">{inspector.kpiScore}%</span>
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ревизий</p>
                                <div className="flex items-center gap-1 justify-end">
                                    <span className="text-xl font-black text-slate-900">{inspector.auditsCompleted || 0}</span>
                                    <Icons.ChevronRight className="h-4 w-4 text-slate-300" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


            {/* Main Content Area */}
            <div className="flex-1 overflow-auto p-8 bg-[#f8f9fa] dark:bg-[#0a0a0b]">
                <div className="max-w-400 mx-auto grid grid-cols-1 lg:grid-cols-[--spacing(90)_1fr] gap-8 h-full">
                    {/* Left Sidebar - Staggered Reveal */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <InspectorPhotoCard inspector={inspector} />

                        <div className="bg-card border-2 border-border/60 rounded-lg overflow-hidden shadow-sm">
                            <div className="p-3 border-b border-border/60 bg-muted/30">
                                <span className="text-tiny font-bold tracking-[0.2em] text-muted-foreground uppercase">Навигация</span>
                            </div>
                            <InspectorNavigation
                                sections={defaultSections}
                                activeSection={activeSection}
                                onSelectSection={setActiveSection}
                                mode={mode}
                            />
                        </div>
                    </motion.div>

                    {/* Right Content Area - Smooth Transitions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="h-full"
                    >
                        <Card className="h-full border-2 border-border/60 shadow-xl rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-0 h-full overflow-auto">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeSection}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="p-6 h-full"
                                    >
                                        <InspectorSectionContent 
                                            section={activeSection} 
                                            inspector={inspector} 
                                            action={action}
                                            planId={planId}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

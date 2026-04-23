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

interface InspectorCardProps {
    inspector: Inspector
    mode?: "inspector" | "personnel"
    initialSection?: string
    action?: string | null
    planId?: string | null
}

export function InspectorCard({
    inspector,
    mode = "personnel",
    initialSection = "personal",
    action,
    planId
}: InspectorCardProps) {
    const router = useRouter()
    const [activeSection, setActiveSection] = useState(initialSection)

    const headerTitle = mode === "inspector" ? "КАРТОЧКА СОТРУДНИКА КРУ" : "ЛИЧНАЯ КАРТОЧКА"

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-full bg-background"
        >
            {/* Header - Refined Military Aesthetic */}
            <div className="border-b-2 border-primary/20 bg-linear-to-r from-card via-card/95 to-muted/30 p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-1">
                                <span className="text-tiny font-mono tracking-[0.3em] text-primary/70 uppercase">{headerTitle}</span>
                            </div>
                            <h1 className="text-4xl font-black text-foreground tracking-tight uppercase">
                                {inspector.fullName}
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-sm text-tiny font-bold text-primary tracking-wider uppercase">
                                    {inspector.inspectorCategory}
                                </span>
                                <span className="text-sm text-muted-foreground font-mono">
                                    ID: {inspector.serviceNumber || inspector.id.toString().padStart(6, '0')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 px-4 border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 font-bold tracking-wide"
                            onClick={() => window.print()}
                        >
                            <Icons.FileText className="h-4 w-4 mr-2 text-primary" />
                            ПЕЧАТЬ
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="h-10 px-4 hover:bg-destructive/10 hover:text-destructive transition-colors duration-300 font-bold"
                        >
                            <Icons.ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                            ВЕРНУТЬСЯ
                        </Button>
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

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

    const headerTitle = mode === "inspector" ? "Карточка сотрудника КРУ" : "Личная карточка"

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b border-border bg-gradient-to-r from-card via-card to-muted/30 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-foreground tracking-tight">{inspector.fullName}</h1>
                            </div>
                            <p className="text-base text-muted-foreground font-medium">
                                {headerTitle} • {inspector.inspectorCategory}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => window.print()}
                        >
                            <Icons.FileText className="h-4 w-4" />
                            Печать
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="border-border hover:bg-accent hover:border-amber-500/50 transition-all duration-200 shadow-sm"
                        >
                            <Icons.ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                            Вернуться
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content Area with Sidebar and Sections */}
            <div className="flex-1 overflow-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 h-full">
                    {/* Left Sidebar */}
                    <div className="space-y-4">
                        {/* Photo Card */}
                        <InspectorPhotoCard inspector={inspector} />

                        {/* Navigation */}
                        <InspectorNavigation
                            sections={defaultSections}
                            activeSection={activeSection}
                            onSelectSection={setActiveSection}
                            mode={mode}
                        />
                    </div>

                    {/* Right Content Area */}
                    <Card className="overflow-hidden">
                        <CardContent className="pt-4 h-full overflow-auto">
                            <InspectorSectionContent 
                                section={activeSection} 
                                inspector={inspector} 
                                action={action}
                                planId={planId}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { ChevronRight, ChevronDown, Shield, Building2, Target, Users } from "lucide-react"
import { initialKruStructure, Department } from "@/lib/data/kru-data"
import { useI18n } from "@/lib/i18n/context"

interface PersonnelStructureSidebarProps {
    activeUnitId: string | null
    onSelectUnit: (unitId: string | null) => void
}

export function PersonnelStructureSidebar({
    activeUnitId,
    onSelectUnit,
}: PersonnelStructureSidebarProps) {
    const { locale } = useI18n()
    const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(["root"]))

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        const newExpanded = new Set(expandedDepts)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedDepts(newExpanded)
    }

    const renderDeptNode = (dept: Department, level: number = 0) => {
        const isExpanded = expandedDepts.has(dept.id)
        const hasChildren = (dept.subDepartments?.length || 0) > 0
        const isActive = activeUnitId === dept.id

        return (
            <div key={dept.id} className="space-y-0.5">
                <div
                    className={cn(
                        "group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200",
                        isActive
                            ? "bg-primary/10 text-primary font-bold shadow-sm"
                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                    style={{ paddingLeft: `${level * 12 + 8}px` }}
                    onClick={() => onSelectUnit(isActive ? null : dept.id)}
                >
                    {hasChildren ? (
                        <button
                            onClick={(e) => toggleExpand(dept.id, e)}
                            className="p-0.5 hover:bg-muted rounded transition-colors"
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                                <ChevronRight className="h-3.5 w-3.5" />
                            )}
                        </button>
                    ) : (
                        <div className="w-4.5" /> // Spacer for no-children nodes
                    )}

                    <div className={cn(
                        "p-1 rounded-md transition-colors",
                        isActive ? "bg-primary/20" : "bg-muted"
                    )}>
                        {level === 0 ? (
                            <Shield className="h-3 w-3" />
                        ) : (
                            <Building2 className="h-3 w-3" />
                        )}
                    </div>

                    <span className="text-[13px] truncate flex-1" title={dept.name}>
                        {dept.name}
                    </span>

                    {isActive && (
                        <div className="h-1 w-1 rounded-full bg-primary" />
                    )}
                </div>

                {hasChildren && isExpanded && (
                    <div className="mt-0.5">
                        {dept.subDepartments!.map((child) => renderDeptNode(child, level + 1))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <Card className="h-full border-primary/10 shadow-sm flex flex-col bg-card/50 backdrop-blur-sm">
            <CardHeader className="p-4 pb-2 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-inner">
                        <Target className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm font-bold tracking-tight uppercase">
                        Структура КРУ
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-2 flex-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-1">
                    {/* All Personnel Option */}
                    <div
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 mb-2",
                            !activeUnitId
                                ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-[1.02]"
                                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground border border-transparent"
                        )}
                        onClick={() => onSelectUnit(null)}
                    >
                        <Users className="h-4 w-4" />
                        <span className="text-[13px] font-semibold">Все подразделения</span>
                    </div>

                    <div className="h-px bg-border/50 my-2 mx-1" />

                    {renderDeptNode(initialKruStructure)}
                </div>
            </CardContent>
        </Card>
    )
}

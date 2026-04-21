"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface NavItem {
    id: string
    title: string
    icon: React.ComponentType<{ className?: string }>
}

interface ReferenceVerticalNavProps {
    items: NavItem[]
    activeId: string
    onChange: (id: string) => void
}

export function ReferenceVerticalNav({ items, activeId, onChange }: ReferenceVerticalNavProps) {
    return (
        <div className="flex flex-col gap-1 w-64 flex-shrink-0 bg-card/30 p-2 rounded-xl border border-border/50 backdrop-blur-sm h-fit sticky top-24">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Подразделы
            </div>
            {items.map((item) => {
                const isActive = activeId === item.id
                const Icon = item.icon

                return (
                    <button
                        key={item.id}
                        onClick={() => onChange(item.id)}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                    >
                        <Icon className={cn(
                            "h-4 w-4 transition-transform group-hover:scale-110",
                            isActive ? "text-primary-foreground" : "text-primary"
                        )} />
                        <span className="leading-tight">{item.title}</span>
                        {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                        )}
                    </button>
                )
            })}
        </div>
    )
}

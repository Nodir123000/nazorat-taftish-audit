"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

interface Section {
  id: string
  title: string
  icon?: React.ComponentType<{ className?: string }>
}

interface SectionSidebarProps {
  sections: Section[]
  activeSection: string
  onSectionChange: (sectionId: string) => void
}

export function SectionSidebar({ sections, activeSection, onSectionChange }: SectionSidebarProps) {
  return (
    <div className="w-64 border-r bg-card p-4 space-y-2">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Разделы</h3>
      </div>
      {sections.map((section) => {
        const isActive = activeSection === section.id
        const Icon = section.icon

        return (
          <Button
            key={section.id}
            variant={isActive ? "default" : "ghost"}
            className={cn("w-full justify-start gap-3", isActive && "shadow-sm")}
            onClick={() => onSectionChange(section.id)}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span className="flex-1 text-left">{section.title}</span>
            {isActive && <Icons.Check className="h-4 w-4" />}
          </Button>
        )
      })}
    </div>
  )
}

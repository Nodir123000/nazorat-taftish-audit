"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface Section {
  id: string
  title: string
  icon?: React.ComponentType<{ className?: string }>
}

interface SectionsTabsProps {
  submoduleTitle: string
  sections: Section[]
  activeSection: string
  onSectionChange: (sectionId: string) => void
  pageId: string
}

export function SectionsTabs({ submoduleTitle, sections, activeSection, onSectionChange, pageId }: SectionsTabsProps) {
  return (
    <div className="border-b bg-card sticky top-0 z-10 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex gap-2 pb-2">
          {sections.map((section) => {
            const isActive = activeSection === section.id
            const Icon = section.icon

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 px-5 py-3.5 rounded-lg transition-all duration-200 font-medium text-sm relative overflow-hidden group",
                  isActive
                    ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                    : "bg-gradient-to-br from-muted/50 to-muted/30 text-muted-foreground hover:from-primary/10 hover:to-primary/5 hover:text-foreground hover:shadow-md border border-border/50 hover:border-primary/30",
                )}
              >
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                <div className="relative flex items-center justify-center gap-2">
                  {Icon && (
                    <Icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                        isActive ? "scale-110" : "group-hover:scale-105",
                      )}
                    />
                  )}
                  <span className="text-center text-wrap text-xs">{section.title}</span>
                  {isActive && (
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse flex-shrink-0 ml-1" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

"use client"

import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface QuickFilter {
  id: string
  label: string
  value: any
  count?: number
}

interface QuickFilterChipsProps {
  filters: QuickFilter[]
  activeFilters: string[]
  onFilterToggle: (filterId: string) => void
  className?: string
}

export function QuickFilterChips({ filters, activeFilters, onFilterToggle, className }: QuickFilterChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter.id)
        return (
          <Badge
            key={filter.id}
            variant={isActive ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-all hover:scale-105",
              isActive ? "shadow-sm" : "hover:border-primary",
            )}
            onClick={() => onFilterToggle(filter.id)}
          >
            {filter.label}
            {filter.count !== undefined && <span className="ml-1">({filter.count})</span>}
            {isActive && <Icons.X className="ml-1 h-3 w-3" />}
          </Badge>
        )
      })}
    </div>
  )
}

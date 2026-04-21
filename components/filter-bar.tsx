"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

export interface FilterOption {
  label: string
  value: string
}

export interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
  placeholder?: string
}

interface FilterBarProps {
  filters: FilterConfig[]
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  onReset: () => void
  className?: string
}

export function FilterBar({ filters, values, onChange, onReset, className }: FilterBarProps) {
  const hasActiveFilters = Object.values(values).some((v) => v !== "")

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={values[filter.key] || "all"}
          onValueChange={(value) => onChange(filter.key, value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={filter.placeholder || filter.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-9">
          <Icons.X className="mr-2 h-4 w-4" />
          Сбросить
        </Button>
      )}
    </div>
  )
}

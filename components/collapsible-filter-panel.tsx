"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface FilterPreset {
  id: string
  label: string
  filters: Record<string, any>
}

interface CollapsibleFilterPanelProps {
  children: React.ReactNode
  presets?: FilterPreset[]
  activeFiltersCount?: number
  onPresetSelect?: (preset: FilterPreset) => void
  onReset?: () => void
  defaultCollapsed?: boolean
}

export function CollapsibleFilterPanel({
  children,
  presets,
  activeFiltersCount = 0,
  onPresetSelect,
  onReset,
  defaultCollapsed = false,
}: CollapsibleFilterPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
              {isCollapsed ? <Icons.ChevronRight className="h-4 w-4" /> : <Icons.ChevronDown className="h-4 w-4" />}
            </Button>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Icons.Filter className="h-4 w-4" />
                Фильтры
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {isCollapsed ? "Нажмите для раскрытия" : "Настройте параметры фильтрации"}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {presets && presets.length > 0 && !isCollapsed && (
              <div className="flex gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.id}
                    variant="outline"
                    size="sm"
                    onClick={() => onPresetSelect?.(preset)}
                    className="h-8"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            )}
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={onReset} className="h-8 bg-transparent">
                Сбросить
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn("transition-all duration-300", isCollapsed && "hidden")}>{children}</CardContent>
    </Card>
  )
}

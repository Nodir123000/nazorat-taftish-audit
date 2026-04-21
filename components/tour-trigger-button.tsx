"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HelpCircle, Play, RotateCcw, Sparkles } from "lucide-react"
import { useTourStore } from "@/lib/stores/tour-store"
import { tourModules } from "@/lib/tour-config"

export function TourTriggerButton() {
  const { startTour, resetAllTours, hasCompletedWelcomeTour } = useTourStore()

  const toursByCategory = tourModules.reduce(
    (acc, module) => {
      const category = module.category || "Другое"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(module)
      return acc
    },
    {} as Record<string, typeof tourModules>,
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" data-tour="help-button">
          <HelpCircle className="h-5 w-5" />
          {!hasCompletedWelcomeTour && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
          <span className="sr-only">Помощь и обучение</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 max-h-[600px] overflow-y-auto">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Обучение системе
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => startTour("welcome")}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800 mb-2"
        >
          <Play className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
          <div className="flex flex-col">
            <span className="font-semibold text-blue-900 dark:text-blue-100">Приветственный тур</span>
            <span className="text-xs text-blue-700 dark:text-blue-300">Обзор основных возможностей системы</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {Object.entries(toursByCategory).map(([category, modules]) => (
          <div key={category}>
            <DropdownMenuLabel className="text-xs font-semibold text-primary">{category}</DropdownMenuLabel>
            {modules.map((module) => (
              <DropdownMenuItem key={module.id} onClick={() => startTour(module.id)}>
                <Play className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-medium">{module.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{module.description}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ))}

        <DropdownMenuItem onClick={resetAllTours} className="text-destructive">
          <RotateCcw className="mr-2 h-4 w-4" />
          Сбросить все туры
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

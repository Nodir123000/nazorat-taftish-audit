"use client"

import type React from "react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

interface HelpTooltipProps {
  content: string
  children?: React.ReactNode
}

export function HelpTooltip({ content, children }: HelpTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          {children || (
            <button className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Помощь</span>
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

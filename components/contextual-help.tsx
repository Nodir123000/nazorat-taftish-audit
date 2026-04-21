"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HelpCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ContextualHelpProps {
  title: string
  content: string
  helpArticleId?: string
  className?: string
}

export function ContextualHelp({ title, content, helpArticleId, className }: ContextualHelpProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-5 w-5 rounded-full text-muted-foreground hover:text-foreground ${className}`}
        >
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Помощь: {title}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
          </div>
          {helpArticleId && (
            <Link href={`/help?article=${helpArticleId}`}>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <ExternalLink className="mr-2 h-3 w-3" />
                Подробнее в справке
              </Button>
            </Link>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

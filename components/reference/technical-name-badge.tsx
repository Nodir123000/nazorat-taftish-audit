"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface TechnicalNameBadgeProps {
    name: string
    className?: string
}

export function TechnicalNameBadge({ name, className }: TechnicalNameBadgeProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(name)
        setCopied(true)
        toast.success("Техническое название скопировано")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={cn("flex items-center gap-1", className)}>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsVisible(!isVisible)}
                title={isVisible ? "Скрыть техническое название" : "Показать техническое название"}
            >
                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>

            {isVisible && (
                <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                    <code className="px-2 py-1.5 rounded-lg bg-muted/50 text-[11px] font-mono font-bold text-primary border border-primary/10 shadow-inner">
                        {name}
                    </code>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95"
                        onClick={handleCopy}
                        title="Копировать название"
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
            )}
        </div>
    )
}

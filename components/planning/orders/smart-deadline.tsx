"use client"

import * as React from "react"
import { differenceInDays, parse, isValid, isPast, isToday } from "date-fns"
import { ru } from "date-fns/locale"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface SmartDeadlineProps {
    period: string // Format: "DD.MM.YYYY - DD.MM.YYYY"
    status: string
}

export function SmartDeadline({ period, status }: SmartDeadlineProps) {
    const [startDateStr, endDateStr] = period.split(" - ").map((s) => s.trim())

    const startDate = parse(startDateStr, "dd.MM.yyyy", new Date())
    const endDate = parse(endDateStr, "dd.MM.yyyy", new Date())

    if (!isValid(startDate) || !isValid(endDate)) {
        return <span className="text-muted-foreground text-sm">{period}</span>
    }

    const totalDays = differenceInDays(endDate, startDate)
    const daysPassed = differenceInDays(new Date(), startDate)
    const daysLeft = differenceInDays(endDate, new Date())

    // Calculate progress percentage, capped between 0 and 100
    let progress = 0
    if (totalDays > 0) {
        progress = Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100)
    } else if (isPast(startDate)) {
        progress = 100
    }

    const isOverdue = isPast(endDate) && !isToday(endDate) && status !== "Завершён" && status !== "Отменён"
    const isActive = status === "Действует"

    if (status === "Завершён" || status === "Отменён") {
        return <span className="text-muted-foreground text-sm">{period}</span>
    }

    if (isOverdue) {
        return (
            <div className="flex items-center gap-2 text-destructive font-medium">
                <Icons.AlertCircle className="h-4 w-4" />
                <span className="text-sm">Просрочено ({Math.abs(daysLeft)} дн.)</span>
            </div>
        )
    }

    if (isActive) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="w-full max-w-[140px] space-y-1 cursor-help">
                            <div className="flex justify-between text-xs mb-1">
                                <span className={daysLeft <= 3 ? "text-amber-600 font-bold" : "text-muted-foreground"}>
                                    {daysLeft > 0 ? `Осталось ${daysLeft} дн.` : "Сегодня срок"}
                                </span>
                            </div>
                            <Progress value={progress} className={cn("h-2", daysLeft <= 3 ? "bg-amber-200 [&>div]:bg-amber-500" : "")} />
                            <div className="text-[10px] text-muted-foreground text-right">{period}</div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Период: {period}</p>
                        <p>Прошло: {daysPassed} дн.</p>
                        <p>Всего: {totalDays} дн.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    // Future or Planning
    return <span className="text-sm">{period}</span>
}

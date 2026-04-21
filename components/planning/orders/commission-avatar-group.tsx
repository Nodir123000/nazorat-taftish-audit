"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getRoleVariant } from "@/lib/types/orders"
import type { CommissionMember } from "@/lib/types/orders"
import { Badge } from "@/components/ui/badge"
import { militaryPersonnel } from "@/components/reference/personnel-data"
import { physicalPersons } from "@/components/reference/physical-persons-data"
import { cn } from "@/lib/utils"

interface CommissionAvatarGroupProps {
    members: CommissionMember[]
    maxVisible?: number
}

const getPersonnelInitials = (id: string) => {
    const mp = militaryPersonnel.find(p => p.id.toString() === id);
    if (!mp) return "??";
    const person = physicalPersons.find(p => p.id === mp.personId);
    return person ? `${person.lastName.charAt(0)}${person.firstName.charAt(0)}` : "??";
};

const getPersonnelFullName = (id: string) => {
    const mp = militaryPersonnel.find(p => p.id.toString() === id);
    if (!mp) return id;
    const person = physicalPersons.find(p => p.id === mp.personId);
    return person ? `${person.lastName} ${person.firstName} ${person.middleName || ''}` : id;
};

export function CommissionAvatarGroup({ members, maxVisible = 3 }: CommissionAvatarGroupProps) {
    const visibleMembers = members.map(m => ({ ...m, isLead: m.role === "Главный ревизор" })).sort((a, b) => (a.isLead === b.isLead ? 0 : a.isLead ? -1 : 1)).slice(0, maxVisible)
    const remainingCount = Math.max(members.length - maxVisible, 0)

    // Sort members for tooltip: Lead first
    const sortedMembers = [...members].sort((a, b) => {
        if (a.role === "Главный ревизор") return -1;
        if (b.role === "Главный ревизор") return 1;
        return 0;
    });

    if (members.length === 0) {
        return <span className="text-muted-foreground text-xs">—</span>
    }

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex -space-x-2 hover:space-x-1 transition-all duration-200 cursor-pointer p-1 rounded-md hover:bg-muted/50">
                        {visibleMembers.map((member, i) => (
                            <Avatar key={member.id} className={cn("h-8 w-8 border-2 border-background", member.role === "Главный ревизор" ? "ring-2 ring-blue-400 z-10" : "z-0")}>
                                {/* Placeholder for image URL if available in future */}
                                <AvatarImage src="" />
                                <AvatarFallback className={cn("text-xs", member.role === "Главный ревизор" ? "bg-blue-100 text-blue-700 font-bold" : "bg-slate-100 text-slate-700")}>
                                    {getPersonnelInitials(member.name)}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                        {remainingCount > 0 && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium z-0">
                                +{remainingCount}
                            </div>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent className="p-0 overflow-hidden border shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                    <div className="bg-popover p-3 min-w-[280px]">
                        <div className="text-sm font-semibold mb-2 pb-2 border-b">
                            Назначенные ревизоры ({members.length} чел.)
                        </div>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                            {sortedMembers.map((member) => (
                                <div key={member.id} className="flex items-start gap-3 text-sm">
                                    <Avatar className="h-8 w-8 shrink-0">
                                        <AvatarFallback className={cn("text-xs", member.role === "Главный ревизор" ? "bg-blue-100 text-blue-700" : "")}>
                                            {getPersonnelInitials(member.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-0.5">
                                        <p className="font-medium leading-none">{getPersonnelFullName(member.name)}</p>
                                        <div className="text-xs text-muted-foreground">{member.position}</div>
                                        <div className="flex pt-1"><Badge variant={getRoleVariant(member.role)} className="px-1.5 py-0 text-[10px]">{member.role}</Badge></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

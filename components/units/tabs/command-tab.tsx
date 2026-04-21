"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

export interface Commander {
    id: string
    role: string
    name: string
    rank: string
    image?: string
    since: string
    phone: string
}

const COMMANDERS: Commander[] = [
    {
        id: "cmdr-1",
        role: "Командир части",
        name: "Бердиев Бахром Хакимович",
        rank: "Полковник",
        image: "/avatars/commander.jpg",
        since: "2021",
        phone: "+998 90 123-45-67"
    },
    {
        id: "cmdr-2",
        role: "Начальник штаба",
        name: "Рахимов Алишер Саидович",
        rank: "Подполковник",
        image: "/avatars/staff-chief.jpg",
        since: "2022",
        phone: "+998 90 234-56-78"
    },
    {
        id: "cmdr-3",
        role: "Зам. по боевой подготовке",
        name: "Каримов Достонбек Алиевич",
        rank: "Майор",
        image: "/avatars/training-chief.jpg",
        since: "2023",
        phone: "+998 90 345-67-89"
    }
]

function CommandCard({ commander }: { commander: Commander }) {
    const initials =
        commander.name
            ?.split(" ")
            .filter(Boolean)
            .map(n => n[0])
            .join("")
            .slice(0, 2) ?? ""

    return (
        <Card className="overflow-hidden border-slate-200 hover:border-blue-300 transition-colors group">
            <div className="h-2 bg-blue-600 w-full" />
            <CardHeader className="flex flex-col items-center pb-2">
                <Avatar className="w-24 h-24 border-4 border-slate-50 shadow-sm group-hover:scale-105 transition-transform">
                    <AvatarImage src={commander.image} alt={commander.name} />
                    <AvatarFallback className="text-xl font-bold bg-slate-100 text-slate-400">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center mt-4">
                    <Badge variant="outline" className="mb-2 text-blue-700 bg-blue-50 border-blue-100 uppercase tracking-wider text-[10px]">
                        {commander.role}
                    </Badge>
                    <CardTitle className="text-lg">{commander.name}</CardTitle>
                    <p className="text-muted-foreground font-medium">{commander.rank}</p>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
                <div className="flex items-center justify-between text-sm py-2 border-t">
                    <span className="text-muted-foreground flex items-center gap-1">
                        <Icons.Calendar className="w-3.5 h-3.5" />
                        В должности с:
                    </span>
                    <span className="font-semibold text-slate-700">{commander.since} г.</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 border-t">
                    <span className="text-muted-foreground flex items-center gap-1">
                        <Icons.Phone className="w-3.5 h-3.5" />
                        Телефон:
                    </span>
                    <a
                        href={`tel:${commander.phone.replace(/\s/g, "")}`}
                        className="font-medium text-blue-600 hover:underline cursor-pointer"
                    >
                        {commander.phone}
                    </a>
                </div>
                <div className="pt-2">
                    <button type="button" className="w-full py-2 bg-slate-50 hover:bg-slate-100 rounded text-xs font-bold text-slate-600 border border-slate-200 transition-colors uppercase tracking-tight">
                        Личное дело
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}

export function CommandTab({ commanders = COMMANDERS }: { commanders?: Commander[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commanders.map((c) => (
                <CommandCard key={c.id} commander={c} />
            ))}
        </div>
    )
}

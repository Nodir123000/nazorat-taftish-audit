"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type ColorScheme =
    | "blue"
    | "green"
    | "orange"
    | "purple"
    | "emerald"
    | "indigo"
    | "rose"
    | "amber"
    | "cyan"
    | "teal"
    | "violet"
    | "pink"
    | "lime"
    | "red"
    | "gray"

interface StatsCardProps {
    title: string
    value: number | string
    subtitle: string
    icon: React.ComponentType<{ className?: string }>
    colorScheme: ColorScheme
}

const colorClasses: Record<ColorScheme, { border: string; bg: string; text: string; iconBg: string; iconRing: string; iconText: string; subtitleText: string }> = {
    blue: {
        border: "border-blue-200",
        bg: "from-blue-50 to-blue-100",
        text: "text-blue-900",
        iconBg: "bg-blue-200",
        iconRing: "ring-blue-300",
        iconText: "text-blue-700",
        subtitleText: "text-blue-700",
    },
    green: {
        border: "border-green-200",
        bg: "from-green-50 to-green-100",
        text: "text-green-900",
        iconBg: "bg-green-200",
        iconRing: "ring-green-300",
        iconText: "text-green-700",
        subtitleText: "text-green-700",
    },
    orange: {
        border: "border-orange-200",
        bg: "from-orange-50 to-orange-100",
        text: "text-orange-900",
        iconBg: "bg-orange-200",
        iconRing: "ring-orange-300",
        iconText: "text-orange-700",
        subtitleText: "text-orange-700",
    },
    purple: {
        border: "border-purple-200",
        bg: "from-purple-50 to-purple-100",
        text: "text-purple-900",
        iconBg: "bg-purple-200",
        iconRing: "ring-purple-300",
        iconText: "text-purple-700",
        subtitleText: "text-purple-700",
    },
    emerald: {
        border: "border-emerald-200",
        bg: "from-emerald-50 to-emerald-100",
        text: "text-emerald-900",
        iconBg: "bg-emerald-200",
        iconRing: "ring-emerald-300",
        iconText: "text-emerald-700",
        subtitleText: "text-emerald-700",
    },
    indigo: {
        border: "border-indigo-200",
        bg: "from-indigo-50 to-indigo-100",
        text: "text-indigo-900",
        iconBg: "bg-indigo-200",
        iconRing: "ring-indigo-300",
        iconText: "text-indigo-700",
        subtitleText: "text-indigo-700",
    },
    rose: {
        border: "border-rose-200",
        bg: "from-rose-50 to-rose-100",
        text: "text-rose-900",
        iconBg: "bg-rose-200",
        iconRing: "ring-rose-300",
        iconText: "text-rose-700",
        subtitleText: "text-rose-700",
    },
    amber: {
        border: "border-amber-200",
        bg: "from-amber-50 to-amber-100",
        text: "text-amber-900",
        iconBg: "bg-amber-200",
        iconRing: "ring-amber-300",
        iconText: "text-amber-700",
        subtitleText: "text-amber-700",
    },
    cyan: {
        border: "border-cyan-200",
        bg: "from-cyan-50 to-cyan-100",
        text: "text-cyan-900",
        iconBg: "bg-cyan-200",
        iconRing: "ring-cyan-300",
        iconText: "text-cyan-700",
        subtitleText: "text-cyan-700",
    },
    teal: {
        border: "border-teal-200",
        bg: "from-teal-50 to-teal-100",
        text: "text-teal-900",
        iconBg: "bg-teal-200",
        iconRing: "ring-teal-300",
        iconText: "text-teal-700",
        subtitleText: "text-teal-700",
    },
    violet: {
        border: "border-violet-200",
        bg: "from-violet-50 to-violet-100",
        text: "text-violet-900",
        iconBg: "bg-violet-200",
        iconRing: "ring-violet-300",
        iconText: "text-violet-700",
        subtitleText: "text-violet-700",
    },
    pink: {
        border: "border-pink-200",
        bg: "from-pink-50 to-pink-100",
        text: "text-pink-900",
        iconBg: "bg-pink-200",
        iconRing: "ring-pink-300",
        iconText: "text-pink-700",
        subtitleText: "text-pink-700",
    },
    lime: {
        border: "border-lime-200",
        bg: "from-lime-50 to-lime-100",
        text: "text-lime-900",
        iconBg: "bg-lime-200",
        iconRing: "ring-lime-300",
        iconText: "text-lime-700",
        subtitleText: "text-lime-700",
    },
    red: {
        border: "border-red-200",
        bg: "from-red-50 to-red-100",
        text: "text-red-900",
        iconBg: "bg-red-200",
        iconRing: "ring-red-300",
        iconText: "text-red-700",
        subtitleText: "text-red-700",
    },
    gray: {
        border: "border-gray-200",
        bg: "from-gray-50 to-gray-100",
        text: "text-gray-900",
        iconBg: "bg-gray-200",
        iconRing: "ring-gray-300",
        iconText: "text-gray-700",
        subtitleText: "text-gray-700",
    },
}

export function StatsCard({ title, value, subtitle, icon: Icon, colorScheme }: StatsCardProps) {
    const colors = colorClasses[colorScheme]

    return (
        <Card
            className={`relative overflow-hidden border-2 ${colors.border} bg-gradient-to-br ${colors.bg} hover:shadow-lg transition-all hover:scale-105`}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${colors.text}`}>{title}</CardTitle>
                <div className={`rounded-full ${colors.iconBg} p-2 ring-2 ${colors.iconRing}`}>
                    <Icon className={`h-5 w-5 ${colors.iconText}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className={`text-3xl font-bold ${colors.text}`}>{value}</div>
                <p className={`text-xs ${colors.subtitleText} font-medium`}>{subtitle}</p>
            </CardContent>
        </Card>
    )
}

interface StatsCardsGridProps {
    cards: StatsCardProps[]
}

export function StatsCardsGrid({ cards = [] }: StatsCardsGridProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {cards.map((card, index) => (
                <StatsCard key={index} {...card} />
            ))}
        </div>
    )
}

import React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ColorConfig {
    bg: string
    border: string
    title: string
    value: string
    subtitle: string
    icon: string
    iconBg: string
    iconRing: string
}

const colorClasses: Record<string, ColorConfig> = {
    blue: {
        bg: "from-blue-50 to-blue-100",
        border: "border-blue-200",
        title: "text-blue-700",
        value: "text-blue-900",
        subtitle: "text-blue-600",
        icon: "text-blue-600",
        iconBg: "bg-blue-100",
        iconRing: "ring-blue-200",
    },
    green: {
        bg: "from-green-50 to-green-100",
        border: "border-green-200",
        title: "text-green-700",
        value: "text-green-900",
        subtitle: "text-green-600",
        icon: "text-green-600",
        iconBg: "bg-green-100",
        iconRing: "ring-green-200",
    },
    orange: {
        bg: "from-orange-50 to-orange-100",
        border: "border-orange-200",
        title: "text-orange-700",
        value: "text-orange-900",
        subtitle: "text-orange-600",
        icon: "text-orange-600",
        iconBg: "bg-orange-100",
        iconRing: "ring-orange-200",
    },
    purple: {
        bg: "from-purple-50 to-purple-100",
        border: "border-purple-200",
        title: "text-purple-700",
        value: "text-purple-900",
        subtitle: "text-purple-600",
        icon: "text-purple-600",
        iconBg: "bg-purple-100",
        iconRing: "ring-purple-200",
    },
    gray: {
        bg: "from-gray-50 to-gray-100",
        border: "border-gray-200",
        title: "text-gray-700",
        value: "text-gray-900",
        subtitle: "text-gray-600",
        icon: "text-gray-600",
        iconBg: "bg-gray-100",
        iconRing: "ring-gray-200",
    },
    red: {
        bg: "from-red-50 to-red-100",
        border: "border-red-200",
        title: "text-red-700",
        value: "text-red-900",
        subtitle: "text-red-600",
        icon: "text-red-600",
        iconBg: "bg-red-100",
        iconRing: "ring-red-200",
    },
    yellow: {
        bg: "from-yellow-50 to-yellow-100",
        border: "border-yellow-200",
        title: "text-yellow-700",
        value: "text-yellow-900",
        subtitle: "text-yellow-600",
        icon: "text-yellow-600",
        iconBg: "bg-yellow-100",
        iconRing: "ring-yellow-200",
    },
    teal: {
        bg: "from-teal-50 to-teal-100",
        border: "border-teal-200",
        title: "text-teal-700",
        value: "text-teal-900",
        subtitle: "text-teal-600",
        icon: "text-teal-600",
        iconBg: "bg-teal-100",
        iconRing: "ring-teal-200",
    },
    indigo: {
        bg: "from-indigo-50 to-indigo-100",
        border: "border-indigo-200",
        title: "text-indigo-700",
        value: "text-indigo-900",
        subtitle: "text-indigo-600",
        icon: "text-indigo-600",
        iconBg: "bg-indigo-100",
        iconRing: "ring-indigo-200",
    },
    amber: {
        bg: "from-amber-50 to-amber-100",
        border: "border-amber-200",
        title: "text-amber-700",
        value: "text-amber-900",
        subtitle: "text-amber-600",
        icon: "text-amber-600",
        iconBg: "bg-amber-100",
        iconRing: "ring-amber-200",
    },
    rose: {
        bg: "from-rose-50 to-rose-100",
        border: "border-rose-200",
        title: "text-rose-700",
        value: "text-rose-900",
        subtitle: "text-rose-600",
        icon: "text-rose-600",
        iconBg: "bg-rose-100",
        iconRing: "ring-rose-200",
    },
}

interface StatsCardProps {
    title: string
    value: number | string
    subtitle: string
    icon: any
    color?: string
    onClick?: () => void
    isActive?: boolean
}

export const StatsCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "blue",
    onClick,
    isActive = false,
}: StatsCardProps) => {
    const classes = colorClasses[color] || colorClasses.blue

    return (
        <Card
            onClick={onClick}
            className={cn(
                `relative overflow-hidden bg-gradient-to-br ${classes.bg} ${classes.border} transition-all duration-300`,
                onClick && "cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-95",
                isActive ? `ring-2 ${classes.iconRing} shadow-md border-opacity-100` : "border-opacity-50"
            )}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${classes.title}`}>{title}</CardTitle>
                <div className={`rounded-full ${classes.iconBg} p-2 ring-2 ${classes.iconRing}`}>
                    <Icon className={`h-4 w-4 ${classes.icon}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className={`text-3xl font-bold ${classes.value}`}>{value}</div>
                <p className={`text-xs font-medium ${classes.subtitle}`}>{subtitle}</p>
            </CardContent>
        </Card>
    )
}

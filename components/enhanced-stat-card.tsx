"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface EnhancedStatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: {
    value: number
    isPositive: boolean
  }
  sparklineData?: number[]
  color?: "blue" | "green" | "purple" | "orange" | "red" | "cyan" | "indigo"
  href?: string
}

export function EnhancedStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  sparklineData,
  color = "blue",
  href,
}: EnhancedStatCardProps) {
  const colorClasses = {
    blue: "border-l-blue-600 hover:border-l-blue-700 bg-gradient-to-br from-blue-50 via-blue-50/30 to-transparent dark:from-blue-950/30 dark:to-transparent",
    green:
      "border-l-green-600 hover:border-l-green-700 bg-gradient-to-br from-green-50 via-green-50/30 to-transparent dark:from-green-950/30 dark:to-transparent",
    purple:
      "border-l-purple-600 hover:border-l-purple-700 bg-gradient-to-br from-purple-50 via-purple-50/30 to-transparent dark:from-purple-950/30 dark:to-transparent",
    orange:
      "border-l-orange-600 hover:border-l-orange-700 bg-gradient-to-br from-orange-50 via-orange-50/30 to-transparent dark:from-orange-950/30 dark:to-transparent",
    red: "border-l-red-600 hover:border-l-red-700 bg-gradient-to-br from-red-50 via-red-50/30 to-transparent dark:from-red-950/30 dark:to-transparent",
    cyan: "border-l-cyan-600 hover:border-l-cyan-700 bg-gradient-to-br from-cyan-50 via-cyan-50/30 to-transparent dark:from-cyan-950/30 dark:to-transparent",
    indigo:
      "border-l-indigo-600 hover:border-l-indigo-700 bg-gradient-to-br from-indigo-50 via-indigo-50/30 to-transparent dark:from-indigo-950/30 dark:to-transparent",
  }

  const iconColorClasses = {
    blue: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 ring-1 ring-blue-500/20",
    green: "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400 ring-1 ring-green-500/20",
    purple: "bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 ring-1 ring-purple-500/20",
    orange: "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 ring-1 ring-orange-500/20",
    red: "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400 ring-1 ring-red-500/20",
    cyan: "bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400 ring-1 ring-cyan-500/20",
    indigo: "bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 ring-1 ring-indigo-500/20",
  }

  const content = (
    <Card
      className={cn(
        "border-l-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        colorClasses[color],
        href && "cursor-pointer",
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-semibold flex items-center gap-1",
                    trend.isPositive ? "text-green-600" : "text-red-600",
                  )}
                >
                  {trend.isPositive ? (
                    <Icons.TrendingUp className="h-3 w-3" />
                  ) : (
                    <Icons.TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
          </div>
          <div className={cn("p-3 rounded-lg transition-transform hover:scale-110", iconColorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-4">
            <Sparkline data={sparklineData} color={color} />
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  const colorMap = {
    blue: "#2563eb",
    green: "#16a34a",
    purple: "#9333ea",
    orange: "#ea580c",
    red: "#dc2626",
    cyan: "#0891b2",
    indigo: "#4f46e5",
  }

  return (
    <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={colorMap[color as keyof typeof colorMap]}
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
        className="drop-shadow-sm"
      />
    </svg>
  )
}

import type React from "react"
import Link from "next/link"

interface StatsCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: React.ComponentType<any>
  color: "blue" | "green" | "purple" | "yellow"
  href?: string
  trend?: {
    value: number
    label: string
  }
}

export function StatsCard({ title, value, subtitle, icon: Icon, color, href, trend }: StatsCardProps) {
  const colorClasses = {
    blue: "stat-card-blue text-primary",
    green: "stat-card-green text-secondary",
    purple: "stat-card-purple text-accent",
    yellow: "stat-card-yellow text-warning",
  }

  const content = (
    <div className={`stat-card ${colorClasses[color]} cursor-pointer`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold tracking-tight">{value}</p>
            {trend && (
              <span className="text-xs font-medium text-muted-foreground">
                {trend.value > 0 ? "+" : ""}
                {trend.value} {trend.label}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground mt-1 font-medium">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-lg bg-current/10">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

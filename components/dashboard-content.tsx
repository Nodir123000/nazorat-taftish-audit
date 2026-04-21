"use client"

import { useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { getDashboardStats, getRecentActivity } from "@/lib/actions/dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { PageHelpBanner } from "@/components/page-help-banner"
import { QuickHelpCard } from "@/components/quick-help-card"
import { Calendar, AlertTriangle, BarChart3 } from "lucide-react"
import { useTranslation } from "@/lib/i18n/hooks"
import { getLocalizedValue } from "@/lib/i18n/localization"

interface DashboardContentProps {
  user: User
}

interface DashboardStats {
  audits: {
    total: number
    inProgress: number
    completed: number
    planned: number
    planCompletion: number
  }
  violations: {
    total: number
    byStatus: Record<string, number>
    bySeverity: Record<string, number>
    totalAmount: number
  }
  decisions: {
    total: number
    overdue: number
    inProgress: number
    completed: number
  }
}

interface Activity {
  id: string
  type: string
  title: string
  description: string | { ru?: string; uz?: string; uzk?: string; [key: string]: any }
  timestamp: string
}

function getActivityIcon(type: string) {
  switch (type) {
    case "audit":
      return <Icons.Clipboard className="h-5 w-5 text-primary" />
    case "violation":
      return <Icons.Alert className="h-5 w-5 text-destructive" />
    case "decision":
      return <Icons.Check className="h-5 w-5 text-accent" />
    default:
      return <Icons.Info className="h-5 w-5 text-muted-foreground" />
  }
}

function formatTimestamp(timestamp: string, t: (key: string) => string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) {
    return `${diffMins} ${t("dashboard.time.minAgo")}`
  } else if (diffHours < 24) {
    return `${diffHours} ${t("dashboard.time.hoursAgo")}`
  } else if (diffDays < 7) {
    return `${diffDays} ${t("dashboard.time.daysAgo")}`
  } else {
    return date.toLocaleDateString("ru-RU")
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount)
}


export function DashboardContent({ user }: DashboardContentProps) {
  const { t, locale } = useTranslation()

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setHasError(false)
        const [statsData, activityData] = await Promise.all([
          getDashboardStats(),
          getRecentActivity(),
        ])
        setStats(statsData)
        setActivity(activityData)
      } catch (error) {
        console.error("[v0] Error loading dashboard data:", error)
        setHasError(true)
        // Set default stats on error
        setStats({
          audits: { total: 0, inProgress: 0, completed: 0, planned: 0, planCompletion: 0 },
          violations: { total: 0, byStatus: {}, bySeverity: {}, totalAmount: 0 },
          decisions: { total: 0, overdue: 0, inProgress: 0, completed: 0 },
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const modules = [
    {
      id: "planning",
      title: t("dashboard.modules.planning"),
      description: t("dashboard.modules.planningDesc"),
      icon: Icons.Calendar,
      color: "bg-primary",
      href: "/planning",
    },

    {
      id: "violations",
      title: t("dashboard.modules.violations"),
      description: t("dashboard.modules.violationsDesc"),
      icon: Icons.Alert,
      color: "bg-destructive",
      href: "/violations",
    },
    {
      id: "decisions",
      title: t("dashboard.modules.decisions"),
      description: t("dashboard.modules.decisionsDesc"),
      icon: Icons.Check,
      color: "bg-accent",
      href: "/decisions",
    },
    {
      id: "reports",
      title: t("dashboard.modules.reports"),
      description: t("dashboard.modules.reportsDesc"),
      icon: Icons.Chart,
      color: "bg-primary",
      href: "/reports",
    },
    {
      id: "reference",
      title: t("dashboard.modules.reference"),
      description: t("dashboard.modules.referenceDesc"),
      icon: Icons.Book,
      color: "bg-secondary",
      href: "/reference",
    },
    {
      id: "admin",
      title: t("dashboard.modules.admin"),
      description: t("dashboard.modules.adminDesc"),
      icon: Icons.Shield,
      color: "bg-muted",
      href: "/admin",
    },
    {
      id: "services",
      title: t("dashboard.modules.services"),
      description: t("dashboard.modules.servicesDesc"),
      icon: Icons.Bell,
      color: "bg-accent",
      href: "/services",
    },
    {
      id: "integration",
      title: t("dashboard.modules.integration"),
      description: t("dashboard.modules.integrationDesc"),
      icon: Icons.Network,
      color: "bg-primary",
      href: "/integration",
    },
  ]

  const quickHelpItems = [
    {
      icon: Icons.Calendar,
      title: t("dashboard.quickHelp.createPlanTitle"),
      description: t("dashboard.quickHelp.createPlanDesc"),
      action: {
        label: t("dashboard.quickHelp.createPlanAction"),
        href: "/planning/annual",
      },
    },

    {
      icon: Icons.Alert,
      title: t("dashboard.quickHelp.registerViolationTitle"),
      description: t("dashboard.quickHelp.registerViolationDesc"),
      action: {
        label: t("dashboard.quickHelp.registerViolationAction"),
        href: "/violations/financial",
      },
    },
    {
      icon: Icons.Chart,
      title: t("dashboard.quickHelp.createReportTitle"),
      description: t("dashboard.quickHelp.createReportDesc"),
      action: {
        label: t("dashboard.quickHelp.createReportAction"),
        href: "/reports/generation",
      },
    },
  ]

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-6 space-y-6">
        <PageHelpBanner
          title={t("dashboard.welcome")}
          description={t("dashboard.welcomeDescription")}
          tourId="welcome"
          storageKey="dashboard-help-dismissed"
        />

        <div className="border-l-4 border-primary pl-6 py-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("dashboard.welcomeUser")}, {getLocalizedValue(user.fullname, locale)}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {getLocalizedValue(user.position, locale)} {getLocalizedValue(user.rank, locale)}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="stat-card">
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">


            <Link href="/violations" className="block">
              <Card className="stat-card cursor-pointer h-full bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-300 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">{t("dashboard.stats.violations.total")}</p>
                      <p className="text-3xl font-bold text-green-600">{stats.violations.total}</p>
                      <p className="text-xs text-green-600 mt-2">
                        +{stats.violations.byStatus.pending || 0} {t("dashboard.stats.violations.pending")}
                      </p>
                    </div>
                    <div className="rounded-full bg-green-500 p-3 ring-4 ring-green-100">
                      <Icons.Alert className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/decisions" className="block">
              <Card className="stat-card cursor-pointer h-full bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 hover:border-orange-300 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700 mb-1">{t("dashboard.stats.decisions.total")}</p>
                      <p className="text-3xl font-bold text-orange-600">{stats.decisions.total}</p>
                      <p className="text-xs text-orange-600 mt-2">
                        {t("dashboard.stats.decisions.completed")}: {stats.decisions.completed}
                      </p>
                    </div>
                    <div className="rounded-full bg-orange-500 p-3 ring-4 ring-orange-100">
                      <Icons.Check className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="stat-card cursor-pointer h-full bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-300 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700 mb-1">{t("dashboard.stats.decisions.overdue")}</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.decisions.overdue}</p>
                    <p className="text-xs text-purple-600 mt-2">{t("dashboard.stats.decisions.attention")}</p>
                  </div>
                  <div className="rounded-full bg-purple-500 p-3 ring-4 ring-purple-100">
                    <Icons.AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">{t("dashboard.error.stats")}</div>
        )}

        <Card className="border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">{t("dashboard.quickActions.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="default" className="gap-2">
                <Link href="/planning/annual">
                  <Icons.Plus className="h-4 w-4" />
                  {t("dashboard.quickActions.createPlan")}
                </Link>
              </Button>

              <Button asChild variant="outline" size="default" className="gap-2 bg-transparent">
                <Link href="/violations/financial">
                  <Icons.Alert className="h-4 w-4" />
                  {t("dashboard.quickActions.registerViolation")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="default" className="gap-2 bg-transparent">
                <Link href="/reports/generation">
                  <Icons.FileText className="h-4 w-4" />
                  {t("dashboard.quickActions.createReport")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="default" className="gap-2 bg-transparent">
                <Link href="/planning/orders">
                  <Icons.FileText className="h-4 w-4" />
                  {t("dashboard.quickActions.orders")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="default" className="gap-2 bg-transparent">
                <Link href="/violations/assets">
                  <Icons.Alert className="h-4 w-4" />
                  {t("dashboard.quickActions.assetShortages")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="default" className="gap-2 bg-transparent">
                <Link href="/reports/analytics">
                  <Icons.Chart className="h-4 w-4" />
                  {t("dashboard.quickActions.analytics")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Icons.Chart className="w-6 h-6" />
              {t("dashboard.systemStats.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center p-4 rounded bg-card border">
                    <Skeleton className="h-9 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                ))}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <Link href="/violations" className="block">
                  <div className="text-center p-6 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 hover:border-red-400 hover:scale-105 hover:shadow-xl transition-all cursor-pointer">
                    <div className="text-4xl font-bold text-red-600 tracking-tight">{stats.violations.total}</div>
                    <div className="text-sm text-red-700 mt-2 font-semibold">
                      {t("dashboard.systemStats.violations")}
                    </div>
                  </div>
                </Link>
                <div className="text-center p-6 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 hover:border-emerald-400 hover:scale-105 hover:shadow-lg transition-all">
                  <div className="text-4xl font-bold text-emerald-600 tracking-tight">
                    {stats.audits.planCompletion}%
                  </div>
                  <div className="text-sm text-emerald-700 mt-2 font-semibold">
                    {t("dashboard.systemStats.planCompletion")}
                  </div>
                </div>
                <Link href="/decisions" className="block">
                  <div className="text-center p-6 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 hover:border-amber-400 hover:scale-105 hover:shadow-xl transition-all cursor-pointer">
                    <div className="text-4xl font-bold text-amber-600 tracking-tight">{stats.decisions.total}</div>
                    <div className="text-sm text-amber-700 mt-2 font-semibold">
                      {t("dashboard.systemStats.decisions")}
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">{t("dashboard.error.stats")}</div>
            )}
          </CardContent>
        </Card>

        {!isLoading && stats && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-200 hover:border-cyan-300 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="rounded-full bg-cyan-500 p-2 ring-4 ring-cyan-100">
                      <Icons.Clipboard className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-cyan-700 font-bold">{t("dashboard.details.audits")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-700 font-medium">{t("dashboard.details.total")}:</span>
                    <span className="font-bold text-cyan-600">{stats.audits.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-700 font-medium">{t("dashboard.details.inWork")}:</span>
                    <span className="font-bold text-cyan-600">{stats.audits.inProgress}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-700 font-medium">{t("dashboard.details.completed")}:</span>
                    <span className="font-bold text-cyan-600">{stats.audits.completed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-700 font-medium">{t("dashboard.details.planned")}:</span>
                    <span className="font-bold text-cyan-600">{stats.audits.planned}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-2 border-rose-200 hover:border-rose-300 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="rounded-full bg-rose-500 p-2 ring-4 ring-rose-100">
                      <Icons.Alert className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-rose-700 font-bold">{t("dashboard.details.violations")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-rose-700 font-medium">{t("dashboard.details.total")}:</span>
                    <span className="font-bold text-rose-600">{stats.violations.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-rose-700 font-medium">{t("dashboard.details.underReview")}:</span>
                    <span className="font-bold text-rose-600">{stats.violations.byStatus.under_review || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-rose-700 font-medium">{t("dashboard.details.confirmed")}:</span>
                    <span className="font-bold text-rose-600">{stats.violations.byStatus.confirmed || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-rose-700 font-medium">{t("dashboard.details.damageAmount")}:</span>
                    <span className="font-bold text-rose-600">{formatCurrency(stats.violations.totalAmount)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-2 border-violet-200 hover:border-violet-300 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="rounded-full bg-violet-500 p-2 ring-4 ring-violet-100">
                      <Icons.Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-violet-700 font-bold">{t("dashboard.details.decisions")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-violet-700 font-medium">{t("dashboard.details.total")}:</span>
                    <span className="font-bold text-violet-600">{stats.decisions.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-violet-700 font-medium">{t("dashboard.details.inWork")}:</span>
                    <span className="font-bold text-violet-600">{stats.decisions.inProgress}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-violet-700 font-medium">{t("dashboard.details.overdue")}:</span>
                    <span className="font-bold text-violet-600">{stats.decisions.overdue}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-violet-700 font-medium">{t("dashboard.details.completed")}:</span>
                    <span className="font-bold text-violet-600">{stats.decisions.completed}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <QuickHelpCard items={quickHelpItems} />
            </div>
          </div>
        )}

        {!isLoading && activity.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icons.Clock className="w-5 h-5" />
                {t("dashboard.activity.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activity.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{getLocalizedValue(item.title, locale)}</p>
                      <p className="text-sm text-muted-foreground">{getLocalizedValue(item.description, locale)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(item.timestamp, t)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-4">{t("dashboard.modules.title")}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => {
              const Icon = module.icon
              const gradientColors = [
                {
                  from: "from-blue-50",
                  to: "to-blue-100",
                  border: "border-blue-200",
                  hoverBorder: "hover:border-blue-300",
                  bg: "bg-blue-500",
                  ring: "ring-blue-100",
                  text: "text-blue-700",
                },
                {
                  from: "from-indigo-50",
                  to: "to-indigo-100",
                  border: "border-indigo-200",
                  hoverBorder: "hover:border-indigo-300",
                  bg: "bg-indigo-500",
                  ring: "ring-indigo-100",
                  text: "text-indigo-700",
                },
                {
                  from: "from-red-50",
                  to: "to-red-100",
                  border: "border-red-200",
                  hoverBorder: "hover:border-red-300",
                  bg: "bg-red-500",
                  ring: "ring-red-100",
                  text: "text-red-700",
                },
                {
                  from: "from-emerald-50",
                  to: "to-emerald-100",
                  border: "border-emerald-200",
                  hoverBorder: "hover:border-emerald-300",
                  bg: "bg-emerald-500",
                  ring: "ring-emerald-100",
                  text: "text-emerald-700",
                },
                {
                  from: "from-amber-50",
                  to: "to-amber-100",
                  border: "border-amber-200",
                  hoverBorder: "hover:border-amber-300",
                  bg: "bg-amber-500",
                  ring: "ring-amber-100",
                  text: "text-amber-700",
                },
                {
                  from: "from-purple-50",
                  to: "to-purple-100",
                  border: "border-purple-200",
                  hoverBorder: "hover:border-purple-300",
                  bg: "bg-purple-500",
                  ring: "ring-purple-100",
                  text: "text-purple-700",
                },
                {
                  from: "from-pink-50",
                  to: "to-pink-100",
                  border: "border-pink-200",
                  hoverBorder: "hover:border-pink-300",
                  bg: "bg-pink-500",
                  ring: "ring-pink-100",
                  text: "text-pink-700",
                },
                {
                  from: "from-teal-50",
                  to: "to-teal-100",
                  border: "border-teal-200",
                  hoverBorder: "hover:border-teal-300",
                  bg: "bg-teal-500",
                  ring: "ring-teal-100",
                  text: "text-teal-700",
                },
                {
                  from: "from-orange-50",
                  to: "to-orange-100",
                  border: "border-orange-200",
                  hoverBorder: "hover:border-orange-300",
                  bg: "bg-orange-500",
                  ring: "ring-orange-100",
                  text: "text-orange-700",
                },
              ]
              const colors = gradientColors[index]

              return (
                <Link key={module.id} href={module.href}>
                  <Card
                    className={`bg-gradient-to-br ${colors.from} ${colors.to} border-2 ${colors.border} ${colors.hoverBorder} hover:scale-105 cursor-pointer h-full transition-all duration-300 shadow-md hover:shadow-xl`}
                  >
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center mb-3 ring-4 ${colors.ring} shadow-lg`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className={`text-base font-bold ${colors.text}`}>{module.title}</CardTitle>
                      <CardDescription className={`text-sm ${colors.text} opacity-80`}>
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-xs font-bold ${colors.text} opacity-70`}>
                        {t("dashboard.modules.module")}{" "}
                        {module.id === "planning"
                          ? "1"
                          : module.id === "execution"
                            ? "2"
                            : module.id === "violations"
                              ? "3"
                              : module.id === "decisions"
                                ? "4"
                                : module.id === "reports"
                                  ? "5"
                                  : module.id === "reference"
                                    ? "6"
                                    : module.id === "admin"
                                      ? "7"
                                      : module.id === "services"
                                        ? "8"
                                        : "9"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

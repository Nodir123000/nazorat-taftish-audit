"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useMemo, memo, useEffect } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { Icons } from "@/components/icons"
import { ChevronRight, HelpCircle, LayoutTemplate, Wallet } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTourStore } from "@/lib/stores/tour-store"
import { ModuleVisibilityDialog } from "./module-visibility-dialog"
import { useTranslation } from "@/lib/i18n/hooks"
import { logout } from "@/lib/auth"
import { getLocalizedValue } from "@/lib/i18n/localization"
import type { User } from "@/lib/types"

const modules = [
  {
    titleKey: "sidebar.home",
    icon: Icons.Home,
    href: "/dashboard",
    tourId: "dashboard",
    id: "dashboard",
  },
  {
    titleKey: "dashboard.title.v2",
    icon: LayoutTemplate,
    href: "/dashboard/design-v2",
    tourId: "dashboard-v2",
    id: "dashboard-v2",
  },
  {
    titleKey: "dashboard.title.receivables",
    icon: Wallet,
    href: "/dashboard/receivables",
    tourId: "receivables",
    id: "receivables",
  },
  {
    titleKey: "sidebar.planning",
    icon: Icons.Calendar,
    href: "/planning",
    tourId: "planning",
    id: "planning",
    submodules: [
      {
        titleKey: "sidebar.planning.annual",
        href: "/planning/annual",
        tourId: "annual-plan",
        id: "annual-plan",
      },
      {
        titleKey: "sidebar.planning.orders",
        href: "/planning/orders",
        tourId: "orders",
        id: "orders",
      },
    ],
  },
  {
    titleKey: "sidebar.kpi",
    icon: Icons.Chart,
    href: "/kpi",
    tourId: "kpi",
    id: "kpi",
    submodules: [
      {
        titleKey: "sidebar.kpi.management",
        href: "/kpi/management",
        tourId: "kpi-management",
        id: "kpi-management",
      },
      {
        titleKey: "sidebar.kpi.analytics",
        href: "/kpi/analytics",
        tourId: "kpi-analytics",
        id: "kpi-analytics",
      },
    ],
  },
  {
    titleKey: "sidebar.audits",
    icon: Icons.Clipboard,
    href: "/audits",
    tourId: "audits",
    id: "audits",
    submodules: [
      {
        titleKey: "sidebar.audits.financial",
        href: "/audits/financial",
        tourId: "financial-audits",
        id: "financial-audits",
      },
      {
        titleKey: "sidebar.audits.law_enforcement",
        href: "/audits/law-enforcement",
        tourId: "law-enforcement",
        id: "law-enforcement",
      },
      {
        titleKey: "sidebar.audits.service_investigations",
        href: "/audits/service-investigations",
        tourId: "service-investigations",
        id: "service-investigations",
      },
    ],
  },
  {
    titleKey: "sidebar.violations",
    icon: Icons.Alert,
    href: "/violations",
    tourId: "violations",
    id: "violations",
    submodules: [
      {
        titleKey: "sidebar.violations.financial",
        href: "/violations/financial",
        tourId: "financial-violations",
        id: "financial-violations",
      },
      {
        titleKey: "sidebar.violations.assets",
        href: "/violations/assets",
        tourId: "assets",
        id: "assets",
      },
    ],
  },
  {
    titleKey: "sidebar.personnel",
    icon: Icons.Users,
    href: "/personnel",
    tourId: "personnel",
    id: "personnel",
    submodules: [
      {
        titleKey: "sidebar.personnel.units",
        href: "/units/list",
        tourId: "personnel-units",
        id: "personnel-units",
      },
      {
        titleKey: "sidebar.personnel.list",
        href: "/personnel/list",
        tourId: "personnel-list",
        id: "personnel-list",
      },
      {
        titleKey: "sidebar.personnel.personnel",
        href: "/personnel/personnel",
        tourId: "personnel-personnel",
        id: "personnel-personnel",
      },
    ],
  },

  {
    titleKey: "sidebar.reports",
    icon: Icons.Chart,
    href: "/reports",
    tourId: "reports",
    id: "reports",
    submodules: [
      {
        titleKey: "sidebar.reports.generation",
        href: "/reports/generation",
        tourId: "report-generation",
        id: "report-generation",
      },
      {
        titleKey: "sidebar.reports.explanatory",
        href: "/reports/explanatory",
        tourId: "explanatory",
        id: "explanatory",
      },
      {
        titleKey: "sidebar.reports.analytics",
        href: "/reports/analytics",
        tourId: "analytics",
        id: "analytics",
      },
    ],
  },

  {
    titleKey: "sidebar.reference",
    icon: Icons.Book,
    href: "/reference",
    tourId: "reference",
    id: "reference",
    submodules: [
      {
        titleKey: "sidebar.reference.database",
        href: "/reference/database",
        tourId: "database",
        id: "database",
      },
      {
        titleKey: "sidebar.reference.regulatory",
        href: "/reference/regulatory",
        tourId: "regulatory",
        id: "regulatory",
      },
    ],
  },
  {
    titleKey: "sidebar.admin",
    icon: Icons.Settings,
    href: "/admin",
    tourId: "admin",
    id: "admin",
    submodules: [
      {
        titleKey: "sidebar.admin.users",
        href: "/admin/users",
        tourId: "users",
        id: "users",
      },
      {
        titleKey: "sidebar.admin.roles",
        href: "/admin/roles",
        tourId: "roles",
        id: "roles",
      },
      {
        titleKey: "sidebar.admin.auditlog",
        href: "/admin/audit-log",
        tourId: "audit-log",
        id: "audit-log",
      },
      {
        titleKey: "sidebar.admin.archive",
        href: "/admin/archive",
        tourId: "archive",
        id: "archive",
      },
      {
        titleKey: "sidebar.admin.metrology",
        href: "/diagnostics",
        tourId: "metrology",
        id: "metrology",
      },
      {
        titleKey: "sidebar.admin.schema",
        href: "/admin/schema",
        tourId: "database-schema",
        id: "database-schema",
      },
    ],
  },
  {
    titleKey: "sidebar.translations",
    icon: Icons.Globe,
    href: "/translation-management",
    tourId: "translation-management",
    id: "translation-management",
  },
]

const SidebarMenuItemComponent = memo(
  ({ module, pathname, t }: { module: any; pathname: string | null; t: (key: string) => string }) => {
    const isActive = pathname ? pathname === module.href || pathname.startsWith(module.href + "/") : false
    const title = t(module.titleKey)

    if (!module.submodules) {
      return (
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={isActive} className="group">
            <Link
              href={module.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200"
              data-tour={module.tourId}
            >
              <div
                className={`p-2 rounded-lg transition-all duration-300 ${isActive ? "bg-cyan-500/30 shadow-md shadow-cyan-400/40" : "group-hover:text-cyan-300"
                  }`}
              >
                <module.icon
                  className={`h-5 w-5 transition-colors duration-300 ${isActive ? "text-cyan-200" : "text-cyan-100/70 group-hover:text-cyan-300"
                    }`}
                />
              </div>
              <span
                className={`font-medium text-sm transition-all ${isActive ? "text-white font-bold" : "text-cyan-50 group-hover:text-white group-hover:font-semibold"}`}
              >
                {title}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    }

    return (
      <Collapsible key={module.href} defaultOpen={isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className="group px-3 py-2 rounded-md transition-all duration-200 hover:bg-white/5"
              data-tour={module.tourId}
            >
              <div
                className={`p-2 rounded-lg transition-all duration-300 ${isActive ? "bg-cyan-500/30 shadow-md shadow-cyan-400/40" : "group-hover:text-cyan-300"
                  }`}
              >
                <module.icon
                  className={`h-5 w-5 transition-colors duration-300 ${isActive ? "text-cyan-200" : "text-cyan-100/70 group-hover:text-cyan-300"
                    }`}
                />
              </div>
              <span
                className={`font-medium text-sm transition-all ${isActive ? "text-white font-bold" : "text-cyan-50 group-hover:text-white group-hover:font-semibold"}`}
              >
                {title}
              </span>
              <ChevronRight className="ml-auto h-4 w-4 text-cyan-300/70 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub className="ml-8 mt-1 space-y-0.5">
              {module.submodules.map((submodule: any) => {
                const isSubActive = pathname && submodule.href ? pathname.startsWith(submodule.href) : false
                const subTitle = t(submodule.titleKey)

                return (
                  <SidebarMenuSubItem key={submodule.href || submodule.titleKey}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isSubActive}
                      className={`rounded-md transition-all duration-200 ${isSubActive
                        ? "bg-cyan-500/20 text-cyan-200 font-bold border-l-2 border-cyan-400 pl-2.5 shadow-sm shadow-cyan-400/30"
                        : "text-cyan-100/70 hover:bg-cyan-500/10 hover:text-cyan-100 hover:border-l-2 hover:border-cyan-500/50 hover:pl-2.5 hover:font-semibold"
                        }`}
                    >
                      <Link
                        href={submodule.href || "#"}
                        className="flex items-center gap-2 py-1.5"
                        data-tour={submodule.tourId}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full transition-all ${isSubActive
                            ? "bg-cyan-300 shadow-md shadow-cyan-300/70"
                            : "bg-cyan-600 group-hover:bg-cyan-400 group-hover:shadow-sm group-hover:shadow-cyan-400/50"
                            }`}
                        />
                        <span className="text-sm">{subTitle}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                )
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  },
)

SidebarMenuItemComponent.displayName = "SidebarMenuItemComponent"

export function AppSidebar({ user }: { user: User | null }) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleModules, setVisibleModules] = useState<Set<string>>(new Set())
  const [visibleSubmodules, setVisibleSubmodules] = useState<Set<string>>(new Set())
  const { open } = useSidebar()
  const { startTour } = useTourStore()
  const { t, locale } = useTranslation()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedModules = localStorage.getItem("visibleModules")
      const savedSubmodules = localStorage.getItem("visibleSubmodules")

      if (savedModules) {
        const parsed = JSON.parse(savedModules)
        // Ensure core modules are visible
        const requiredModules = ["dashboard", "planning", "reference", "analytics-main", "dashboard-v2", "receivables", "audits", "personnel", "violations", "admin", "kpi", "reports"]
        let moduleUpdated = false
        parsed.forEach((mod: string) => {
          // No-op, just keep existing
        })
        requiredModules.forEach(mod => {
          if (!parsed.includes(mod)) {
            parsed.push(mod)
            moduleUpdated = true
          }
        })

        if (moduleUpdated) {
          localStorage.setItem("visibleModules", JSON.stringify(parsed))
        }
        setVisibleModules(new Set(parsed))
      } else {
        setVisibleModules(new Set(modules.map((m) => m.id)))
      }

      if (savedSubmodules) {
        const parsed = JSON.parse(savedSubmodules)
        // Ensure important submodules are visible
        const requiredSubmodules = [
          "annual-plan", "orders", "receivables", "personnel-units", 
          "personnel-list", "personnel-personnel", "financial-violations", 
          "assets", "financial-audits", "law-enforcement", "service-investigations", 
          "metrology", "database-schema", "kpi-management", "report-generation"
        ]
        let subUpdated = false
        requiredSubmodules.forEach(sub => {
          if (!parsed.includes(sub)) {
            parsed.push(sub)
            subUpdated = true
          }
        })

        if (subUpdated) {
          localStorage.setItem("visibleSubmodules", JSON.stringify(parsed))
        }
        setVisibleSubmodules(new Set(parsed))
      } else {
        const allSubmodules = modules.flatMap((m) => m.submodules?.map((s) => s.id) || [])
        setVisibleSubmodules(new Set(allSubmodules))
      }

      const handleVisibilityChange = (e: Event) => {
        const customEvent = e as CustomEvent
        setVisibleModules(customEvent.detail.visible)
        setVisibleSubmodules(customEvent.detail.subvisible)
      }

      window.addEventListener("moduleVisibilityChanged", handleVisibilityChange)
      return () => window.removeEventListener("moduleVisibilityChanged", handleVisibilityChange)
    }
  }, [])

  const filteredModules = useMemo(() => {
    let result = modules as any[]

    if (visibleModules.size > 0) {
      result = result.filter((m) => visibleModules.has(m.id))
    }

    result = result.map((m) => ({
      ...m,
      submodules: m.submodules?.filter((s: any) => visibleSubmodules.has(s.id)),
    }))

    if (!searchQuery) return result
    return result.filter((module) => t(module.titleKey).toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery, visibleModules, visibleSubmodules, t])

  return (
    <Sidebar
      collapsible="icon"
      className="print:hidden border-r border-white/10"
      data-tour="sidebar"
      style={
        {
          "--sidebar": "hsl(207, 50%, 30%)",
          "--sidebar-foreground": "rgba(255, 255, 255, 0.9)",
          "--sidebar-primary": "hsl(190, 90%, 50%)",
          "--sidebar-accent": "rgba(255, 255, 255, 0.1)",
          "--sidebar-border": "rgba(255, 255, 255, 0.1)",
          "--sidebar-ring": "hsl(190, 90%, 50%)",
        } as React.CSSProperties
      }
    >
      <SidebarHeader className="border-b border-white/10 p-4 bg-linear-to-b from-[hsl(207,50%,35%)] to-[hsl(207,50%,30%)]">
        <div className="flex items-center gap-3">
          <div className="p-1">
            <img src="/logo.svg" width={40} height={40} alt="" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-white truncate leading-tight tracking-tight">{t("sidebar.title")}</h2>
            <p className="text-xs text-cyan-200 font-medium">{t("sidebar.version")}</p>
          </div>
          <ModuleVisibilityDialog />
        </div>
        <div className="mt-4 relative group">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-300/50 group-focus-within:text-cyan-300 transition-colors" />
          <Input
            type="text"
            placeholder={t("sidebar.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-cyan-200/50 focus:border-cyan-400 focus:ring-cyan-400/30 transition-all text-xs h-9"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[hsl(207,50%,28%)]">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredModules.map((module) => (
                <SidebarMenuItemComponent key={module.href} module={module} pathname={pathname} t={t} />
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => startTour("welcome")}
                  className="group px-3 py-2 rounded-md transition-all duration-200 hover:bg-white/5 cursor-pointer"
                >
                  <div className="p-2 rounded-lg transition-all duration-300 bg-cyan-500/20 group-hover:bg-linear-to-br group-hover:from-cyan-400 group-hover:to-blue-500 group-hover:shadow-lg group-hover:shadow-cyan-400/70 group-hover:scale-110">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-sm text-cyan-50 group-hover:text-white group-hover:font-semibold transition-all">
                    {t("sidebar.training")}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="bg-white/10" />

      <SidebarFooter className="p-4 bg-linear-to-b from-[hsl(207,50%,30%)] to-[hsl(207,50%,25%)] border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/30 shadow-md shadow-cyan-400/40 flex items-center justify-center shrink-0">
              <Icons.User className="h-5 w-5 text-cyan-200" />
            </div>
            <div className="text-xs min-w-0">
              <p className="font-bold text-white truncate leading-none mb-1">
                {user ? getLocalizedValue(user.fullname, locale) : t("sidebar.user.admin")}
              </p>
              <p className="font-medium text-cyan-50 truncate leading-none">
                {user ? getLocalizedValue(user.rank, locale) : t("sidebar.user.rank")}
              </p>
              <p className="font-medium text-cyan-200 text-[10px] truncate leading-none mt-1 opacity-60">
                {user ? getLocalizedValue(user.position, locale) : t("sidebar.user.name")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Link href="/help">
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-cyan-300 hover:shadow-sm hover:shadow-cyan-400/30 transition-all duration-300 rounded-lg text-cyan-100 h-8 w-8"
              >
                <Icons.Book className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:text-red-400 hover:shadow-sm hover:shadow-red-400/30 transition-all duration-300 rounded-lg text-cyan-100 h-8 w-8"
            >
              <Icons.Logout className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

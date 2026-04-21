"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { LanguageSelectorPanel } from "@/components/language-selector-panel"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { logout } from "@/lib/auth"
import { NotificationBell } from "./notifications/notification-bell"
import type { User } from "@/lib/types"
import { getLocalizedValue } from "@/lib/i18n/localization"
import { useTranslation } from "@/lib/i18n/hooks"

interface PageHeaderProps {
  title: string
  subtitle?: string
  onImport?: () => void
  onExport?: () => void
  onAdd?: () => void
  showActions?: boolean
  user: User | null
}

export function PageHeader({ title, subtitle, onImport, onExport, onAdd, showActions = true, user }: PageHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { locale } = useTranslation()
  const [loadingTime, setLoadingTime] = useState<string>("0.00")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    let timer: any = null
    let lastActivity = performance.now()

    // Function to stop measurement and update state
    const stopMeasurement = (start: number) => {
      const end = performance.now()
      const duration = (end - start).toFixed(2)
      setLoadingTime(duration)
      setIsUpdating(true)
      setTimeout(() => setIsUpdating(false), 400)
    }

    // High-level listener for clicks (nav starts)
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isNav = target.closest('a') || target.closest('button')
      if (isNav) {
        const start = performance.now()
        // Start observing for DOM changes
        const observer = new MutationObserver(() => {
          lastActivity = performance.now()
          clearTimeout(timer)
          timer = setTimeout(() => {
            observer.disconnect()
            stopMeasurement(start)
          }, 250) // Settle time
        })
        observer.observe(document.body, { childList: true, subtree: true, attributes: true })

        // Safety timeout
        setTimeout(() => observer.disconnect(), 5000)
      }
    }

    // Specific event for components that load data async
    const handleLoad = (e: any) => {
      setLoadingTime(e.detail.duration)
      setIsUpdating(true)
      setTimeout(() => setIsUpdating(false), 400)
    }

    window.addEventListener('click', handleGlobalClick)
    window.addEventListener('personnelLoaded', handleLoad)

    // Initial load
    if (typeof window !== 'undefined') {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (nav) setLoadingTime(nav.duration.toFixed(2))
    }

    return () => {
      window.removeEventListener('click', handleGlobalClick)
      window.removeEventListener('personnelLoaded', handleLoad)
      clearTimeout(timer)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title and subtitle */}
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>

        {/* Right: Actions and user menu */}
        <div className="flex items-center gap-3">
          {showActions && (
            <>
              {onImport && (
                <Button variant="outline" size="sm" onClick={onImport} className="gap-2 bg-transparent">
                  <Icons.Upload className="h-4 w-4" />
                  Импорт
                </Button>
              )}
              {onExport && (
                <Button variant="outline" size="sm" onClick={onExport} className="gap-2 bg-transparent">
                  <Icons.Download className="h-4 w-4" />
                  Экспорт
                </Button>
              )}
              {onAdd && (
                <Button size="sm" onClick={onAdd} className="gap-2">
                  <Icons.Plus className="h-4 w-4" />
                  Добавить
                </Button>
              )}
            </>
          )}



          {/* Language Selector Panel */}
          <LanguageSelectorPanel />

          {/* Notifications */}
          <NotificationBell />

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Icons.Settings className="h-5 w-5" />
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icons.User className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium">
                    {user ? getLocalizedValue(user.fullname, locale) : "Пользователь"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user ? getLocalizedValue(user.rank, locale) : "Гость"}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Icons.User className="mr-2 h-4 w-4" />
                Профиль
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icons.Settings className="mr-2 h-4 w-4" />
                Настройки
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <Icons.Logout className="mr-2 h-4 w-4" />
                Выход
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

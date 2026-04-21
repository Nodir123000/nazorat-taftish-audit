"use client"

import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n/hooks"
import { getLocalizedValue } from "@/lib/i18n/localization"

interface DashboardNavProps {
  user: User
}

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter()
  const { t, locale } = useTranslation()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
    router.refresh()
  }

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <Icons.Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">АИС КРР</h1>
            <p className="text-xs text-muted-foreground">Контрольно-ревизионная работа</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <Icons.Home className="w-4 h-4 mr-2" />
              Главная
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Icons.User className="w-4 h-4" />
                <span className="hidden md:inline">{getLocalizedValue(user.fullname, locale)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{getLocalizedValue(user.fullname, locale)}</p>
                  <p className="text-xs text-muted-foreground">{getLocalizedValue(user.rank, locale)}</p>
                  <p className="text-xs text-muted-foreground">{getLocalizedValue(user.position, locale)}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-muted-foreground">
                Роль:{" "}
                {user.role === "admin"
                  ? "Администратор"
                  : user.role === "chief_inspector"
                    ? "Главный инспектор"
                    : user.role === "inspector"
                      ? "Инспектор"
                      : "Наблюдатель"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <Icons.Logout className="w-4 h-4 mr-2" />
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

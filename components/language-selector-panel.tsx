"use client"

import { useI18n, type Locale } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

export type Language = Locale

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "uzCyrl", name: "Ўзбекча (кирилл)", flag: "🇺🇿" },
  { code: "uzLatn", name: "O'zbek (lotin)", flag: "🇺🇿" },
]

export function LanguageSelectorPanel() {
  const { locale, setLocale } = useI18n()

  const handleToggle = () => {
    if (locale === "ru") setLocale("uzLatn")
    else if (locale === "uzLatn") setLocale("uzCyrl")
    else setLocale("ru")
  }

  const getLabel = () => {
    if (locale === "ru") return "RU"
    if (locale === "uzLatn") return "UZ"
    return "УЗ"
  }

  const getFullName = () => {
    if (locale === "ru") return "Русский"
    if (locale === "uzLatn") return "O'zbekcha"
    return "Ўзбекча"
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 rounded-xl bg-muted/50 hover:bg-muted transition-all px-3 h-9 border border-transparent hover:border-primary/20"
      onClick={handleToggle}
    >
      <Icons.Globe className="h-4 w-4 text-primary" />
      <div className="flex flex-col items-start leading-none">
        <span className="font-bold uppercase tracking-wider text-[10px]">
          {getLabel()}
        </span>
        <span className="text-[9px] text-muted-foreground hidden sm:block">
          {getFullName()}
        </span>
      </div>
    </Button>
  )
}

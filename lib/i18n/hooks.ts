"use client"

import { useI18n } from "./context"
import { translationStore } from "./translation-store"
import { useEffect, useState } from "react"

export function useTranslation() {
  const { locale, setLocale, refreshTranslations } = useI18n()
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const handleLocaleChange = () => {
      forceUpdate((v) => v + 1)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("localeChange", handleLocaleChange)
      return () => window.removeEventListener("localeChange", handleLocaleChange)
    }
  }, [])

  const t = (key: string) => {
    const localeMap = {
      ru: "ru" as const,
      uzCyrl: "uz-Cyrl" as const,
      uzLatn: "uz-Latn" as const,
    }

    const mappedLocale = localeMap[locale]
    const result = translationStore.getTranslation(key, mappedLocale)

    console.log("[v0] Translation:", { key, locale, mappedLocale, result })

    return result
  }

  return { locale, setLocale, t, refreshTranslations }
}

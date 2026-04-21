"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translationStore } from "./translation-store"

export type Locale = "ru" | "uzCyrl" | "uzLatn"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  refreshTranslations: () => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru")
  const [, setTranslationVersion] = useState(0)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("locale") as Locale
      if (savedLocale && ["ru", "uzCyrl", "uzLatn"].includes(savedLocale)) {
        console.log("[v0] Loaded saved locale:", savedLocale)
        setLocaleState(savedLocale)
      } else {
        console.log("[v0] Using default locale: ru")
        setLocaleState("ru")
      }
    }
  }, [])

  useEffect(() => {
    const unsubscribe = translationStore.subscribe(() => {
      console.log("[v0] Translations updated")
      setTranslationVersion((v) => v + 1)
    })
    return unsubscribe
  }, [])

  const setLocale = (newLocale: Locale) => {
    console.log("[v0] Setting locale to:", newLocale)
    setLocaleState(newLocale)
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale)
      window.dispatchEvent(new CustomEvent("localeChange", { detail: newLocale }))
    }
  }

  const refreshTranslations = () => {
    console.log("[v0] Refreshing translations")
    setTranslationVersion((v) => v + 1)
  }

  return <I18nContext.Provider value={{ locale, setLocale, refreshTranslations }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

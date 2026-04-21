import { translations } from "./translations"
import type { Locale } from "./context"

type Subscriber = () => void

class TranslationStore {
  private subscribers: Set<Subscriber> = new Set()

  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback)
    return () => {
      this.subscribers.delete(callback)
    }
  }

  private notify() {
    this.subscribers.forEach((callback) => callback())
  }

  getTranslation(key: string, locale: "ru" | "uz-Cyrl" | "uz-Latn"): string {
    const localeMap: Record<string, Locale> = {
      ru: "ru",
      "uz-Cyrl": "uzCyrl",
      "uz-Latn": "uzLatn",
    }

    const mappedLocale = localeMap[locale] || "ru"

    const translation = translations[mappedLocale]?.[key]

    if (translation) {
      return translation
    }

    const fallback = translations.ru[key]
    if (fallback) {
      return fallback
    }

    console.warn("[v0] Translation not found:", { key, locale, mappedLocale })
    return key
  }

  refresh() {
    this.notify()
  }
}

export const translationStore = new TranslationStore()

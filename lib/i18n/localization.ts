/**
 * Get localized string from value that can be a string or an object with multiple languages
 * Supported object keys: ru, uz (Latin), uzk (Cyrillic)
 */
export function getLocalizedValue(
  value: any,
  locale: string = "ru"
): string {
  if (!value) return ""
  if (typeof value === "string") return value
  
  if (typeof value === "object") {
    // Map locale (ru, uzCyrl, uzLatn) to DB keys (ru, uzk, uz)
    const key = locale === "ru" ? "ru" : locale === "uzCyrl" ? "uzk" : "uz"
    
    // Try primary key, then fallback to Russian, then first available value
    return value[key] || value.ru || Object.values(value)[0]?.toString() || ""
  }
  
  return String(value)
}

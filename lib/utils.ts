import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDistrictAbbreviation(district: string): string {
  if (!district) return ""

  const lower = district.toLowerCase()

  if (lower.includes("ташкентский")) return "ТВО"
  if (lower.includes("центральный") && lower.includes("округ")) return "ЦВО"
  if (lower.includes("восточный")) return "ВВО"
  if (lower.includes("северо-западный") || lower.includes("северо‑западный")) return "СЗВО"
  if (lower.includes("юго-западный") || lower.includes("юго‑западный")) return "ЮЗСВО"
  if (lower.includes("центральный") && lower.includes("подчинения")) return "ЦП"

  return district
}

export function maskPINFL(pinfl: string | undefined | null): string {
  if (!pinfl) return "—"
  if (pinfl.length !== 14) return pinfl
  return `${pinfl.substring(0, 3)}********${pinfl.substring(11)}`
}

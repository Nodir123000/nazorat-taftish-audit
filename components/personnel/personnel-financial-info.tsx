"use client"

import type { PersonnelMember } from "@/lib/types/personnel"

interface PersonnelFinancialInfoProps {
  personnel: PersonnelMember
}

export function PersonnelFinancialInfo({ personnel }: PersonnelFinancialInfoProps) {
  const formatCurrency = (value?: number) => {
    if (!value) return "—"
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Финансовые сведения</h3>
    </div>
  )
}

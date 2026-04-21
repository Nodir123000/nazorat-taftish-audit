"use client"

import type { PersonnelMember } from "@/lib/types/personnel"

interface PersonnelHRInfoProps {
  personnel: PersonnelMember
}

export function PersonnelHRInfo({ personnel }: PersonnelHRInfoProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Кадровые сведения</h3>
    </div>
  )
}

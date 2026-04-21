"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeftOpen } from "lucide-react"

export function SidebarToggleButton() {
  const { open, setOpen } = useSidebar()

  if (open) return null

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setOpen(true)}
      className="fixed  top-4 z-50 h-10 w-10 rounded-sm bg-zinc-900 border-zinc-700 hover:bg-zinc-800 hover:text-amber-400 hover:border-amber-600 text-zinc-400 shadow-lg transition-all"
      title="Открыть панель"
    >
      <PanelLeftOpen className="h-5 w-5" />
    </Button>
  )
}

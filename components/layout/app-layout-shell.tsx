"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { WelcomeTourDialog } from "@/components/welcome-tour-dialog"
import { VoiceAssistant } from "@/components/voice-assistant"
import { VoiceAssistantHelp } from "@/components/voice-assistant-help"
import { GlobalHeader } from "@/components/global-header"
import { IntroVideo } from "@/components/intro-video"
import type { User } from "@/lib/types"

export function AppLayoutShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: User | null
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  if (isLoginPage) {
    return (
      <div className="min-h-screen w-full bg-background">
        <main>{children}</main>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} />
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
          <VoiceAssistantHelp />
          <VoiceAssistant />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <GlobalHeader user={user} />
          <IntroVideo />
          <main className="flex-1">{children}</main>
        </div>
      </div>
      <WelcomeTourDialog />
    </SidebarProvider>
  )
}

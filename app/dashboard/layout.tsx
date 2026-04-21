import type React from "react"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardProvider } from "@/components/dashboard-v2/dashboard-context"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardProvider>
      <div className="flex-1 bg-background">{children}</div>
    </DashboardProvider>
  )
}

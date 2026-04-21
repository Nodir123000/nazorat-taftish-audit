"use client"

import { usePathname } from "next/navigation"
import { PageHeader } from "./page-header"
import type { User } from "@/lib/types"

export function GlobalHeader({ user }: { user: User | null }) {
  const pathname = usePathname()
  
  // Do not render global header on pages that provide their own PageHeader
  // Currently these are admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  return <PageHeader title="" showActions={false} user={user} />
}

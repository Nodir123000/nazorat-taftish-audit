import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { headers } from "next/headers"
import "./globals.css"
import { I18nProvider } from "@/lib/i18n/context"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/components/providers/query-provider"
import { AppLayoutShell } from "@/components/layout/app-layout-shell"
import { getCurrentUser } from "@/lib/auth"
import ThemeRegistry from "@/components/providers/theme-registry"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
})

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "АИС КРР - ERP МО РУз",
  description: "Система управления контрольно-ревизионной работой",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  const headerList = await headers()
  const nonce = headerList.get("x-nonce") || undefined // Извлечение nonce из CSP-заголовков

  return (
    <html lang="ru" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <ThemeRegistry nonce={nonce}>
          <QueryProvider>
            <I18nProvider>
              <AppLayoutShell user={user}>
                {children}
              </AppLayoutShell>
              <Toaster />
            </I18nProvider>
          </QueryProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface QuickHelpItem {
  icon: any
  title: string
  description: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
}

interface QuickHelpCardProps {
  items: QuickHelpItem[]
}

export function QuickHelpCard({ items }: QuickHelpCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Быстрая помощь</CardTitle>
        <CardDescription>Основные действия на этой странице</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {item.action && (
                  <div className="pt-1">
                    {item.action.href ? (
                      <Link href={item.action.href}>
                        <Button variant="link" size="sm" className="h-auto p-0">
                          {item.action.label} →
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="link" size="sm" className="h-auto p-0" onClick={item.action.onClick}>
                        {item.action.label} →
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

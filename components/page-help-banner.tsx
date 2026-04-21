"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Info, X, Play } from "lucide-react"
import { useTourStore } from "@/lib/stores/tour-store"

interface PageHelpBannerProps {
  title: string
  description: string
  tourId?: string
  storageKey: string
}

export function PageHelpBanner({ title, description, tourId, storageKey }: PageHelpBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(storageKey) === "true") {
      setDismissed(true)
    }
  }, [storageKey])
  const { startTour } = useTourStore()

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem(storageKey, "true")
  }

  const handleStartTour = () => {
    if (tourId) {
      startTour(tourId)
    }
  }

  if (dismissed) return null

  return (
    <Alert className="mb-6 border-primary/50 bg-primary/5">
      <Info className="h-4 w-4 text-primary" />
      <AlertTitle className="flex items-center justify-between">
        {title}
        <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2" onClick={handleDismiss}>
          <X className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription className="mt-2 flex items-start justify-between gap-4">
        <span className="text-sm">{description}</span>
        {tourId && (
          <Button size="sm" variant="outline" onClick={handleStartTour} className="shrink-0 bg-transparent">
            <Play className="mr-2 h-3 w-3" />
            Показать
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

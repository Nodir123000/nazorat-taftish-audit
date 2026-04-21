"use client"

import { useCallback, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Joyride, { type CallBackProps, STATUS, EVENTS, type Step } from "react-joyride"
import { useTourStore } from "@/lib/stores/tour-store"
import { welcomeTourSteps, tourModules } from "@/lib/tour-config"
import { TourCustomTooltip } from "./tour-custom-tooltip"

export function InteractiveTour() {
  const { isTourActive, currentTourId, currentTourStep, setTourStep, completeTour, endTour } = useTourStore()
  const router = useRouter()
  const pathname = usePathname()
  const lastNavigatedRouteRef = useRef<string | null>(null)
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get current tour steps
  const getCurrentSteps = useCallback((): Step[] => {
    if (!currentTourId) return []

    if (currentTourId === "welcome") {
      return welcomeTourSteps.map((step) => ({
        target: step.target,
        content: (
          <div className="space-y-2">
            <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed">{step.content}</p>
          </div>
        ),
        placement: "bottom" as const,
        disableBeacon: step.disableBeacon,
        spotlightClicks: step.spotlightClicks,
        floaterProps: {
          disableAnimation: true,
          disableFlip: true,
          hideArrow: true,
        },
      }))
    }

    const module = tourModules.find((m) => m.id === currentTourId)
    if (!module) return []

    return module.steps.map((step) => ({
      target: step.target,
      content: (
        <div className="space-y-2">
          <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed">{step.content}</p>
        </div>
      ),
      placement: "bottom" as const,
      disableBeacon: step.disableBeacon,
      spotlightClicks: step.spotlightClicks,
      floaterProps: {
        disableAnimation: true,
        disableFlip: true,
        hideArrow: true,
      },
    }))
  }, [currentTourId])

  useEffect(() => {
    if (!isTourActive || !currentTourId) return

    const steps =
      currentTourId === "welcome" ? welcomeTourSteps : tourModules.find((m) => m.id === currentTourId)?.steps || []
    const currentStep = steps[currentTourStep]

    if (currentStep?.route) {
      // This prevents infinite loops when routes redirect to subpaths
      const isAlreadyAtRoute = pathname === currentStep.route || pathname.startsWith(currentStep.route + "/")

      if (!isAlreadyAtRoute && lastNavigatedRouteRef.current !== currentStep.route) {
        console.log("[v0] Tour navigation: navigating to", currentStep.route)
        lastNavigatedRouteRef.current = currentStep.route

        // Clear any pending navigation timeout
        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current)
        }

        router.push(currentStep.route)

        // If this step has a parent to expand, click on the parent collapsible trigger
        if (currentStep.expandParent) {
          // Wait for navigation to complete, then expand the parent
          navigationTimeoutRef.current = setTimeout(() => {
            const parentElement = document.querySelector(`[data-tour="${currentStep.expandParent}"]`)
            if (parentElement) {
              // Check if parent is already expanded
              const collapsible = parentElement.closest("[data-state]")
              if (collapsible && collapsible.getAttribute("data-state") === "closed") {
                // Click the parent to expand it
                ;(parentElement as HTMLElement).click()
              }
            }
          }, 300) // Wait for navigation to complete
        }
      }
    }
  }, [currentTourStep, currentTourId, isTourActive, router, pathname])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data

    if (type === EVENTS.STEP_AFTER) {
      setTourStep(index + 1)
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      if (currentTourId) {
        completeTour(currentTourId)
        lastNavigatedRouteRef.current = null
        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current)
        }
      }
    }
  }

  const steps = getCurrentSteps()

  if (!isTourActive || !currentTourId || steps.length === 0) {
    return null
  }

  return (
    <>
      <Joyride
        steps={steps}
        run={isTourActive}
        continuous
        showProgress
        showSkipButton
        stepIndex={currentTourStep}
        callback={handleJoyrideCallback}
        disableScrolling={false}
        spotlightPadding={8}
        tooltipComponent={TourCustomTooltip}
        disableOverlay={false}
        styles={{
          options: {
            primaryColor: "hsl(var(--primary))",
            textColor: "#1f2937",
            backgroundColor: "#ffffff",
            overlayColor: "rgba(0, 0, 0, 0.4)",
            arrowColor: "transparent",
            zIndex: 10000,
          },
          spotlight: {
            borderRadius: "8px",
          },
        }}
        locale={{
          back: "Назад",
          close: "Закрыть",
          last: "Завершить",
          next: "Вперед",
          skip: "Пропустить",
        }}
      />
    </>
  )
}

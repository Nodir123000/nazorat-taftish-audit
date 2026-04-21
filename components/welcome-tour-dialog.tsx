"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTourStore } from "@/lib/stores/tour-store"
import { Rocket, X, Sparkles, BookOpen } from "lucide-react"

export function WelcomeTourDialog() {
  const { hasCompletedWelcomeTour, startTour, skipWelcomeTour } = useTourStore()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Show dialog after a short delay if user hasn't completed welcome tour
    if (!hasCompletedWelcomeTour) {
      const timer = setTimeout(() => {
        setOpen(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [hasCompletedWelcomeTour])

  const handleStartTour = () => {
    setOpen(false)
    startTour("welcome")
  }

  const handleSkip = () => {
    setOpen(false)
    skipWelcomeTour()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg border-2 border-primary/20">
        <DialogHeader>
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Добро пожаловать в АИС КРР!
              </DialogTitle>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Автоматизированная информационная система
              </p>
            </div>
          </div>

          <div className="text-base leading-relaxed space-y-4">
            <div className="space-y-4">
              <p className="text-gray-900 dark:text-gray-100 font-semibold text-[15px]">
                <span className="font-bold text-gray-900 dark:text-gray-50">Система контрольно-ревизионной работы</span>{" "}
                Министерства обороны для управления проверками, учета нарушений и формирования отчетности.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 mb-1">Интерактивное обучение</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 font-semibold">
                      Пройдите краткий тур по системе — это займет всего <span className="font-bold">2-3 минуты</span> и
                      поможет вам быстрее освоиться с основными возможностями.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 font-semibold">
                <BookOpen className="h-4 w-4" />
                <span>Вы всегда можете вернуться к обучению через меню помощи</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-3 mt-2">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="w-full sm:w-auto border-2 hover:bg-muted bg-transparent"
          >
            <X className="mr-2 h-4 w-4" />
            Пропустить
          </Button>
          <Button
            onClick={handleStartTour}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Начать тур
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

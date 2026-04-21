import { create } from "zustand"
import { persist } from "zustand/middleware"

interface TourState {
  hasCompletedWelcomeTour: boolean
  completedModuleTours: string[]
  currentTourStep: number
  isTourActive: boolean
  currentTourId: string | null

  // Actions
  startTour: (tourId: string) => void
  completeTour: (tourId: string) => void
  setTourStep: (step: number) => void
  endTour: () => void
  resetAllTours: () => void
  skipWelcomeTour: () => void
}

export const useTourStore = create<TourState>()(
  persist(
    (set) => ({
      hasCompletedWelcomeTour: false,
      completedModuleTours: [],
      currentTourStep: 0,
      isTourActive: false,
      currentTourId: null,

      startTour: (tourId: string) =>
        set({
          isTourActive: true,
          currentTourId: tourId,
          currentTourStep: 0,
        }),

      completeTour: (tourId: string) =>
        set((state) => ({
          isTourActive: false,
          currentTourId: null,
          currentTourStep: 0,
          hasCompletedWelcomeTour: tourId === "welcome" ? true : state.hasCompletedWelcomeTour,
          completedModuleTours:
            tourId !== "welcome" && !state.completedModuleTours.includes(tourId)
              ? [...state.completedModuleTours, tourId]
              : state.completedModuleTours,
        })),

      setTourStep: (step: number) => set({ currentTourStep: step }),

      endTour: () =>
        set({
          isTourActive: false,
          currentTourId: null,
          currentTourStep: 0,
        }),

      resetAllTours: () =>
        set({
          hasCompletedWelcomeTour: false,
          completedModuleTours: [],
          currentTourStep: 0,
          isTourActive: false,
          currentTourId: null,
        }),

      skipWelcomeTour: () =>
        set({
          hasCompletedWelcomeTour: true,
          isTourActive: false,
          currentTourId: null,
        }),
    }),
    {
      name: "ais-krr-tour-storage",
    },
  ),
)

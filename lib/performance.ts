"use client"

import { useEffect, useRef } from "react"

/**
 * Hook to measure component render performance
 * Use in development to identify slow components
 */
export function useRenderPerformance(componentName: string, enabled = process.env.NODE_ENV === "development") {
  const renderCount = useRef(0)
  const startTime = useRef(0)

  if (enabled) {
    renderCount.current++
    startTime.current = performance.now()
  }

  useEffect(() => {
    if (enabled) {
      const endTime = performance.now()
      const renderTime = endTime - startTime.current
      console.log(`[v0] ${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`)
    }
  })
}

/**
 * Debounce function for search inputs and filters
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageSkeleton } from "@/components/loading-skeleton"
import { ViolationsContent } from "@/components/violations-content"

export default function ShortagesPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        <ViolationsContent initialSection="shortages" />
      </Suspense>
    </ErrorBoundary>
  )
}

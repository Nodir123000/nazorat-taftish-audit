"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageSkeleton } from "@/components/loading-skeleton"
import { FinancialActivityContent } from "@/components/audits/financial-activity-content"

export default function FinancialActivityPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        <FinancialActivityContent />
      </Suspense>
    </ErrorBoundary>
  )
}

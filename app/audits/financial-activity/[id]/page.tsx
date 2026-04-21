"use client"

import { use } from "react"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageSkeleton } from "@/components/loading-skeleton"
import { FinancialAuditDetail } from "@/components/audits/financial-audit-detail"

interface PageProps {
    params: Promise<{ id: string }>
}

export default function FinancialAuditDetailPage({ params }: PageProps) {
    const resolvedParams = use(params)
    const id = parseInt(resolvedParams.id)

    return (
        <ErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>
                <FinancialAuditDetail id={id} />
            </Suspense>
        </ErrorBoundary>
    )
}

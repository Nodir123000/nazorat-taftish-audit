import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LawEnforcementRegistry } from "@/components/audits/law-enforcement-registry"
import { Icons } from "@/components/icons"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"
import { PageSkeleton } from "@/components/ui/page-skeleton"

export default async function LawEnforcementPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-rose-800 rounded-lg flex items-center justify-center shadow-lg shadow-rose-200">
                    <Icons.Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-800 underline decoration-rose-500/30 decoration-8">
                        Правоохранительные органы
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg mt-1">
                        Реестр материалов, переданных в следственные органы
                    </p>
                </div>
            </div>

            <ErrorBoundary>
                <Suspense fallback={<PageSkeleton />}>
                    <LawEnforcementRegistry />
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}

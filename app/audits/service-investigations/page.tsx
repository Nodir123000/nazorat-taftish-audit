import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ServiceInvestigationsRegistry } from "@/components/audits/service-investigations-registry"
import { Icons } from "@/components/icons"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"
import { PageSkeleton } from "@/components/ui/page-skeleton"

export default async function ServiceInvestigationsPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center shadow-lg">
                    <Icons.Users className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-800 underline decoration-amber-500/30 decoration-8">
                        Служебные расследования
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg mt-1">
                        Контроль исполнения предписаний и проведения расследований
                    </p>
                </div>
            </div>

            <ErrorBoundary>
                <Suspense fallback={<PageSkeleton />}>
                    <ServiceInvestigationsRegistry />
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}

import { AnnualPlanPage } from "@/components/planning/annual-plan-page"
import { Suspense } from "react"
import { planningService } from "@/lib/services/planning-service"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AnnualPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams

  const year = params.year ? Number(params.year) : undefined
  const status = params.status as any
  const search = params.search as string

  const plans = await planningService.getAnnualPlans({
    year,
    status,
    search,
  })

  return (
    <Suspense fallback={<div className="p-6">Загрузка...</div>}>
      <AnnualPlanPage initialPlans={plans} />
    </Suspense>
  )
}

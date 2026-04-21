"use client"

import { AnnualPlanPage as NewAnnualPlanPage } from "./annual-plans/AnnualPlanPage"

export function AnnualPlanPage({ initialPlans = [] }: { initialPlans?: any[] }) {
  return <NewAnnualPlanPage initialPlans={initialPlans} />
}

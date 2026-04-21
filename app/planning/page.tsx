import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PlanningContent } from "@/components/planning-content"
import { Suspense } from "react"

function PlanningContentWrapper({ user }: { user: any }) {
  return <PlanningContent user={user} />
}

async function PlanningPageContent() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <PlanningContentWrapper user={user} />
}

export default function PlanningPage() {
  return (
    <Suspense fallback={<div className="p-6">Загрузка...</div>}>
      <PlanningPageContent />
    </Suspense>
  )
}

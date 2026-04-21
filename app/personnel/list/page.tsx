import { Suspense } from "react"
import { Personnel } from "@/components/reference/personnel"
import { getCurrentUser } from "@/lib/auth"

async function PersonnelListContent() {
  const user = await getCurrentUser()
  return <Personnel lockedUnitId={user?.unit_id?.toString()} navigateOnView={true} />
}

export default function PersonnelListPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">Загрузка...</div>}>
      <PersonnelListContent />
    </Suspense>
  )
}

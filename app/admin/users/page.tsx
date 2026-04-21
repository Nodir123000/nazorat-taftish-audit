import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { UsersManagement } from "@/components/admin/users-management"
import { PageHeader } from "@/components/page-header"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect("/login")

  return (
    <div className="space-y-6">
      <PageHeader title="Учёт пользователей" user={currentUser} />
      <UsersManagement currentUser={currentUser} />
    </div>
  )
}

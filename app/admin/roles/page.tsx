import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { RolesManagement } from "@/components/admin/roles-management"
import { PageHeader } from "@/components/page-header"
import { Icons } from "@/components/icons"

export default async function RolesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin" && user.role !== "chief_inspector") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Роли и права доступа" user={user} />
      <RolesManagement />
    </div>
  )
}

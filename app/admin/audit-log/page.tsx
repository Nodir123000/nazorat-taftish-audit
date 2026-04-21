import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AuditLogViewer } from "@/components/admin/audit-log-viewer"
import { PageHeader } from "@/components/page-header"
import { Icons } from "@/components/icons"

export default async function AuditLogPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin" && user.role !== "chief_inspector") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <PageHeader title="История изменений" user={user} />
      <AuditLogViewer />
    </div>
  )
}

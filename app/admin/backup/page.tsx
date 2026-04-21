import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ArchiveBackup } from "@/components/admin/archive-backup"
import { PageHeader } from "@/components/page-header"
import { Icons } from "@/components/icons"

export default async function BackupPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin" && user.role !== "chief_inspector") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Резервные копии" user={user} />
      <ArchiveBackup />
    </div>
  )
}

import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminContent } from "@/components/admin-content"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin" && user.role !== "chief_inspector") {
    redirect("/dashboard")
  }

  return <AdminContent user={user} />
}

import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DiagnosticsContent } from "@/components/diagnostics-content"

export default async function DiagnosticsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Optional: Check if user is admin if needed
  // if (user.role !== 'admin') redirect("/")

  return <DiagnosticsContent />
}

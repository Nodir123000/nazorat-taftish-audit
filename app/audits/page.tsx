import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AuditsContent } from "@/components/audits-content"

export default async function AuditsPage() {
  try {
    console.log(">>> [SERVER] Rendering AuditsPage");
    const user = await getCurrentUser()

    if (!user) {
      redirect("/login")
    }

    return <AuditsContent user={user} />
  } catch (error: any) {
    console.error(">>> [SERVER] AuditsPage Error:", error);
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h1 className="text-xl font-bold text-red-700">Audit Page Error</h1>
        <pre className="mt-4 p-4 bg-white border rounded text-sm overflow-auto max-w-full">
          {error instanceof Error ? error.stack : String(error)}
        </pre>
      </div>
    );
  }
}

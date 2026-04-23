export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ role: "viewer" })
    }
    return NextResponse.json({ role: user.role, user_id: user.user_id })
  } catch {
    return NextResponse.json({ role: "viewer" })
  }
}


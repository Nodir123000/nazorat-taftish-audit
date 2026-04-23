export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

// GET /api/planning/annual-plans/history?planId=123
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const planId = searchParams.get("planId")

  if (!planId || isNaN(Number(planId))) {
    return NextResponse.json({ error: "planId is required" }, { status: 400 })
  }

  try {
    const logs = await prisma.plan_change_log.findMany({
      where: { plan_id: Number(planId) },
      orderBy: { changed_at: "desc" },
    })

    return NextResponse.json(
      logs.map((l: any) => ({
        id: l.id,
        action: l.change_type,
        details: l.description,
        date: l.changed_at?.toISOString() ?? "",
      }))
    )
  } catch (error: any) {
    console.error("[plan history GET]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


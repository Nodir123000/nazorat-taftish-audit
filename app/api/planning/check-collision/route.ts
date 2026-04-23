import { NextResponse } from "next/server"
import { planningService } from "@/lib/services/planning-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const unitId = searchParams.get("unitId")
  const year = searchParams.get("year")
  const excludePlanId = searchParams.get("excludePlanId")

  if (!unitId || !year) {
    return NextResponse.json({ error: "Missing unitId or year" }, { status: 400 })
  }

  try {
    const result = await planningService.checkPlanCollision(
      Number(unitId),
      Number(year),
      excludePlanId ? Number(excludePlanId) : undefined
    )
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

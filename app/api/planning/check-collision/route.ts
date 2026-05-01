import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { collisionService } from "@/lib/services/collision-service"
import { logAudit } from "@/lib/server-audit"
import { logCollisionCheck } from "@/lib/services/audit-logging-service"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unitId = searchParams.get("unitId")
    const year = searchParams.get("year")
    const excludePlanId = searchParams.get("excludePlanId")

    if (!unitId || !year) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Use hierarchy-aware collision check
    const result = await collisionService.checkPlanCollisionWithHierarchy(
      parseInt(unitId as string),
      parseInt(year as string),
      user.user_id,
      excludePlanId ? parseInt(excludePlanId as string) : undefined
    )

    // Log collision check with specialized audit service
    const collisionsFound = result.hasCollision
      ? (result.plans?.length || (result.block ? 1 : 0))
      : 0;

    await logCollisionCheck(
      user.user_id.toString(),
      unitId as string,
      parseInt(year as string),
      collisionsFound,
      user.control_authority_id || 0
    );

    // Log check attempt with legacy audit
    await logAudit({
      userId: user.user_id,
      action: "COLLISION_CHECK",
      tableName: "rev_plan_year",
      newValue: {
        unit_id: unitId,
        year: year,
        result: result.hasCollision ? "COLLISION" : "CLEAR"
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[check-collision] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

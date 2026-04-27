export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { planningService } from "@/lib/services/planning-service"

/**
 * GET /api/planning/previous-period
 * Поиск последнего периода контроля для указанной воинской части и органа контроля.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const unitId = searchParams.get("unitId")
    const unitName = searchParams.get("unitName")
    const authorityCode = searchParams.get("authorityCode")
    const direction = searchParams.get("direction")

    if ((!unitId && !unitName) || !authorityCode) {
      return NextResponse.json(
        { success: false, error: "Необходимо указать unitId/unitName и authorityCode" },
        { status: 400 }
      )
    }

    const unitRef = unitId ? Number(unitId) : unitName!
    const data = await planningService.findLastControlPeriod(unitRef, authorityCode, direction || undefined)

    return NextResponse.json({
      success: true,
      data: data
    })
  } catch (error) {
    console.error("[API] Error fetching previous control period:", error)
    return NextResponse.json(
      { success: false, error: "Ошибка при поиске предыдущего периода контроля" },
      { status: 500 }
    )
  }
}


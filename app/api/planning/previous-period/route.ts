import { type NextRequest, NextResponse } from "next/server"
import { planningService } from "@/lib/services/planning-service"

/**
 * GET /api/planning/previous-period
 * Поиск последнего периода контроля для указанной воинской части и органа контроля.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const unitName = searchParams.get("unitName")
    const authorityCode = searchParams.get("authorityCode")

    if (!unitName || !authorityCode) {
      return NextResponse.json(
        { success: false, error: "Необходимо указать unitName и authorityCode" },
        { status: 400 }
      )
    }

    const data = await planningService.findLastControlPeriod(unitName, authorityCode)

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

export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

// GET /api/planning/inspector-assignments - Retrieve all inspector assignments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const planId = searchParams.get("planId")
    const personnelId = searchParams.get("inspectorId") // This mapping is used by the frontend

    const where: any = {}
    if (planId) where.orderId = Number(planId) // simplified link
    if (personnelId) where.personnel_id = Number(personnelId)

    // Ищем записи комиссий
    const assignments = await (prisma as any).commission_members.findMany({
      where,
      include: {
        orders: {
          include: {
            rev_plan_year: true
          }
        }
      },
      orderBy: { id: "desc" }
    })

    const result = assignments.map((cm: any) => {
      const plan = cm.orders?.rev_plan_year
      return {
        id: cm.id,
        recordId: `ИН-${cm.id}`,
        planNumber: plan?.plan_number || `План-${plan?.plan_id}`,
        controlObject: "—",
        inspector: cm.fullname || "—",
        role: cm.role || "Член группы",
        startDate: plan?.period_covered_start || "—",
        endDate: plan?.period_covered_end || "—",
        status: plan?.status || "pending",
        conflictOfInterest: "none",
        createdAt: cm.created_at || new Date().toISOString(),
      }
    })

    return NextResponse.json({
      success: true,
      data: result,
      total: result.length,
    })
  } catch (error: any) {
    console.error("[inspector-assignments] Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST /api/planning/inspector-assignments - Create new assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // In our system, assignments are created via the Orders Management logic,
    // so this method could be used for direct adjustments if needed.
    // For now, let's just log it.
    console.log("Direct assignment POST:", body);
    
    return NextResponse.json({ success: true, message: "Use /api/planning/orders/manage for official assignments" })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}



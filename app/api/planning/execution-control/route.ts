import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

// GET /api/planning/execution-control - Retrieve execution control data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get("year")
    const quarter = searchParams.get("quarter")

    const where: any = {}
    if (year) {
      const yearNum = Number.parseInt(year, 10)
      if (isNaN(yearNum)) return NextResponse.json({ success: false, error: "year must be a number" }, { status: 400 })
      where.rev_plan_year = { year: yearNum }
    }
    if (quarter) {
      const quarterNum = Number.parseInt(quarter, 10)
      if (isNaN(quarterNum)) return NextResponse.json({ success: false, error: "quarter must be a number" }, { status: 400 })
      where.quarter = quarterNum
    }

    const data = await prisma.quarterly_plans.findMany({
      where,
      include: {
        rev_plan_year: true
      },
      orderBy: [
        { year: 'desc' },
        { quarter: 'asc' }
      ]
    })

    const transformedData = data.map((q: any) => ({
      id: q.id,
      quarter: `${q.quarter} квартал ${q.year || ''}`,
      year: q.year,
      quarterNum: q.quarter,
      plannedAudits: q.planned_audits || 0,
      completedAudits: 0, // This has to be derived from related data later
      inProgressAudits: 0,
      notStartedAudits: q.planned_audits || 0,
      completionRate: 0,
      status: q.status,
    }))

    const totalPlanned = transformedData.reduce((sum: number, e: any) => sum + e.plannedAudits, 0)
    const totalCompleted = transformedData.reduce((sum: number, e: any) => sum + e.completedAudits, 0)

    return NextResponse.json({
      success: true,
      data: transformedData,
      total: transformedData.length,
      summary: {
        totalPlanned,
        totalCompleted,
        totalInProgress: 0,
        overallCompletionRate: totalPlanned ? Math.round((totalCompleted / totalPlanned) * 100) : 0,
      },
    })
  } catch (error) {
    console.error("[API] Error fetching execution control data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch execution control data" }, { status: 500 })
  }
}

// PUT /api/planning/execution-control - Update execution status
export async function PUT(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const updatedData = await prisma.quarterly_plans.update({
      where: { id: Number.parseInt(body.id) },
      data: {
        status: body.status,
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedData,
      message: "Execution control updated successfully",
    })
  } catch (error) {
    console.error("[API] Error updating execution control:", error)
    return NextResponse.json({ success: false, error: "Failed to update execution control" }, { status: 500 })
  }
}

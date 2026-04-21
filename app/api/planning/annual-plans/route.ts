import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

// GET /api/planning/annual-plans - Retrieve all annual plans
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get("year")
    const status = searchParams.get("status")
    const unitId = searchParams.get("unitId")

    const where: any = {}
    if (year) {
      const yearNum = Number.parseInt(year, 10)
      if (isNaN(yearNum)) return NextResponse.json({ success: false, error: "year must be a number" }, { status: 400 })
      where.year = yearNum
    }
    if (status) where.status = status
    if (unitId) {
      const unitIdNum = Number.parseInt(unitId, 10)
      if (isNaN(unitIdNum)) return NextResponse.json({ success: false, error: "unitId must be a number" }, { status: 400 })
      where.unit_id = unitIdNum
    }

    const data = await prisma.rev_plan_year.findMany({
      where,
      include: {
        ref_units: true,
        users_rev_plan_year_responsible_idTousers: true
      },
      orderBy: { year: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: data,
      total: data.length,
    })
  } catch (error) {
    console.error("[API] Error fetching annual plans:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch annual plans" }, { status: 500 })
  }
}

// POST /api/planning/annual-plans - Create new annual plan
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()

    if (!body.year || !body.unitId || !body.startDate || !body.endDate) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const start_date = new Date(body.startDate)
    const end_date = new Date(body.endDate)
    if (isNaN(start_date.getTime())) return NextResponse.json({ success: false, error: "Invalid startDate" }, { status: 400 })
    if (isNaN(end_date.getTime())) return NextResponse.json({ success: false, error: "Invalid endDate" }, { status: 400 })

    const data = await prisma.rev_plan_year.create({
      data: {
        year: Number.parseInt(body.year),
        plan_number: body.planNumber,
        start_date,
        end_date,
        unit_id: Number.parseInt(body.unitId),
        responsible_id: body.responsibleId ? Number.parseInt(body.responsibleId) : undefined,
        status: body.status || "draft",
        description: body.description,
      },
      include: {
        ref_units: true,
        users_rev_plan_year_responsible_idTousers: true
      }
    })

    return NextResponse.json(
      {
        success: true,
        data: data,
        message: "Annual plan created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[API] Error creating annual plan:", error)
    return NextResponse.json({ success: false, error: "Failed to create annual plan" }, { status: 500 })
  }
}

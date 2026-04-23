export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

// GET /api/planning/approved-plans - Retrieve all approved plans
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get("year")
    const status = searchParams.get("status") || "approved"
    const unitId = searchParams.get("unitId")

    const where: any = { status }
    if (year) where.year = Number.parseInt(year)
    if (unitId) where.unit_id = Number.parseInt(unitId)

    const data = await prisma.rev_plan_year.findMany({
      where,
      include: {
        ref_units: true,
        users_rev_plan_year_responsible_idTousers: true,
        users_rev_plan_year_approved_by_idTousers: true
      },
      orderBy: { approval_date: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data,
      total: data.length,
    })
  } catch (error) {
    console.error("[API] Error fetching approved plans:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch approved plans" }, { status: 500 })
  }
}

// POST /api/planning/approved-plans - Create new approved plan
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()

    if (!body.year || !body.unitId || !body.planNumber) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const data = await prisma.rev_plan_year.create({
      data: {
        year: Number.parseInt(body.year),
        plan_number: body.planNumber,
        unit_id: Number.parseInt(body.unitId),
        responsible_id: body.responsibleId ? Number.parseInt(body.responsibleId) : undefined,
        approved_by_id: body.approvedById ? Number.parseInt(body.approvedById) : undefined,
        approval_date: body.approvalDate ? new Date(body.approvalDate) : new Date(),
        status: "approved",
        start_date: body.startDate ? new Date(body.startDate) : new Date(),
        end_date: body.endDate ? new Date(body.endDate) : new Date(),
        description: body.description,
      },
      include: {
        ref_units: true,
        users_rev_plan_year_responsible_idTousers: true,
        users_rev_plan_year_approved_by_idTousers: true
      }
    })

    return NextResponse.json(
      {
        success: true,
        data,
        message: "Approved plan created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[API] Error creating approved plan:", error)
    return NextResponse.json({ success: false, error: "Failed to create approved plan" }, { status: 500 })
  }
}


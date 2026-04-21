import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

// GET /api/planning/annual-plans/[id] - Get specific annual plan
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await prisma.rev_plan_year.findUnique({
      where: { plan_id: Number.parseInt(id) },
      include: {
        ref_units: true,
        users_rev_plan_year_responsible_idTousers: true,
        quarterly_plans: true,
      }
    })

    if (!data) {
      return NextResponse.json({ success: false, error: "Plan not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: data })
  } catch (error) {
    console.error("[API] Error fetching annual plan:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch annual plan" }, { status: 500 })
  }
}

// PUT /api/planning/annual-plans/[id] - Update annual plan
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const { id: idStr } = await params
    const id = Number.parseInt(idStr)
    const body = await request.json()

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 })
    }

    const existing = await prisma.rev_plan_year.findUnique({
      where: { plan_id: id }
    })

    if (!existing) {
      return NextResponse.json({ success: false, error: "Plan not found" }, { status: 404 })
    }

    const updateData: any = {}
    if (body.year !== undefined) updateData.year = Number.parseInt(body.year)
    if (body.planNumber !== undefined) updateData.plan_number = body.planNumber
    if (body.status !== undefined) updateData.status = body.status
    if (body.description !== undefined) updateData.description = body.description
    if (body.startDate !== undefined) updateData.start_date = new Date(body.startDate)
    if (body.endDate !== undefined) updateData.end_date = new Date(body.endDate)
    if (body.unitId !== undefined) updateData.unit_id = Number.parseInt(body.unitId)
    if (body.responsibleId !== undefined) updateData.responsible_id = Number.parseInt(body.responsibleId)
    if (body.approvedById !== undefined) updateData.approved_by_id = Number.parseInt(body.approvedById)
    if (body.approvalDate !== undefined) updateData.approval_date = new Date(body.approvalDate)
    if (body.periodCoveredStart !== undefined) updateData.period_covered_start = body.periodCoveredStart ? new Date(body.periodCoveredStart) : null
    if (body.periodCoveredEnd !== undefined) updateData.period_covered_end = body.periodCoveredEnd ? new Date(body.periodCoveredEnd) : null

    const data = await prisma.rev_plan_year.update({
      where: { plan_id: id },
      data: updateData,
      include: {
        ref_units: true,
        users_rev_plan_year_responsible_idTousers: true
      }
    })

    return NextResponse.json({
      success: true,
      data: data,
      message: "Annual plan updated successfully",
    })
  } catch (error) {
    console.error("[API] Error updating annual plan:", error)
    return NextResponse.json({ success: false, error: "Failed to update annual plan" }, { status: 500 })
  }
}

// DELETE /api/planning/annual-plans/[id] - Delete annual plan
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const { id: idStr } = await params
    const id = Number.parseInt(idStr)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 })
    }

    const existing = await prisma.rev_plan_year.findUnique({
      where: { plan_id: id }
    })

    if (!existing) {
      return NextResponse.json({ success: false, error: "Plan not found" }, { status: 404 })
    }

    await prisma.rev_plan_year.delete({
      where: { plan_id: id }
    })

    return NextResponse.json({
      success: true,
      message: "Annual plan deleted successfully",
    })
  } catch (error) {
    console.error("[API] Error deleting annual plan:", error)
    return NextResponse.json({ success: false, error: "Failed to delete annual plan" }, { status: 500 })
  }
}

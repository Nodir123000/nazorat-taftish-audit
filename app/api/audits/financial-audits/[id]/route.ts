import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = Number.parseInt(idStr)

    const audit = await prisma.financial_audits.findUnique({
      where: { id },
      include: {
        financial_violations: true
      }
    })

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 })
    }

    return NextResponse.json(audit)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id: idStr } = await params
    const id = Number.parseInt(idStr)
    const body = await request.json()

    const updated = await prisma.financial_audits.update({
      where: { id },
      data: {
        unit: body.unit,
        unit_subtitle: body.unitSubtitle,
        control_body: body.controlBody,
        inspection_direction: body.inspectionDirection,
        inspection_direction_subtitle: body.inspectionDirectionSubtitle,
        inspection_type: body.inspectionType,
        date: body.date ? new Date(body.date) : undefined,
        cashier: body.cashier,
        cashier_role: body.cashierRole,
        balance: body.balance,
        status: body.status,
        inspector_id: body.inspectorId,
        inspector_name: body.inspectorName,
        prescription_id: body.prescriptionId
      }
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id: idStr } = await params
    const id = Number.parseInt(idStr)

    await prisma.financial_audits.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

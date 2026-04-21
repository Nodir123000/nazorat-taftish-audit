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

    const violation = await prisma.financial_violations.findUnique({
      where: { id }
    })

    if (!violation) {
      return NextResponse.json({ error: "Violation not found" }, { status: 404 })
    }

    return NextResponse.json(violation)
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

    const updated = await prisma.financial_violations.update({
      where: { id },
      data: {
        kind: body.kind,
        type: body.type,
        source: body.source,
        amount: body.amount !== undefined ? Number(body.amount) || 0 : undefined,
        recovered: body.recovered !== undefined ? Number(body.recovered) || 0 : undefined,
        count: body.count !== undefined ? Number(body.count) || 1 : undefined,
        responsible: body.responsible
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

    await prisma.financial_violations.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const inspectorId = searchParams.get("inspectorId")

    const where: any = {}
    if (inspectorId) {
      where.financial_audits = {
        inspector_id: Number(inspectorId)
      }
    }

    const violations = await prisma.financial_violations.findMany({
      where,
      include: {
        financial_audits: true, // Includes audit metadata (act number, dates, unit)
        financial_repayments: true // Includes payment history
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(violations)
  } catch (error: any) {
    console.error("[violations-api] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    if (!body.auditId) {
      return NextResponse.json({ error: "Audit ID is required" }, { status: 400 })
    }

    const newViolation = await prisma.financial_violations.create({
      data: {
        audit_id: Number(body.auditId),
        kind: body.kind,
        type: body.type,
        source: body.source,
        amount: Number(body.amount) || 0,
        recovered: Number(body.recovered) || 0,
        count: Number(body.count) || 1,
        responsible: body.responsible
      }
    })

    return NextResponse.json(newViolation)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

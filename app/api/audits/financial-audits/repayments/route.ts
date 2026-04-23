export const dynamic = "force-dynamic"
export const revalidate = 0
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

// GET /api/audits/financial-audits/repayments?violationId=123
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const violationId = searchParams.get("violationId")

    if (!violationId) {
      return NextResponse.json({ error: "violationId is required" }, { status: 400 })
    }

    const repayments = await prisma.financial_repayments.findMany({
      where: { violation_id: Number(violationId) },
      orderBy: { document_date: "asc" },
    })

    return NextResponse.json(repayments)
  } catch (error: any) {
    console.error("[repayments GET]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/audits/financial-audits/repayments
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { violation_id, dj_article, document_name, document_number, document_date, repaid_amount, remainder_after } = body

    if (!violation_id || repaid_amount == null) {
      return NextResponse.json({ error: "violation_id and repaid_amount are required" }, { status: 400 })
    }
    const amount = parseFloat(repaid_amount)
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "repaid_amount must be a positive number" }, { status: 400 })
    }

    const repayment = await (prisma as any).$transaction(async (tx: any) => {
      const created = await tx.financial_repayments.create({
        data: {
          violation_id: Number(violation_id),
          dj_article: dj_article ?? "",
          document_name: document_name ?? "",
          document_number: document_number ?? "",
          document_date: new Date(document_date ?? Date.now()),
          repaid_amount: repaid_amount,
          remainder_after: remainder_after ?? 0,
          updated_at: new Date(),
        },
      })

      const totalRepaid = await tx.financial_repayments.aggregate({
        where: { violation_id: Number(violation_id) },
        _sum: { repaid_amount: true },
      })

      await tx.financial_violations.update({
        where: { id: Number(violation_id) },
        data: { recovered: totalRepaid._sum.repaid_amount ?? 0 },
      })

      return created
    })

    return NextResponse.json(repayment, { status: 201 })
  } catch (error: any) {
    console.error("[repayments POST]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


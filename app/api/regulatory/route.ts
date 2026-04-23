export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)))

        const [documents, total] = await Promise.all([
            // @ts-ignore
            prisma.regulatory_documents.findMany({
                orderBy: { date: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            // @ts-ignore
            prisma.regulatory_documents.count(),
        ])
        return NextResponse.json({ items: documents, total, page, limit })
    } catch (error) {
        console.error("Failed to fetch regulatory documents:", error)
        return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json()
        // @ts-ignore
        const document = await prisma.regulatory_documents.create({
            data: {
                ...body,
                date: new Date(body.date)
            }
        })
        return NextResponse.json(document)
    } catch (error) {
        console.error("Failed to create regulatory document:", error)
        return NextResponse.json({ error: "Failed to create document" }, { status: 500 })
    }
}


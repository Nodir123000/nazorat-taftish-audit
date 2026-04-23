export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search") || ""

        const ranks = await prisma.ref_ranks.findMany({
            include: {
                ref_compositions: true
            },
            orderBy: [
                { composition_id: 'asc' },
                { rank_id: 'asc' }
            ]
        })

        if (search) {
            const query = search.toLowerCase()
            const filtered = ranks.filter((r: any) => {
                const nameObj = r.name as any
                return (
                    nameObj.ru?.toLowerCase().includes(query) ||
                    nameObj.uz?.toLowerCase().includes(query) ||
                    nameObj.uzk?.toLowerCase().includes(query)
                )
            })
            return NextResponse.json(filtered)
        }

        return NextResponse.json(ranks)
    } catch (error: any) {
        console.error("GET /api/ranks error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json()
        const { id, name, type, compositionId } = body

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 })
        }

        const rank = await prisma.ref_ranks.upsert({
            where: { rank_id: parseInt(id) },
            update: {
                name,
                type,
                composition_id: compositionId ? parseInt(compositionId) : null
            },
            create: {
                rank_id: parseInt(id),
                name,
                type,
                composition_id: compositionId ? parseInt(compositionId) : null
            }
        })

        return NextResponse.json(rank)
    } catch (error: any) {
        console.error("POST /api/ranks error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 })

        await prisma.ref_ranks.delete({
            where: { rank_id: parseInt(id) }
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("DELETE /api/ranks error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}




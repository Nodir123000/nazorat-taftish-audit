import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search") || ""

        const positions = await prisma.ref_positions.findMany({
            orderBy: {
                name: 'asc'
            }
        })

        if (search) {
            const query = search.toLowerCase()
            const filtered = positions.filter((v: any) => {
                const nameObj = v.name as any
                const code = v.code?.toLowerCase() || ""
                return (
                    code.includes(query) ||
                    nameObj.ru?.toLowerCase().includes(query) ||
                    nameObj.uz?.toLowerCase().includes(query) ||
                    nameObj.uzk?.toLowerCase().includes(query)
                )
            })
            return NextResponse.json(filtered)
        }

        return NextResponse.json(positions)
    } catch (error: any) {
        console.error("GET /api/positions error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json()
        const { code, name, status } = body

        if (!code || !name) {
            return NextResponse.json({ error: "Code and name are required" }, { status: 400 })
        }

        const position = await prisma.ref_positions.upsert({
            where: { code: code.toString() },
            update: {
                name,
                status: status || 'active'
            },
            create: {
                id: body.id ? parseInt(body.id) : Math.floor(Math.random() * 1000000),
                code: code.toString(),
                name,
                status: status || 'active'
            }
        })

        return NextResponse.json(position)
    } catch (error: any) {
        console.error("POST /api/positions error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search") || ""

        const vusList = await prisma.ref_vus_list.findMany({
            orderBy: {
                code: 'asc'
            }
        })

        if (search) {
            const query = search.toLowerCase()
            const filtered = (vusList as any[]).filter((v: any) => {
                const nameObj = (v.name || {}) as any
                const code = (v.code || "").toLowerCase()
                return (
                    code.includes(query) ||
                    nameObj.ru?.toLowerCase().includes(query) ||
                    nameObj.uz?.toLowerCase().includes(query) ||
                    nameObj.uzk?.toLowerCase().includes(query)
                )
            })
            return NextResponse.json(filtered)
        }

        return NextResponse.json(vusList)
    } catch (error: any) {
        console.error("Failed to fetch VUS:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json()
        const { id, code, name, status } = body

        if (!code || !name) {
            return NextResponse.json({ error: "Code and name are required" }, { status: 400 })
        }

        const vus = await prisma.ref_vus_list.upsert({
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

        return NextResponse.json(vus)
    } catch (error: any) {
        console.error("Error saving VUS:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}




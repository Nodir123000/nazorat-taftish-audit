export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search") || ""

        const supplyDepartments = await prisma.ref_supply_departments.findMany({
            orderBy: { id: 'asc' }
        })

        if (search) {
            const query = search.toLowerCase()
            const filtered = (supplyDepartments as any[]).filter((v: any) => {
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

        return NextResponse.json(supplyDepartments)
    } catch (error: any) {
        console.error("Failed to fetch supply departments:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json()
        const { code, name, shortName, status } = body

        if (!code || !name) {
            return NextResponse.json({ error: "Code and name are required" }, { status: 400 })
        }

        const supplyDept = await prisma.ref_supply_departments.upsert({
            where: { code: code.toString() },
            update: {
                name,
                short_name: shortName || null,
                status: status || 'active'
            },
            create: {
                code: code.toString(),
                name,
                short_name: shortName || null,
                status: status || 'active'
            }
        })

        return NextResponse.json(supplyDept)
    } catch (error: any) {
        console.error("Error saving supply department:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


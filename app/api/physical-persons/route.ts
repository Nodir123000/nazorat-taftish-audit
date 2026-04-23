export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { getPhysicalPersons, getPhysicalPersonsCount } from "@/lib/services/reference-db-service"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search") || ""
        const skip = parseInt(searchParams.get("skip") || "0", 10)
        const limit = parseInt(searchParams.get("limit") || "50", 10)

        const [data, total] = await Promise.all([
            getPhysicalPersons({ search, skip, take: limit }),
            getPhysicalPersonsCount({ search })
        ])

        return NextResponse.json({ data, total })
    } catch (error: any) {
        console.error("GET /api/physical-persons error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


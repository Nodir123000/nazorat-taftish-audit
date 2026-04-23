export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { getAreas } from "@/lib/services/reference-db-service"

export async function GET() {
    try {
        const areas = await getAreas()
        return NextResponse.json(areas)
    } catch (error) {
        console.error("Failed to fetch areas:", error)
        return NextResponse.json({ error: "Failed to fetch areas" }, { status: 500 })
    }
}


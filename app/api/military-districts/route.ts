import { NextResponse } from "next/server"
import { getDistricts } from "@/lib/services/reference-db-service"

export async function GET() {
    try {
        const districts = await getDistricts()
        return NextResponse.json(districts)
    } catch (error) {
        console.error("Failed to fetch military districts:", error)
        return NextResponse.json({ error: "Failed to fetch military districts" }, { status: 500 })
    }
}

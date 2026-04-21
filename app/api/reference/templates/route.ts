import { NextRequest, NextResponse } from "next/server"
import { planningService } from "@/lib/services/planning-service"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get("type") || undefined
        const templates = await planningService.getTemplates(type)
        return NextResponse.json(templates)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const data = await request.json()
        const { id, ...rest } = data
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })
        const template = await planningService.upsertTemplate(id, rest)
        return NextResponse.json(template)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })
        await planningService.deleteTemplate(id)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

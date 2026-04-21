import { NextRequest, NextResponse } from "next/server"
import { planningService } from "@/lib/services/planning-service"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const plan_id = searchParams.get("plan_id")
        if (!plan_id) return NextResponse.json({ error: "plan_id is required" }, { status: 400 })
        const items = await planningService.getBriefings({ plan_id })
        return NextResponse.json(items)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        // instructorId может прийти как строка-имя — подставляем текущего пользователя
        if (!data.instructorId || isNaN(Number(data.instructorId))) {
            const currentUser = await getCurrentUser()
            if (currentUser) data.instructorId = currentUser.user_id
        }
        const item = await planningService.createBriefing(data)
        return NextResponse.json(item)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
        await planningService.deleteBriefing(id)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

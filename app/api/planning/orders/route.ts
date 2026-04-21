import { NextRequest, NextResponse } from "next/server"
import { planningService } from "@/lib/services/planning-service"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const plan_id = searchParams.get("plan_id")
        const items = await planningService.getOrders({ plan_id })
        return NextResponse.json(items)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        // issuerId может не прийти или прийти как строка-имя — подставляем текущего пользователя
        if (!data.issuerId || isNaN(Number(data.issuerId))) {
            const currentUser = await getCurrentUser()
            if (currentUser) data.issuerId = currentUser.user_id
        }
        const order = await planningService.createOrder(data)

        // If commission members are provided, add them
        if (data.commissionMembers && Array.isArray(data.commissionMembers)) {
            for (const member of data.commissionMembers) {
                await planningService.addCommissionMember({
                    orderId: order.id,
                    auditId: data.auditId || null,
                    userId: member.userId,
                    role: member.role,
                    isResponsible: member.isResponsible
                })
            }
        }

        return NextResponse.json(order)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
        const data = await request.json()
        
        // 1. Update the order itself
        const order = await planningService.updateOrder(id, data)

        // 2. Update commission members if provided
        if (data.commissionMembers && Array.isArray(data.commissionMembers)) {
            // First, remove old members for this order
            await planningService.deleteCommissionMembersByOrder(Number(id))
            
            // Add new members
            for (const member of data.commissionMembers) {
                await planningService.addCommissionMember({
                    orderId: Number(id),
                    auditId: data.auditId || null,
                    userId: member.userId,
                    role: member.role,
                    isResponsible: member.isResponsible
                })
            }
        }

        return NextResponse.json(order)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
        await planningService.deleteOrder(id)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

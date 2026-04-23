export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { planningService } from "../../../../../lib/services/planning-service"
import { getCurrentUser } from "../../../../../lib/auth"

export async function POST(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const data = await request.json()
        const planIdNum = Number(data.planId)

        if (!data.planId || isNaN(planIdNum) || planIdNum <= 0) {
            return NextResponse.json({ error: "planId is required and must be a positive number" }, { status: 400 })
        }

        console.log(`[Manage-All] Processing Plan ID: ${planIdNum}`);

        const issuerId = currentUser.user_id;

        // 1. Manage ORDER
        const orderRes = await planningService.getOrders({ plan_id: planIdNum })
        let order;
        try {
            if (orderRes.items && orderRes.items.length > 0) {
                const existingOrder = orderRes.items[0];
                console.log(`[Manage-All] Updating existing Order ID: ${existingOrder.id}`);
                order = await planningService.updateOrder(existingOrder.id, {
                    orderNumber: data.orderNumber,
                    orderDate: data.orderDate
                })
            } else {
                console.log(`[Manage-All] Creating new Order for Plan: ${planIdNum}`);
                order = await planningService.createOrder({
                    planId: planIdNum,
                    orderNumber: data.orderNumber || `П-${Date.now()}`,
                    orderDate: data.orderDate || new Date(),
                    issuerId: issuerId
                })
            }
        } catch (err: any) {
            console.error(`[Manage-All] Order Error: ${err.message}`);
            throw new Error(`Ошибка при работе с приказом: ${err.message}`);
        }

        // 2. Manage BRIEFING
        if (data.briefingDate) {
            try {
                const briefings = await planningService.getBriefings({ plan_id: planIdNum })
                if (briefings && briefings.length > 0) {
                    console.log(`[Manage-All] Updating Briefing: ${briefings[0].id}`);
                    await planningService.updateBriefingTopic(briefings[0].id, {
                        instructionDate: data.briefingDate
                    })
                } else {
                    console.log(`[Manage-All] Creating New Briefing`);
                    await planningService.createBriefing({
                        planId: planIdNum,
                        instructionDate: data.briefingDate,
                        instructorId: issuerId,
                        content: "Плановый инструктаж"
                    })
                }
            } catch (err: any) {
                console.error(`[Manage-All] Briefing Error: ${err.message}`);
            }
        }

        // 3. Manage PRESCRIPTION
        if (data.prescriptionNumber) {
            try {
                const prescriptions = await planningService.getPrescriptions({ plan_id: planIdNum })
                if (prescriptions && prescriptions.length > 0) {
                    console.log(`[Manage-All] Updating Prescription: ${prescriptions[0].id}`);
                    await planningService.updatePrescription(prescriptions[0].id, {
                        prescriptionNum: data.prescriptionNumber,
                        date: data.prescriptionDate,
                        requirements: "Соблюдать финансовую дисциплину"
                    })
                } else {
                    console.log(`[Manage-All] Creating New Prescription`);
                    await planningService.createPrescription({
                        planId: planIdNum,
                        prescriptionNum: data.prescriptionNumber,
                        date: data.prescriptionDate || new Date(),
                        issuerId: issuerId,
                        requirements: "Соблюдать финансовую дисциплину"
                    })
                }
            } catch (err: any) {
                console.error(`[Manage-All] Prescription Error: ${err.message}`);
            }
        }

        // 4. Sync COMMISSION members
        if (data.commission && Array.isArray(data.commission)) {
            try {
                console.log(`[Manage-All] Syncing ${data.commission.length} Commission Members`);
                await planningService.deleteCommissionMembersByOrder(order.id)
                for (const member of data.commission) {
                    if (member.userId) {
                        await planningService.addCommissionMember({
                            orderId: order.id,
                            userId: Number(member.userId),
                            role: member.role,
                            isResponsible: member.role === "Председатель комиссии"
                        })
                    }
                }
            } catch (err: any) {
                console.error(`[Manage-All] Commission Error: ${err.message}`);
            }
        }

        console.log(`[Manage-All] SUCCESS for Plan: ${planIdNum}`);
        return NextResponse.json({ success: true, orderId: order.id })
    } catch (error: any) {
        console.error("Manage-all error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

/**
 * GET /api/planning/commission-assignments?personnelId=123
 * Возвращает все планы, в которых данный пользователь (personnelId) 
 * назначен в состав контрольной группы (chairman / member / specialist)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const personnelId = searchParams.get("personnelId")
        const userId = searchParams.get("userId")
        const from = searchParams.get("from")
        const to = searchParams.get("to")
        const excludeOrderId = searchParams.get("excludeOrderId")

        if (!personnelId && !userId) {
            return NextResponse.json({ error: "personnelId or userId is required" }, { status: 400 })
        }

        // --- Fast conflict check mode (userId + period) ---
        if (userId && (from || to)) {
            const uid = parseInt(userId)
            const conflicts = await (prisma as any).commission_members.findMany({
                where: {
                    user_id: uid,
                    ...(excludeOrderId ? { order_id: { not: parseInt(excludeOrderId) } } : {}),
                },
                include: {
                    orders: {
                        select: {
                            id: true,
                            order_number: true,
                            rev_plan_year: {
                                select: {
                                    period_covered_start: true,
                                    period_covered_end: true,
                                    unit: { select: { name: true } }
                                }
                            }
                        }
                    }
                }
            })
            const fromDate = from ? new Date(from) : null
            const toDate = to ? new Date(to) : null
            const overlapping = conflicts.filter((c: any) => {
                const plan = c.orders?.rev_plan_year
                if (!plan?.period_covered_start || !plan?.period_covered_end) return false
                const start = new Date(plan.period_covered_start)
                const end = new Date(plan.period_covered_end)
                const overlaps = (!fromDate || start <= toDate!) && (!toDate || end >= fromDate!)
                return overlaps
            })
            return NextResponse.json({
                success: true,
                hasConflict: overlapping.length > 0,
                data: overlapping.map((c: any) => {
                    const plan = c.orders?.rev_plan_year
                    const unitName = typeof plan?.unit?.name === "object"
                        ? (plan.unit.name as any)?.ru || ""
                        : plan?.unit?.name || "—"
                    return {
                        orderId: c.order_id,
                        orderNumber: c.orders?.order_number || "—",
                        role: c.role,
                        controlObject: unitName,
                        period: plan?.period_covered_start && plan?.period_covered_end
                            ? `${new Date(plan.period_covered_start).toLocaleDateString("ru-RU")} – ${new Date(plan.period_covered_end).toLocaleDateString("ru-RU")}`
                            : "—"
                    }
                })
            })
        }

        const pId = personnelId ? Number(personnelId) : null
        if (pId !== null && isNaN(pId)) {
            return NextResponse.json({ error: "personnelId must be a number" }, { status: 400 })
        }

        if (!pId) {
            return NextResponse.json({ success: true, data: [], total: 0 })
        }

        // Search for personnel record
        const person = await prisma.personnel.findUnique({
            where: { id: pId },
            select: { full_name: true }
        })

        let resolvedUserId: number | null = null
        if (person?.full_name) {
            const u = await prisma.users.findFirst({
                where: { fullname: person.full_name },
                select: { user_id: true }
            })
            if (u) resolvedUserId = u.user_id
        }

        // 1. Fetch commission memberships
        const assignments = await (prisma as any).commission_members.findMany({
            where: {
                OR: [
                    { personnel_id: pId },
                    ...(resolvedUserId ? [{ user_id: resolvedUserId }] : [])
                ]
            },
            orderBy: { id: "desc" }
        })

        if (!assignments.length) {
            return NextResponse.json({ success: true, data: [], total: 0 })
        }

        // 2. Map data and fetch associated records manually to avoid Prisma nested include bugs
        const result = []
        for (const cm of assignments) {
            // Fetch Order
            const order = await prisma.orders.findUnique({
                where: { id: cm.order_id },
                include: { rev_plan_year: true } as any
            })

            if (!order) continue;

            const plan = order.rev_plan_year;
            let unit = null;
            let direction = null;
            let authority = null;

            // Fetch Plan Relations if exists
            if (plan) {
                if (plan.unit_id) {
                    unit = await prisma.ref_units.findUnique({
                        where: { unit_id: plan.unit_id },
                        include: { ref_military_districts: true } as any
                    })
                }
                if (plan.inspection_direction_id) {
                    direction = await (prisma as any).ref_control_directions.findUnique({
                        where: { direction_id: plan.inspection_direction_id }
                    })
                }
                if (plan.control_authority_id) {
                    authority = await (prisma as any).ref_control_authorities.findUnique({
                        where: { authority_id: plan.control_authority_id }
                    })
                }
            }

            // Fetch latest Briefing and Prescription for the plan
            const briefing = plan ? await prisma.briefings.findFirst({
                where: { plan_id: plan.plan_id },
                orderBy: { id: "desc" }
            }) : null

            const prescription = plan ? await prisma.prescriptions.findFirst({
                where: { plan_id: plan.plan_id },
                orderBy: { id: "desc" }
            }) : null

            const getLoc = (obj: any): string => {
                if (!obj?.name) return ""
                if (typeof obj.name === "string") return obj.name
                return obj.name?.ru || obj.name?.uz || ""
            }

            result.push({
                assignmentId: cm.id,
                planId: plan?.plan_id ?? null,
                planNumber: plan?.plan_number || (plan?.plan_id ? `ГП-${plan.plan_id}` : "—"),
                controlObject: getLoc(unit) || "—",
                controlObjectSubtitle: getLoc(unit?.ref_military_districts) || "",
                role: cm.role || "Член комиссии",
                isResponsible: cm.is_responsible || false,
                orderNumber: order?.order_number || "—",
                orderDate: order?.order_date
                    ? new Date(order.order_date).toLocaleDateString("ru-RU")
                    : "—",
                period: plan?.period_covered_start && plan?.period_covered_end
                    ? `${new Date(plan.period_covered_start).toLocaleDateString("ru-RU")} – ${new Date(plan.period_covered_end).toLocaleDateString("ru-RU")}`
                    : "—",
                status: plan?.status || "—",
                year: plan?.year || null,
                inspectionDirection: direction?.code || authority?.code || "",
                inspectionDirectionLabel: getLoc(direction) || getLoc(authority) || "",
                briefingDate: briefing?.instruction_date 
                    ? new Date(briefing.instruction_date).toLocaleDateString("ru-RU") 
                    : null,
                prescriptionNum: prescription?.prescription_num || null,
                prescriptionDate: prescription?.date 
                    ? new Date(prescription.date).toLocaleDateString("ru-RU") 
                    : null,
                financialAuditId: prescription ? (await prisma.financial_audits.findFirst({
                    where: { prescription_id: prescription.id },
                    select: { id: true }
                }))?.id || null : null,
            })
        }

        return NextResponse.json({ success: true, data: result, total: result.length })
    } catch (error: any) {
        console.error("[commission-assignments] Critical Error:", error)
        return NextResponse.json({ 
            success: false, 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 })
    }
}


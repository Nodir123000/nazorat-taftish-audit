export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { planningService } from "../../../../../lib/services/planning-service"
import { prisma } from "../../../../../lib/db/prisma"
import { getCurrentUser } from "../../../../../lib/auth"

// Localized defaults for fallback
const DEFAULTS: Record<string, Record<string, string>> = {
    briefing: {
        ru: "Плановый инструктаж перед проведением контрольно-ревизионных мероприятий",
        uz: "Nazorat-taftish tadbirlarini o'tkazishdan oldin rejalashtirilgan yo'riqnoma",
        uzk: "Назорат-тафтиш тадбирларини ўтказишдан олдин режалаштирилган йўриқнома"
    },
    prescription: {
        ru: "Соблюдать финансовую дисциплину и требования действующего законодательства",
        uz: "Moliyaviy intizom va amaldagi qonunchilik talablariga rioya qiling",
        uzk: "Молиявий интизом ва амалдаги қонунчилик талабларига риоя қилинг"
    }
}

async function getLocalizedText(key: string, lang: string, fallbackType: 'briefing' | 'prescription'): Promise<string> {
    try {
        const tr = await (prisma as any).ui_translations.findUnique({ where: { key } });
        if (tr && tr.name && typeof tr.name === 'object') {
            const val = (tr.name as any)[lang] || (tr.name as any)['ru'];
            if (val) return val;
        }
    } catch (e) {
        console.warn(`[Manage-API] Failed to fetch translation for key: ${key}`);
    }
    const fb = DEFAULTS[fallbackType];
    return fb[lang] || fb['ru'] || "Default text";
}

export async function POST(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const data = await request.json()
        const lang = data.lang || 'ru';
        
        let planIdNum = Number(data.planId);
        
        // Robust ID resolution: handles both DB IDs and "GP-..." plan numbers
        if (isNaN(planIdNum) && typeof data.planId === 'string') {
            console.log(`[Manage] Attempting to resolve plan by number: ${data.planId}`);
            const plan = await prisma.rev_plan_year.findFirst({
                where: { plan_number: data.planId }
            });
            if (plan) {
                planIdNum = plan.plan_id;
                console.log(`[Manage] Resolved ${data.planId} to numeric ID: ${planIdNum}`);
            }
        }
        
        if (!planIdNum || isNaN(planIdNum)) {
            return NextResponse.json({ error: `Некорректный ID плана: ${data.planId}. Требуется число или существующий номер плана.` }, { status: 400 })
        }

        console.log(`[Manage] Processing Plan ID: ${planIdNum} (${lang})`);

        const issuerId = currentUser.user_id;

        // 1. Manage ORDER
        const orderRes = await planningService.getOrders({ plan_id: planIdNum })
        let order;
        
        // Uniqueness check for Order Number
        if (data.orderNumber) {
            const duplicateOrder = await prisma.orders.findFirst({
                where: { 
                    order_number: data.orderNumber,
                    NOT: orderRes.items && orderRes.items.length > 0 ? { id: orderRes.items[0].id } : undefined
                }
            });
            if (duplicateOrder) {
                return NextResponse.json({ error: `Приказ с номером "${data.orderNumber}" уже существует в системе.` }, { status: 400 });
            }
        }

        try {
            if (orderRes.items && orderRes.items.length > 0) {
                const existingOrder = orderRes.items[0];
                order = await planningService.updateOrder(existingOrder.id, {
                    orderNumber: data.orderNumber,
                    orderDate: data.orderNumber ? (data.orderDate || new Date()) : undefined
                })
            } else {
                order = await planningService.createOrder({
                    planId: planIdNum,
                    orderNumber: data.orderNumber || `П-${Date.now()}`,
                    orderDate: data.orderDate || new Date(),
                    issuerId: issuerId
                })
            }
        } catch (err: any) {
            console.error(`[Manage] Order Error: ${err.message}`);
            throw new Error(`Ошибка при работе с приказом: ${err.message}`);
        }

        // 2. Manage BRIEFING
        if (data.briefingDate) {
            try {
                const briefings = await planningService.getBriefings({ plan_id: planIdNum })
                const localizedContent = await getLocalizedText('briefing.default.content', lang, 'briefing');
                
                if (briefings && briefings.length > 0) {
                    await planningService.updateBriefingTopic(briefings[0].id, {
                        instructionDate: data.briefingDate
                    })
                } else {
                    await planningService.createBriefing({
                        planId: planIdNum,
                        instructionDate: data.briefingDate,
                        instructorId: issuerId,
                        content: localizedContent
                    })
                }
            } catch (err: any) {
                console.error(`[Manage] Briefing Error: ${err.message}`);
            }
        }

        // 3. Manage PRESCRIPTION
        let prescriptionRecord = null;
        if (data.prescriptionNumber) {
            try {
                const prescriptions = await planningService.getPrescriptions({ plan_id: planIdNum })
                const localizedReqs = await getLocalizedText('prescription.default.requirements', lang, 'prescription');

                // Uniqueness check for Prescription Number
                const duplicatePresc = await (prisma as any).prescriptions.findFirst({
                    where: { 
                        prescription_num: data.prescriptionNumber,
                        NOT: prescriptions && prescriptions.length > 0 ? { id: prescriptions[0].id } : undefined
                    }
                });
                if (duplicatePresc) {
                    return NextResponse.json({ error: `Предписание с номером "${data.prescriptionNumber}" уже существует.` }, { status: 400 });
                }

                if (prescriptions && prescriptions.length > 0) {
                    prescriptionRecord = await planningService.updatePrescription(prescriptions[0].id, {
                        prescriptionNum: data.prescriptionNumber,
                        date: data.prescriptionDate,
                        requirements: localizedReqs
                    })
                    if(!prescriptionRecord) prescriptionRecord = prescriptions[0];
                } else {
                    prescriptionRecord = await planningService.createPrescription({
                        planId: planIdNum,
                        prescriptionNum: data.prescriptionNumber,
                        date: data.prescriptionDate || new Date(),
                        issuerId: issuerId,
                        requirements: localizedReqs
                    })
                }
            } catch (err: any) {
                console.error(`[Manage] Prescription Error: ${err.message}`);
            }
        }

        // 4. Sync COMMISSION members
        if (data.commission && Array.isArray(data.commission)) {
            try {
                // To avoid ID issues with mock/real mixing, we use the confirmed order.id
                await planningService.deleteCommissionMembersByOrder(order.id)
                for (const member of data.commission) {
                    if (member.userId || member.personnelId) {
                        await planningService.addCommissionMember({
                            orderId: order.id,
                            userId: member.userId ? Number(member.userId) : null,
                            personnelId: member.personnelId ? Number(member.personnelId) : null,
                            role: member.role,
                            isResponsible: member.role === "Председатель комиссии"
                        })
                    }
                }
            } catch (err: any) {
                console.error(`[Manage] Commission Error: ${err.message}`);
            }
        }

        // 5. Auto-create Financial Audit (Act) for the Plan
        if (prescriptionRecord && prescriptionRecord.id) {
            try {
                // Find Chairman or first member to assign
                let chairman = data.commission?.find((m: any) => m.role === "Председатель комиссии" || m.isResponsible);
                if (!chairman && data.commission && data.commission.length > 0) {
                    chairman = data.commission[0];
                }
                
                const existingAudit = await prisma.financial_audits.findFirst({
                    where: { prescription_id: prescriptionRecord.id }
                });

                if (!existingAudit) {
                    // Fetch plan details to populate the audit
                    const planDetails = await prisma.rev_plan_year.findUnique({
                        where: { plan_id: planIdNum },
                        include: {
                            ref_units: { include: { ref_military_districts: true } } as any,
                            ref_control_directions: true as any,
                            ref_control_authorities: true as any
                        } as any
                    });

                    if (planDetails) {
                        const getLoc = (obj: any): string => {
                            if (!obj?.name) return ""
                            if (typeof obj.name === "string") return obj.name
                            return obj.name?.ru || obj.name?.uz || ""
                        }

                        const unitName = getLoc((planDetails as any).ref_units);
                        let unitSubtitle = "";
                        if ((planDetails as any).ref_units?.ref_military_districts) {
                            unitSubtitle = getLoc((planDetails as any).ref_units.ref_military_districts);
                        }
                        const direction = planDetails.inspection_direction_id ? getLoc((planDetails as any).ref_control_directions) : "";
                        const authority = planDetails.control_authority_id ? getLoc((planDetails as any).ref_control_authorities) : "";

                        let inspectorName = "";
                        if (chairman?.personnelId) {
                            const pId = Number(chairman.personnelId);
                            if (!isNaN(pId)) {
                                const person = await prisma.personnel.findUnique({ where: { id: pId }});
                                if (person) inspectorName = person.full_name || "";
                            }
                        }

                        await prisma.financial_audits.create({
                            data: {
                                unit: unitName || "Не указано",
                                unit_subtitle: unitSubtitle || "",
                                control_body: authority || "",
                                inspection_direction: direction || authority || "",
                                status: "Черновик",
                                date: new Date(),
                                prescription_id: prescriptionRecord.id,
                                inspector_id: chairman?.personnelId ? Number(chairman.personnelId) : null,
                                inspector_name: inspectorName
                            }
                        });
                        console.log(`[Manage] Auto-created draft financial audit for Prescription ID: ${prescriptionRecord.id}`);
                    }
                }
            } catch (err: any) {
                console.error(`[Manage] Auto-create Audit Error: ${err.message}`);
            }
        }

        // 6. Update Plan Status to Approved (101) if not already
        try {
            await prisma.rev_plan_year.update({
                where: { plan_id: planIdNum },
                data: { status: "101" } // 101 is "Утвержден" / "Approved"
            });
            console.log(`[Manage] Updated Plan ID ${planIdNum} status to Approved (101)`);
        } catch (err: any) {
            console.error(`[Manage] Plan Status Update Error: ${err.message}`);
        }

        return NextResponse.json({ success: true, orderId: order.id })
    } catch (error: any) {
        console.error("Manage error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


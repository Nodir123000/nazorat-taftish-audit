import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const pId = 1;

    const person = await prisma.personnel.findUnique({ where: { id: pId }, select: { full_name: true } });
    let userId: number | null = null;
    if (person?.full_name) {
        const user = await prisma.users.findFirst({ where: { fullname: person.full_name }, select: { user_id: true } });
        if (user) userId = user.user_id;
    }

    const assignments = await (prisma as any).commission_members.findMany({
        where: { OR: [ { personnel_id: pId }, ...(userId ? [{ user_id: userId }] : []) ] },
        select: { order_id: true }
    });

    const orderIds = assignments.map((a: any) => a.order_id);
    let prescriptionIds: number[] = [];

    if (orderIds.length > 0) {
        const orders = await prisma.orders.findMany({
            where: { id: { in: orderIds } },
            select: { plan_id: true }
        });
        const planIds = orders.map(o => o.plan_id).filter(id => id !== null) as number[];

        if (planIds.length > 0) {
            const prescriptions = await prisma.prescriptions.findMany({
                where: { plan_id: { in: planIds } },
                select: { id: true }
            });
            prescriptionIds = prescriptions.map(p => p.id);
        }
    }

    // AUTO-GENERATE DRAFT AUDITS FOR NEW ASSIGNMENTS
    if (prescriptionIds.length > 0 && pId && person?.full_name) {
        const existingAudits = await prisma.financial_audits.findMany({
            where: { prescription_id: { in: prescriptionIds } },
            select: { prescription_id: true }
        });
        const existingPrescriptionIds = new Set(existingAudits.map((a: any) => a.prescription_id));
        const missingPrescriptionIds = prescriptionIds.filter(id => !existingPrescriptionIds.has(id));

        if (missingPrescriptionIds.length > 0) {
            const getLoc = (obj: any): string => {
                if (!obj?.name) return "";
                if (typeof obj.name === "string") return obj.name;
                return obj.name?.ru || obj.name?.uz || "";
            };

            for (const mId of missingPrescriptionIds) {
                const pres = (await prisma.prescriptions.findUnique({
                    where: { id: mId },
                    include: { 
                        rev_plan_year: { 
                            include: { 
                                ref_units: { include: { ref_military_districts: true } }, 
                                ref_control_authorities: true, 
                                ref_control_directions: true 
                            } 
                        } 
                    }
                })) as any;

                if (pres && pres.rev_plan_year) {
                    const plan = pres.rev_plan_year as any;
                    const unitName = getLoc(plan.ref_units);
                    const unitSubtitle = plan.ref_units?.ref_military_districts?.name_ru || getLoc(plan.ref_units?.ref_military_districts) || "";
                    const controlBody = getLoc(plan.ref_control_authorities) || "КРУ МО РУз";
                    const directionCode = plan.ref_control_directions?.code || "";
                    const directionName = getLoc(plan.ref_control_directions) || directionCode;

                    let type = "Комплексная";
                    if (directionCode.includes("FIN")) type = "Финансовая";
                    if (directionCode.includes("ECO")) type = "Хозяйственная";

                    console.log("Will create:", {
                        unit: unitName || "Не указан объект",
                        unit_subtitle: unitSubtitle,
                        control_body: controlBody,
                        inspection_direction: directionName || "Плановая проверка",
                        inspection_type: type,
                        status: "Черновик",
                        date: new Date(),
                        inspector_id: pId,
                        inspector_name: person.full_name,
                        prescription_id: mId
                    });
                    
                    await prisma.financial_audits.create({
                        data: {
                            unit: unitName || "Не указан объект",
                            unit_subtitle: unitSubtitle,
                            control_body: controlBody,
                            inspection_direction: directionName || "Плановая проверка",
                            inspection_type: type,
                            status: "Черновик",
                            date: new Date(),
                            inspector_id: pId,
                            inspector_name: person.full_name,
                            prescription_id: mId
                        }
                    });
                }
            }
        }
    }
    console.log("Done");
}

main().catch(console.error).finally(() => prisma.$disconnect());

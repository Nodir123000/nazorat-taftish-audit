import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const pId = 1;
    let person = await prisma.personnel.findUnique({ where: { id: pId } })
    if (!person) {
        person = await prisma.personnel.create({
            data: {
                id: pId,
                full_name: "Фазилов Рустам Джураевич",
                physical_person_id: 1, // Added missing required field based on schema
            }
        });
        console.log("Created Person 1");
    } else if (!person.full_name) {
        person = await prisma.personnel.update({
            where: { id: pId },
            data: { full_name: "Фазилов Рустам Джураевич" }
        });
    }
    
    console.log("Found Inspector:", person?.full_name);

    const user = await prisma.users.findFirst({ select: { user_id: true } })
    const uid = user ? user.user_id : 1;

    const CA1 = await prisma.ref_control_authorities.findFirst()
    const CD1 = await prisma.ref_control_directions.findFirst({ skip: 0 })
    const CD2 = await prisma.ref_control_directions.findFirst({ skip: 1 })

    if (!CA1 || !CD1 || !CD2) {
        console.log("Not enough reference data to create mock records");
        return;
    }

    let plan1 = await prisma.rev_plan_year.findFirst({ where: { plan_number: "ГП-TEST-1" } })
    if (!plan1) {
        plan1 = await prisma.rev_plan_year.create({
            data: {
                year: 2026,
                plan_number: "ГП-TEST-1",
                start_date: new Date("2026-05-01"),
                end_date: new Date("2026-05-31"),
                description: "Финансовая проверка воинской части",
                status: "approved",
                control_authority_id: CA1.authority_id,
                inspection_direction_id: CD1.direction_id,
            }
        })
    }

    let plan2 = await prisma.rev_plan_year.findFirst({ where: { plan_number: "ГП-TEST-2" } })
    if (!plan2) {
        plan2 = await prisma.rev_plan_year.create({
            data: {
                year: 2026,
                plan_number: "ГП-TEST-2",
                start_date: new Date("2026-06-10"),
                end_date: new Date("2026-06-25"),
                description: "Хозяйственная проверка",
                status: "approved",
                control_authority_id: CA1.authority_id,
                inspection_direction_id: CD2.direction_id,
            }
        })
    }

    let order1 = await prisma.orders.findFirst({ where: { order_number: "П-TEST-001" } })
    if (!order1) {
        order1 = await prisma.orders.create({
            data: {
                plan_id: plan1.plan_id,
                order_number: "П-TEST-001",
                order_date: new Date("2026-04-25"),
                order_text: "О назначении",
                status: "issued",
                issuer_id: uid
            }
        })
    }

    let order2 = await prisma.orders.findFirst({ where: { order_number: "П-TEST-002" } })
    if (!order2) {
        order2 = await prisma.orders.create({
            data: {
                plan_id: plan2.plan_id,
                order_number: "П-TEST-002",
                order_date: new Date("2026-06-05"),
                order_text: "О назначении 2",
                status: "issued",
                issuer_id: uid
            }
        })
    }

    let pres1 = await prisma.prescriptions.findFirst({ where: { prescription_num: "ПР-TEST-001" } })
    if (!pres1) {
        pres1 = await prisma.prescriptions.create({
            data: {
                plan_id: plan1.plan_id,
                prescription_num: "ПР-TEST-001",
                date: new Date("2026-04-26"),
                requirements: "Проверить",
                issuer_id: uid, 
                status: "issued",
                updated_at: new Date()
            }
        })
    }

    let pres2 = await prisma.prescriptions.findFirst({ where: { prescription_num: "ПР-TEST-002" } })
    if (!pres2) {
        pres2 = await prisma.prescriptions.create({
            data: {
                plan_id: plan2.plan_id,
                prescription_num: "ПР-TEST-002",
                date: new Date("2026-06-06"),
                requirements: "Проверить 2",
                issuer_id: uid,
                status: "issued",
                updated_at: new Date()
            }
        })
    }

    const check1 = await (prisma as any).commission_members.findFirst({ where: { personnel_id: pId, order_id: order1.id } })
    if (!check1) {
        await (prisma as any).commission_members.create({
            data: {
                personnel_id: pId,
                order_id: order1.id,
                role: "Главный ревизор",
                is_responsible: true
            }
        })
    }

    const check2 = await (prisma as any).commission_members.findFirst({ where: { personnel_id: pId, order_id: order2.id } })
    if (!check2) {
        await (prisma as any).commission_members.create({
            data: {
                personnel_id: pId,
                order_id: order2.id,
                role: "Ревизор",
                is_responsible: false
            }
        })
    }

    console.log("Mock data generated successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());

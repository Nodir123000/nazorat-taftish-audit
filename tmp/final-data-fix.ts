import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Step 1: Repairing Data for Order #15...');

    // 1. Find Order 15
    const order = await prisma.orders.findFirst({
        where: { order_number: '15' }
    });

    if (!order) {
        console.error('Order 15 not found.');
        return;
    }

    // 2. Create a VALID Audit to satisfy the database constraint
    // The table commission_members REQUIRED an audit_id.
    let audit = await prisma.audit.findFirst({
        where: { order: { id: order.id } }
    });

    if (!audit) {
        console.log('Creating audit link...');
        audit = await prisma.audit.create({
            data: {
                orderId: order.id,
                auditNumber: `A2025-01`,
                auditType: 'planned',
                unitId: order.unit_id || 1,
                startDate: new Date(),
                endDate: new Date(),
                status: 'pending'
            }
        });
    }

    // 3. Add personnel to the commission
    const personnel = [
        { id: 2, role: 'Руководитель', isResponsible: true },
        { id: 3, role: 'Заместитель', isResponsible: false }
    ];

    for (const p of personnel) {
        const exists = await prisma.commission_members.findFirst({
            where: { order_id: order.id, user_id: p.id }
        });

        if (!exists) {
            await prisma.commission_members.create({
                data: {
                    order_id: order.id,
                    audit_id: audit.id,
                    user_id: p.id,
                    role: p.role,
                    is_responsible: p.isResponsible
                } as any
            });
            console.log(`✅ ${p.role} added.`);
        }
    }
    
    console.log('🎉 Done! Refresh the briefing page.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

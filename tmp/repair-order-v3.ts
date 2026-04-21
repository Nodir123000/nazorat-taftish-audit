import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Repairing Commission Members for Order #15...');

    // 1. Find Order
    const order = await prisma.orders.findFirst({
        where: { order_number: '15' }
    });

    if (!order) {
        console.error('❌ Order 15 not found.');
        return;
    }

    // 2. We NEED a valid audit record for commission_members (it's required in schema)
    // Check if an audit exists for this order
    let audit = await prisma.audit.findFirst({
        where: { orderId: order.id }
    });

    if (!audit) {
        console.log(`➕ Creating technical Audit record for Order ${order.id}...`);
        audit = await prisma.audit.create({
            data: {
                orderId: order.id,
                auditNumber: `REV-2025-${order.order_number}`,
                auditType: 'annual',
                unitId: order.unit_id || 168,
                startDate: new Date('2025-01-01'),
                endDate: new Date('2025-12-31'),
                status: 'planned'
            }
        });
    }

    console.log(`✅ Linked to Audit ID: ${audit.id}`);

    // 3. Add members
    const membersToAdd = [
        { userId: 2, role: 'Руководитель', isResponsible: true },
        { userId: 3, role: 'Заместитель', isResponsible: false },
        { userId: 4, role: 'Член группы', isResponsible: false },
        { userId: 5, role: 'Член группы', isResponsible: false }
    ];

    for (const m of membersToAdd) {
        const exists = await prisma.commission_members.findFirst({
            where: {
                order_id: order.id,
                user_id: m.userId
            }
        });

        if (!exists) {
            await prisma.commission_members.create({
                data: {
                    order_id: order.id,
                    audit_id: audit.id,
                    user_id: m.userId,
                    role: m.role,
                    is_responsible: m.isResponsible
                } as any
            });
            console.log(`✅ Added member ID ${m.userId} as ${m.role}`);
        } else {
            console.log(`ℹ️ Member ID ${m.userId} already exists.`);
        }
    }

    console.log('🎉 SUCCESS! Please refresh the briefing page.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

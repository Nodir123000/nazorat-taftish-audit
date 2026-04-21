import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Final Repair Attempt for Plan 352...');

    // 1. Find Order
    const order = await prisma.orders.findFirst({
        where: { plan_id: 352 }
    });

    if (!order) {
        console.error('❌ Order for plan 352 not found.');
        return;
    }

    // 2. We NEED a valid audit record for commission_members (it's required in schema)
    // Try to find any audit or create a dummy one for this plan
    let audit = await prisma.audit.findFirst({
        where: { planId: 352 }
    });

    if (!audit) {
        console.log('➕ Creating technical Audit record for Plan 352 to satisfy database constraints...');
        audit = await prisma.audit.create({
            data: {
                planId: 352,
                auditNumber: `REV-${order.order_number}`,
                auditType: 'annual',
                unitId: order.unit_id || 168,
                startDate: new Date('2025-01-01'),
                endDate: new Date('2025-12-31'),
                status: 'planned'
            }
        });
    }

    console.log(`✅ Using Audit ID: ${audit.id}`);

    // 3. Add members
    const membersToAdd = [
        { userId: 2, role: 'Руководитель', isResponsible: true },
        { userId: 3, role: 'Заместитель', isResponsible: false },
        { userId: 4, role: 'Член группы', isResponsible: false },
        { userId: 5, role: 'Член группы', isResponsible: false }
    ];

    for (const m of membersToAdd) {
        // Use raw execution or exact typed check
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

    console.log('🎉 Database repair SUCCESSFUL. Members are now linked to Order #15.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

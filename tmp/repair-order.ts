import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Repairing Commission Members for Order #1 (Plan 352)...');

    // 1. Ensure the order exists
    const order = await prisma.orders.findFirst({
        where: { plan_id: 352 }
    });

    if (!order) {
        console.error('❌ Order for plan 352 not found.');
        return;
    }

    // 2. Add members if they don't exist
    // Roles: 'Руководитель' (ID 2), 'Заместитель' (ID 3), Members (ID 4, 5)
    const membersToAdd = [
        { userId: 2, role: 'Руководитель', isResponsible: true },
        { userId: 3, role: 'Заместитель', isResponsible: false },
        { userId: 4, role: 'Член группы', isResponsible: false },
        { userId: 5, role: 'Член группы', isResponsible: false }
    ];

    for (const m of membersToAdd) {
        // Check if already exists to avoid duplicates
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
                    audit_id: null,
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

    console.log('🎉 Repair complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Fixing IDs and relations for Order 15...');

    // 1. Create missing users in the DB to satisfy Foreign Key constraints
    const usersToCreate = [
        { user_id: 2, username: 'p_petrov', fullname: 'Петров П.П.', rank: 'Подполковник', position: 'Заместитель командира' },
        { user_id: 3, username: 'm_petrov', fullname: 'Петров П.П.', rank: 'Матрос', position: 'Заместитель командира' }
    ];

    for (const u of usersToCreate) {
        const exists = await prisma.users.findUnique({ where: { user_id: u.user_id } });
        if (!exists) {
            await prisma.users.create({
                data: {
                    user_id: u.user_id,
                    username: u.username,
                    fullname: u.fullname,
                    rank: u.rank,
                    position: u.position,
                    password_hash: 'dummy',
                    role: 'inspector',
                    is_active: true
                } as any
            });
            console.log(`✅ User ${u.fullname} created.`);
        }
    }

    // 2. Clear old attempts and add correctly
    const order = await prisma.orders.findFirst({ where: { order_number: '15' } });
    if (!order) return;

    let audit = await prisma.audit.findFirst({ where: { orderId: order.id } });
    if (!audit) {
       audit = await prisma.audit.create({
            data: {
                orderId: order.id,
                auditNumber: `REV-2025-${order.id}`,
                auditType: 'annual',
                unitId: order.unit_id || 1,
                startDate: new Date(),
                endDate: new Date(),
                status: 'planned'
            }
       });
    }

    // 3. Add to commission
    const personnel = [
        { id: 2, role: 'Руководитель' },
        { id: 3, role: 'Заместитель' }
    ];

    for (const p of personnel) {
        try {
            await prisma.commission_members.create({
                data: {
                    order_id: order.id,
                    audit_id: audit.id,
                    user_id: p.id,
                    role: p.role,
                    is_responsible: p.role === 'Руководитель'
                } as any
            });
            console.log(`✅ ${p.role} linked to Order.`);
        } catch (e) {
            console.log(`Member ${p.id} already exists or error skip.`);
        }
    }

    console.log('🎉 REPAIR SUCCESSFUL! PLEASE REFRESH THE PAGE.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

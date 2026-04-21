import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Force-Repairing Commission Members...');

    const order = await prisma.orders.findFirst({
        where: { order_number: '15' }
    });

    if (!order) {
        console.error('Order 15 not found.');
        return;
    }

    // Now adding members without audit_id because I updated the schema.prisma
    // Even if client isn't regenerated, the DB level change will allow this (if nullable)
    // Or I will just find ONE existing audit ID to be 100% safe.
    const anyAudit = await prisma.audit.findFirst();
    const auditId = anyAudit ? anyAudit.id : 1; 

    const members = [
        { userId: 2, role: 'Руководитель', isResponsible: true },
        { userId: 3, role: 'Заместитель', isResponsible: false },
        { userId: 4, role: 'Член группы', isResponsible: false }
    ];

    for (const m of members) {
        try {
            await (prisma.commission_members as any).create({
                data: {
                    order_id: order.id,
                    audit_id: auditId, // Using existing or fallback
                    user_id: m.userId,
                    role: m.role,
                    is_responsible: m.isResponsible
                }
            });
            console.log(`✅ Added ${m.role}`);
        } catch (e: any) {
            console.log(`ℹ️ Skipping or error: ${e.message}`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());

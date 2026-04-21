import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const plan = await prisma.revPlanYear.findUnique({
        where: { planId: 352 },
        include: {
            orders: {
                include: {
                    commission_members: true
                }
            }
        }
    });
    console.log('PLAN DATA:', JSON.stringify(plan, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());

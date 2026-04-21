
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRelations() {
    try {
        console.log('--- checking orders relations ---');
        // Try including each one separately to see which fail
        const relations = ['users', 'rev_plan_year', 'ref_units', 'commission_members'];
        for (const rel of relations) {
            try {
                await prisma.orders.findFirst({ include: { [rel]: true } });
                console.log(`[orders] relation "${rel}" is OK`);
            } catch (e) {
                console.log(`[orders] relation "${rel}" FAILED: ${e.message}`);
            }
        }

        console.log('\n--- checking rev_plan_year relations ---');
        const planRels = ['ref_units', 'ref_control_authorities', 'ref_control_directions', 'ref_inspection_types', 'orders'];
        for (const rel of planRels) {
            try {
                await prisma.rev_plan_year.findFirst({ include: { [rel]: true } });
                console.log(`[rev_plan_year] relation "${rel}" is OK`);
            } catch (e) {
                console.log(`[rev_plan_year] relation "${rel}" FAILED: ${e.message}`);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkRelations();

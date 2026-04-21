
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const dmmf = prisma._baseDmmf || prisma._dmmf;
        const model = dmmf.datamodel.models.find(m => m.name === 'rev_plan_year');
        const relations = model.fields.filter(f => f.kind === 'object').map(f => f.name);
        console.log('Relations for rev_plan_year:', relations.join(', '));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
check();

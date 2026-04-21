
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMetadata() {
    try {
        console.log('--- rev_plan_year DMMF ---');
        const dmmf = prisma._baseDmmf || prisma._dmmf;
        if (dmmf) {
            const model = dmmf.datamodel.models.find(m => m.name === 'rev_plan_year');
            if (model) {
                console.log('Fields:', model.fields.map(f => `${f.name} (${f.kind})`).join(', '));
            } else {
                console.log('Model rev_plan_year not found in DMMF');
            }
        } else {
            console.log('DMMF not available');
            // Fallback: check keys of a sample object
            const sample = await prisma.rev_plan_year.findFirst();
            console.log('Sample keys:', sample ? Object.keys(sample) : 'No data');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkMetadata();

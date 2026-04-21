
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const res = await prisma.rev_plan_year.findMany({
        take: 1,
        include: { ref_units: true }
    });
    console.log('Success including ref_units');
  } catch (error) {
    console.error('ERROR:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();

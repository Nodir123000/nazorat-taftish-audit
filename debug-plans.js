const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const plans = await prisma.revPlanYear.findMany({
    take: 5,
    select: { planId: true, status: true, planNumber: true }
  });
  console.log('Sample plans from DB:', JSON.stringify(plans, null, 2));
  
  const statusCounts = await prisma.revPlanYear.groupBy({
    by: ['status'],
    _count: { _all: true }
  });
  console.log('Status counts:', JSON.stringify(statusCounts, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

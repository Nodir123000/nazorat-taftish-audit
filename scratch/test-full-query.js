
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const pId = 1;
    const assignments = await prisma.commission_members.findMany({
        where: { personnel_id: pId },
        include: {
            orders: {
                include: {
                    rev_plan_year: {
                        include: {
                            ref_units: true,
                            ref_control_authorities: true,
                            ref_control_directions: true
                        }
                    }
                }
            }
        }
    });
    console.log('Assignments count:', assignments.length);
  } catch (error) {
    console.error('ERROR BODY:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();

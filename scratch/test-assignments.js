
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const pId = 1;
    const person = await prisma.personnel.findUnique({
        where: { id: pId },
        select: { full_name: true }
    });
    console.log('Person:', person);

    let userId = null;
    if (person?.full_name) {
        const user = await prisma.users.findFirst({
            where: { fullname: person.full_name },
            select: { user_id: true }
        });
        console.log('User:', user);
        if (user) userId = user.user_id;
    }

    const assignments = await prisma.commission_members.findMany({
        where: {
            OR: [
                { personnel_id: pId },
                ...(userId ? [{ user_id: userId }] : [])
            ]
        },
        include: {
            orders: {
                include: {
                    rev_plan_year: {
                        include: {
                            ref_units: {
                                include: {
                                    ref_military_districts: true
                                }
                            },
                            ref_control_authorities: true,
                        }
                    }
                }
            }
        },
        orderBy: { id: "desc" }
    });
    console.log('Assignments count:', assignments.length);
    if (assignments.length > 0) {
        console.log('First Assignment:', JSON.stringify(assignments[0], null, 2));
    }
  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();

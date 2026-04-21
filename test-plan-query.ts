import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
    const planId = 1; // Assuming 1 exists
    const plan = await prisma.rev_plan_year.findUnique({
        where: { plan_id: planId },
        include: {
            ref_units: { include: { ref_military_districts: true } },
        }
    });

    console.log("Plan:", plan);

    // Get direction manually
    let direction = null;
    let auth = null;
    if (plan?.inspection_direction_id) {
        direction = await (prisma as any).ref_control_directions.findUnique({ where: { direction_id: plan.inspection_direction_id } });
    }
    if (plan?.control_authority_id) {
        auth = await (prisma as any).ref_control_authorities.findUnique({ where: { authority_id: plan.control_authority_id }});
    }

    console.log("Direction:", direction);
    console.log("Authority:", auth);
}

test()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

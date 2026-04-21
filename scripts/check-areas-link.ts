import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkData() {
    try {
        const unitsCount = await prisma.ref_units.count();
        const unitsWithAreaCount = await prisma.ref_units.count({
            where: { NOT: { area_id: null } }
        });
        const areasCount = await prisma.ref_areas.count();
        const regionsCount = await prisma.ref_regions.count();

        console.log(`Units total: ${unitsCount}`);
        console.log(`Units with area: ${unitsWithAreaCount}`);
        console.log(`Areas total: ${areasCount}`);
        console.log(`Regions total: ${regionsCount}`);

        const sampleAreas = await prisma.ref_areas.findMany({
            take: 5,
            include: { ref_regions: true }
        });

        console.log('Sample Areas with Regions:');
        console.log(JSON.stringify(sampleAreas, null, 2));

        const sampleUnits = await prisma.ref_units.findMany({
            take: 5,
            include: { ref_areas: { include: { ref_regions: true } } }
        });

        console.log('Sample Units with Areas:');
        console.log(JSON.stringify(sampleUnits, null, 2));

    } catch (error) {
        console.error('Error checking data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();

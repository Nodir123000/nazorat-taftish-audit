import { planningService } from '../lib/services/planning-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
    try {
        const users = await prisma.user.findMany({ select: { userId: true } });
        const units = await prisma.refUnit.findMany({ select: { unitId: true } });

        if (users.length === 0 || units.length === 0) {
            console.error('❌ Cannot seed: No users or units found in database.');
            process.exit(1);
        }

        const userIds = users.map(u => u.userId);
        const unitIds = units.map(u => u.unitId);

        const years = [2023, 2024, 2025];
        for (const year of years) {
            console.log(`--- Seeding year ${year} ---`);
            for (let i = 0; i < 30; i++) {
                const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
                const randomUnit = unitIds[Math.floor(Math.random() * unitIds.length)];

                const planData = {
                    year,
                    unit: randomUnit.toString(),
                    startDate: `${year}-01-01`,
                    endDate: `${year}-12-31`,
                    responsible: randomUser.toString(),
                    incomingNumber: `IN-${year}-${i + 1}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                    incomingDate: `${year}-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
                    objectsTotal: Math.floor(Math.random() * 16) + 5,
                    objectsFS: Math.floor(Math.random() * 6),
                    objectsOS: Math.floor(Math.random() * 6),
                    expenseClassification: `EC-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                    supplyDepartment: `SD-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                    controlAuthority: `CA-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                    controlObject: `CO-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                    inspectionDirection: Math.floor(Math.random() * 5) + 1,
                    inspectionType: Math.floor(Math.random() * 3) + 1,
                };

                try {
                    await planningService.createAnnualPlan(planData);
                    console.log(`✅ created ${i + 1}/30 for ${year}`);
                } catch (e) {
                    console.error(`❌ error creating plan ${i + 1} for ${year}:`, e);
                }
            }
        }
        console.log('✅ seed finished');
    } catch (err) {
        console.error('Fatal error during seeding:', err);
    } finally {
        await prisma.$disconnect();
    }
})();

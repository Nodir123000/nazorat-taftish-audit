
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Copy of relevant data from components/reference/classifiers.tsx and military-data.ts
const controlAuthorities: any = {
    "КРУ МО РУ": {
        name: "Контрольно-ревизионное управление МО РУ",
    },
    "ГУБП ГШ ВС РУ": {
        name: "Главное управление боевой подготовки ГШ ВС РУ",
    },
    // ... we only need enough to map common ones or just use the keys if they match
};

const controlDirections = [
    { id: 1, name: "Финансово-хозяйственная деятельность" },
    { id: 2, name: "Материально-техническое обеспечение" },
    { id: 3, name: "Кадровая работа и воспитательная деятельность" },
    { id: 4, name: "Связь, ИТ и защита информации" },
    { id: 5, name: "Медицинское обеспечение" },
    { id: 6, name: "Боевая и специальная подготовка" },
    { id: 7, name: "Антикоррупционная деятельность" },
];

const inspectionTypes = [
    { id: 2301, name: "Плановая инспекция" },
    { id: 2302, name: "Внеплановая проверка" },
    { id: 2303, name: "Целевая проверка" },
];

const statuses = [
    { id: 101, name: "Запланирована" },
    { id: 102, name: "В работе" },
    { id: 103, name: "Приостановлена" },
    { id: 104, name: "Завершена" },
    { id: 105, name: "Отменена" },
];

async function main() {
    console.log('Starting data humanization...');

    const plans = await prisma.revPlanYear.findMany();
    console.log(`Found ${plans.length} plans to check.`);

    for (const plan of plans) {
        const updateData: any = {};

        // 1. Fix controlAuthority if it is an ID
        // In the data, controlAuthority keys are strings like "КРУ МО РУ"
        // If it's a number, it's weird, but let's check

        // 2. Fix inspectionDirection
        if (plan.inspectionDirection && !isNaN(Number(plan.inspectionDirection))) {
            const dirId = Number(plan.inspectionDirection);
            const dir = controlDirections.find(d => d.id === dirId);
            if (dir) {
                updateData.inspectionDirection = dir.name;
            }
        }

        // 3. Fix inspectionType
        if (plan.inspectionType && !isNaN(Number(plan.inspectionType))) {
            const typeId = Number(plan.inspectionType);
            const type = inspectionTypes.find(t => t.id === typeId);
            if (type) {
                updateData.inspectionType = type.name;
            }
        }

        // 4. Fix status
        if (plan.status && !isNaN(Number(plan.status))) {
            const statusId = Number(plan.status);
            const status = statuses.find(s => s.id === statusId);
            if (status) {
                updateData.status = status.name;
            } else if (plan.status === "draft") {
                updateData.status = "Запланирована";
            }
        }

        if (Object.keys(updateData).length > 0) {
            console.log(`Updating plan ${plan.planId}:`, updateData);
            await prisma.revPlanYear.update({
                where: { planId: plan.planId },
                data: updateData
            });
        }
    }

    console.log('Done!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fillMissingAreas() {
    console.log("🛠 Заполняем недостающие территории для всех регионов...");

    try {
        const regions = await prisma.ref_regions.findMany();
        const areas = await prisma.ref_areas.findMany();

        const regionsWithAreas = new Set(areas.map(a => a.region_id));
        let createdCount = 0;

        for (const region of regions) {
            if (!regionsWithAreas.has(region.id)) {
                const regionName = (region.name as any).ru || 'Регион';
                // Remove " область" or " Республика" for area name
                const cityName = regionName.replace(' область', '').replace('Республика ', '').replace(' область', '');

                const nameJson = {
                    ru: cityName,
                    uz: (region.name as any).uz || cityName,
                    uzk: (region.name as any).uzk || cityName
                };

                await prisma.ref_areas.create({
                    data: {
                        region_id: region.id,
                        name: nameJson,
                        type: 'City',
                        status: 'active'
                    }
                });
                createdCount++;
                console.log(`+ Создан город для региона: ${regionName}`);
            }
        }

        console.log(`✅ Создано ${createdCount} новых территорий.`);

        // Теперь перепривязываем все части, чтобы они были распределены по ВСЕМ областям равномерно
        console.log("🔄 Перераспределяем воинские части по ВСЕМ областям...");

        const allAreas = await prisma.ref_areas.findMany({ select: { id: true } });
        const allUnits = await prisma.ref_units.findMany({ select: { unit_id: true } });

        for (let i = 0; i < allUnits.length; i++) {
            const area = allAreas[i % allAreas.length];
            await prisma.ref_units.update({
                where: { unit_id: allUnits[i].unit_id },
                data: { area_id: area.id }
            });
        }

        console.log(`🎉 Все ${allUnits.length} частей успешно распределены по ${allAreas.length} территориям.`);

    } catch (error) {
        console.error("❌ Ошибка:", error);
    } finally {
        await prisma.$disconnect();
    }
}

fillMissingAreas();

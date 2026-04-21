import { PrismaClient, RefRegion } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

type AreaRaw = {
    regionRu: string; // region name in Russian
    nameRu: string;
    nameUzLatn: string;
    nameUzCyrl: string;
    type?: string;
    status?: string;
};

async function main() {
    const dataPath = path.resolve('Районы', 'areas.json');
    if (!fs.existsSync(dataPath)) {
        console.error(`❌ File ${dataPath} not found.`);
        process.exit(1);
    }
    const raw: AreaRaw[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Load all existing regions for lookup by Russian name
    const regions = await prisma.refRegion.findMany();
    const regionMap = new Map<string, RefRegion>();
    for (const r of regions) {
        const nameObj = r.name as any;
        if (nameObj?.ru) regionMap.set(nameObj.ru.toLowerCase(), r);
        if (nameObj?.uz) regionMap.set(nameObj.uz.toLowerCase(), r);
        if (nameObj?.uzk) regionMap.set(nameObj.uzk.toLowerCase(), r);
    }

    // Ensure a placeholder region exists for areas without a matching region
    let placeholderRegion = regionMap.get('неизвестный регион');
    if (!placeholderRegion) {
        placeholderRegion = await prisma.refRegion.create({
            data: {
                name: {
                    ru: 'Неизвестный регион',
                    uz: "Noma'lum region",
                    uzk: "Нома'лум регион",
                } as any,
                status: 'active',
            },
        });
        regionMap.set('неизвестный регион', placeholderRegion);
    }

    let inserted = 0;
    for (const item of raw) {
        // Find region by the provided Russian region name, fallback to placeholder
        const regionKey = item.regionRu?.toLowerCase?.() ?? '';
        const region = regionMap.get(regionKey) || placeholderRegion!;

        const nameJson = {
            ru: item.nameRu,
            uz: item.nameUzLatn,
            uzk: item.nameUzCyrl,
        } as any;

        await prisma.refArea.create({
            data: {
                regionId: region.id,
                name: nameJson,
                type: item.type ?? null,
                status: item.status ?? 'active',
            },
        });
        inserted++;
    }

    console.log(`✅ Inserted ${inserted} RefArea records.`);
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

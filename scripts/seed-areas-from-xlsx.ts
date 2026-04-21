import { PrismaClient, RefRegion } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

type RegionRow = {
    'Код'?: string; // region code
    'Название Ru'?: string; // region name Russian
};

type AreaRow = {
    'Код region'?: string; // region code reference
    'Название Uzk'?: string; // Uzbek Cyrillic
    'Название Uz'?: string; // Uzbek Latin
    'Название Ru'?: string; // Russian name of area
    'Статус'?: string;
    type?: string; // optional, not present in file but keep for compatibility
};

async function main() {
    // 1️⃣ Очистим таблицу RefArea полностью
    await prisma.refArea.deleteMany();
    console.log('🧹 Cleared existing RefArea records');

    // 2️⃣ Загрузим справочник регионов из Областя.xlsx
    const regionsPath = path.resolve('Областя.xlsx');
    const regionsWb = XLSX.readFile(regionsPath);
    const regionsSheet = regionsWb.Sheets[regionsWb.SheetNames[0]];
    const regionsData: any[][] = XLSX.utils.sheet_to_json(regionsSheet, { header: 1 }) as any[][];
    const regionHeaders = regionsData[0];
    const regionRows = regionsData.slice(1);
    const regionMap = new Map<string, string>(); // code -> Russian name
    for (const row of regionRows) {
        const obj: any = {};
        regionHeaders.forEach((h: string, i: number) => (obj[h] = row[i]));
        const code = obj['Код'];
        const ruName = obj['Название Ru'];
        if (code && ruName) {
            regionMap.set(String(code).trim(), ruName.trim());
        }
    }

    // 3️⃣ Загрузим области/города из Районы.xlsx
    const areasPath = path.resolve('Районы.xlsx');
    const areasWb = XLSX.readFile(areasPath);
    const areasSheet = areasWb.Sheets[areasWb.SheetNames[0]];
    const areasData: any[][] = XLSX.utils.sheet_to_json(areasSheet, { header: 1 }) as any[][];
    const areaHeaders = areasData[0];
    const areaRows = areasData.slice(1);

    // 4️⃣ Подготовим placeholder регион, если понадобится
    let placeholderRegion = await prisma.refRegion.findFirst({
        where: { name: { path: ['ru'], equals: 'Неизвестный регион' } },
    });
    if (!placeholderRegion) {
        placeholderRegion = await prisma.refRegion.create({
            data: {
                name: { ru: 'Неизвестный регион', uz: "Noma'lum region", uzk: "Нома'лум регион" } as any,
                status: 'active',
            },
        });
    }

    // 5️⃣ Сопоставим регионы из БД
    const dbRegions = await prisma.refRegion.findMany();
    const dbRegionByRu = new Map<string, any>();
    for (const r of dbRegions) {
        const nameObj = r.name as any;
        if (nameObj?.ru) dbRegionByRu.set(nameObj.ru.toLowerCase(), r);
    }

    let inserted = 0;

    for (const row of areaRows) {
        const obj: any = {};
        areaHeaders.forEach((h: string, i: number) => (obj[h] = row[i]));
        const area: AreaRow = obj as AreaRow;

        // Use 'Код viloyat' for the region code connection
        let regionCode = String(obj['Код viloyat'] ?? '').trim();
        if (regionCode.length === 1) {
            regionCode = '0' + regionCode;
        }

        const regionRuName = regionMap.get(regionCode) ?? '';
        const region = dbRegionByRu.get(regionRuName?.toLowerCase()) || placeholderRegion!;

        const ruName = obj['Название Ru'] ?? '';
        // Determine type based on name
        let type = 'District';
        if (ruName.toLowerCase().startsWith('город') || ruName.toLowerCase().includes('город')) {
            type = 'City';
        }

        const nameJson = {
            ru: ruName,
            uz: obj['Название Uz'] ?? '',
            uzk: obj['Название Uzk'] ?? '',
        } as any;

        const statusRaw = String(obj['Статус'] ?? 'active').trim().toLowerCase();
        const status = (statusRaw === 'активен' || statusRaw === 'active') ? 'active' : 'inactive';

        if (!statusRaw) continue; // Skip empty rows

        await prisma.refArea.create({
            data: {
                regionId: region.id,
                name: nameJson,
                type: type,
                status: status,
            },
        });
        inserted++;
    }

    console.log(`✅ Inserted ${inserted} RefArea records from Районы.xlsx`);
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

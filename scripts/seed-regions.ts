import { PrismaClient, RefRegion } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

type RegionRow = {
    '№'?: number;
    'Код'?: string;
    'ID global'?: number;
    'Название Uzk': string; // Uzbek Cyrillic
    'Название Uz': string; // Uzbek Latin
    'Название Ru': string; // Russian
    'Статус'?: string;
};

async function main() {
    const filePath = path.resolve('Областя.xlsx');
    if (!filePath) {
        console.error('❌ File path not provided');
        process.exit(1);
    }
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 }) as any[][];
    const headers = rows[0];
    const dataRows = rows.slice(1);

    let inserted = 0;
    let updated = 0;

    for (const row of dataRows) {
        const obj: any = {};
        headers.forEach((h: string, i: number) => (obj[h] = row[i]));
        const region: RegionRow = obj as RegionRow;
        const nameJson = {
            ru: region['Название Ru'],
            uz: region['Название Uz'],
            uzk: region['Название Uzk'],
        } as any;
        const status = (region['Статус'] ?? 'active').toLowerCase();

        // Try to find existing region by Russian name
        const existing = await prisma.refRegion.findFirst({
            where: { name: { path: ['ru'], equals: nameJson.ru } },
        });

        if (existing) {
            await prisma.refRegion.update({
                where: { id: existing.id },
                data: { name: nameJson, status },
            });
            updated++;
        } else {
            await prisma.refRegion.create({
                data: { name: nameJson, status },
            });
            inserted++;
        }
    }

    console.log(`✅ Inserted ${inserted} new RefRegion records.`);
    console.log(`🔄 Updated ${updated} existing RefRegion records.`);
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

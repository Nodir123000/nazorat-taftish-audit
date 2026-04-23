import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as XLSX from 'xlsx';
import path from 'path';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('⚠️  STARTING FULL RESET of Territories...');

    // 1. Clear Tables
    try {
        // Option A: Use Prisma deleteMany
        // Check relationships first. Areas depend on Regions. Units depend on Areas.

        // We might need to clear Orphaned units or set their area_id to null?
        // Or assume this is dev env and we can wipe units?
        // Let's try to just wipe areas and regions. If it fails due to FK, we'll know.

        console.log('Deleting all Areas...');
        await prisma.$executeRaw`DELETE FROM "ref_areas"`;

        console.log('Deleting all Regions...');
        await prisma.$executeRaw`DELETE FROM "ref_regions"`;

        console.log('✅ Tables cleared.');
    } catch (e: any) {
        console.error('Error clearing tables (foreign key constraints?):', e.message);
        // If critical, we stop. But let's verify count.
        const cR: any[] = await prisma.$queryRaw`SELECT count(*) as c FROM "ref_regions"`;
        if (Number(cR[0].c) > 0) {
            console.log('Could not clear regions fully. Aborting reset to avoid mixed state.');
            return;
        }
    }

    console.log('🚀 Starting import from XLSX files...');

    // 2. Import Regions
    const regionsPath = path.resolve('Областя.xlsx');
    const regionsWb = XLSX.readFile(regionsPath);
    const regionsSheet = regionsWb.Sheets[regionsWb.SheetNames[0]];
    const regionsData: any[] = XLSX.utils.sheet_to_json(regionsSheet);

    const regionCodeToId = new Map<string, number>();

    for (const row of regionsData) {
        const code = String(row['Код'] || '').trim();
        const nameRu = row['Название Ru']?.trim();
        if (!code || !nameRu) continue;

        const nameJson = {
            ru: nameRu,
            uz: row['Название Uz']?.trim() || nameRu,
            uzk: row['Название Uzk']?.trim() || nameRu
        };

        let type = 'Region';
        if (String(nameRu).includes('Республика')) type = 'Republic';
        if (String(nameRu).toLowerCase().includes('город') || String(nameRu).toLowerCase().includes('г.')) type = 'City';

        const inserted: any[] = await prisma.$queryRaw`
            INSERT INTO "ref_regions" ("code", "name", "type", "status", "created_at")
            VALUES (${code}, ${nameJson}::jsonb, ${type}, 'active', NOW())
            RETURNING id
        `;
        if (inserted.length > 0) {
            regionCodeToId.set(code, inserted[0].id);
        }
    }
    console.log(`✅ Imported ${regionCodeToId.size} Regions.`);

    // 3. Import Areas
    const areasPath = path.resolve('Районы.xlsx');
    const areasWb = XLSX.readFile(areasPath);
    const areasSheet = areasWb.Sheets[areasWb.SheetNames[0]];
    const areasData: any[] = XLSX.utils.sheet_to_json(areasSheet);

    let areasInserted = 0;

    for (const row of areasData) {
        let regionCode = String(row['Код viloyat'] || '').trim();
        // Pad single digit codes (e.g., '1' -> '01') to match region codes
        if (regionCode.length === 1) regionCode = '0' + regionCode;

        const areaCode = String(row['Код region'] || '').trim();
        const nameRu = row['Название Ru']?.trim();

        if (!regionCode || !nameRu) continue;

        const regionId = regionCodeToId.get(regionCode);
        if (!regionId) {
            // console.log(`Skipping area ${nameRu}: region code ${regionCode} not found`);
            continue;
        }

        const nameJson = {
            ru: nameRu,
            uz: row['Название Uz']?.trim() || nameRu,
            uzk: row['Название Uzk']?.trim() || nameRu
        };

        let type = 'District';
        if (String(nameRu).toLowerCase().includes('город') || String(nameRu).toLowerCase().startsWith('г.')) type = 'City';

        await prisma.$executeRaw`
            INSERT INTO "ref_areas" ("region_id", "code", "name", "type", "status", "created_at")
            VALUES (${regionId}, ${areaCode || null}, ${nameJson}::jsonb, ${type}, 'active', NOW())
        `;
        areasInserted++;
    }

    console.log(`✅ Imported ${areasInserted} Areas.`);
    console.log('🎉 Full Reset & Seed Complete.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

export {};

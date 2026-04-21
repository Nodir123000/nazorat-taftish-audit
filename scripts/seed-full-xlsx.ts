
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting import from XLSX files via Raw SQL...');

    // 1. Process Regions
    const regionsPath = path.resolve('Областя.xlsx');
    if (Object.keys(XLSX).length === 0) {
        console.error('XLSX library not loaded correctly');
        process.exit(1);
    }

    console.log(`Loading regions from ${regionsPath}...`);
    const regionsWb = XLSX.readFile(regionsPath);
    const regionsSheet = regionsWb.Sheets[regionsWb.SheetNames[0]];
    const regionsData: any[] = XLSX.utils.sheet_to_json(regionsSheet);

    const regionCodeToId = new Map<string, number>();

    for (const row of regionsData) {
        const code = String(row['Код'] || '').trim();
        const nameRu = row['Название Ru']?.trim();
        const nameUz = row['Название Uz']?.trim();
        const nameUzk = row['Название Uzk']?.trim();

        if (!code || !nameRu) continue;

        const nameJson = {
            ru: nameRu,
            uz: nameUz || nameRu,
            uzk: nameUzk || nameRu
        };

        // Determine type
        let type = 'Region';
        if (String(nameRu).includes('Республика')) type = 'Republic';
        if (String(nameRu).toLowerCase().includes('город') || String(nameRu).toLowerCase().includes('г.')) type = 'City';

        // Check if exists by code
        const existing: any[] = await prisma.$queryRaw`
            SELECT id FROM "ref_regions" WHERE code = ${code} LIMIT 1
        `;

        let regionId;
        if (existing.length > 0) {
            regionId = existing[0].id;
            // Update existing region to ensure updated fields
            await prisma.$executeRaw`
                UPDATE "ref_regions" 
                SET name = ${nameJson}::jsonb, type = ${type}
                WHERE id = ${regionId}
             `;
        } else {
            const inserted: any[] = await prisma.$queryRaw`
                INSERT INTO "ref_regions" ("code", "name", "type", "status", "created_at")
                VALUES (${code}, ${nameJson}::jsonb, ${type}, 'active', NOW())
                RETURNING id
            `;
            if (inserted.length > 0) regionId = inserted[0].id;
            console.log(`Created region: ${nameRu} (${code})`);
        }

        if (regionId) regionCodeToId.set(code, regionId);
    }
    console.log(`Processed ${regionsData.length} regions.`);


    // 2. Process Areas
    const areasPath = path.resolve('Районы.xlsx');
    console.log(`Loading areas from ${areasPath}...`);
    const areasWb = XLSX.readFile(areasPath);
    const areasSheet = areasWb.Sheets[areasWb.SheetNames[0]];
    const areasData: any[] = XLSX.utils.sheet_to_json(areasSheet);

    let areasInserted = 0;

    for (const row of areasData) {
        const regionCode = String(row['Код viloyat'] || '').trim();
        const areaCode = String(row['Код region'] || '').trim();
        const nameRu = row['Название Ru']?.trim();
        const nameUz = row['Название Uz']?.trim();
        const nameUzk = row['Название Uzk']?.trim();

        if (!regionCode || !nameRu) continue;

        const regionId = regionCodeToId.get(regionCode);
        if (!regionId) {
            // console.warn(`Region not found for area ${nameRu} (Region Code: ${regionCode})`);
            continue;
        }

        const nameJson = {
            ru: nameRu,
            uz: nameUz || nameRu,
            uzk: nameUzk || nameRu
        };

        // Determine type
        let type = 'District';
        if (String(nameRu).toLowerCase().includes('город') || String(nameRu).toLowerCase().startsWith('г.')) type = 'City';

        // Try to find by code if present and not empty
        let existing: any[] = [];
        if (areaCode && areaCode !== 'undefined') {
            existing = await prisma.$queryRaw`
                SELECT id FROM "ref_areas" WHERE code = ${areaCode} LIMIT 1
            `;
        }

        // Fallback to name + region check if not found by code
        if (existing.length === 0) {
            existing = await prisma.$queryRaw`
                SELECT id FROM "ref_areas" 
                WHERE region_id = ${regionId} AND name->>'ru' = ${nameRu}
                LIMIT 1
            `;
        }

        if (existing.length === 0) {
            await prisma.$executeRaw`
                INSERT INTO "ref_areas" ("region_id", "code", "name", "type", "status", "created_at")
                VALUES (${regionId}, ${areaCode || null}, ${nameJson}::jsonb, ${type}, 'active', NOW())
            `;
            areasInserted++;
        } else {
            // Update logic if needed?
        }
    }

    console.log(`✅ Import complete. Inserted ${areasInserted} new areas.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

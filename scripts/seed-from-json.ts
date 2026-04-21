import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('⚠️  STARTING SEED from JSON...');

    const dataPath = path.resolve('scripts/data/districts_data.json');
    if (!fs.existsSync(dataPath)) {
        console.error('❌ JSON data file not found at:', dataPath);
        return;
    }

    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // 1. Clear Tables
    try {
        console.log('Deleting all Areas...');
        await prisma.ref_areas.deleteMany({});
        console.log('Deleting all Regions...');
        await prisma.ref_regions.deleteMany({});
        console.log('✅ Tables cleared.');
    } catch (e: any) {
        console.error('Error clearing tables:', e.message);
        // Continue anyway if tables were already empty
    }

    const regionsList = Object.keys(data.regions_counts);
    const regionNameToId = new Map();

    console.log('🚀 Importing Regions...');
    for (const regionName of regionsList) {
        const nameJson = {
            ru: regionName,
            uz: regionName,
            uzk: regionName
        };

        let type = 'Region';
        if (regionName.includes('Республика')) type = 'Republic';
        if (regionName.includes('г. ')) type = 'City';

        const code = (regionsList.indexOf(regionName) + 1).toString().padStart(2, '0');

        const inserted = await prisma.ref_regions.create({
            data: {
                code: code,
                name: nameJson,
                type: type,
                status: 'active'
            }
        });
        regionNameToId.set(regionName, inserted.id);
    }
    console.log(`✅ Imported ${regionNameToId.size} Regions.`);

    console.log('🚀 Importing Districts...');
    let areasInserted = 0;
    for (const district of data.districts) {
        const regionId = regionNameToId.get(district.region);
        if (!regionId) continue;

        const nameJson = {
            ru: district.name,
            uz: district.name,
            uzk: district.name
        };

        await prisma.ref_areas.create({
            data: {
                region_id: regionId,
                code: district.id.toString(),
                name: nameJson,
                type: district.type || 'District',
                status: 'active'
            }
        });
        areasInserted++;
    }

    console.log(`✅ Imported ${areasInserted} Districts.`);
    console.log('🎉 Seeding Complete!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

export {};

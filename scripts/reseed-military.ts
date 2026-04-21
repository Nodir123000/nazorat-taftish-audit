
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting military units re-seed...');

    // 1. Fetch all Administrative Territories (Districts and Cities)
    // Excluding top-level parents (Regions/Republics) usually implies type 'Region' or 'Republic'
    // But strictly we want the "Raions and Cities".
    // Note: Some cities might be regions themselves? The user said "Raions and Cities".
    // Looking at territories.tsx, it filters out 'Region' to get Districts.
    // We want RefTerritory where type IN ('District', 'City') AND parentId is NOT NULL (usually).

    const territories = await prisma.refTerritory.findMany({
        where: {
            type: {
                in: ['District', 'City']
            },
            parentId: {
                not: null
            }
        }
    });

    console.log(`Found ${territories.length} administrative districts/cities.`);

    if (territories.length === 0) {
        console.error("No administrative territories found to map to. Aborting.");
        return;
    }

    // 2. Fetch all Military Districts
    const militaryDistricts = await prisma.refDistrict.findMany();
    console.log(`Found ${militaryDistricts.length} military districts.`);

    if (militaryDistricts.length === 0) {
        console.error("No military districts found. Cannot distribute units. Aborting.");
        return;
    }

    // 3. Delete existing Military Units
    console.log('Deleting existing military units...');
    await prisma.refUnit.deleteMany({});
    console.log('Existing units deleted.');

    // 4. Create new Military Units
    console.log('Creating new military units...');

    let createdCount = 0;

    for (let i = 0; i < territories.length; i++) {
        const territory = territories[i];

        // Round-robin distribution
        const militaryDistrict = militaryDistricts[i % militaryDistricts.length];

        // Generate Unit Data
        const unitCode = Math.floor(10000 + Math.random() * 90000).toString(); // 5 digit random
        const stateNumber = `${Math.floor(Math.random() * 99)}/${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 9)}`;

        // Generate Names
        const baseNameRu = `Воинская часть ${territory.name}`;
        const baseNameUzLatn = `Harbiy qism ${territory.nameUzLatn || territory.name}`;
        const baseNameUzCyrl = `Ҳарбий қисм ${territory.nameUzCyrl || territory.name}`;

        await prisma.refUnit.create({
            data: {
                unitCode: unitCode, // Mapping to stateId in UI usually
                name: baseNameRu,
                nameUzLatn: baseNameUzLatn,
                nameUzCyrl: baseNameUzCyrl,

                // Link to territory
                territoryId: territory.id,
                location: territory.name,
                locationUzLatn: territory.nameUzLatn,
                locationUzCyrl: territory.nameUzCyrl,

                // Link to Military District (via subordination field string as per UI logic)
                subordination: militaryDistrict.shortName || militaryDistrict.name,

                // Additional fields
                unitType: "Воинская часть",
                isActive: true,
                commanderName: `Командир ${unitCode}`,
                commanderRank: "Полковник"
            }
        });

        createdCount++;
    }

    console.log(`Successfully created ${createdCount} military units.`);
    console.log(`Units were distributed across ${militaryDistricts.length} military districts.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

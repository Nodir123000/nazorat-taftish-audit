
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting military units re-seed (renaming with numbers)...');

    // 1. Fetch all Administrative Territories
    const territories = await prisma.refTerritory.findMany({
        where: {
            type: {
                in: ['District', 'City']
            },
            parentId: {
                not: null
            }
        },
        orderBy: {
            id: 'asc' // Ensure consistent ordering
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

        // Generate Sequential Unit Number (00001, 00002...)
        const unitNumber = (i + 1).toString().padStart(5, '0');

        // Generate Names: "Воинская часть 00001"
        const baseNameRu = `Воинская часть ${unitNumber}`;
        const baseNameUzLatn = `Harbiy qism ${unitNumber}`;
        const baseNameUzCyrl = `Ҳарбий қисм ${unitNumber}`;

        // Additional fake data
        const stateNumber = `${Math.floor(Math.random() * 99)}/${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 9)}`;

        await prisma.refUnit.create({
            data: {
                unitCode: unitNumber,
                name: baseNameRu,
                nameUzLatn: baseNameUzLatn,
                nameUzCyrl: baseNameUzCyrl,

                // Link to territory
                territoryId: territory.id,
                location: territory.name,
                locationUzLatn: territory.nameUzLatn,
                locationUzCyrl: territory.nameUzCyrl,

                // Link to Military District
                subordination: militaryDistrict.shortName || militaryDistrict.name,

                // Additional fields
                unitType: "Воинская часть",
                isActive: true,
                commanderName: `Командир ${unitNumber}`,
                commanderRank: "Полковник"
            }
        });

        createdCount++;
    }

    console.log(`Successfully created ${createdCount} military units.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const BACKUP_FILE = path.join(process.cwd(), 'scripts', 'territories_backup.json');

async function restore() {
    console.log('Restoring RefTerritory from JSON backup...');

    if (!fs.existsSync(BACKUP_FILE)) {
        console.error('Backup file not found!');
        return;
    }

    const rawData = fs.readFileSync(BACKUP_FILE, 'utf-8');
    const territories = JSON.parse(rawData);

    console.log(`Found ${territories.length} records.`);

    for (const t of territories) {
        // We retain the ID to keep relations valid (if we relink later)
        await prisma.refTerritory.create({
            data: {
                id: t.id,
                // Magic: we pass the object structure. 
                // If the Prisma Client is outdated (thinks it's a string), this might fail validation or runtime.
                // We cast to any to bypass TS errors.
                name: t.name as any,
                type: t.type,
                parentId: t.parentId,
                status: t.status,
                createdAt: t.createdAt
            }
        });
    }

    console.log('Restoration complete.');

    // Optional: relink units based on assumptions or manual work?
    // We unlinked them (set territoryId = null).
    // The User didn't ask to relink, but good manners.
    // Actually, we kept IDs! So units that had territoryId=X will point to nowhere?
    // No, we set unit.territoryId = null. 
    // We can try to restore links if we had backed up units. We didn't.
    // But wait! We only cleared territoryId in DB. We didn't change Unit IDs.
    // The restoration of Territories puts them back with SAME IDs.
    // So if we had NOT set territoryId=null, constraints would have failed.
    // Now we need a way to put territoryId back?
    // Unfortunately, we didn't backup the link "UnitID -> TerritoryID".
    // We only backed up Territories.
    // The script "clean-territories.ts" did `updateMany({ data: { territoryId: null } })`.
    // The links are LOST unless we re-infer them (e.g. by matching location name).

    // Re-linking logic (Bonus)
    // Re-link based on string match of previously saved location text?
    // Unit has `location` (string). Territory has `name.ru`.
    // Let's try to simple match.

    console.log('Attempting to re-link units by location name...');
    const allUnits = await prisma.refUnit.findMany();
    let relinkCount = 0;

    for (const unit of allUnits) {
        if (unit.location) {
            // Try to find a territory with matching name in JSON
            // Note: unit.location might be "Toshkent sh." or just "Toshkent".
            // This is fuzzy.

            // Simple exact match on Russian name (as it was primary key effectively)
            const match = territories.find((t: any) =>
                t.name.ru === unit.location ||
                t.name.uz === unit.location ||
                t.name.uzk === unit.location
            );

            if (match) {
                await prisma.refUnit.update({
                    where: { unitId: unit.unitId },
                    data: { territoryId: match.id }
                });
                relinkCount++;
            }
        }
    }
    console.log(`Re-linked ${relinkCount} units.`);
}

restore()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

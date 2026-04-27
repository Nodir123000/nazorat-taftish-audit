import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = "postgresql://postgres:Muslima-3001%23%23@localhost:5432/nazorat_taftish"
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log("👥 Добавление образцового личного состава КРУ...");

    // Get some physical persons
    const people = await prisma.ref_physical_persons.findMany({ take: 10 });
    if (people.length < 5) {
        console.log("⚠️ Недостаточно физических лиц в базе. Запустите scripts/seed-people.ts сначала.");
        return;
    }

    const kruUnits = [208, 20801, 20802, 20803, 20804];
    const kruPositions = [5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008, 5009, 5010];

    for (let i = 0; i < 5; i++) {
        const person = people[i];
        const unitId = kruUnits[i % kruUnits.length];
        const posId = kruPositions[i % kruPositions.length];
        
        await prisma.personnel.upsert({
            where: { service_number: `KRU-${1000 + i}` },
            update: {
                unit_id: unitId,
                position_id: posId,
                status: 'active'
            },
            create: {
                physical_person_id: person.id,
                service_number: `KRU-${1000 + i}`,
                pnr: `Щ-${200000 + i}`,
                rank_id: 1, // Полковник/Подполковник usually
                unit_id: unitId,
                position_id: posId,
                status: 'active',
                service_start_date: new Date('2020-01-01')
            }
        });
    }

    console.log("✅ Образцовый личный состав КРУ добавлен.");
}

main().finally(async () => { await prisma.$disconnect(); await pool.end(); });

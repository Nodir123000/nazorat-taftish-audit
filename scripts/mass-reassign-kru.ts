import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = "postgresql://postgres:Muslima-3001%23%23@localhost:5432/nazorat_taftish"
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log("🚀 Массовое переназначение должностей и подразделений для КРУ...");

    // Get 100 personnel members
    const personnel = await prisma.personnel.findMany({ take: 100 });
    
    const kruUnits = [20801, 20802, 20803, 20804];
    const kruPositions = [
        5003, 5004, // OMO
        5005, 5006, // OVA
        5009, 5010, // OFI
        5013, 5014  // OMTO
    ];

    // Mapping unit to its positions for realism
    const unitToPosMap: Record<number, number[]> = {
        20801: [5003, 5004],
        20802: [5005, 5006],
        20803: [5009, 5010],
        20804: [5013, 5014]
    };

    let count = 0;
    for (let i = 0; i < personnel.length; i++) {
        const p = personnel[i];
        const unitId = kruUnits[i % kruUnits.length];
        const availablePositions = unitToPosMap[unitId];
        const positionId = availablePositions[i % availablePositions.length];

        await prisma.personnel.update({
            where: { id: p.id },
            data: {
                unit_id: unitId,
                position_id: positionId,
                status: 'active'
            }
        });
        count++;
    }

    // Assign chiefs manually for better look
    const chiefs = [
        { unitId: 208, posId: 5001 }, // Начальник КРУ
        { unitId: 20801, posId: 5002 }, // Зам нач КРУ - нач ОМО
        { unitId: 20802, posId: 5005 }, // Нач ОВА
        { unitId: 20803, posId: 5007 }, // Нач ОФИ
        { unitId: 20804, posId: 5011 }  // Нач ОМТО
    ];

    for (let i = 0; i < chiefs.length; i++) {
        if (personnel[i]) {
            await prisma.personnel.update({
                where: { id: personnel[i].id },
                data: {
                    unit_id: chiefs[i].unitId,
                    position_id: chiefs[i].posId
                }
            });
        }
    }

    console.log(`✅ Переназначено ${count} сотрудников в структуру КРУ.`);
}

main().finally(async () => { await prisma.$disconnect(); await pool.end(); });

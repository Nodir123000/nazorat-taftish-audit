
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper to seed reference data if missing
async function ensureReferences() {
    console.log('Ensuring reference data exists...')

    // 1. Control Authorities
    let authority = await (prisma as any).ref_control_authorities.findUnique({
        where: { code: 'ГФЭУ МО РУ' }
    });
    if (!authority) {
        authority = await (prisma as any).ref_control_authorities.create({
            data: {
                code: 'ГФЭУ МО РУ',
                name: { ru: 'Главное финансово-экономическое управление', uz: 'Bosh moliya-iqtisodiy boshqarmasi' }
            }
        });
        console.log('Created authority: ГФЭУ МО РУ');
    }

    // 2. Control Directions
    let direction = await (prisma as any).ref_control_directions.findUnique({
        where: { code: 'FIN' }
    });
    if (!direction) {
        direction = await (prisma as any).ref_control_directions.create({
            data: {
                code: 'FIN',
                name: { ru: 'Финансово-хозяйственная деятельность', uz: 'Moliya-xo\'jalik faoliyati' },
                status: 'active'
            }
        });
        console.log('Created direction: FIN');
    }

    // 3. Inspection Types
    let type = await (prisma as any).ref_inspection_types.findUnique({
        where: { code: '2301' }
    });
    if (!type) {
        type = await (prisma as any).ref_inspection_types.create({
            data: {
                code: '2301',
                name: { ru: 'Комплексная проверка', uz: 'Kompleks tekshiruv' },
                status: 'active'
            }
        });
        console.log('Created type: 2301');
    }

    return { authorityId: authority.authority_id, directionId: direction.direction_id, typeId: type.id };
}

const mockPlansData = [
    {
        planNumber: "10/001",
        year: 2024,
        unitCode: "00001", // Code to lookup
        status: "101",
        periodCoveredStart: new Date("2023-01-01"),
        periodCoveredEnd: new Date("2023-12-31"),
        // periodConducted is removed
        subordinateUnitsOnAllowance: [
            { unitCode: "00006", unitName: "Десантно-штурмовая бригада (В/Ч 00006)" }
        ],
        objectsTotal: 5,
        objectsFs: 1,
        objectsOs: 2
    },
    {
        planNumber: "10/002",
        year: 2024,
        unitCode: "00002",
        status: "101",
        periodCoveredStart: new Date("2023-06-01"),
        periodCoveredEnd: new Date("2023-12-31"),
        subordinateUnitsOnAllowance: [
            { unitCode: "00008", unitName: "Артиллерийский батальон (В/Ч 00008)" },
            { unitCode: "00009", unitName: "Зенитно-ракетный отряд (В/Ч 00009)" }
        ],
        objectsTotal: 3,
        objectsFs: 1,
        objectsOs: 1
    },
    {
        planNumber: "10/003",
        year: 2024,
        unitCode: "00003",
        status: "101",
        periodCoveredStart: new Date("2024-01-01"),
        periodCoveredEnd: new Date("2024-06-30"),
        subordinateUnitsOnAllowance: [
            { unitCode: "00010", unitName: "Батальон связи (В/Ч 00010)" }
        ],
        objectsTotal: 2,
        objectsFs: 0,
        objectsOs: 0
    },
    {
        planNumber: "10/004",
        year: 2024,
        unitCode: "00004",
        status: "101",
        periodCoveredStart: new Date("2023-01-01"),
        periodCoveredEnd: new Date("2023-12-01"),
        subordinateUnitsOnAllowance: [
            { unitCode: "00005", unitName: "Батальон обеспечения (В/Ч 00005)" },
            { unitCode: "00016", unitName: "Бригада (В/Ч 00016)" }
        ],
        objectsTotal: 4,
        objectsFs: 1,
        objectsOs: 1
    }
]

async function main() {
    console.log('Starting seed...')

    const refs = await ensureReferences();

    console.log('Clearing existing plans...')
    await (prisma as any).revPlanYear.deleteMany({})

    try {
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE rev_plan_year_plan_id_seq RESTART WITH 1;`)
        console.log('Sequence reset.')
    } catch (e) {
        console.log('Could not reset sequence, continuing...', e)
    }

    console.log('Seeding mock plans...')
    for (const plan of mockPlansData) {
        // Find unit
        const unit = await (prisma as any).ref_units.findUnique({
            where: { unit_code: plan.unitCode }
        });

        if (!unit) {
            console.warn(`Unit with code ${plan.unitCode} not found! Skipping plan ${plan.planNumber}`);
            continue;
        }

        await (prisma as any).revPlanYear.create({
            data: {
                planNumber: plan.planNumber,
                year: plan.year,
                status: plan.status,
                periodCoveredStart: plan.periodCoveredStart,
                periodCoveredEnd: plan.periodCoveredEnd,
                objectsTotal: plan.objectsTotal,
                objectsFs: plan.objectsFs,
                objectsOs: plan.objectsOs,
                subordinateUnitsOnAllowance: plan.subordinateUnitsOnAllowance,

                // Relations
                unitId: unit.unit_id,
                controlAuthorityId: refs.authorityId,
                inspectionDirectionId: refs.directionId,
                inspectionTypeId: refs.typeId,

                // Metadata
                startDate: new Date("2024-01-01"), // Technical dates
                endDate: new Date("2024-12-31"),
                periodType: "annual"
            }
        })
    }
    console.log('Seeding complete.')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())

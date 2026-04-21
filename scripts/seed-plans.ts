
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting plan generation...')

    // 1. Get all military units from DB
    const units = await prisma.ref_units.findMany({
        include: {
            ref_military_districts: true
        }
    })

    if (units.length === 0) {
        console.log('No units found in database. Please seed units first.')
        return
    }

    // 2. Get all control authorities and directions
    const authorities = await prisma.ref_control_authorities.findMany()
    const directions = await prisma.ref_control_directions.findMany()
    const inspectionTypes = await prisma.ref_inspection_types.findMany()

    const years = [2023, 2024, 2025]

    // Clear existing plans for these years to avoid mess (optional but recommended for 'forming' a plan)
    // await prisma.revPlanYear.deleteMany({ where: { year: { in: years } } })

    for (let i = 0; i < units.length; i++) {
        const unit = units[i]
        const year = years[i % years.length]
        const auth = authorities[i % authorities.length]
        const dir = directions[i % directions.length]
        const type = inspectionTypes[i % inspectionTypes.length]

        // Find subordinate units (on allowance) in the same district
        const subordinateUnits = units
            .filter(u => u.district_id === unit.district_id && u.unit_id !== unit.unit_id)
            .slice(0, 2) // Take up to 2
            .map(u => ({
                unitId: u.unit_id,
                unitName: typeof u.name === 'object' ? (u.name as any).ru : u.name
            }))

        const startDate = new Date(year, (i % 4) * 3, 1) // Distribute by quarters
        const endDate = new Date(year, (i % 4) * 3 + 1, 28)

        await prisma.revPlanYear.create({
            data: {
                year: year,
                planNumber: `${year}/${(i + 1).toString().padStart(3, '0')}`,
                status: 'approved',
                startDate: startDate,
                endDate: endDate,
                unitId: unit.unit_id,
                controlAuthorityId: auth.authority_id,
                inspectionDirectionId: dir.direction_id,
                inspectionTypeId: type.id,
                periodCoveredStart: new Date(year - 1, 0, 1),
                periodCoveredEnd: new Date(year - 1, 11, 31),
                subordinateUnitsOnAllowance: subordinateUnits as any,
                objectsTotal: Math.floor(Math.random() * 10) + 1,
                objectsFs: Math.floor(Math.random() * 5),
                objectsOs: Math.floor(Math.random() * 3),
            }
        })

        console.log(`Created plan for ${unit.name} (${year})`)
    }

    console.log('Plan generation completed successfully.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

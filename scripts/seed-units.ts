
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding units based on areas...')

    // Fetch reference data
    const areas = await (prisma as any).ref_areas.findMany({
        where: { status: 'active' },
        orderBy: { id: 'asc' }
    })

    const districts = await (prisma as any).ref_military_districts.findMany({
        where: { status: 'active' }
    })

    if (areas.length === 0) {
        console.log('No areas found. Please seed RefArea first.')
        return
    }
    if (districts.length === 0) {
        console.log('No districts found. Please seed RefMilitaryDistrict first.')
        return
    }

    // Fetch Types and Specializations
    const unitTypes = await (prisma as any).ref_unit_types.findMany({ where: { status: 'active' } })
    const specializations = await (prisma as any).ref_specializations.findMany({ where: { status: 'active' } })

    if (unitTypes.length === 0 || specializations.length === 0) {
        console.log('Unit Types or Specializations missing.')
        return
    }

    console.log(`Found ${areas.length} areas, ${districts.length} districts.`)

    // Ensure RefUnits are generated
    // We will iterate areas.
    let districtIndex = 0

    for (let i = 0; i < areas.length; i++) {
        const area = areas[i]

        // Generate unit code: 00001, 00002...
        const unitCodeNum = (i + 1).toString().padStart(5, '0')

        // Construct Name JSON
        const nameJson = {
            ru: `В/Ч ${unitCodeNum}`,
            uz: `H/Q ${unitCodeNum}`,
            uzk: `Ҳ/Қ ${unitCodeNum}`
        }

        // Round-robin district assignment with override for Unit 00001
        let district;
        if (unitCodeNum === "00001") {
            district = districts.find((d: any) => d.code === "ВВО") || districts[0];
        } else if (unitCodeNum === "00002") {
            district = districts.find((d: any) => d.code === "ВВО") || districts[0];
        } else if (unitCodeNum === "00003") {
            district = districts.find((d: any) => d.code === "ВВО") || districts[0];
        } else {
            district = districts[districtIndex % districts.length];
            districtIndex++;
        }

        // Random Type and Specialization
        const type = unitTypes[Math.floor(Math.random() * unitTypes.length)]
        const spec = specializations[Math.floor(Math.random() * specializations.length)]

        const existing = await (prisma as any).ref_units.findUnique({
            where: { unit_code: unitCodeNum }
        })

        const unitData = {
            name: nameJson,
            unit_code: unitCodeNum,
            // Relations using IDs
            area_id: area.id,
            military_district_id: district.district_id, // Note: snake_case for raw db access if needed, but Prisma Client usually maps it. Wait, if I use `(prisma as any).ref_units`, I should use snake_case fields.
            unit_type_id: type.id,
            specialization_id: spec.id,

            is_active: true,
        }

        if (existing) {
            await (prisma as any).ref_units.update({
                where: { unit_code: unitCodeNum },
                data: unitData
            })
        } else {
            await (prisma as any).ref_units.create({
                data: unitData
            })
        }

        if (i % 10 === 0) console.log(`Processed ${i + 1}/${areas.length} units...`)
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

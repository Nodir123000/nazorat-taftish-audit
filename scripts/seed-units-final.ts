
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Seeding Military Units...')

    const [areas, districts, unitTypes, specializations] = await Promise.all([
        (prisma as any).ref_areas.findMany(),
        (prisma as any).ref_military_districts.findMany(),
        (prisma as any).ref_unit_types.findMany(),
        (prisma as any).ref_specializations.findMany()
    ])

    if (areas.length === 0 || districts.length === 0) {
        console.error('Missing areas or districts! Run territory and district seeds first.')
        return
    }

    console.log(`Mapping units to ${areas.length} areas and ${districts.length} districts...`)

    let count = 0
    for (let i = 0; i < areas.length; i++) {
        const area = areas[i]
        const district = districts[i % districts.length]
        const type = unitTypes[i % unitTypes.length]
        const spec = specializations[i % specializations.length]

        const unitCode = (10000 + i).toString()
        const nameRu = `Воинская часть ${unitCode}`
        const nameUz = `Harbiy qism ${unitCode}`
        const nameUzk = `Ҳарбий қисм ${unitCode}`

        await prisma.refUnit.upsert({
            where: { unitCode },
            update: {
                name: { ru: nameRu, uz: nameUz, uzk: nameUzk },
                militaryDistrict: district.districtId,
                areaId: area.id,
                unitTypeId: type?.id,
                specializationId: spec?.id,
                isActive: true
            },
            create: {
                unitCode,
                name: { ru: nameRu, uz: nameUz, uzk: nameUzk },
                militaryDistrict: district.districtId,
                areaId: area.id,
                unitTypeId: type?.id,
                specializationId: spec?.id,
                isActive: true,
                location: (area.name as any).ru
            }
        })
        count++
    }

    console.log(`✅ ${count} Military Units seeded.`)
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())

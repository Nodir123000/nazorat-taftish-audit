
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Restoring Personnel records...')

    const [ranks, units, positions, vusList, genders, nationalities] = await Promise.all([
        prisma.refRank.findMany(),
        prisma.refUnit.findMany(),
        prisma.refPosition.findMany(),
        prisma.refVus.findMany(),
        prisma.refGender.findMany(),
        prisma.refNationality.findMany()
    ])

    const physicalPersonsData = [
        { pinfl: "31204851230045", lastName: "Абдуллаев", firstName: "Фарход", middleName: "Рустамович", gender: "Мужской" },
        { pinfl: "42510901230089", lastName: "Каримова", firstName: "Нигора", middleName: "Бахтияровна", gender: "Женский" },
        { pinfl: "30509781230012", lastName: "Султанов", firstName: "Тимур", middleName: "Азизович", gender: "Мужской" },
    ]

    for (let i = 0; i < physicalPersonsData.length; i++) {
        const p = physicalPersonsData[i]

        const gender = genders.find(g => (g.name as any).ru === p.gender)
        const nationality = nationalities[0]

        const person = await prisma.refPhysicalPerson.upsert({
            where: { pinfl: p.pinfl },
            update: {},
            create: {
                pinfl: p.pinfl,
                lastName: p.lastName,
                firstName: p.firstName,
                middleName: p.middleName,
                genderId: gender?.id,
                nationalityId: nationality?.id
            }
        })

        const rank = ranks[i % ranks.length]
        const unit = units[i % units.length]
        const pos = positions[i % positions.length]
        const vus = vusList[i % vusList.length]

        const pnrMap: Record<number, string> = {
            1: 'AB-000002',
            2: 'AB-000003',
            3: 'AB-000001'
        }
        const personPnr = pnrMap[person.id] || `PNR-${person.id}`

        await prisma.personnel.upsert({
            where: { pnr: personPnr },
            update: {},
            create: {
                physicalPersonId: person.id,
                pnr: personPnr,
                rankId: rank.rankId,
                unitId: unit.unitId,
                positionId: pos.id,
                vusId: vus.id,
                status: 'active'
            }
        })
    }

    console.log('✅ Personnel records restored.')
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())


import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Starting personnel re-seeding...')

    // 1. Fetch Resources
    // Increase limit to process more people
    const physicalPersons = await prisma.refPhysicalPerson.findMany({
        take: 1000
    })

    if (physicalPersons.length === 0) {
        console.error('❌ No physical persons found!')
        return
    }

    const units = await prisma.refUnit.findMany()
    const ranks = await prisma.refRank.findMany()
    const positions = await prisma.refPosition.findMany()
    const vusList = await prisma.refVus.findMany()

    console.log(`📊 Found: ${physicalPersons.length} people, ${units.length} units, ${ranks.length} ranks, ${positions.length} positions.`)

    if (units.length === 0) {
        console.error('❌ No units found! Seed units first.')
        return
    }

    let createdCount = 0

    for (const person of physicalPersons) {
        // Randomly assign military attributes
        const unit = units[Math.floor(Math.random() * units.length)]
        const rank = ranks.length > 0 ? ranks[Math.floor(Math.random() * ranks.length)] : null
        const position = positions.length > 0 ? positions[Math.floor(Math.random() * positions.length)] : null
        const vus = vusList.length > 0 ? vusList[Math.floor(Math.random() * vusList.length)] : null

        // Generate PNR
        const passportSeries = person.passportSeries || 'XX';
        const passportNumber = person.passportNumber || Math.floor(1000000 + Math.random() * 9000000).toString();
        const pnr = passportSeries + passportNumber

        try {
            // Check if personnel record already exists for this person
            const existingPersonnel = await prisma.personnel.findFirst({
                where: { physicalPersonId: person.id }
            });

            if (existingPersonnel) {
                await prisma.personnel.update({
                    where: { id: existingPersonnel.id },
                    data: {
                        unitId: unit.unitId,
                        rankId: rank ? rank.rankId : null,
                        positionId: position ? position.id : null,
                        vusId: vus ? vus.id : null,
                        status: 'active',
                    }
                });
            } else {
                await prisma.personnel.create({
                    data: {
                        physicalPersonId: person.id,
                        unitId: unit.unitId,
                        rankId: rank ? rank.rankId : null,
                        positionId: position ? position.id : null,
                        vusId: vus ? vus.id : null,
                        pnr: pnr,
                        status: 'active',
                    }
                });
            }
            createdCount++
        } catch (e) {
            console.error(`Failed for person ${person.id}:`, e)
        }

        if (createdCount % 50 === 0) process.stdout.write('.')
    }

    console.log(`\n✅ Successfully seeded/updated ${createdCount} personnel records.`)
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())

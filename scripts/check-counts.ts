import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.users.count()
    const physicalPersons = await prisma.ref_physical_persons.count()
    const units = await prisma.ref_units.count()

    console.log({
        users,
        physicalPersons,
        units
    })
}

main().finally(() => prisma.$disconnect())

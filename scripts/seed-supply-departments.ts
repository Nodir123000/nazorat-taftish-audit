import { PrismaClient, Prisma } from '@prisma/client'
import { supplyDepartments } from '../lib/data/expense-classification'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding supply departments...')

    for (const dept of supplyDepartments) {
        const nameJson: Prisma.JsonObject = {
            ru: dept.name,
            uz: dept.name_uz_latn,
            uzk: dept.name_uz_cyrl
        }

        const shortNameJson: Prisma.JsonObject = {
            ru: dept.short_name,
            uz: dept.short_name_uz_latn,
            uzk: dept.short_name_uz_cyrl
        }

        // @ts-expect-error - Prisma Client types may not be fully updated in IDE
        await prisma.refSupplyDepartment.upsert({
            where: { code: dept.code },
            update: {
                name: nameJson,
                shortName: shortNameJson,
                status: 'active'
            },
            create: {
                code: dept.code,
                name: nameJson,
                shortName: shortNameJson,
                status: 'active'
            }
        })
    }

    console.log(`Seeded ${supplyDepartments.length} supply departments.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

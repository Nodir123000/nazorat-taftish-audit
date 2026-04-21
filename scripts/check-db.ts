import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const templates = await prisma.document_templates.findMany({
        where: { type: 'order' }
    })

    console.log('--- Order Templates in DB ---')
    templates.forEach(t => {
        if (t.locale === 'uz_lt') {
            console.log(`--- FULL TEMPLATE ${t.id} (${t.locale}) ---`)
            console.log(t.content)
        }
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())

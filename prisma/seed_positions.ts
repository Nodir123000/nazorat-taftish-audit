
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const positionsList = [
        { id: 1301, code: "1301", name: { ru: "Командир части", uz: "Qism komandiri", uzk: "Қисм командири" } },
        { id: 1302, code: "1302", name: { ru: "Начальник штаба", uz: "Shtab boshlig'i", uzk: "Штаб бошлиғи" } },
        { id: 1303, code: "1303", name: { ru: "Заместитель командира", uz: "Komandir o'rinbosari", uzk: "Командир ўринбосари" } },
        { id: 1304, code: "1304", name: { ru: "Командир батальона", uz: "Batalyon komandiri", uzk: "Батальон командири" } },
        { id: 1305, code: "1305", name: { ru: "Командир роты", uz: "Rota komandiri", uzk: "Рота командири" } },
        { id: 1306, code: "1306", name: { ru: "Командир взвода", uz: "Vzvod komandiri", uzk: "Взвод командири" } },
        { id: 1307, code: "1307", name: { ru: "Старший офицер", uz: "Katta ofitser", uzk: "Катта офицер" } },
        { id: 1308, code: "1308", name: { ru: "Офицер", uz: "Ofitser", uzk: "Офицер" } },
        { id: 1309, code: "1309", name: { ru: "Инспектор", uz: "Inspektor", uzk: "Инспектор" } },
        { id: 1310, code: "1310", name: { ru: "Главный инженер", uz: "Bosh muhandis", uzk: "Бош муҳандис" } },
    ]

    console.log('Seeding Positions list...')
    for (const pos of positionsList) {
        await prisma.refPosition.upsert({
            where: { code: pos.code },
            update: {
                name: pos.name as any,
            },
            create: {
                id: pos.id,
                code: pos.code,
                name: pos.name as any,
            },
        })
    }

    console.log('Positions seed finished successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

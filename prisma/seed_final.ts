
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Cleaning tables...')
    await prisma.refVus.deleteMany({})
    await prisma.refPosition.deleteMany({})

    const vusList = [
        { id: 100915, code: "100915", name: { ru: "Стрелок", uz: "O'qchi", uzk: "Ўқчи" } },
        { id: 101001, code: "101001", name: { ru: "Пулеметчик", uz: "Pulyotchi", uzk: "Пулёдчи" } },
        { id: 102001, code: "102001", name: { ru: "Гранатометчик", uz: "Granatamyotchi", uzk: "Гранатамётчи" } },
        { id: 106646, code: "106646", name: { ru: "Разведчик", uz: "Razvedkachi", uzk: "Разведкачи" } },
        { id: 113001, code: "113001", name: { ru: "Снайпер", uz: "Snayper", uzk: "Снайпер" } },
        { id: 121000, code: "121000", name: { ru: "Механик-водитель", uz: "Mexanik-haydovchi", uzk: "Механик-ҳайдовчи" } },
        { id: 600543, code: "600543", name: { ru: "Оператор ЭВМ", uz: "EHM operatori", uzk: "ЭҲМ оператори" } },
        { id: 837037, code: "837037", name: { ru: "Водитель", uz: "Haydowchi", uzk: "Ҳайдовчи" } },
    ]

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

    console.log('Seeding VUS list...')
    for (const vus of vusList) {
        await prisma.refVus.create({
            data: {
                id: vus.id,
                code: vus.code,
                name: vus.name as any,
            },
        })
    }

    console.log('Seeding Positions list...')
    for (const pos of positionsList) {
        await prisma.refPosition.create({
            data: {
                id: pos.id,
                code: pos.code,
                name: pos.name as any,
            },
        })
    }

    console.log('Complete seed successful')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })


import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const compositions = [
        { id: 1101, name: { ru: "Рядовой состав", uz: "Oddiy askarlar tarkibi", uzk: "Оддий аскарлар таркиби" } },
        { id: 1102, name: { ru: "Сержантский состав", uz: "Serjantlar tarkibi", uzk: "Сержантлар таркиби" } },
        { id: 1103, name: { ru: "Младший офицерский состав", uz: "Kichik ofitserlar tarkibi", uzk: "Кичик офицерлар таркиби" } },
        { id: 1104, name: { ru: "Старший офицерский состав", uz: "Katta ofitserlar tarkibi", uzk: "Катта офицерлар таркиби" } },
        { id: 1105, name: { ru: "Генеральский состав", uz: "Generallar tarkibi", uzk: "Генераллар таркиби" } },
    ]

    const ranks = [
        // Рядовой состав (compositionId: 1101)
        { id: 601, name: { ru: "Рядовой", uz: "Oddiy askar", uzk: "Оддий аскар" }, compositionId: 1101, type: "army" },
        { id: 602, name: { ru: "Матрос", uz: "Matros", uzk: "Матрос" }, compositionId: 1101, type: "navy" },

        // Сержантский состав (compositionId: 1102)
        { id: 603, name: { ru: "Младший сержант", uz: "Kichik serjant", uzk: "Кичик сержант" }, compositionId: 1102, type: "army" },
        { id: 604, name: { ru: "Сержант III степени", uz: "III darajali serjant", uzk: "III даражали сержант" }, compositionId: 1102, type: "army" },
        { id: 605, name: { ru: "Сержант II степени", uz: "II darajali serjant", uzk: "II даражали сержант" }, compositionId: 1102, type: "army" },
        { id: 606, name: { ru: "Сержант I степени", uz: "I darajali serjant", uzk: "I даражали сержант" }, compositionId: 1102, type: "army" },
        { id: 607, name: { ru: "Старший сержант", uz: "Katta serjant", uzk: "Катта сержант" }, compositionId: 1102, type: "army" },
        { id: 608, name: { ru: "Старшина", uz: "Starshina", uzk: "Старшина" }, compositionId: 1102, type: "army" },
        { id: 609, name: { ru: "Старшина III статьи", uz: "III toifali starshina", uzk: "III тоифали старшина" }, compositionId: 1102, type: "navy" },
        { id: 610, name: { ru: "Старшина II статьи", uz: "II toifali starshina", uzk: "II тоифали старшина" }, compositionId: 1102, type: "navy" },
        { id: 611, name: { ru: "Старшина I статьи", uz: "I toifali starshina", uzk: "I тоифали старшина" }, compositionId: 1102, type: "navy" },
        { id: 612, name: { ru: "Главный старшина", uz: "Bosh starshina", uzk: "Бош старшина" }, compositionId: 1102, type: "navy" },

        // Младший офицерский состав (compositionId: 1103)
        { id: 613, name: { ru: "Лейтенант", uz: "Leytenant", uzk: "Лейтенант" }, compositionId: 1103, type: "army" },
        { id: 614, name: { ru: "Старший лейтенант", uz: "Katta leytenant", uzk: "Катта лейтенант" }, compositionId: 1103, type: "army" },
        { id: 615, name: { ru: "Капитан", uz: "Kapitan", uzk: "Капитан" }, compositionId: 1103, type: "army" },
        { id: 616, name: { ru: "Лейтенант", uz: "Leytenant", uzk: "Лейтенант" }, compositionId: 1103, type: "navy" },
        { id: 617, name: { ru: "Старший лейтенант", uz: "Katta leytenant", uzk: "Катта лейтенант" }, compositionId: 1103, type: "navy" },
        { id: 618, name: { ru: "Капитан-лейтенант", uz: "Kapitan-leytenant", uzk: "Капитан-лейтенант" }, compositionId: 1103, type: "navy" },

        // Старший офицерский состав (compositionId: 1104)
        { id: 619, name: { ru: "Майор", uz: "Mayor", uzk: "Майор" }, compositionId: 1104, type: "army" },
        { id: 620, name: { ru: "Подполковник", uz: "Podpolkovnik", uzk: "Подполковник" }, compositionId: 1104, type: "army" },
        { id: 621, name: { ru: "Полковник", uz: "Polkovnik", uzk: "Полковник" }, compositionId: 1104, type: "army" },
        { id: 622, name: { ru: "Капитан III ранга", uz: "III darajali kapitan", uzk: "III даражали капитан" }, compositionId: 1104, type: "navy" },
        { id: 623, name: { ru: "Капитан II ранга", uz: "II darajali kapitan", uzk: "II даражали капитан" }, compositionId: 1104, type: "navy" },
        { id: 624, name: { ru: "Капитан I ранга", uz: "I darajali kapitan", uzk: "I даражали капитан" }, compositionId: 1104, type: "navy" },

        // Генеральский состав (compositionId: 1105)
        { id: 625, name: { ru: "Генерал-майор", uz: "General-mayor", uzk: "Генерал-майор" }, compositionId: 1105, type: "army" },
        { id: 626, name: { ru: "Генерал-лейтенант", uz: "General-leytenant", uzk: "Генерал-лейтенант" }, compositionId: 1105, type: "army" },
        { id: 627, name: { ru: "Генерал-полковник", uz: "General-polkovnik", uzk: "Генерал-полковник" }, compositionId: 1105, type: "army" },
        { id: 628, name: { ru: "Генерал армии", uz: "Armiya generali", uzk: "Армия генерали" }, compositionId: 1105, type: "army" },
    ]

    console.log('Seeding compositions...')
    for (const comp of compositions) {
        await prisma.refComposition.upsert({
            where: { id: comp.id },
            update: {
                name: comp.name,
            },
            create: {
                id: comp.id,
                name: comp.name,
            },
        })
    }

    console.log('Seeding ranks...')
    for (const rank of ranks) {
        await prisma.refRank.upsert({
            where: { rankId: rank.id },
            update: {
                name: rank.name,
                compositionId: rank.compositionId,
                type: rank.type,
            },
            create: {
                rankId: rank.id,
                name: rank.name,
                compositionId: rank.compositionId,
                type: rank.type,
            },
        })
    }

    console.log('Seed finished successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

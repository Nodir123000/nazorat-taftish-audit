
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// --- REFERENCE DATA: UZBEKISTAN MILITARY RANKS ---

const COMPOSITIONS = [
    { id: 1101, name: { ru: "Рядовой состав", uz: "Oddiy askarlar tarkibi", uzk: "Оддий аскарлар таркиби" } },
    { id: 1102, name: { ru: "Сержантский состав", uz: "Serjantlar tarkibi", uzk: "Сержантлар таркиби" } },
    { id: 1103, name: { ru: "Младший офицерский состав", uz: "Kichik ofitserlar tarkibi", uzk: "Кичик офицерлар таркиби" } },
    { id: 1104, name: { ru: "Старший офицерский состав", uz: "Katta ofitserlar tarkibi", uzk: "Катта офицерлар таркиби" } },
    { id: 1105, name: { ru: "Генеральский состав", uz: "Generallar tarkibi", uzk: "Генераллар таркиби" } }
]

const RANKS = [
    // 1. Soldiers / Sailors
    {
        level: 1, id: 601, compId: 1101, type: 'army',
        name: { ru: "Рядовой", uz: "Oddiy askar", uzk: "Оддий аскар" }
    },
    {
        level: 1, id: 602, compId: 1101, type: 'navy',
        name: { ru: "Матрос", uz: "Matros", uzk: "Матрос" }
    },

    // 2. Sergeants / Petty Officers
    {
        level: 2, id: 603, compId: 1102, type: 'army',
        name: { ru: "Младший сержант", uz: "Kichik serjant", uzk: "Кичик сержант" }
    },
    // No explicit Navy equivalent for Jr Sergeant in some systems, but assuming standard symmetry if needed. 
    // Using generic sergeant ranks structure often used in modernized systems:

    {
        level: 3, id: 604, compId: 1102, type: 'army',
        name: { ru: "Сержант III степени", uz: "III darajali serjant", uzk: "III даражали сержант" }
    },
    {
        level: 3, id: 640, compId: 1102, type: 'navy',
        name: { ru: "Старшина III статьи", uz: "III darajali starshina", uzk: "III даражали старшина" } // Hypothetical mapping if needed, or skip
    },

    {
        level: 4, id: 605, compId: 1102, type: 'army',
        name: { ru: "Сержант II степени", uz: "II darajali serjant", uzk: "II даражали сержант" }
    },
    {
        level: 4, id: 641, compId: 1102, type: 'navy',
        name: { ru: "Старшина II статьи", uz: "II darajali starshina", uzk: "II даражали старшина" }
    },

    {
        level: 5, id: 642, compId: 1102, type: 'army',
        name: { ru: "Сержант I степени", uz: "I darajali serjant", uzk: "I даражали сержант" }
    },
    {
        level: 5, id: 643, compId: 1102, type: 'navy',
        name: { ru: "Старшина I статьи", uz: "I darajali starshina", uzk: "I даражали старшина" }
    },

    {
        level: 6, id: 606, compId: 1102, type: 'army',
        name: { ru: "Старший сержант", uz: "Katta serjant", uzk: "Катта сержант" }
    },
    {
        level: 6, id: 607, compId: 1102, type: 'navy',
        name: { ru: "Главный старшина", uz: "Bosh starshina", uzk: "Бош старшина" }
    },

    // (Starshina is often max sergeant rank)
    {
        level: 7, id: 644, compId: 1102, type: 'navy',
        name: { ru: "Старшина", uz: "Starshina", uzk: "Старшина" }
    },


    // 3. Junior Officers
    {
        level: 8, id: 613, compId: 1103, type: 'army',
        name: { ru: "Лейтенант", uz: "Leytenant", uzk: "Лейтенант" }
    },
    {
        level: 8, id: 650, compId: 1103, type: 'navy',
        name: { ru: "Лейтенант", uz: "Leytenant", uzk: "Лейтенант" }
    },

    {
        level: 9, id: 614, compId: 1103, type: 'army',
        name: { ru: "Старший лейтенант", uz: "Katta leytenant", uzk: "Катта лейтенант" }
    },
    {
        level: 9, id: 651, compId: 1103, type: 'navy',
        name: { ru: "Старший лейтенант", uz: "Katta leytenant", uzk: "Катта лейтенант" }
    },

    {
        level: 10, id: 615, compId: 1103, type: 'army',
        name: { ru: "Капитан", uz: "Kapitan", uzk: "Капитан" }
    },
    {
        level: 10, id: 616, compId: 1103, type: 'navy',
        name: { ru: "Капитан-лейтенант", uz: "Kapitan-leytenant", uzk: "Капитан-лейтенант" }
    },

    // 4. Senior Officers
    {
        level: 11, id: 617, compId: 1104, type: 'army',
        name: { ru: "Майор", uz: "Mayor", uzk: "Майор" }
    },
    {
        level: 11, id: 618, compId: 1104, type: 'navy',
        name: { ru: "Капитан 3-го ранга", uz: "III rang kapitani", uzk: "III ранг капитани" }
    },

    {
        level: 12, id: 619, compId: 1104, type: 'army',
        name: { ru: "Подполковник", uz: "Podpolkovnik", uzk: "Подполковник" }
    },
    {
        level: 12, id: 620, compId: 1104, type: 'navy',
        name: { ru: "Капитан 2-го ранга", uz: "II rang kapitani", uzk: "II ранг капитани" }
    },

    {
        level: 13, id: 621, compId: 1104, type: 'army',
        name: { ru: "Полковник", uz: "Polkovnik", uzk: "Полковник" }
    },
    {
        level: 13, id: 622, compId: 1104, type: 'navy',
        name: { ru: "Капитан 1-го ранга", uz: "I rang kapitani", uzk: "I ранг капитани" }
    },

    // 5. Generals
    {
        level: 14, id: 625, compId: 1105, type: 'army',
        name: { ru: "Генерал-майор", uz: "General-mayor", uzk: "Генерал-майор" }
    },
    {
        level: 14, id: 626, compId: 1105, type: 'navy',
        name: { ru: "Контр-адмирал", uz: "Kontr-admiral", uzk: "Контр-адмирал" }
    },

    {
        level: 15, id: 627, compId: 1105, type: 'army',
        name: { ru: "Генерал-лейтенант", uz: "General-leytenant", uzk: "Генерал-лейтенант" }
    },
    {
        level: 15, id: 628, compId: 1105, type: 'navy',
        name: { ru: "Вице-адмирал", uz: "Vitse-admiral", uzk: "Вице-адмирал" }
    },

    {
        level: 16, id: 629, compId: 1105, type: 'army',
        name: { ru: "Генерал-полковник", uz: "General-polkovnik", uzk: "Генерал-полковник" }
    },
    {
        level: 16, id: 630, compId: 1105, type: 'navy',
        name: { ru: "Адмирал", uz: "Admiral", uzk: "Адмирал" }
    },

    {
        level: 17, id: 631, compId: 1105, type: 'army',
        name: { ru: "Генерал армии", uz: "Armiya generali", uzk: "Армия генерали" }
    },
    {
        level: 17, id: 632, compId: 1105, type: 'navy',
        name: { ru: "Адмирал флота", uz: "Flot admirali", uzk: "Флот адмирали" } // Assuming highest navy rank
    },
]


async function main() {
    console.log("🔥 STARTING FULL RESET OF RANKS...")

    // 1. Clean existing Personnel links to avoid FK errors (set rank to null optionally, or we assume test environment)
    // For safety, we will NOT delete personnel, but we might encounter FK issues if we delete ranks used by them.
    // Ideally, we should update personnel to point to new IDs, but for this 'Reset' we assume a clean slate or data fix is prioritized.
    // A smart way: upsert.

    // 2. Ensure Compositions exist
    console.log("Checking compositions...")
    for (const comp of COMPOSITIONS) {
        await prisma.refComposition.upsert({
            where: { id: comp.id },
            update: { name: comp.name },
            create: {
                id: comp.id,
                code: comp.id.toString(),
                name: comp.name,
                status: 'active'
            }
        })
    }

    // 3. Upsert Ranks
    console.log("Upserting Ranks...")
    for (const rank of RANKS) {
        await prisma.refRank.upsert({
            where: { rankId: rank.id },
            update: {
                name: rank.name,
                compositionId: rank.compId,
                type: rank.type,
                level: rank.level,
            },
            create: {
                rankId: rank.id,
                name: rank.name,
                compositionId: rank.compId,
                type: rank.type,
                level: rank.level,
            }
        })
    }

    // 4. Remove any ranks NOT in our list (Cleanup old/duplicates)
    const validIds = RANKS.map(r => r.id)
    const deleted = await prisma.refRank.deleteMany({
        where: {
            rankId: { notIn: validIds }
        }
    })

    console.log(`✅ Reference Data Synced. Deleted ${deleted.count} old/invalid ranks.`)
    console.log("🏁 DONE.")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())


import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const educationLevels = [
    { id: 1801, name: "Среднее общее", name_uz_cyrl: "Умумий ўрта", name_uz_latn: "Umumiy o'rta" },
    { id: 1802, name: "Среднее специальное", name_uz_cyrl: "Ўрта махсус", name_uz_latn: "O'rta maxsus" },
    { id: 1803, name: "Высшее гражданское", name_uz_cyrl: "Олий фуқаролик", name_uz_latn: "Oliy fuqarolik" },
    { id: 1804, name: "Высшее военное", name_uz_cyrl: "Олий ҳарбий", name_uz_latn: "Oliy harbiy" },
    { id: 1805, name: "Академическое (послевузовское)", name_uz_cyrl: "Академик (Олийгоҳдан кейинги)", name_uz_latn: "Akademik (Oliygohdan keyingi)" },
]

async function seedEducation() {
    console.log("🌱 Seeding Education Levels (JSON format)...")

    for (const level of educationLevels) {
        const nameJson = {
            ru: level.name,
            uz: level.name_uz_latn,
            uzk: level.name_uz_cyrl
        }

        await prisma.ref_education_levels.upsert({
            where: {
                id: level.id
            },
            update: {
                code: level.id.toString(),
                name: nameJson,
                status: "active"
            },
            create: {
                id: level.id,
                code: level.id.toString(),
                name: nameJson,
                status: "active"
            }
        })
    }
    console.log("✅ Education Levels Seeded")
}

seedEducation()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

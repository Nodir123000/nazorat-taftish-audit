import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { classifiersData } from './classifiers-data'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function seedClassifiers() {
    console.log("🌱 Начинаем заполнение классификаторов...")

    for (const category of classifiersData) {
        console.log(`📡 Обработка типа: ${category.type}...`)

        for (const item of category.values) {
            try {
                await (prisma as any).ref_classifiers.upsert({
                    where: {
                        type_code: {
                            type: category.type,
                            code: item.id.toString(),
                        }
                    },
                    update: {
                        name: {
                            ru: item.name,
                            uz: item.name_uz_latn || "",
                            uzk: item.name_uz_cyrl || ""
                        }
                    },
                    create: {
                        type: category.type,
                        code: item.id.toString(),
                        name: {
                            ru: item.name,
                            uz: item.name_uz_latn || "",
                            uzk: item.name_uz_cyrl || ""
                        }
                    },
                })
            } catch (error) {
                console.error(`❌ Ошибка при вставке ${item.name}:`, error)
            }
        }
    }

    console.log("✅ Все классификаторы успешно синхронизированы!")
}

seedClassifiers()
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

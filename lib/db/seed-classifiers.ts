import { PrismaClient } from '@prisma/client'
import { classifiersData } from './classifiers-data'

const prisma = new PrismaClient()

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

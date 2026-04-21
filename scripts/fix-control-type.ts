
import { PrismaClient } from '@prisma/client'
import { classifiersData } from '../lib/db/classifiers-data'

const prisma = new PrismaClient()

async function resetControlType() {
    console.log("🧹 Очистка и обновление справочника 'control_type' (Виды контроля)...")

    const controlTypeData = classifiersData.find(c => c.type === 'control_type')
    if (!controlTypeData) {
        console.error("❌ Данные для control_type не найдены в classifiers-data")
        return
    }

    try {
        // 1. Удаляем все записи данного типа
        const deleted = await prisma.refClassifier.deleteMany({
            where: {
                type: 'control_type'
            }
        })
        console.log(`🗑️ Удалено старых записей: ${deleted.count}`)

        // 2. Вставляем актуальные данные
        console.log(`📥 Вставка ${controlTypeData.values.length} новых записей...`)

        for (const item of controlTypeData.values) {
            await prisma.refClassifier.create({
                data: {
                    type: 'control_type',
                    code: item.id.toString(),
                    nameRu: item.name,
                    nameUzLatn: item.name_uz_latn,
                    nameUzCyrl: item.name_uz_cyrl,
                }
            })
        }

        console.log("✅ Справочник control_type успешно обновлен!")

    } catch (error) {
        console.error("❌ Ошибка при обновлении:", error)
    }
}

resetControlType()
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

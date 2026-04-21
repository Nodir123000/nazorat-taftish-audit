import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

interface Translation {
    key: string
    ru: string
    uz_cyrl: string
    uz_latn: string
    tags: string[]
    description?: string
}

async function main() {
    console.log('🚀 Начинаем импорт переводов для модуля Territories...')

    // Читаем JSON-файл
    const filePath = join(__dirname, 'ui_translations_territories.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    const translations: Translation[] = JSON.parse(fileContent)

    console.log(`📦 Найдено ${translations.length} переводов`)

    let imported = 0
    let updated = 0

    // Импортируем каждый перевод
    for (const translation of translations) {
        const existing = await prisma.uITranslation.findUnique({
            where: { key: translation.key }
        })

        // Формируем JSON-объект для поля name
        const nameJson = {
            ru: translation.ru,
            uz_latn: translation.uz_latn,
            uz_cyrl: translation.uz_cyrl
        }

        if (existing) {
            // Обновляем существующий
            await prisma.uITranslation.update({
                where: { key: translation.key },
                data: {
                    name: nameJson,
                    tags: translation.tags,
                    description: translation.description
                }
            })
            updated++
            console.log(`✏️  Обновлен: ${translation.key}`)
        } else {
            // Создаем новый
            await prisma.uITranslation.create({
                data: {
                    key: translation.key,
                    name: nameJson,
                    tags: translation.tags,
                    description: translation.description
                }
            })
            imported++
            console.log(`✅ Создан: ${translation.key}`)
        }
    }

    console.log('\n📊 Итоги импорта:')
    console.log(`   Создано новых: ${imported}`)
    console.log(`   Обновлено: ${updated}`)
    console.log(`   Всего обработано: ${translations.length}`)
    console.log('\n✨ Импорт завершен успешно!')
}

main()
    .catch((e) => {
        console.error('❌ Ошибка при импорте:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

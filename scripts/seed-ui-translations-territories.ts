import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Translations mapping
const translations = [
    { key: "ref.territories.title", ru: "Справочник территорий", uz_latn: "Hududlar ma'lumotnomasi", uz_cyrl: "Ҳудудлар маълумотномаси" },
    { key: "ref.territories.description", ru: "Управление областями и районами республики", uz_latn: "Respublika viloyatlari va tumanlarini boshqarish", uz_cyrl: "Республика вилоятлари ва туманларини бошқариш" },
    { key: "ref.territories.tab_regions", ru: "Области", uz_latn: "Viloyatlar", uz_cyrl: "Вилоятлар" },
    { key: "ref.territories.tab_districts", ru: "Районы", uz_latn: "Tumanlar", uz_cyrl: "Туманлар" },
    { key: "ref.territories.search_placeholder", ru: "Поиск по названию...", uz_latn: "Nom bo'yicha qidirish...", uz_cyrl: "Ном бўйича қидириш..." },
    { key: "ref.territories.add_region", ru: "Добавить область", uz_latn: "Viloyat qo'shish", uz_cyrl: "Вилоят қўшиш" },
    { key: "ref.territories.add_district", ru: "Добавить район", uz_latn: "Tuman qo'shish", uz_cyrl: "Туман қўшиш" },
    { key: "ref.territories.field.name", ru: "Наименование", uz_latn: "Nomlanishi", uz_cyrl: "Номланиши" },
    { key: "ref.territories.field.type", ru: "Тип", uz_latn: "Turi", uz_cyrl: "Тури" },
    { key: "ref.territories.field.region", ru: "Область", uz_latn: "Viloyat", uz_cyrl: "Вилоят" },
    { key: "ref.territories.field.status", ru: "Статус", uz_latn: "Holati", uz_cyrl: "Ҳолати" },
    { key: "common.unit_short", ru: "ед.", uz_latn: "birl.", uz_cyrl: "бирл." },
    { key: "common.actions", ru: "Действия", uz_latn: "Harakatlar", uz_cyrl: "Ҳаракатлар" },
]

async function main() {
    console.log('Seeding UI Translations for Territories...')

    for (const t of translations) {
        console.log(`Upserting ${t.key}...`)
        await prisma.ui_translations.upsert({
            where: { key: t.key },
            update: {
                name: {
                    ru: t.ru,
                    uz_latn: t.uz_latn,
                    uz_cyrl: t.uz_cyrl
                },
                tags: ["reference", "territories"],
                status: "active",
                updated_at: new Date()
            },
            create: {
                id: crypto.randomUUID(),
                key: t.key,
                name: {
                    ru: t.ru,
                    uz_latn: t.uz_latn,
                    uz_cyrl: t.uz_cyrl
                },
                tags: ["reference", "territories"],
                status: "active",
                created_at: new Date(),
                updated_at: new Date()
            }
        })
    }
    console.log('Done.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

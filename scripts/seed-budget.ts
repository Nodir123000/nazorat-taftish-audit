
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const articles = [
        { code: "100", name: "Расходы на персонал", nameUzLatn: "Personal xarajatlari", nameUzCyrl: "Персонал харажатлари" },
        { code: "110", name: "Заработная плата", nameUzLatn: "Ish haqi", nameUzCyrl: "Иш ҳақи" },
        { code: "120", name: "Начисления на зарплату", nameUzLatn: "Ish haqiga hisoblangan to'lovlar", nameUzCyrl: "Иш ҳақига ҳисобланган тўловлар" },
        { code: "200", name: "Закупка товаров и услуг", nameUzLatn: "Tovar va xizmatlar xaridi", nameUzCyrl: "Товар ва хизматлар хариди" },
        { code: "300", name: "Капитальные вложения", nameUzLatn: "Kapital qo'yilmalar", nameUzCyrl: "Капитал қўйилмалар" },
    ]

    console.log('Seeding Budget Articles...')
    for (const a of articles) {
        await prisma.refBudgetArticle.upsert({
            where: { code: a.code },
            update: a,
            create: a
        })
    }
    console.log('✅ Budget Articles seeded.')
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())


import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const docTypes = [
        { code: "ORD", name: "Приказ", nameUzLatn: "Buyruq", nameUzCyrl: "Буйруқ", category: "Основные" },
        { code: "DIR", name: "Распоряжение", nameUzLatn: "Farmoyish", nameUzCyrl: "Фармойиш", category: "Основные" },
        { code: "ACT", name: "Акт", nameUzLatn: "Dalolatnoma", nameUzCyrl: "Далолатнома", category: "Отчетные" },
        { code: "PRO", name: "Протокол", nameUzLatn: "Bayonnoma", nameUzCyrl: "Баённома", category: "Отчетные" },
        { code: "INF", name: "Справка", nameUzLatn: "Ma'lumotnoma", nameUzCyrl: "Маълумотнома", category: "Дополнительные" },
    ]

    console.log('Seeding Document Types...')
    for (const d of docTypes) {
        await prisma.refDocumentType.upsert({
            where: { code: d.code },
            update: d,
            create: d
        })
    }
    console.log('✅ Document Types seeded.')
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())

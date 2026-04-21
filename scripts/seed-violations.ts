
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const violations = [
        { code: "V001", name: "Нецелевое использование бюджетных средств", nameUzLatn: "Byudjet mablag'laridan maqsadsiz foydalanish", nameUzCyrl: "Бюджет маблағларидан мақсадсиз фойдаланиш", category: "Финансовые", severity: "High" },
        { code: "V002", name: "Недостача товарно-материальных ценностей", nameUzLatn: "Tovar-moddiy boyliklar kamomadi", nameUzCyrl: "Товар-моддий бойликлар камомади", category: "Материальные", severity: "Medium" },
        { code: "V003", name: "Излишки товарно-материальных ценностей", nameUzLatn: "Tovar-moddiy boyliklar ortiqchasi", nameUzCyrl: "Товар-моддий бойликлар ортиқчаси", category: "Материальные", severity: "Low" },
        { code: "V004", name: "Незаконные выплаты заработной платы", nameUzLatn: "Noqonuniy ish haqi to'lovlari", nameUzCyrl: "Ноқонуний иш ҳақи тўловлари", category: "Финансовые", severity: "High" },
    ]

    console.log('Seeding Violations...')
    for (const v of violations) {
        await prisma.refViolation.upsert({
            where: { code: v.code },
            update: v,
            create: v
        })
    }
    console.log('✅ Violations seeded.')
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())

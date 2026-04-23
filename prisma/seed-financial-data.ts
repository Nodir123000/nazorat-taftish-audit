import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding financial audits and violations (20.04.26)...')

  await prisma.financial_violations.deleteMany({})
  await prisma.financial_audits.deleteMany({})

  const audits = [
    {
      unit: "Воинская часть 99887",
      unit_subtitle: "Западный военный округ",
      control_body: "КРУ МО РУ",
      inspection_direction: "Финансово-хозяйственной деятельности",
      inspection_direction_subtitle: "ГФЭУ МО РУ",
      inspection_type: "плановые",
      date: new Date('2025-02-15'),
      cashier: "майор Сидоров А.",
      cashier_role: "начфин",
      balance: 1200000.00,
      status: "Проверено",
      inspector_name: "подполк. Хайдаров Н.",
    },
    {
      unit: "В/Ч 11223",
      unit_subtitle: "Северо-Западный военный округ",
      control_body: "КРУ МО РУ",
      inspection_direction: "Финансово-хозяйственной деятельности",
      inspection_direction_subtitle: "ГФЭУ МО РУ",
      inspection_type: "внеплановые",
      date: new Date('2025-03-20'),
      cashier: "кап. Рахимов Ж.",
      cashier_role: "кассир",
      balance: 670000.00,
      status: "Проверено",
      inspector_name: "майор Саидов А.",
    }
  ]

  const violationTypes = [
    { type: "Недостача денежных средств", kind: "Финансовое", source: "бюджет" },
    { type: "Излишки материальных ценностей", kind: "Имущественное", source: "внебюджет" },
    { type: "Необоснованные выплаты", kind: "Финансовое", source: "бюджет" }
  ]

  for (const auditData of audits) {
    const audit = await prisma.financial_audits.create({ data: auditData })
    const numViolations = 3
    for (let i = 0; i < numViolations; i++) {
      const vType = violationTypes[i % violationTypes.length]
      await prisma.financial_violations.create({
        data: {
          audit_id: audit.id,
          kind: vType.kind,
          type: vType.type,
          source: vType.source,
          amount: 500000,
          recovered: 100000,
          count: 1,
          responsible: "кап. Ответственный А."
        }
      })
    }
  }

  console.log('Seeding 20.04.26 completed!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const d = await prisma.ref_military_districts.findMany()
  console.log('DISTRICTS_LIST:')
  d.forEach(x => console.log(`${x.district_id}: ${x.code} - ${(x.name as any).ru}`))
}

main().finally(() => prisma.$disconnect())

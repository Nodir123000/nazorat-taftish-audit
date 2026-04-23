import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const unitsCount = await prisma.ref_units.count()
  const units = await prisma.ref_units.findMany({ take: 5 })
  
  console.log('--- DATABASE STATUS ---')
  console.log('Total Units in Prisma:', unitsCount)
  console.log('Sample Units:', JSON.stringify(units, null, 2))
  
  const regionsCount = await prisma.ref_regions.count()
  console.log('Total Regions:', regionsCount)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

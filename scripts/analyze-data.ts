import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const unitsCount = await prisma.ref_units.count()
  const unitsWithoutArea = await prisma.ref_units.count({
    where: { area_id: null }
  })

  const areasCount = await prisma.ref_areas.count()

  console.log(`Total units: ${unitsCount}`)
  console.log(`Units without area: ${unitsWithoutArea}`)
  console.log(`Total areas: ${areasCount}`)

  const someUnitsWithoutArea = await prisma.ref_units.findMany({
    where: { area_id: null },
    take: 10
  })

  const someAreas = await prisma.ref_areas.findMany({
    take: 10
  })

  console.log('\nSample Units without Area:')
  someUnitsWithoutArea.forEach(u => console.log(`- ${JSON.stringify(u.name)}`))

  console.log('\nSample Areas:')
  someAreas.forEach(a => console.log(`- ${JSON.stringify(a.name)}`))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

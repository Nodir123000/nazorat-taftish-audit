import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const districts = await prisma.ref_military_districts.findMany()
  console.log('MIL_DISTRICTS:', JSON.stringify(districts, null, 2))
  
  const regions = await prisma.ref_regions.findMany()
  console.log('REGIONS:', JSON.stringify(regions, null, 2))
  
  const tashkentCity = regions.find(r => (r.name as any)?.ru?.includes('Ташкент'))
  if (tashkentCity) {
    const tashkentAreas = await prisma.ref_areas.findMany({
      where: { region_id: tashkentCity.id }
    })
    console.log('TASHKENT_AREAS:', JSON.stringify(tashkentAreas, null, 2))
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

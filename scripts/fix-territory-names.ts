import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Fixing Territory (Area) names for multilingual support...')

  const areas = await prisma.ref_areas.findMany()

  let updatedCount = 0

  for (const area of areas) {
    const nameObj = area.name as any || {}
    
    let ru = nameObj.ru || ""
    let uz = nameObj.uz || ""
    let uzk = nameObj.uzk || ""

    // Logic: If UZ/UZK contains Russian "район", replace it with "tumani"/"тумани"
    // Also handle capitalization if needed
    
    const originalUz = uz;
    const originalUzk = uzk;

    // Replace " район" or " Район"
    uz = uz.replace(/\sрайон/gi, ' tumani')
    uzk = uzk.replace(/\sрайон/gi, ' тумани')

    if (uz !== originalUz || uzk !== originalUzk) {
      await prisma.ref_areas.update({
        where: { id: area.id },
        data: {
          name: {
            ru,
            uz,
            uzk
          }
        }
      })
      updatedCount++
    }
  }

  console.log(`✅ Success! Updated ${updatedCount} territory names.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

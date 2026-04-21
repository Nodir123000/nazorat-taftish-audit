import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Cleaning up Military Unit names (removing district info)...')

  const units = await prisma.ref_units.findMany()

  let updatedCount = 0

  for (const unit of units) {
    const nameObj = unit.name as any || {}
    let ru = nameObj.ru || ""
    let uz = nameObj.uz || ""
    let uzk = nameObj.uzk || ""

    // Logic: Remove anything in parentheses or from the first "("
    const cleanRu = ru.split('(')[0].trim()
    const cleanUz = uz.split('(')[0].trim()
    const cleanUzk = uzk.split('(')[0].trim()

    if (cleanRu !== ru || cleanUz !== uz || cleanUzk !== uzk) {
        await prisma.ref_units.update({
            where: { unit_id: unit.unit_id },
            data: {
              name: {
                ru: cleanRu,
                uz: cleanUz,
                uzk: cleanUzk
              }
            }
          })
          updatedCount++
    }
  }

  console.log(`✅ Success! Cleaned names for ${updatedCount} units.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

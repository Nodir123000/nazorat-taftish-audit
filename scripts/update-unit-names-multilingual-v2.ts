import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting Multilingual Unit Name update (V2)...')

  // 1. Fetch units with linked areas
  const units = await prisma.ref_units.findMany({
    include: {
      ref_areas: true
    },
    orderBy: { unit_id: 'asc' }
  })

  console.log(`✅ Found ${units.length} units to process.`)

  let updatedCount = 0

  for (const unit of units) {
    let nameRu = ''
    let nameUz = ''
    let nameUzk = ''

    const unitCode = unit.unit_code || '00000'

    if (unit.ref_areas) {
      const area = unit.ref_areas
      const areaName: any = area.name || {}
      
      if (unit.military_district_id === 4 && area.id === 977 && unit.unit_id > 193) {
        // Central Apparatus fallback
        nameRu = `В/Ч ${unitCode} (Центральный аппарат)`
        nameUz = `H/Q ${unitCode} (Markaziy apparat)`
        nameUzk = `Ҳ/Қ ${unitCode} (Марказий аппарат)`
      } else {
        // Standard Area mapping
        const areaRu = areaName.ru || 'Район'
        const areaUz = areaName.uz || 'tumani'
        const areaUzk = areaName.uzk || 'тумани'
        
        nameRu = `В/Ч ${unitCode} (${areaRu})`
        nameUz = `H/Q ${unitCode} (${areaUz})`
        nameUzk = `Ҳ/Қ ${unitCode} (${areaUzk})`
      }
    } else {
        // Fallback for units without mapped area
        nameRu = `В/Ч ${unitCode}`
        nameUz = `H/Q ${unitCode}`
        nameUzk = `Ҳ/Қ ${unitCode}`
    }

    const nameJson = {
      ru: nameRu,
      uz: nameUz,
      uzk: nameUzk
    }

    await prisma.ref_units.update({
      where: { unit_id: unit.unit_id },
      data: {
        name: nameJson
      }
    })

    updatedCount++
    if (updatedCount % 50 === 0) {
      console.log(`Updated ${updatedCount}/${units.length} unit names...`)
    }
  }

  console.log(`\n🎉 Multilingual update V2 complete! Updated ${updatedCount} units.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

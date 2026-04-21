import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting Military Units to Areas mapping (Fixed)...')

  const areas = await prisma.ref_areas.findMany({
    where: { status: 'active' },
    orderBy: { id: 'asc' }
  })
  
  const units = await prisma.ref_units.findMany({
    orderBy: { unit_id: 'asc' }
  })

  // ID 4: ЦВО (Central Military District)
  // ID 977: Мирабадский район (Tashkent)
  const CA_DISTRICT_ID = 4
  const CA_AREA_ID = 977

  for (let i = 0; i < units.length; i++) {
    const unit = units[i]
    let area_id;
    let military_district_id = unit.military_district_id; // Keep existing

    if (i < areas.length) {
      area_id = areas[i].id
      // No change to military_district_id here to avoid FK errors unless we are sure of the mapping.
      // The current existing ID (1-5) is valid.
    } else {
      area_id = CA_AREA_ID
      military_district_id = CA_DISTRICT_ID
    }

    try {
        await prisma.ref_units.update({
            where: { unit_id: unit.unit_id },
            data: {
              area_id: area_id,
              military_district_id: military_district_id
            }
          })
    } catch (e: any) {
        console.error(`❌ Error updating unit ${unit.unit_code}: ${e.message}`)
    }

    if ((i + 1) % 50 === 0) {
      console.log(`Processed ${i + 1}/${units.length} units...`)
    }
  }

  console.log(`\n🎉 Mapping Complete!`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

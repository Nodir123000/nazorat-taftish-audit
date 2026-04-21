import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const areas = await prisma.ref_areas.findMany({
    select: { id: true, name: true },
    orderBy: { id: 'asc' }
  })
  
  const units = await prisma.ref_units.findMany({
    select: { unit_id: true, unit_code: true, name: true, area_id: true },
    orderBy: { unit_id: 'asc' }
  })

  console.log(`Total Areas: ${areas.length}`)
  console.log(`Total Units: ${units.length}`)
  
  const unitsWithoutArea = units.filter(u => u.area_id === null)
  console.log(`Units without Area: ${unitsWithoutArea.length}`)

  // Check if we can map by index for the first 193
  const mappingSuggestions = []
  for (let i = 0; i < Math.min(areas.length, units.length); i++) {
    const area = areas[i]
    const unit = units[i]
    mappingSuggestions.push({
      unitId: unit.unit_id,
      unitCode: unit.unit_code,
      unitName: (unit.name as any)?.ru,
      areaId: area.id,
      areaName: (area.name as any)?.ru
    })
  }

  console.log('\nMapping Suggestion (First 5):')
  console.table(mappingSuggestions.slice(0, 5))

  // Find any other script that might have seeded units
  // Check if there are any specific files in Районы that look like unit lists
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

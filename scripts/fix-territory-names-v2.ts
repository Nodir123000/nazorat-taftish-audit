import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Basic Transliteration for common Uzbek district names (Latin -> Cyrillic/Russian)
const translitMap: Record<string, string> = {
    'Ulugnor': 'Улугнор',
    'Boston': 'Боз',
    'Baliqchi': 'Балыкчи',
    'Izboskan': 'Избоскан',
    'Paxtaobod': 'Пахтаабад',
    'Oltinko': 'Алтынкуль', // Oltinkol
    'Shahrixon': 'Шахрихан',
    'Asaka': 'Асака',
    'Marhamat': 'Мархамат',
    'Xodjaobod': 'Ходжаабад',
    'Buloqboshi': 'Булакбаши',
    'Qorgontepa': 'Кургантепа',
    'Jalaquduq': 'Джалакудук',
    'Andijon': 'Андижан',
    'Mirabad': 'Мирабад',
}

async function main() {
  console.log('🚀 Fixing Territory Names (V2: Transliteration & Labels)...')

  const areas = await prisma.ref_areas.findMany()
  let updatedCount = 0

  for (const area of areas) {
    const nameObj = area.name as any || {}
    let ru = nameObj.ru || ""
    let uz = nameObj.uz || ""
    let uzk = nameObj.uzk || ""

    // 1. Fix Russian (RU) logic
    // Current RU is Latin (e.g. "Ulugnor район"). Let's try to fix it.
    let baseName = ru.replace(/\sрайон/gi, '').trim()
    
    // Heuristic: If baseName is Latin, try to transliterate
    if (/^[A-Za-z\s]+$/.test(baseName) && translitMap[baseName]) {
        ru = `${translitMap[baseName]} район`
    } else {
        // Fallback: If it's Latin and not in map, just keep it but ensure label is Russian
        ru = `${baseName} район`
    }

    // 2. Fix Uzbek (UZ) - Latin label "tumani"
    let baseUz = uz.replace(/\sрайон/gi, '').replace(/\stumani/gi, '').trim()
    uz = `${baseUz} tumani`

    // 3. Fix Uzbek (UZK) - Cyrillic label "тумани" and transliteration
    let baseUzk = uzk.replace(/\sрайон/gi, '').replace(/\stumani/gi, '').replace(/\sтумани/gi, '').trim()
    if (/^[A-Za-z\s]+$/.test(baseUzk) && translitMap[baseUzk]) {
        uzk = `${translitMap[baseUzk]} тумани`
    } else {
        uzk = `${baseUzk} тумани`
    }

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

  console.log(`✅ Success! Updated ${updatedCount} territory names with labels and basic transliteration.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

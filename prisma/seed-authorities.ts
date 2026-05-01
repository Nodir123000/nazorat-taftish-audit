import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

interface AuthorityConfig {
  code: string
  name: {
    ru: string
    uz: string
    uzk: string
  }
  priority_level: number
}

// Uzbekistan government inspection authorities with hierarchy
const AUTHORITIES: AuthorityConfig[] = [
  {
    code: 'КРУ МО РУ',
    name: {
      ru: 'Главное управление контроля Министерства обороны',
      uz: 'Mudofiа Vazirligi nazoratining bosh idarasi',
      uzk: 'Мудофиа Вазирлиги назоратининг бош идарасы'
    },
    priority_level: 1 // Master level
  },
  {
    code: 'ГФЭУ МО РУ',
    name: {
      ru: 'Главное финансово-экономическое управление',
      uz: 'Bosh moliyaviy-iqtisodiy boshqarma',
      uzk: 'Бош молиявий-иқтисодий бошқарма'
    },
    priority_level: 1 // Master level
  },
  {
    code: 'CENTRAL_INSPECTION',
    name: {
      ru: 'Центральная служба внутреннего контроля',
      uz: 'Markaziy ichki nazorat xizmati',
      uzk: 'Марказий ички назорат хизмати'
    },
    priority_level: 2 // Central level
  },
  {
    code: 'REGIONAL_INSPECTION',
    name: {
      ru: 'Региональная служба контроля',
      uz: 'Mintaqaviy nazorat xizmati',
      uzk: 'Минтақавий назорат хизмати'
    },
    priority_level: 3 // Regional level
  },
  {
    code: 'MILITARY_COMMAND',
    name: {
      ru: 'Военное командование',
      uz: 'Harbiy qo\'mondon',
      uzk: 'Харбий қўмондон'
    },
    priority_level: 2 // Central level
  }
]

async function ensureAuthority(config: AuthorityConfig) {
  try {
    const existing = await prisma.ref_control_authorities.findUnique({
      where: { code: config.code }
    })

    if (!existing) {
      const created = await prisma.ref_control_authorities.create({
        data: {
          code: config.code,
          name: config.name,
          priority_level: config.priority_level
        }
      })
      console.log(`✓ Created authority: ${config.code} (priority ${config.priority_level})`)
      return created
    } else if (existing.priority_level !== config.priority_level) {
      const updated = await prisma.ref_control_authorities.update({
        where: { code: config.code },
        data: { priority_level: config.priority_level }
      })
      console.log(`⟳ Updated ${config.code}: priority ${existing.priority_level} → ${config.priority_level}`)
      return updated
    } else {
      console.log(`○ Skipped ${config.code}: already properly configured`)
      return existing
    }
  } catch (error) {
    console.error(`❌ Error processing authority ${config.code}:`, error)
    throw error
  }
}

async function validateAuthorities() {
  console.log('\n🔍 Validating authority hierarchy...')
  const authorities = await prisma.ref_control_authorities.findMany()

  let hasIssues = false
  const levelCounts: Record<number, number> = {}

  for (const auth of authorities) {
    if (auth.priority_level === null || auth.priority_level === undefined) {
      console.warn(`⚠ Authority ${auth.code} missing priority_level`)
      hasIssues = true
      continue
    }

    if (![1, 2, 3].includes(auth.priority_level)) {
      console.warn(`⚠ Authority ${auth.code} has invalid priority ${auth.priority_level}`)
      hasIssues = true
      continue
    }

    levelCounts[auth.priority_level] = (levelCounts[auth.priority_level] || 0) + 1
  }

  console.log('\nAuthority Priority Distribution:')
  console.log('─────────────────────────────')
  console.log(`Master (1):   ${levelCounts[1] || 0} authorities`)
  console.log(`Central (2):  ${levelCounts[2] || 0} authorities`)
  console.log(`Regional (3): ${levelCounts[3] || 0} authorities`)
  console.log('─────────────────────────────')

  // Warn if hierarchy is incomplete
  if (!levelCounts[1]) {
    console.warn('⚠ Warning: No Master (1) level authorities found')
    hasIssues = true
  }
  if (!levelCounts[2]) {
    console.warn('⚠ Warning: No Central (2) level authorities found')
    hasIssues = true
  }
  if (!levelCounts[3]) {
    console.warn('⚠ Warning: No Regional (3) level authorities found')
    hasIssues = true
  }

  if (!hasIssues) {
    console.log('✓ All authorities properly configured with valid priorities')
  }

  return !hasIssues
}

async function seed() {
  console.log('🌱 Starting control authority priority seeding...\n')

  try {
    for (const authConfig of AUTHORITIES) {
      await ensureAuthority(authConfig)
    }

    const isValid = await validateAuthorities()

    if (isValid) {
      console.log('\n✅ Seed completed successfully - all authorities properly configured')
    } else {
      console.log('\n⚠ Seed completed with warnings - review the issues above')
    }
  } catch (error) {
    console.error('\n❌ Seed failed:', error)
    throw error
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (e) => {
    console.error('Fatal error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function verifyAuthorities() {
  console.log('🔍 Verifying control authorities...\n')

  const authorities = await prisma.ref_control_authorities.findMany({
    orderBy: { priority_level: 'asc' }
  })

  if (authorities.length === 0) {
    console.log('⚠ No authorities found in database')
    await prisma.$disconnect()
    return
  }

  console.log('Authority Priority Levels:')
  console.log('─────────────────────────────────────────────────')

  const levelNames: Record<number, string> = {
    1: 'Master',
    2: 'Central',
    3: 'Regional'
  }

  for (const auth of authorities) {
    const levelName = levelNames[auth.priority_level] || 'Unknown'
    const ruName = typeof auth.name === 'object' && auth.name !== null && 'ru' in auth.name
      ? auth.name.ru
      : auth.code

    console.log(`${auth.code.padEnd(25)} │ Priority: ${auth.priority_level} (${levelName})`)
    console.log(`  └─ Name: ${ruName}`)
  }

  console.log('─────────────────────────────────────────────────')
  console.log(`Total: ${authorities.length} authorities\n`)

  // Verify hierarchy is valid
  const levels = new Set(authorities.map(a => a.priority_level))
  let hierarchyValid = true

  if (!levels.has(1)) {
    console.warn('⚠ No Master (1) authority found')
    hierarchyValid = false
  }
  if (!levels.has(2)) {
    console.warn('⚠ No Central (2) authority found')
    hierarchyValid = false
  }
  if (!levels.has(3)) {
    console.warn('⚠ No Regional (3) authority found')
    hierarchyValid = false
  }

  if (hierarchyValid) {
    console.log('✓ Authority hierarchy is complete and valid')
  }

  await prisma.$disconnect()
}

verifyAuthorities().catch(error => {
  console.error('Error:', error)
  process.exit(1)
})

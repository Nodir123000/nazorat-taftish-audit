import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- USERS ---')
  const users = await prisma.users.findMany({ take: 10 })
  console.log(JSON.stringify(users, null, 2))

  console.log('--- PERSONNEL ---')
  const personnel = await prisma.personnel.findMany({ 
    take: 10,
    include: { ref_physical_persons: true }
  })
  console.log(JSON.stringify(personnel, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

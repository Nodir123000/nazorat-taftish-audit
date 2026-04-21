import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Checking ref_classifiers for Commission Roles...")
  
  // 1. Find the classifier entries by name to be sure
  const classifiers = await prisma.ref_classifiers.findMany({
    where: {
      name: {
        path: ['ru'],
        equals: 'Председатель комиссии'
      }
    }
  })
  
  console.log(`Found ${classifiers.length} classifier entries for 'Председатель комиссии'`)
  if (classifiers.length > 0) {
    console.log("Classifier Type discovered:", classifiers[0].type)
  }

  // 2. Update ref_classifiers
  const updateClassifiers = await prisma.ref_classifiers.updateMany({
    where: {
      name: {
        path: ['ru'],
        equals: 'Председатель комиссии'
      }
    },
    data: {
      name: {
        ru: "Главный ревизор",
        uz: "Bosh taftishchi",
        uzk: "Бош тафтишчи"
      }
    }
  })
  console.log(`Updated ${updateClassifiers.count} rows in ref_classifiers (Chairman)`)

  const updateClassifiersMember = await prisma.ref_classifiers.updateMany({
    where: {
      name: {
        path: ['ru'],
        equals: 'Член комиссии'
      }
    },
    data: {
      name: {
        ru: "Ревизор",
        uz: "Taftishchi",
        uzk: "Тафтишчи"
      }
    }
  })
  console.log(`Updated ${updateClassifiersMember.count} rows in ref_classifiers (Member)`)

  // 3. Update commission_members table
  const updateMembers = await prisma.commission_members.updateMany({
    where: { role: "Председатель комиссии" },
    data: { role: "Главный ревизор" }
  })
  console.log(`Updated ${updateMembers.count} rows in commission_members (Chairman)`)

  const updateMembersRegular = await prisma.commission_members.updateMany({
    where: { role: "Член комиссии" },
    data: { role: "Ревизор" }
  })
  console.log(`Updated ${updateMembersRegular.count} rows in commission_members (Member)`)

  console.log("Done database migration.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

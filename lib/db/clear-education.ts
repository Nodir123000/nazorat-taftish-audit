
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearEducation() {
    console.log("🧹 Clearing RefEducationLevel...")
    await prisma.refEducationLevel.deleteMany({})
    console.log("✅ Cleared")
}

clearEducation()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

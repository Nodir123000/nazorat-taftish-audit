import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as bcrypt from 'bcryptjs'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function seed() {
    console.log("🌱 Начинаем заполнение базы данных (Prisma)...")

    const passwordHash = await bcrypt.hash("admin", 10)

    try {
        const admin = await (prisma as any).users.upsert({
            where: { username: "admin" },
            update: {},
            create: {
                username: "admin",
                password_hash: passwordHash,
                fullname: "Администратор Системы",
                rank: "Полковник",
                position: "Начальник КРУ",
                role: "admin",
                email: "admin@krr.mil",
            },
        })
        console.log(`✅ Администратор (${admin.username}) создан/проверен успешно!`)
    } catch (error) {
        console.error("❌ Ошибка при создании админа:", error)
    }

    try {
        console.log("🔄 Запуск посева классификаторов...")
        require('child_process').execSync('npx tsx lib/db/seed-classifiers.ts', { stdio: 'inherit' })

        console.log("🔄 Запуск посева физических лиц...")
        require('child_process').execSync('npx tsx scripts/seed-people.ts', { stdio: 'inherit' })

        // Add other seeds here if necessary
        // require('child_process').execSync('npx tsx scripts/seed-units.ts', { stdio: 'inherit' })

    } catch (error) {
        console.error("❌ Ошибка при запуске дочерних сидов:", error)
    } finally {
        await prisma.$disconnect()
    }
}

seed().catch((err) => {
    console.error(err)
    process.exit(1)
})

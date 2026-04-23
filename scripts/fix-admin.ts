import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as bcrypt from 'bcryptjs'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    try {
        console.log("Checking admin user...");
        const hash = await bcrypt.hash('admin', 10);
        
        // Find existing users to see if they exist
        const allUsers = await (prisma as any).users.findMany({ select: { username: true } });
        console.log("All usernames in DB:", allUsers.map((u: any) => u.username));

        const admin = await (prisma as any).users.upsert({
            where: { username: 'admin' },
            update: { password_hash: hash, is_active: true },
            create: {
                username: 'admin',
                password_hash: hash,
                fullname: 'Админ',
                role: 'admin',
                is_active: true
            }
        });
        console.log('Admin user successfully verified/created:', admin.username);
    } catch(e) {
        console.error("Error setting up admin:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();

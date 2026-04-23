import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    try {
        const units = await (prisma as any).ref_units.findMany({ take: 5, select: { unit_code: true, unit_id: true } });
        console.log('Available units:', units);
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();

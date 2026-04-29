import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: any }

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    
    const client = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

    return client.$extends({
        client: {
            async $withRLS<T>(
                ctx: { user_id: number; unit_id: number },
                fn: (tx: any) => Promise<T>
            ): Promise<T> {
                const userId = Math.trunc(ctx.user_id)
                const unitId = Math.trunc(ctx.unit_id)
                if (!Number.isFinite(userId) || !Number.isFinite(unitId)) {
                    throw new Error("[RLS] invalid user_id or unit_id")
                }
                return (this as any).$transaction(async (tx: any) => {
                    await tx.$executeRaw`SET LOCAL app.current_user_id = ${String(userId)}`;
                    await tx.$executeRaw`SET LOCAL app.current_unit_id = ${String(unitId)}`;
                    return fn(tx);
                });
            }
        }
    })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: any }

/**
 * Расширение Prisma для поддержки Row-Level Security (RLS) в PostgreSQL.
 * Гарантирует выполнение SET LOCAL внутри транзакции.
 */
export const prisma = (globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})).$extends({
    client: {
        async $withRLS<T>(
            ctx: { user_id: number; unit_id: number }, 
            fn: (tx: any) => Promise<T>
        ): Promise<T> {
            // Используем транзакцию для гарантии того, что SET LOCAL и основной запрос 
            // пройдут через одно и то же соединение в пуле.
            return (this as any).$transaction(async (tx: any) => {
                await tx.$executeRawUnsafe(`SET LOCAL app.current_user_id = '${ctx.user_id}'`);
                await tx.$executeRawUnsafe(`SET LOCAL app.current_unit_id = '${ctx.unit_id}'`);
                return fn(tx);
            });
        }
    }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

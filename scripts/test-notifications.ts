import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { notificationService } from '../lib/services/notification-service'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    try {
        console.log("Testing notification service...");
        const user = await prisma.users.findFirst();
        if (!user) {
            console.error("No user found to test notifications.");
            return;
        }

        console.log(`Creating notification for user: ${user.username}`);
        const notification = await (prisma as any).notifications.create({
            data: {
                user_id: user.user_id,
                title: "Тестовое уведомление",
                message: "Это проверка работы системы уведомлений после исправления схемы.",
                type: "success",
                category: "system"
            }
        });
        console.log("Notification created successfully:", notification.id);

        const count = await (prisma as any).notifications.count({
            where: { user_id: user.user_id }
        });
        console.log(`Total notifications for user: ${count}`);

    } catch (e) {
        console.error("Error testing notifications:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

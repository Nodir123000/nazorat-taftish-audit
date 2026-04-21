const { PrismaClient } = require('@prisma/client');

/**
 * Скрипт проверки дедлайнов (Пример для Agent Skills Level 3)
 * Использование: node check-overdue-decisions.js --markAsOverdue=true
 */

const prisma = new PrismaClient();

async function checkDeadlines() {
    const args = process.argv.slice(2);
    const markAsOverdue = args.includes('--markAsOverdue=true');

    try {
        console.log('Поиск просроченных решений по нарушениям...');
        
        const today = new Date();
        
        const overdueDecisions = await prisma.decisions.findMany({
            where: {
                deadline: { lt: today },
                status: { notIn: ['completed', 'cancelled', 'overdue'] }
            },
            include: {
                violations: true
            }
        });

        console.log(`Найдено просроченных записей: ${overdueDecisions.length}`);

        if (overdueDecisions.length > 0 && markAsOverdue) {
            console.log('Обновление статусов на "overdue"...');
            
            const ids = overdueDecisions.map(d => d.id);
            
            const updateResult = await prisma.decisions.updateMany({
                where: { id: { in: ids } },
                data: { status: 'overdue' }
            });

            console.log(`Успешно обновлено: ${updateResult.count} записей`);
            
            // Здесь могла быть логика отправки внутренних уведомлений
            // await createInternalNotifications(overdueDecisions);
        }

        console.log('---SUCCESS---');

    } catch (error) {
        console.error('Ошибка мониторинга дедлайнов:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

checkDeadlines();

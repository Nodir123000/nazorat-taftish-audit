import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Выполнение миграции: добавление справочников типов и статусов...\n')

    const filePathArg = process.argv[2];
    const sqlPath = filePathArg ? join(process.cwd(), filePathArg) : join(__dirname, '../prisma/migrations/add_territory_types_and_statuses.sql');

    console.log(`Executing migration from: ${sqlPath}`);
    const sql = readFileSync(sqlPath, 'utf-8')

    // Разбиваем SQL на отдельные команды. Но для DO $$ нужно осторожнее.
    // Если файл содержит DO $$, разбиение по ; сломает его тело.
    // Лучше выполнять целиком если это один блок, или использовать более умный парсер.
    // Пока оставим как есть, но для DO $$ ... END $$; нужно чтобы парсер не ломал его.
    // Простой сплит по ; может быть опасен. 
    // Для нашего случая с DO $$ ... END $$; точки с запятой внутри блока могут все испортить.
    // Но в моем DO блоке точки с запятой есть.

    // Давайте лучше не сплитить, если файл содержит DO $$.

    if (sql.includes('DO $$')) {
        try {
            await prisma.$executeRawUnsafe(sql);
            console.log(`✅ Выполнен блок SQL DO $$`);
        } catch (e: any) {
            console.error(`❌ Ошибка:`, e.message);
        }
        console.log('\n✨ Миграция завершена!');
        return;
    }

    // Разбиваем SQL на отдельные команды (старая логика)
    const commands = sql
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.startsWith('COMMENT'))

    for (const command of commands) {
        try {
            await prisma.$executeRawUnsafe(command)
            console.log(`✅ Выполнено: ${command.substring(0, 50)}...`)
        } catch (error: any) {
            if (error.code === '42P07') {
                console.log(`⚠️  Таблица уже существует, пропускаем...`)
            } else if (error.code === '23505') {
                console.log(`⚠️  Запись уже существует, пропускаем...`)
            } else {
                console.error(`❌ Ошибка:`, error.message)
            }
        }
    }

    console.log('\n✨ Миграция завершена!')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())

const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://postgres:Muslima-3001%23%23@localhost:5432/nazorat_taftish"
});

async function main() {
    await client.connect();

    // Получаем список всех таблиц в схеме public
    const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);

    console.log(`📊 Проверка всех таблиц (всего: ${tablesRes.rows.length})`);
    console.log('--------------------------------------------------');
    console.log(`${'Таблица'.padEnd(35)} | ${'Записей'}`);
    console.log('--------------------------------------------------');

    for (const row of tablesRes.rows) {
        const tableName = row.table_name;
        try {
            // Считаем количество строк во вложенном запросе с кавычками для имен таблиц
            const countRes = await client.query(`SELECT count(*) FROM "${tableName}"`);
            const count = countRes.rows[0].count;

            let status = '';
            if (count === '0') {
                status = ' ⚠️ ПУСТО';
            }

            console.log(`${tableName.padEnd(35)} | ${count}${status}`);
        } catch (err) {
            console.log(`${tableName.padEnd(35)} | ❌ Ошибка: ${err.message}`);
        }
    }

    console.log('--------------------------------------------------');
    await client.end();
}

main().catch(err => console.error(err));

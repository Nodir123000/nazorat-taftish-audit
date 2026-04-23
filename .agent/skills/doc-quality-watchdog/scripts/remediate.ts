import fs from 'fs';
import path from 'path';

/**
 * АИС КРУ — Автоматический исправитель технической документации
 * Соответствие O‘z DSt 1987:2018 и Markdown Standards
 */

const DOCS_DIR = path.join(process.cwd(), 'docs', 'ТЗ');

function fixMarkdownFile(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    console.log(`\n🔍 Анализ: ${fileName}...`);
    let initialContent = content;

    // 1. Исправление MD041: Первая строка должна быть H1
    if (!content.trim().startsWith('# ')) {
        const h1Match = content.match(/^# .+/m);
        if (h1Match) {
            console.log(`   [FIX] Перенос H1 в начало файла`);
            content = h1Match[0] + '\n\n' + content.replace(h1Match[0], '').trim();
        }
    }

    // 2. Исправление MD025: Устранение дубликатов H1 (кроме самого первого)
    let h1Count = 0;
    content = content.replace(/^# .+/gm, (match) => {
        h1Count++;
        if (h1Count > 1) {
            console.log(`   [FIX] Понижение лишнего H1 до H2`);
            return '##' + match.substring(1);
        }
        return match;
    });

    // 3. Исправление MD022: Пустые строки вокруг заголовков
    content = content.replace(/^([#]+ .+)$/gm, '\n$1\n');
    content = content.replace(/\n\n\n+/g, '\n\n'); // Убираем лишние пустые строки

    // 4. Исправление MD060: Форматирование таблиц (пробелы у pipe)
    content = content.replace(/^\|([-:|]+)\|$/gm, (match) => {
        // Убеждаемся, что разделители имеют вид | :--- | :--- |
        let fixed = match.split('|').map(cell => {
            if (cell === '') return '';
            let c = cell.trim();
            if (!c.startsWith('-') && !c.startsWith(':')) return cell; // Не разделитель
            if (c.includes(':')) {
                // Если есть выравнивание, сохраняем его
                if (c.startsWith(':') && c.endsWith(':')) return ' :---: ';
                if (c.startsWith(':')) return ' :--- ';
                if (c.endsWith(':')) return ' ---: ';
            }
            return ' --- ';
        }).join('|');
        return fixed;
    });

    // 5. Исправление MD040: Добавление языка в блоки кода
    content = content.replace(/^```(\s*)$/gm, '```text$1');

    // 6. Очистка двойных пустых строк в начале
    content = content.trim() + '\n';

    if (content !== initialContent) {
        fs.writeFileSync(filePath, content);
        console.log(`   ✅ Файл исправлен и сохранен.`);
    } else {
        console.log(`   ✨ Проблем не обнаружено.`);
    }
}

function processDirectory(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.md')) {
            fixMarkdownFile(fullPath);
        }
    }
}

console.log('🚀 Запуск Doc-Quality-Watchdog Remediator...');
processDirectory(DOCS_DIR);
console.log('\n🎯 Ремедиация завершена.');

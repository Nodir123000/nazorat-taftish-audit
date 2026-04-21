
const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'd:/kru-version-2/Дебиторка.xlsx';
const outputPath = 'd:/kru-version-2/components/receivables/data.json';

try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets['Данные'];

    // Read as array of arrays to avoid key encoding issues from the library's auto-header detection
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // We know from inspection that Row 3 (index 3) is the header.
    // Row 3: ["Месяц","Год","Менеджер","Покупатель","Город","Продажи","Всего","без просрочки","до 30 дней","31-60 дней","61-90 дней","от 91 дня"]
    const HEADER_ROW_INDEX = 3;
    const headers = rows[HEADER_ROW_INDEX];

    console.log("Detected Headers:", headers);

    const cleanData = [];

    // Iterate rows after header
    for (let i = HEADER_ROW_INDEX + 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        // Map by index to ensure stable specific keys
        // We map manually to avoid reliance on the file's header string encoding if it's acting up
        const record = {
            "Месяц": row[0],
            "Год": row[1],
            "Менеджер": row[2],
            "Покупатель": row[3],
            "Город": row[4],
            "Продажи": row[5] || 0,
            "Всего": row[6] || 0,
            "без просрочки": row[7] || 0,
            "до 30 дней": row[8] || 0,
            "31-60 дней": row[9] || 0,
            "61-90 дней": row[10] || 0,
            "от 91 дня": row[11] || 0
        };

        // Filter out empty rows (where Manager is undefined)
        if (record["Менеджер"]) {
            cleanData.push(record);
        }
    }

    fs.writeFileSync(outputPath, JSON.stringify(cleanData, null, 2));
    console.log(`Fixed data written to ${outputPath}, records: ${cleanData.length}`);

    // Preview one record
    console.log("Sample Record:", JSON.stringify(cleanData[0], null, 2));

} catch (e) {
    console.error(e);
}


const XLSX = require('xlsx');
const path = require('path');

const filePath = 'd:/kru-version-2/Дебиторка.xlsx';

try {
    const workbook = XLSX.readFile(filePath);

    if (workbook.SheetNames.includes('Данные')) {
        const sheet = workbook.Sheets['Данные'];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        console.log("\n--- First 10 rows of 'Данные' ---");
        data.slice(0, 10).forEach((row, i) => {
            console.log(`Row ${i}:`, JSON.stringify(row));
        });
    } else {
        console.log("'Данные' sheet not found.");
    }

} catch (e) {
    console.error(`Error reading file: ${e.message}`);
}


const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'Форма 171.xlsx');

try {
    const workbook = XLSX.readFile(filePath);
    console.log("Sheet names:", workbook.SheetNames);

    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log(`\n--- First 20 rows of '${sheetName}' ---`);
        data.slice(0, 20).forEach((row, i) => {
            console.log(`Row ${i}:`, JSON.stringify(row));
        });
    });

} catch (e) {
    console.error(`Error reading file: ${e.message}`);
}

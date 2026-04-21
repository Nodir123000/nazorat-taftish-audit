
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = 'd:/kru-version-2/Дебиторка.xlsx';
const outputPath = 'd:/kru-version-2/components/receivables/data.json';

try {
    const workbook = XLSX.readFile(filePath);
    if (workbook.SheetNames.includes('Данные')) {
        const sheet = workbook.Sheets['Данные'];
        const data = XLSX.utils.sheet_to_json(sheet, { range: 3 }); // Headers start at row 3 (0-indexed is 3)
        // Wait, inspected data showed Headers at Row 3 (index 3). 
        // Let's verify inspection output:
        // Row 3: ["Месяц","Год",...] -> This is index 3.
        
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
        console.log(`Data written to ${outputPath}, records: ${data.length}`);
    }
} catch (e) {
    console.error(e);
}

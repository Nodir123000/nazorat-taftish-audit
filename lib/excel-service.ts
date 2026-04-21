import path from 'path';
import fs from 'fs';
import * as xlsx from 'xlsx';

const EXCEL_FILE_PATH = path.join(process.cwd(), 'Дебиторка.xlsx');

export interface KPIData {
    sales: number;
    totalDebt: number;
    debtToSalesRatio: number;
    overdueDebt: number;
    noOverdueDebt: number;
    aging: {
        noOverdue: number;
        days1to30: number; // до 30 дней
        days31to60: number; // 31-60 дней
        days61to90: number; // 61-90 дней
        days91plus: number; // от 91 дня
    };
}

export interface DebtorRecord {
    name: string;
    manager: string;
    totalDebt: number;
    overdueDebt: number;
}

export interface TransactionRecord {
    month: string;
    year: number;
    manager: string;
    buyer: string;
    city: string;
    sales: number;
    totalDebt: number;
    noOverdue: number;
    days1to30: number;
    days31to60: number;
    days61to90: number;
    days91plus: number;
}

export async function getReceivablesReportData() {
    let workbook: xlsx.WorkBook;
    try {
        // Read file into buffer first to avoid path encoding issues
        const fileBuffer = fs.readFileSync(EXCEL_FILE_PATH);
        workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    } catch (error) {
        console.error("Error reading Excel file:", error);
        throw new Error(`Failed to read Excel file at ${EXCEL_FILE_PATH}: ${error}`);
    }

    // 1. Parse 'Вспом' sheet for KPIs
    const sheetAux = workbook.Sheets['Вспом'];

    // Helper to safely get number from a specific sheet
    const getNum = (sheet: xlsx.WorkSheet, cell: string) => {
        if (!sheet) return 0;
        const v = sheet[cell]?.v;
        return typeof v === 'number' ? v : 0;
    };

    const kpiData: KPIData = {
        sales: getNum(sheetAux, 'F5'),
        totalDebt: getNum(sheetAux, 'F6'),
        debtToSalesRatio: getNum(sheetAux, 'F19'),
        noOverdueDebt: getNum(sheetAux, 'J5'),
        overdueDebt: 0,
        aging: {
            noOverdue: getNum(sheetAux, 'J5'),
            days1to30: getNum(sheetAux, 'J6'),
            days31to60: getNum(sheetAux, 'J7'),
            days61to90: getNum(sheetAux, 'J8'),
            days91plus: getNum(sheetAux, 'J9'),
        }
    };

    kpiData.overdueDebt = kpiData.totalDebt - kpiData.noOverdueDebt;

    // 2. Parse 'ВспомТаб' for Top 10 Debtors
    const sheetTop = workbook.Sheets['ВспомТаб'];
    const topDebtors: DebtorRecord[] = [];

    if (sheetTop) {
        for (let r = 5; r <= 14; r++) {
            const name = sheetTop[`B${r}`]?.v;
            if (!name) continue;

            topDebtors.push({
                name: String(name),
                manager: String(sheetTop[`C${r}`]?.v || ''),
                totalDebt: getNum(sheetTop, `D${r}`),
                overdueDebt: getNum(sheetTop, `E${r}`),
            });
        }
    }

    // 3. Parse 'Данные' for detailed transactions
    const sheetData = workbook.Sheets['Данные'];
    const transactions: TransactionRecord[] = [];

    if (sheetData) {
        // Analysis says Row 5 is header, Row 6 is data start. Range ends at approx row 491
        const range = xlsx.utils.decode_range(sheetData['!ref'] || 'A1:M1000');

        // Safety limit to avoid infinite loops if something is wrong
        const endRow = Math.min(range.e.r, 5000);

        for (let r = 5; r <= endRow; r++) {
            const buyer = sheetData[`E${r + 1}`]?.v; // E column
            if (!buyer) continue; // Skip empty rows

            transactions.push({
                month: String(sheetData[`B${r + 1}`]?.v || ''),
                year: Number(sheetData[`C${r + 1}`]?.v || 0),
                manager: String(sheetData[`D${r + 1}`]?.v || ''),
                buyer: String(buyer),
                city: String(sheetData[`F${r + 1}`]?.v || ''),
                sales: getNum(sheetData, `G${r + 1}`),
                totalDebt: getNum(sheetData, `H${r + 1}`),
                noOverdue: getNum(sheetData, `I${r + 1}`),
                days1to30: getNum(sheetData, `J${r + 1}`),
                days31to60: getNum(sheetData, `K${r + 1}`),
                days61to90: getNum(sheetData, `L${r + 1}`),
                days91plus: getNum(sheetData, `M${r + 1}`),
            });
        }
    }

    return { kpiData, topDebtors, transactions };
}

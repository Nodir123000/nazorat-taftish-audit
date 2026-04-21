#!/usr/bin/env node
/**
 * АИС КРР — Summary Dashboard Report
 * Generates monthly/quarterly summary Excel dashboard.
 * Run: node .agent/skills/automated-reporting/scripts/summary-dashboard.js
 */

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const COLORS = { header: '1E3A5F', headerText: 'FFFFFF', CRITICAL: 'FF4444', HIGH: 'FF8C00', MEDIUM: 'FFD700', LOW: '4169E1' };

async function generateSummaryDashboard(options = {}) {
  const { year = new Date().getFullYear(), quarter = null, outputDir = 'public/reports' } = options;
  const period = quarter ? `Q${quarter} ${year}` : `${year}`;

  console.log(`\n📈 Генерация сводного дашборда за ${period}...`);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'АИС КРР';

  // Sheet 1: Overview
  const sheet = workbook.addWorksheet('Сводный отчёт');
  sheet.columns = [
    { key: 'label', width: 40 },
    { key: 'q1', width: 14, header: 'I квартал' },
    { key: 'q2', width: 14, header: 'II квартал' },
    { key: 'q3', width: 14, header: 'III квартал' },
    { key: 'q4', width: 14, header: 'IV квартал' },
    { key: 'total', width: 14, header: 'Итого' },
  ];

  // Title
  sheet.spliceRows(1, 0, []);
  sheet.mergeCells('A1:F1');
  const titleCell = sheet.getRow(1).getCell(1);
  titleCell.value = `СВОДНЫЙ ОТЧЁТ КРУ МО РУз — ${year}`;
  titleCell.font = { name: 'Times New Roman', size: 14, bold: true, color: { argb: COLORS.header } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 30;

  sheet.spliceRows(2, 0, []);

  // Section: Audits
  const addSection = (title, rowNum) => {
    const row = sheet.getRow(rowNum);
    sheet.mergeCells(`A${rowNum}:F${rowNum}`);
    row.getCell(1).value = title;
    row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.header } };
    row.getCell(1).font = { name: 'Times New Roman', size: 11, bold: true, color: { argb: 'FFFFFF' } };
    row.height = 24;
  };

  const addDataRow = (sheet, rowNum, label, values, isBold = false) => {
    const row = sheet.getRow(rowNum);
    row.getCell(1).value = label;
    values.forEach((v, i) => row.getCell(i + 2).value = v);
    row.eachCell(cell => {
      cell.font = { name: 'Times New Roman', size: 10, bold: isBold };
      cell.border = { top: { style: 'hair' }, bottom: { style: 'hair' }, left: { style: 'hair' }, right: { style: 'hair' } };
      cell.alignment = { vertical: 'middle' };
    });
    row.height = 20;
  };

  // TODO: Replace with actual Prisma aggregation queries
  addSection('I. РЕВИЗИИ', 3);
  addDataRow(sheet, 4, 'Запланировано ревизий', [8, 8, 8, 6, 30]);
  addDataRow(sheet, 5, 'Проведено ревизий', [7, 8, 6, 3, 24]);
  addDataRow(sheet, 6, 'Выполнение плана (%)', ['88%', '100%', '75%', '50%', '80%']);

  addSection('II. НАРУШЕНИЯ', 8);
  addDataRow(sheet, 9, 'Всего нарушений выявлено', [23, 28, 21, 15, 87]);
  addDataRow(sheet, 10, '— Критические (CRITICAL)', [2, 3, 1, 1, 7]);
  addDataRow(sheet, 11, '— Высокие (HIGH)', [8, 10, 7, 5, 30]);
  addDataRow(sheet, 12, '— Средние (MEDIUM)', [9, 11, 9, 6, 35]);
  addDataRow(sheet, 13, '— Низкие (LOW)', [4, 4, 4, 3, 15]);
  addDataRow(sheet, 14, 'Сумма нарушений (млн сум)', [120.5, 145.0, 110.0, 75.0, 450.5], true);
  addDataRow(sheet, 15, 'Уголовные дела', [1, 1, 1, 0, 3]);

  addSection('III. РЕШЕНИЯ', 17);
  addDataRow(sheet, 18, 'Всего решений создано', [23, 28, 21, 15, 87]);
  addDataRow(sheet, 19, 'Выполнено в срок', [18, 22, 17, 11, 68]);
  addDataRow(sheet, 20, 'Просрочено', [5, 6, 4, 4, 19], true);
  addDataRow(sheet, 21, 'Выполнение в срок (%)', ['78%', '79%', '81%', '73%', '78%']);

  const filename = `summary-dashboard-${year}-${Date.now()}.xlsx`;
  const outputPath = path.join(outputDir, filename);
  await workbook.xlsx.writeFile(outputPath);
  console.log(`✅ Сводный дашборд сохранён: ${outputPath}`);
  return outputPath;
}

generateSummaryDashboard().catch(console.error);

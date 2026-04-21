#!/usr/bin/env node
/**
 * АИС КРР — KPI Report
 * Generates KPI metrics Excel report for inspection department.
 * Run: node .agent/skills/automated-reporting/scripts/kpi-report.js
 */

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const COLORS = { header: '1E3A5F', headerText: 'FFFFFF', green: '28A745', red: 'DC3545', yellow: 'FFC107', blue: '007BFF' };

async function generateKpiReport(options = {}) {
  const { year = new Date().getFullYear(), outputDir = 'public/reports' } = options;

  console.log(`\n📊 Генерация KPI отчёта за ${year}...`);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'АИС КРР';

  // Sheet 1: Summary KPIs
  const summarySheet = workbook.addWorksheet('Сводные КПЭ');
  summarySheet.columns = [
    { header: 'Показатель', key: 'metric', width: 45 },
    { header: 'Значение', key: 'value', width: 15 },
    { header: 'Цель', key: 'target', width: 15 },
    { header: 'Выполнение', key: 'completion', width: 15 },
    { header: 'Статус', key: 'status', width: 12 },
  ];

  // Title
  summarySheet.spliceRows(1, 0, []);
  summarySheet.mergeCells('A1:E1');
  const titleCell = summarySheet.getRow(1).getCell(1);
  titleCell.value = `КПЭ КОНТРОЛЬНО-РЕВИЗИОННОГО УПРАВЛЕНИЯ МО РУз — ${year}`;
  titleCell.font = { name: 'Times New Roman', size: 13, bold: true, color: { argb: COLORS.header } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  summarySheet.getRow(1).height = 28;

  summarySheet.spliceRows(2, 0, []);

  // Header row
  const hRow = summarySheet.getRow(3);
  hRow.height = 30;
  ['Показатель', 'Значение', 'Цель', 'Выполнение %', 'Статус'].forEach((h, i) => {
    const cell = hRow.getCell(i + 1);
    cell.value = h;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.header } };
    cell.font = { name: 'Times New Roman', size: 10, bold: true, color: { argb: 'FFFFFF' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // TODO: Replace with actual Prisma queries
  const kpis = [
    { metric: 'Количество завершённых ревизий', value: 24, target: 30, status: 'yellow' },
    { metric: 'Количество выявленных нарушений', value: 87, target: null, status: 'blue' },
    { metric: 'Сумма нарушений (млн сум)', value: 450.5, target: null, status: 'blue' },
    { metric: 'Процент решений выполнено в срок', value: 78, target: 90, status: 'yellow' },
    { metric: 'Количество просроченных решений', value: 12, target: 0, status: 'red' },
    { metric: 'Среднее время выполнения решения (дней)', value: 22, target: 20, status: 'yellow' },
    { metric: 'Уголовные дела (хищение/коррупция)', value: 3, target: null, status: 'blue' },
    { metric: 'Охват воинских частей (%)', value: 65, target: 80, status: 'yellow' },
  ];

  kpis.forEach((kpi, idx) => {
    const row = summarySheet.getRow(idx + 4);
    const completion = kpi.target ? Math.round((kpi.value / kpi.target) * 100) : null;
    row.getCell(1).value = kpi.metric;
    row.getCell(2).value = kpi.value;
    row.getCell(3).value = kpi.target ?? '—';
    row.getCell(4).value = completion ? `${completion}%` : '—';

    const statusCell = row.getCell(5);
    if (kpi.status === 'green') { statusCell.value = '✅'; statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C6EFCE' } }; }
    else if (kpi.status === 'yellow') { statusCell.value = '⚠️'; statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEB9C' } }; }
    else if (kpi.status === 'red') { statusCell.value = '❌'; statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC7CE' } }; }
    else { statusCell.value = 'ℹ️'; statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DEEBF7' } }; }

    row.eachCell(cell => {
      cell.font = { name: 'Times New Roman', size: 10 };
      cell.border = { top: { style: 'hair' }, bottom: { style: 'hair' }, left: { style: 'hair' }, right: { style: 'hair' } };
      cell.alignment = { vertical: 'middle' };
    });
    row.height = 22;
  });

  const filename = `kpi-report-${year}-${Date.now()}.xlsx`;
  const outputPath = path.join(outputDir, filename);
  await workbook.xlsx.writeFile(outputPath);
  console.log(`✅ KPI отчёт сохранён: ${outputPath}`);
  return outputPath;
}

generateKpiReport().catch(console.error);

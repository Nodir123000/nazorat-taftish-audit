#!/usr/bin/env node
/**
 * АИС КРР — Violations Registry Report
 * Generates Excel registry of all violations for a given period.
 * Run: node .agent/skills/automated-reporting/scripts/violations-registry.js
 *
 * Requires: npm install exceljs @prisma/client
 */

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

// Color palette
const COLORS = {
  header: '1E3A5F',     // Dark navy
  headerText: 'FFFFFF',
  CRITICAL: 'FF4444',
  HIGH: 'FF8C00',
  MEDIUM: 'FFD700',
  LOW: '4169E1',
  altRow: 'F0F4F8',
  white: 'FFFFFF',
};

const SEVERITY_LABELS = {
  ru: { CRITICAL: 'Критический', HIGH: 'Высокий', MEDIUM: 'Средний', LOW: 'Низкий' },
};

const VIOLATION_TYPE_LABELS = {
  ru: {
    illegal_expense: 'Незаконные расходы',
    overpayment: 'Переплата',
    cash_shortage: 'Недостача ден. средств',
    embezzlement: 'Хищение',
    misuse_of_funds: 'Нецелевое использование',
    property_shortage: 'Недостача имущества',
    property_surplus: 'Излишки имущества',
    improper_storage: 'Нарушение хранения',
    unlawful_writeoff: 'Незаконное списание',
    accounting_violation: 'Нарушение учёта',
    procurement_violation: 'Нарушение закупок',
    labor_violation: 'Нарушение трудового зак-ва',
    staffing_violation: 'Нарушение штатного расп.',
    corruption_risk: 'Коррупционный риск',
    other: 'Иное нарушение',
  },
};

async function generateViolationsRegistry(options = {}) {
  const { year = new Date().getFullYear(), locale = 'ru', outputDir = 'public/reports' } = options;

  console.log(`\n📋 Генерация реестра нарушений за ${year}...`);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'АИС КРР';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Реестр нарушений', {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true },
  });

  // Column definitions
  sheet.columns = [
    { header: '№', key: 'num', width: 5 },
    { header: 'Воинская часть', key: 'unit', width: 25 },
    { header: 'Период ревизии', key: 'period', width: 18 },
    { header: 'Вид нарушения', key: 'type', width: 30 },
    { header: 'Степень', key: 'severity', width: 14 },
    { header: 'Сумма нарушения (сум)', key: 'amount', width: 22 },
    { header: 'Описание', key: 'description', width: 40 },
    { header: 'Статус решения', key: 'decision_status', width: 18 },
    { header: 'Срок устранения', key: 'deadline', width: 18 },
    { header: 'Уголовное дело', key: 'criminal_referral', width: 16 },
  ];

  // Title row
  sheet.spliceRows(1, 0, []);
  const titleRow = sheet.getRow(1);
  sheet.mergeCells('A1:J1');
  titleRow.getCell(1).value = `РЕЕСТР НАРУШЕНИЙ КРУ МО РУз — ${year} ГОД`;
  titleRow.getCell(1).font = { name: 'Times New Roman', size: 14, bold: true, color: { argb: COLORS.header } };
  titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  titleRow.height = 30;

  sheet.spliceRows(2, 0, []);
  sheet.getRow(2).height = 5;

  // Header row (row 3)
  const headerRow = sheet.getRow(3);
  headerRow.height = 35;
  sheet.columns.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = col.header;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.header } };
    cell.font = { name: 'Times New Roman', size: 10, bold: true, color: { argb: COLORS.headerText } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
      left: { style: 'thin', color: { argb: 'FFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFF' } },
    };
  });

  // TODO: Replace with actual Prisma query
  // const violations = await prisma.violation.findMany({
  //   where: { audit: { start_date: { gte: new Date(`${year}-01-01`), lt: new Date(`${year+1}-01-01`) } } },
  //   include: { audit: { include: { unit: true } }, decisions: { orderBy: { created_at: 'desc' }, take: 1 } },
  //   orderBy: [{ severity: 'asc' }, { created_at: 'asc' }],
  // });

  // Sample data for demonstration
  const violations = [
    { num: 1, unit: 'в/ч 12345', period: '01.02.2026–15.02.2026', type: 'illegal_expense', severity: 'HIGH', amount: 5000000, description: 'Нецелевое расходование ГСМ', decision_status: 'in_progress', deadline: '15.03.2026', criminal_referral: false },
    { num: 2, unit: 'в/ч 67890', period: '10.03.2026–25.03.2026', type: 'embezzlement', severity: 'CRITICAL', amount: 12000000, description: 'Хищение денежных средств', decision_status: 'overdue', deadline: '20.03.2026', criminal_referral: true },
  ];

  violations.forEach((v, idx) => {
    const rowNum = idx + 4;
    const row = sheet.getRow(rowNum);
    const isAlt = idx % 2 === 1;
    const bgColor = isAlt ? COLORS.altRow : COLORS.white;

    row.getCell(1).value = v.num;
    row.getCell(2).value = v.unit;
    row.getCell(3).value = v.period;
    row.getCell(4).value = VIOLATION_TYPE_LABELS[locale][v.type] || v.type;
    row.getCell(5).value = SEVERITY_LABELS[locale][v.severity];
    row.getCell(6).value = v.amount ? v.amount.toLocaleString('ru-RU') : '—';
    row.getCell(7).value = v.description;
    row.getCell(8).value = v.decision_status;
    row.getCell(9).value = v.deadline;
    row.getCell(10).value = v.criminal_referral ? '⚠️ ДА' : 'Нет';

    // Severity color on cell 5
    const severityCell = row.getCell(5);
    severityCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS[v.severity] } };
    severityCell.font = { color: { argb: 'FFFFFF' }, bold: true };

    row.eachCell(cell => {
      cell.font = cell.font || {};
      cell.font.name = 'Times New Roman';
      cell.font.size = 10;
      if (!cell.fill || cell.fill.pattern !== 'solid') {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      }
      cell.border = {
        top: { style: 'hair' }, bottom: { style: 'hair' },
        left: { style: 'hair' }, right: { style: 'hair' },
      };
      cell.alignment = { vertical: 'middle', wrapText: true };
    });
    row.height = 30;
  });

  // Footer
  const lastRow = violations.length + 5;
  sheet.getRow(lastRow).getCell(1).value = `Сформировано: ${new Date().toLocaleDateString('ru-RU')} | АИС КРР v2.0`;
  sheet.getRow(lastRow).getCell(1).font = { name: 'Times New Roman', size: 9, italic: true, color: { argb: '888888' } };
  sheet.mergeCells(`A${lastRow}:J${lastRow}`);

  const filename = `violations-registry-${year}-${Date.now()}.xlsx`;
  const outputPath = path.join(outputDir, filename);
  await workbook.xlsx.writeFile(outputPath);

  console.log(`✅ Реестр нарушений сохранён: ${outputPath}`);
  return outputPath;
}

generateViolationsRegistry().catch(console.error);

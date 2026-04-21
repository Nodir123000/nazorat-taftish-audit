#!/usr/bin/env node
/**
 * АИС КРР — Compliance Report
 * Generates O'z DSt 2814:2014 compliance status report for МО.
 * Run: node .agent/skills/automated-reporting/scripts/compliance-report.js
 */

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const COLORS = { header: '1E3A5F', headerText: 'FFFFFF', pass: 'C6EFCE', fail: 'FFC7CE', warn: 'FFEB9C', blue: 'DEEBF7' };

async function generateComplianceReport(options = {}) {
  const { outputDir = 'public/reports' } = options;

  console.log('\n🛡️  Генерация отчёта соответствия O\'z DSt 2814:2014...');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'АИС КРР';

  const sheet = workbook.addWorksheet('Соответствие O\'z DSt 2814');
  sheet.columns = [
    { key: 'num', width: 8 },
    { key: 'section', width: 35 },
    { key: 'requirement', width: 55 },
    { key: 'status', width: 14 },
    { key: 'note', width: 35 },
  ];

  // Title
  sheet.spliceRows(1, 0, []);
  sheet.mergeCells('A1:E1');
  const t1 = sheet.getRow(1).getCell(1);
  t1.value = "ОТЧЁТ СООТВЕТСТВИЯ O'z DSt 2814:2014 — АИС КРР МО РУз";
  t1.font = { name: 'Times New Roman', size: 13, bold: true, color: { argb: COLORS.header } };
  t1.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 28;

  sheet.spliceRows(2, 0, []);
  sheet.getRow(2).getCell(1).value = `Дата формирования: ${new Date().toLocaleDateString('ru-RU')} | Классификация: КЗ-2`;
  sheet.getRow(2).getCell(1).font = { name: 'Times New Roman', size: 10, italic: true };
  sheet.mergeCells('A2:E2');

  sheet.spliceRows(3, 0, []);

  // Header
  const hRow = sheet.getRow(4);
  hRow.height = 30;
  ['№', 'Раздел', 'Требование', 'Статус', 'Примечание'].forEach((h, i) => {
    const cell = hRow.getCell(i + 1);
    cell.value = h;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.header } };
    cell.font = { name: 'Times New Roman', size: 10, bold: true, color: { argb: 'FFFFFF' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });

  // Compliance items — TODO: integrate with security-scan results
  const items = [
    { num: '1.1', section: '1. Управление доступом', req: 'RBAC реализован для всех модулей', status: 'ВЫПОЛНЕНО', note: 'getCurrentUser() во всех routes' },
    { num: '1.5', section: '1. Управление доступом', req: 'Инспектор видит только свои ревизии', status: 'ВЫПОЛНЕНО', note: 'Проверка commission_members' },
    { num: '1.6', section: '1. Управление доступом', req: 'Таймаут сессии 30 минут', status: 'ПРОВЕРИТЬ', note: 'Требует конфигурации next-auth' },
    { num: '2.1', section: '2. Защита данных', req: 'ПИНФЛ маскирован для непривилегированных ролей', status: 'ВЫПОЛНЕНО', note: 'maskPinfl() в personnel-service.ts' },
    { num: '2.3', section: '2. Защита данных', req: 'Передача данных только по HTTPS', status: 'ВЫПОЛНЕНО', note: 'Next.js + TLS на сервере' },
    { num: '3.1', section: '3. Аудит и журналирование', req: 'Все события аутентификации логируются', status: 'ВЫПОЛНЕНО', note: 'next-auth events' },
    { num: '3.2', section: '3. Аудит и журналирование', req: 'Все мутации данных пишутся в audit_log', status: 'ПРОВЕРИТЬ', note: '51 предупреждение в отчёте аудита' },
    { num: '3.5', section: '3. Аудит и журналирование', req: 'Хранение логов минимум 3 года', status: 'ПРОВЕРИТЬ', note: 'Настроить политику архивации' },
    { num: '4.1', section: '4. Контроль входных данных', req: 'Все API входы валидированы (Zod)', status: 'ЧАСТИЧНО', note: 'Не все routes имеют Zod' },
    { num: '5.1', section: '5. Обработка ошибок', req: 'Стек-трейс не отображается в production', status: 'ВЫПОЛНЕНО', note: 'NODE_ENV=production' },
    { num: '6.1', section: '6. Криптография', req: 'Пароли хэшируются bcrypt (cost >= 12)', status: 'ПРОВЕРИТЬ', note: 'Проверить параметры bcrypt' },
    { num: '7.1', section: '7. Сетевая безопасность', req: 'HTTP редиректит на HTTPS', status: 'ВЫПОЛНЕНО', note: 'next.config.js redirect' },
  ];

  const statusColors = { 'ВЫПОЛНЕНО': COLORS.pass, 'ПРОВЕРИТЬ': COLORS.warn, 'ЧАСТИЧНО': COLORS.warn, 'НЕ ВЫПОЛНЕНО': COLORS.fail };
  const passed = items.filter(i => i.status === 'ВЫПОЛНЕНО').length;
  const total = items.length;

  items.forEach((item, idx) => {
    const row = sheet.getRow(idx + 5);
    row.getCell(1).value = item.num;
    row.getCell(2).value = item.section;
    row.getCell(3).value = item.req;
    const statusCell = row.getCell(4);
    statusCell.value = item.status;
    statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusColors[item.status] || COLORS.blue } };
    statusCell.font = { bold: true };
    row.getCell(5).value = item.note;

    row.eachCell(cell => {
      cell.font = Object.assign({ name: 'Times New Roman', size: 10 }, cell.font);
      cell.border = { top: { style: 'hair' }, bottom: { style: 'hair' }, left: { style: 'hair' }, right: { style: 'hair' } };
      cell.alignment = { vertical: 'middle', wrapText: true };
    });
    row.height = 28;
  });

  // Summary
  const sumRow = items.length + 6;
  sheet.mergeCells(`A${sumRow}:C${sumRow}`);
  sheet.getRow(sumRow).getCell(1).value = `Итого выполнено: ${passed} из ${total} (${Math.round(passed/total*100)}%)`;
  sheet.getRow(sumRow).getCell(1).font = { name: 'Times New Roman', size: 11, bold: true, color: { argb: COLORS.header } };
  sheet.getRow(sumRow).height = 24;

  const filename = `compliance-report-${new Date().getFullYear()}-${Date.now()}.xlsx`;
  const outputPath = path.join(outputDir, filename);
  await workbook.xlsx.writeFile(outputPath);
  console.log(`✅ Отчёт соответствия сохранён: ${outputPath}`);
  return outputPath;
}

generateComplianceReport().catch(console.error);

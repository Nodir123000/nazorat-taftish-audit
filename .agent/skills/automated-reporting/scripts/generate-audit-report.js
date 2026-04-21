const ExcelJS = require('exceljs');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

/**
 * Скрипт генерации Акта ревизии (Пример для Agent Skills Level 3)
 * Использование: node generate-audit-report.js --auditId=1
 */

const prisma = new PrismaClient();

async function generateReport() {
    const args = process.argv.slice(2);
    const auditIdArg = args.find(arg => arg.startsWith('--auditId='));
    
    if (!auditIdArg) {
        console.error('Ошибка: Не указан --auditId');
        process.exit(1);
    }

    const auditId = parseInt(auditIdArg.split('=')[1]);

    try {
        console.log(`Получение данных для ревизии ID: ${auditId}...`);
        
        // В реальном скрипте здесь будет сложный запрос из kru-inspection-expert
        const audit = await prisma.audits.findUnique({
            where: { id: auditId },
            include: {
                ref_units: true,
                orders: true,
                commission_members: {
                    include: {
                        personnel: true
                    }
                }
            }
        });

        if (!audit) {
            console.error(`Ревизия с ID ${auditId} не найдена`);
            process.exit(1);
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Акт ревизии');

        // Стилизация (согласно стандарту из SKILL.md)
        sheet.columns = [
            { header: 'Параметр', key: 'label', width: 30 },
            { header: 'Значение', key: 'value', width: 50 },
        ];

        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1E3A5F' }
        };

        sheet.addRows([
            { label: 'Номер ревизии', value: audit.audit_number },
            { label: 'Объект проверки', value: audit.unit_name || audit.ref_units?.unit_name },
            { label: 'Тип проверки', value: audit.audit_type },
            { label: 'Период', value: `${audit.start_date.toLocaleDateString()} - ${audit.end_date.toLocaleDateString()}` },
            { label: 'Статус', value: audit.status },
        ]);

        sheet.addRow({});
        sheet.addRow({ label: 'СОСТАВ КОМИССИИ', value: '' }).font = { bold: true };

        audit.commission_members.forEach(member => {
            const name = member.personnel ? `${member.personnel.first_name} ${member.personnel.last_name}` : 'Н/Д';
            sheet.addRow({ label: member.role, value: name });
        });

        const reportsDir = path.join(process.cwd(), 'public', 'reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const fileName = `audit_report_${auditId}_${Date.now()}.xlsx`;
        const filePath = path.join(reportsDir, fileName);

        await workbook.xlsx.writeFile(filePath);
        
        console.log(`---SUCCESS---`);
        console.log(`Файл успешно создан: ${filePath}`);
        console.log(`URL: /reports/${fileName}`);

    } catch (error) {
        console.error('Ошибка при генерации отчета:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

generateReport();

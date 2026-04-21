#!/usr/bin/env npx tsx
/**
 * КРУ Code Quality Watchdog v1.0
 * Автономный аудит кода для проекта АИС КРР.
 * Проверяет Frontend, Backend и Database на соответствие kru-code-standard.
 *
 * Запуск: npx tsx .agent/skills/code-quality-watchdog/scripts/quality-audit.ts
 *       или: npm run audit
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Типы ────────────────────────────────────────────────────────────────────

type Severity = 'CRITICAL' | 'WARNING' | 'INFO';

interface Violation {
  severity: Severity;
  ruleId: string;
  file: string;
  line: number;
  message: string;
  suggestion?: string;
}

interface AuditRule {
  id: string;
  severity: Severity;
  description: string;
  check: (filePath: string, content: string, lines: string[]) => Violation[];
}

// ─── Конфигурация ─────────────────────────────────────────────────────────────

const PROJECT_ROOT = path.resolve(__dirname, '../../../..');
const SCAN_DIRS = ['app', 'components', 'lib'];
const IGNORE_PATTERNS = [
  'node_modules', '.next', '.next_new', '.agent', 'dist',
  'cleanup.js', 'scripts/seed', '.d.ts',
];

// ─── Правила аудита ──────────────────────────────────────────────────────────

const FRONTEND_RULES: AuditRule[] = [
  {
    id: 'NO_DIRECT_FETCH',
    severity: 'WARNING',
    description: 'fetch() в клиенте: рекомендуется SWR или серверный компонент',
    check: (filePath, content, lines) => {
      if (!filePath.endsWith('.tsx')) return [];
      const isClientComponent = content.includes("'use client'") || content.includes('"use client"');
      if (!isClientComponent) return [];
      const violations: Violation[] = [];
      lines.forEach((line, idx) => {
        if (/^\s*(const|let|var).*=\s*await\s+fetch\(/.test(line) || /^\s*fetch\(/.test(line)) {
          violations.push({
            severity: 'WARNING', ruleId: 'NO_DIRECT_FETCH',
            file: filePath, line: idx + 1,
            message: `fetch() в клиентском компоненте. Рекомендуется useSWR() или серверный компонент.`,
            suggestion: `import useSWR from 'swr';\nconst { data } = useSWR('/api/...', fetcher);`,
          });
        }
      });
      return violations;
    },
  },
  {
    id: 'NO_INLINE_PRISMA',
    severity: 'CRITICAL',
    description: 'Prisma запрещена на клиенте',
    check: (filePath, content, lines) => {
      if (!filePath.endsWith('.tsx')) return [];
      const isClientComponent = content.includes("'use client'") || content.includes('"use client"');
      if (!isClientComponent) return [];
      const violations: Violation[] = [];
      lines.forEach((line, idx) => {
        if (line.includes('@prisma/client') || line.includes('from \'@/lib/db/prisma\'') || line.includes('new PrismaClient')) {
          violations.push({
            severity: 'CRITICAL', ruleId: 'NO_INLINE_PRISMA',
            file: filePath, line: idx + 1,
            message: `Импорт Prisma в клиентском компоненте. Данные должны приходить через API.`,
          });
        }
      });
      return violations;
    },
  },
];

const BACKEND_RULES: AuditRule[] = [
  {
    id: 'NO_PRISMA_NEW',
    severity: 'CRITICAL',
    description: 'Запрет new PrismaClient() — использовать только singleton',
    check: (filePath, _content, lines) => {
      if (!filePath.includes('/api/') && !filePath.includes('/services/')) return [];
      const violations: Violation[] = [];
      lines.forEach((line, idx) => {
        if (/new\s+PrismaClient\s*\(/.test(line)) {
          violations.push({
            severity: 'CRITICAL', ruleId: 'NO_PRISMA_NEW',
            file: filePath, line: idx + 1,
            message: `Создание нового PrismaClient. Это приведет к исчерпанию пула соединений!`,
            suggestion: `import prisma from '@/lib/db/prisma'; // Используется singleton`,
          });
        }
      });
      return violations;
    },
  },
  {
    id: 'USE_SHARED_PRISMA',
    severity: 'WARNING',
    description: 'Использовать единый импорт Prisma из @/lib/db/prisma',
    check: (filePath, content, lines) => {
      if (!filePath.includes('/api/') && !filePath.includes('/services/')) return [];
      if (!content.includes('@prisma/client')) return [];
      // Если есть прямой импорт из prisma/client, но нет shared singleton
      const violations: Violation[] = [];
      lines.forEach((line, idx) => {
        if (line.includes("from '@prisma/client'") && !line.includes('type') && !line.includes('Prisma')) {
          violations.push({
            severity: 'WARNING', ruleId: 'USE_SHARED_PRISMA',
            file: filePath, line: idx + 1,
            message: `Прямой импорт из @prisma/client. Используйте shared singleton.`,
            suggestion: `import prisma from '@/lib/db/prisma';`,
          });
        }
      });
      return violations;
    },
  },
  {
    id: 'HANDLE_ERRORS',
    severity: 'WARNING',
    description: 'Все API-маршруты должны содержать try/catch с обработкой ошибок',
    check: (filePath, content, _lines) => {
      if (!filePath.includes('/api/') || !filePath.endsWith('route.ts')) return [];
      if (!content.includes('export async function')) return [];
      if (!content.includes('try') || !content.includes('catch')) {
        return [{
          severity: 'WARNING', ruleId: 'HANDLE_ERRORS',
          file: filePath, line: 1,
          message: `API-маршрут без обработки ошибок (try/catch). Добавьте обработчик.`,
          suggestion: `try { ... } catch (error) { return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }); }`,
        }];
      }
      return [];
    },
  },
  {
    id: 'SERVICE_LAYER',
    severity: 'WARNING',
    description: 'Бизнес-логику выносить в lib/services/, не держать в route.ts',
    check: (filePath, content, _lines) => {
      if (!filePath.includes('/api/') || !filePath.endsWith('route.ts')) return [];
      // Если в route.ts есть прямые запросы к Prisma (не через сервис) — это нарушение
      const hasPrismaQuery = /prisma\.(findMany|findFirst|create|update|delete|count|aggregate)\s*\(/.test(content);
      const hasServiceImport = content.includes("from '@/lib/services/");
      if (hasPrismaQuery && !hasServiceImport) {
        return [{
          severity: 'WARNING', ruleId: 'SERVICE_LAYER',
          file: filePath, line: 1,
          message: `Прямые запросы к Prisma в API-маршруте. Вынесите логику в lib/services/*.ts.`,
          suggestion: `// Создайте: lib/services/my-service.ts\n// Затем: import { getData } from '@/lib/services/my-service';`,
        }];
      }
      return [];
    },
  },
];

const SCHEMA_RULES: AuditRule[] = [
  {
    id: 'HAS_CREATED_AT',
    severity: 'WARNING',
    description: 'Все Prisma-модели должны иметь поле created_at',
    check: (filePath, content, _lines) => {
      if (!filePath.endsWith('schema.prisma')) return [];
      const modelBlocks = content.match(/model\s+\w+\s*\{[^}]+\}/g) || [];
      const violations: Violation[] = [];
      modelBlocks.forEach(block => {
        const modelName = block.match(/model\s+(\w+)/)?.[1];
        // Пропускаем служебные/справочные модели
        if (modelName?.startsWith('ref_') || modelName?.startsWith('Ref')) return;
        if (!block.includes('created_at') && !block.includes('createdAt')) {
          violations.push({
            severity: 'WARNING', ruleId: 'HAS_CREATED_AT',
            file: filePath, line: 1,
            message: `Модель '${modelName}' не имеет поля created_at. Рекомендуется добавить.`,
            suggestion: `created_at DateTime @default(now())`,
          });
        }
      });
      return violations;
    },
  },
];

const ALL_RULES = [...FRONTEND_RULES, ...BACKEND_RULES, ...SCHEMA_RULES];

// ─── Утилиты ──────────────────────────────────────────────────────────────────

function shouldIgnore(filePath: string): boolean {
  return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
}

function getFilesRecursive(dir: string, exts = ['.ts', '.tsx', '.prisma']): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (shouldIgnore(fullPath)) continue;
    if (entry.isDirectory()) {
      results.push(...getFilesRecursive(fullPath, exts));
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

function colorize(severity: Severity): string {
  const colors: Record<Severity, string> = {
    CRITICAL: '\x1b[31m', // красный
    WARNING: '\x1b[33m',  // жёлтый
    INFO: '\x1b[36m',     // голубой
  };
  return `${colors[severity]}[${severity}]\x1b[0m`;
}

// ─── Основной аудит ───────────────────────────────────────────────────────────

async function runAudit() {
  const startTime = Date.now();

  console.log('\n\x1b[36m🔍 КРУ Code Quality Watchdog v1.0\x1b[0m');
  console.log('====================================');
  console.log(`📂 Корень проекта: ${PROJECT_ROOT}`);

  // Сбор файлов
  let allFiles: string[] = [
    path.join(PROJECT_ROOT, 'prisma', 'schema.prisma'),
  ];
  for (const dir of SCAN_DIRS) {
    allFiles.push(...getFilesRecursive(path.join(PROJECT_ROOT, dir)));
  }
  allFiles = allFiles.filter(f => fs.existsSync(f));

  console.log(`📄 Файлов для анализа: ${allFiles.length}`);

  // Запуск правил
  const allViolations: Violation[] = [];

  for (const filePath of allFiles) {
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    let content: string;
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch {
      continue;
    }
    const lines = content.split('\n');

    for (const rule of ALL_RULES) {
      const violations = rule.check(relativePath, content, lines);
      allViolations.push(...violations);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  // ─── Отчет ────────────────────────────────────────────────────────────────

  const criticals = allViolations.filter(v => v.severity === 'CRITICAL');
  const warnings = allViolations.filter(v => v.severity === 'WARNING');
  const infos = allViolations.filter(v => v.severity === 'INFO');

  console.log(`\n✅ Сканирование завершено за ${elapsed}s`);
  console.log('\n\x1b[1m📊 ОТЧЕТ ПО КАЧЕСТВУ КОДА\x1b[0m');
  console.log('====================================');
  console.log(
    `\x1b[31mCRITICAL: ${criticals.length}\x1b[0m | \x1b[33mWARNING: ${warnings.length}\x1b[0m | \x1b[36mINFO: ${infos.length}\x1b[0m`
  );

  if (allViolations.length === 0) {
    console.log('\n\x1b[32m✅ Нарушений не найдено! Код соответствует стандартам KRU.\x1b[0m\n');
  } else {
    console.log('');
    for (const v of allViolations) {
      console.log(`${colorize(v.severity)} ${v.file}:${v.line}`);
      console.log(`    ${v.ruleId}: ${v.message}`);
      if (v.suggestion) {
        console.log(`    \x1b[90m💡 Исправление: ${v.suggestion.split('\n')[0]}\x1b[0m`);
      }
      console.log('');
    }
  }

  // Итог
  console.log('====================================');
  if (criticals.length > 0) {
    console.log(`\x1b[31m❌ Качество кода: ТРЕБУЕТ ИСПРАВЛЕНИЯ (${criticals.length} критических нарушений)\x1b[0m\n`);
    process.exit(1); // Выход с ошибкой для CI
  } else if (warnings.length > 0) {
    console.log(`\x1b[33m⚠️  Качество кода: ХОРОШЕЕ (есть предупреждения, критических нет)\x1b[0m\n`);
  } else {
    console.log(`\x1b[32m✅ Качество кода: ОТЛИЧНОЕ\x1b[0m\n`);
  }

  // JSON-отчет
  const reportDir = path.join(PROJECT_ROOT, '.agent');
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, 'last-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    filesScanned: allFiles.length,
    summary: { critical: criticals.length, warning: warnings.length, info: infos.length },
    violations: allViolations,
  }, null, 2));
  console.log(`📋 JSON-отчет сохранен: .agent/last-audit-report.json\n`);
}

runAudit().catch(console.error);

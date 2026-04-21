#!/usr/bin/env npx tsx
/**
 * АИС КРР Security Scanner v1.0
 * Scans for: PINFL exposure, missing RBAC, audit_log gaps, hardcoded secrets
 * Run: npx tsx .agent/skills/security-guardian/scripts/security-scan.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface SecurityIssue {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  rule: string;
  file: string;
  line: number;
  message: string;
  suggestion: string;
}

const ROOT = process.cwd();
const SCAN_DIRS = ['app', 'components', 'lib'];
const RESULTS: SecurityIssue[] = [];
let filesScanned = 0;

function getAllFiles(dir: string): string[] {
  const fullDir = path.join(ROOT, dir);
  if (!fs.existsSync(fullDir)) return [];
  const results: string[] = [];
  function walk(current: string) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        walk(full);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        results.push(full);
      }
    }
  }
  walk(fullDir);
  return results;
}

function rel(abs: string) {
  return abs.replace(ROOT + path.sep, '').replace(/\\/g, '/');
}

function add(severity: SecurityIssue['severity'], rule: string, file: string, line: number, message: string, suggestion: string) {
  RESULTS.push({ severity, rule, file: rel(file), line, message, suggestion });
}

function checkPinfl(filePath: string, lines: string[]) {
  const isClient = lines.some(l => l.includes("'use client'") || l.includes('"use client"'));
  const isApiRoute = filePath.includes('/api/') && filePath.endsWith('route.ts');
  lines.forEach((line, i) => {
    if (isApiRoute && line.includes('personnel') && line.includes('findMany') && !line.includes('maskPinfl')) {
      add('CRITICAL', 'SEC-01', filePath, i + 1, 'Personnel query may expose raw PINFL', 'Use personnel-service.ts with maskPinfl()');
    }
    if (isClient && (line.includes('.pinfl') || line.includes('["pinfl"]'))) {
      add('CRITICAL', 'SEC-01', filePath, i + 1, 'PINFL accessed in client component', 'Mask PINFL in service layer before sending to client');
    }
  });
}

function checkRbac(filePath: string, lines: string[]) {
  if (!filePath.includes('/api/') || !filePath.endsWith('route.ts')) return;
  const hasMethod = lines.some(l => /export async function (GET|POST|PUT|PATCH|DELETE)/.test(l));
  const hasAuth = lines.some(l => l.includes('getCurrentUser'));
  if (hasMethod && !hasAuth) {
    add('CRITICAL', 'SEC-02', filePath, 1, 'API route has no getCurrentUser() check', "Add: const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });");
  }
}

function checkServerActions(filePath: string, lines: string[]) {
  const isServer = lines.some(l => l.includes("'use server'") || l.includes('"use server"'));
  if (!isServer) return;
  const hasMutation = lines.some(l => l.includes('prisma.') && (l.includes('.create(') || l.includes('.update(') || l.includes('.delete(')));
  const hasAuth = lines.some(l => l.includes('getCurrentUser'));
  if (hasMutation && !hasAuth) {
    add('CRITICAL', 'SEC-02', filePath, 1, 'Server Action mutates without auth check', 'Add getCurrentUser() at top of every server action');
  }
}

function checkAuditLog(filePath: string, lines: string[]) {
  if (!filePath.includes('lib/services/')) return;
  const sensitiveOps = ['violations', 'decisions', 'audits', 'orders', 'personnel', 'users'];
  const hasMutation = lines.some(l =>
    sensitiveOps.some(t => l.includes(`prisma.${t}.`) || l.includes(`prisma.${t.slice(0,-1)}.`)) &&
    (l.includes('.create(') || l.includes('.update(') || l.includes('.delete('))
  );
  const hasLog = lines.some(l => l.includes('audit_log'));
  if (hasMutation && !hasLog) {
    add('HIGH', 'SEC-04', filePath, 1, 'Service mutates sensitive data without audit_log', 'Add prisma.audit_log.create() after each mutation');
  }
}

function checkErrorHandling(filePath: string, lines: string[]) {
  if (!filePath.includes('/api/') || !filePath.endsWith('route.ts')) return;
  const hasMethod = lines.some(l => /export async function (GET|POST|PUT|PATCH|DELETE)/.test(l));
  const hasTryCatch = lines.some(l => l.trim().startsWith('try {') || l.includes(' try {'));
  if (hasMethod && !hasTryCatch) {
    add('HIGH', 'SEC-05', filePath, 1, 'Route handler lacks try/catch — stack traces may leak', 'Wrap body in try/catch, return status 500 with generic message');
  }
}

function checkSecrets(filePath: string, lines: string[]) {
  const patterns = [/password\s*=\s*['"][^'"]{4,}/i, /secret\s*=\s*['"][^'"]{8,}/i, /api_key\s*=\s*['"][^'"]{8,}/i];
  lines.forEach((line, i) => {
    if (!line.trim().startsWith('//') && !line.trim().startsWith('*') && patterns.some(p => p.test(line))) {
      add('CRITICAL', 'SEC-06', filePath, i + 1, 'Possible hardcoded credential', 'Move to environment variable: process.env.SECRET_NAME');
    }
  });
}

function checkNewPrisma(filePath: string, lines: string[]) {
  lines.forEach((line, i) => {
    if (line.includes('new PrismaClient()')) {
      add('CRITICAL', 'SEC-07', filePath, i + 1, 'Direct new PrismaClient() — connection pool risk', "Import shared: import { prisma } from '@/lib/db/prisma'");
    }
  });
}

// Main scan
console.log('\n🛡️  АИС КРР Security Scanner v1.0');
console.log('━'.repeat(50));
const start = Date.now();

for (const dir of SCAN_DIRS) {
  for (const file of getAllFiles(dir)) {
    const lines = fs.readFileSync(file, 'utf-8').split('\n');
    filesScanned++;
    checkPinfl(file, lines);
    checkRbac(file, lines);
    checkServerActions(file, lines);
    checkAuditLog(file, lines);
    checkErrorHandling(file, lines);
    checkSecrets(file, lines);
    checkNewPrisma(file, lines);
  }
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
RESULTS.sort((a, b) => order[a.severity] - order[b.severity]);
const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
for (const r of RESULTS) counts[r.severity]++;

const deductions = { CRITICAL: 15, HIGH: 5, MEDIUM: 2, LOW: 0.5 };
const score = Math.max(0, Math.round(100 - RESULTS.reduce((s, r) => s + deductions[r.severity], 0)));
const grade = score >= 100 ? 'LEGENDARY' : score >= 95 ? 'EXCELLENT' : score >= 85 ? 'GOOD' : score >= 70 ? 'FAIR' : score >= 50 ? 'POOR' : 'CRITICAL';

console.log(`✅ Сканирование завершено за ${elapsed}s — ${filesScanned} файлов`);
console.log(`\n📊 ОТЧЕТ БЕЗОПАСНОСТИ`);
console.log('━'.repeat(50));
console.log(`🔴 CRITICAL: ${counts.CRITICAL} | 🟠 HIGH: ${counts.HIGH} | 🟡 MEDIUM: ${counts.MEDIUM} | 🔵 LOW: ${counts.LOW}`);
console.log(`\n🏆 Security Score: ${score}/100 — ${grade}`);

if (RESULTS.length > 0) {
  console.log('\n🚨 НАЙДЕННЫЕ ПРОБЛЕМЫ:');
  for (const r of RESULTS) {
    const icon = { CRITICAL: '🔴', HIGH: '🟠', MEDIUM: '🟡', LOW: '🔵' }[r.severity];
    console.log(`\n${icon} [${r.severity}] ${r.rule} — ${r.file}:${r.line}`);
    console.log(`   ❌ ${r.message}`);
    console.log(`   ✅ ${r.suggestion}`);
  }
} else {
  console.log('\n✅ Проблем безопасности не найдено!');
}

const reportPath = path.join(ROOT, '.agent', 'last-security-report.json');
fs.writeFileSync(reportPath, JSON.stringify({ timestamp: new Date().toISOString(), filesScanned, issues: RESULTS, score, grade }, null, 2));
console.log(`\n📋 Отчет сохранен: .agent/last-security-report.json`);

if (counts.CRITICAL > 0) {
  console.log('\n❌ КРИТИЧЕСКИЕ ПРОБЛЕМЫ — сборка остановлена');
  process.exit(1);
}

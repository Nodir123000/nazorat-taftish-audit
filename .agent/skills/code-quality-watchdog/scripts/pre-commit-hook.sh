#!/bin/sh
# АИС КРР Pre-commit Hook
# Runs quality audit and security scan before every commit.
# Blocks commit if CRITICAL issues found.
#
# Install:
#   cp .agent/skills/code-quality-watchdog/scripts/pre-commit-hook.sh .git/hooks/pre-commit
#   chmod +x .git/hooks/pre-commit

echo "🔍 АИС КРР: Running pre-commit checks..."

# Run code quality audit
echo "\n📊 Code quality audit..."
npx tsx .agent/skills/code-quality-watchdog/scripts/quality-audit.ts --pre-commit
AUDIT_EXIT=$?

# Run security scan
echo "\n🛡️  Security scan..."
npx tsx .agent/skills/security-guardian/scripts/security-scan.ts
SECURITY_EXIT=$?

# Block commit if critical issues found
if [ $AUDIT_EXIT -ne 0 ] || [ $SECURITY_EXIT -ne 0 ]; then
  echo "\n❌ Pre-commit checks FAILED. Fix CRITICAL issues before committing."
  echo "   Run 'npm run audit' and 'npm run security-scan' for details."
  exit 1
fi

echo "\n✅ Pre-commit checks passed."
exit 0

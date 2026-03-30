#!/usr/bin/env node
import { execSync } from 'node:child_process';

const MAX_ERRORS = Number(process.env.LINT_GATE_MAX_ERRORS ?? 270);
const MAX_WARNINGS = Number(process.env.LINT_GATE_MAX_WARNINGS ?? 60);

function runEslintJson() {
  try {
    return execSync('npx eslint . --format json', { 
      encoding: 'utf8', 
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 10 * 1024 * 1024
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'stdout' in error && error.stdout) {
      return String(error.stdout);
    }
    throw error;
  }
}

const output = runEslintJson();
const results = JSON.parse(output);

const totals = results.reduce(
  (acc, result) => {
    acc.errors += result.errorCount ?? 0;
    acc.warnings += result.warningCount ?? 0;
    return acc;
  },
  { errors: 0, warnings: 0 }
);

console.log(`Lint totals -> errors: ${totals.errors}, warnings: ${totals.warnings}`);
console.log(`Lint gate limits -> errors: ${MAX_ERRORS}, warnings: ${MAX_WARNINGS}`);

if (totals.errors > MAX_ERRORS || totals.warnings > MAX_WARNINGS) {
  console.error('❌ Lint gate failed: issue count increased above baseline limits.');
  process.exit(1);
}

console.log('✅ Lint gate passed: issue counts are within baseline limits.');

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listSliceIds } from './lib/ollama-peer-review/profiles.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const requiredFiles = [
  'scripts/ollama-peer-review.mjs',
  'scripts/lib/ollama-peer-review/client.mjs',
  'scripts/lib/ollama-peer-review/context.mjs',
  'scripts/lib/ollama-peer-review/profiles.mjs',
  'scripts/lib/ollama-peer-review/prompt.mjs',
  'scripts/lib/ollama-peer-review/secrets.mjs',
  'docs/ai/ollama-peer-review-runbook.md',
  'docs/ai/provider-settings-contract.md',
  'docs/ui/reviews/_templates/ollama-peer-review-receipt.template.md',
  'docs/ui/reviews/ollama-peer-review-001-receipt.md',
  '.cursor/rules/ollama-peer-review.mdc',
];

for (const relative of requiredFiles) {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) {
    console.error(`ollama-peer-review-model-check: missing ${relative}`);
    process.exit(1);
  }
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (!pkg.scripts['peer-review:ollama']) {
  console.error('ollama-peer-review-model-check: package.json missing peer-review:ollama script');
  process.exit(1);
}
if (!pkg.scripts['check:ollama-peer-review']) {
  console.error('ollama-peer-review-model-check: package.json missing check:ollama-peer-review script');
  process.exit(1);
}

if (listSliceIds().length < 3) {
  console.error('ollama-peer-review-model-check: expected at least 3 slice profiles');
  process.exit(1);
}

console.log('ollama-peer-review-model-check: pass');

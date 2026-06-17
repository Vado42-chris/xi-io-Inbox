#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const previewJs = fs.readFileSync(path.join(root, 'public/inbox-preview.js'), 'utf8');
const loopJs = fs.readFileSync(path.join(root, 'public/src/runtime/gmail-runtime-refresh-loop.js'), 'utf8');
const bridgeJs = fs.readFileSync(path.join(root, 'public/src/runtime/gmail-runtime-bridge.js'), 'utf8');
const pkg = fs.readFileSync(path.join(root, 'package.json'), 'utf8');

for (const token of [
  'createRuntimeRefreshLoop',
  'syncRuntimeRefreshLoop',
  'runRuntimeRefreshTick',
  'runtime-refresh-now',
  'RUNTIME_REFRESH_INTERVAL_MS',
  'lastRefreshAt',
  'visibilitychange',
]) {
  if (!previewJs.includes(token)) {
    console.error(`runtime-002c-model-check: preview missing ${token}`);
    process.exit(1);
  }
}

if (!loopJs.includes('export function createRuntimeRefreshLoop')) {
  console.error('runtime-002c-model-check: refresh loop module missing export');
  process.exit(1);
}

if (!bridgeJs.includes('export async function refreshRuntimeMail')) {
  console.error('runtime-002c-model-check: bridge missing refreshRuntimeMail');
  process.exit(1);
}

if (!pkg.includes('check:runtime002c')) {
  console.error('runtime-002c-model-check: package.json missing check:runtime002c');
  process.exit(1);
}

for (const doc of [
  'docs/ui/reviews/runtime-002c-refresh-loop-operator-proof-receipt.md',
  'docs/ui/reviews/runtime-002c-operator-oauth-proof-runbook.md',
]) {
  if (!fs.existsSync(path.join(root, doc))) {
    console.error(`runtime-002c-model-check: missing ${doc}`);
    process.exit(1);
  }
}

console.log('runtime-002c-model-check: pass');

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const indexHtml = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
const polish002 = fs.readFileSync(path.join(root, 'public/brand-shell-polish-002.css'), 'utf8');
const previewJs = fs.readFileSync(path.join(root, 'public/inbox-preview.js'), 'utf8');

if (!fs.existsSync(path.join(root, 'public/brand-shell-polish-002.css'))) {
  console.error('brand-002-model-check: missing public/brand-shell-polish-002.css');
  process.exit(1);
}

const logoPath = path.join(root, 'public/assets/brand/xi-io-inbox-logo.png');
if (!fs.existsSync(logoPath)) {
  console.error('brand-002-model-check: missing public/assets/brand/xi-io-inbox-logo.png');
  process.exit(1);
}

if (!indexHtml.includes('brand-shell-polish-002.css')) {
  console.error('brand-002-model-check: index.html must load brand-shell-polish-002.css after 001');
  process.exit(1);
}

const idx001 = indexHtml.indexOf('brand-shell-polish-001.css');
const idx002 = indexHtml.indexOf('brand-shell-polish-002.css');
if (idx002 <= idx001) {
  console.error('brand-002-model-check: brand-shell-polish-002.css must load after 001');
  process.exit(1);
}

if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(indexHtml + polish002)) {
  console.error('brand-002-model-check: external font CDN forbidden (route smoke policy)');
  process.exit(1);
}

for (const fontFile of ['inter-latin.woff2', 'jetbrains-mono-latin.woff2', 'oswald-light-latin.woff2']) {
  if (!fs.existsSync(path.join(root, 'public/assets/fonts', fontFile))) {
    console.error(`brand-002-model-check: missing self-hosted font ${fontFile}`);
    process.exit(1);
  }
}

for (const token of [
  'BRAND-SHELL-POLISH-002',
  '--color-bg-root',
  '--color-bg-shell',
  '--color-accent-blue',
  '--font-display',
  '--font-ui',
  '--font-body',
  '--font-mono',
  'Oswald',
  'Inter',
  'JetBrains Mono',
  '-webkit-font-smoothing: antialiased',
  'text-rendering: optimizeLegibility',
  '.app-shell.is-owner-shell .app-topbar',
  'background-image: none',
]) {
  if (!polish002.includes(token)) {
    console.error(`brand-002-model-check: brand-shell-polish-002.css missing ${token}`);
    process.exit(1);
  }
}

if (!previewJs.includes('is-owner-shell') || !previewJs.includes('/assets/brand/xi-io-inbox-logo.png')) {
  console.error('brand-002-model-check: preview JS missing owner shell or logo asset path');
  process.exit(1);
}

const serverFiles = ['server/local-web-runtime.mjs', 'server/mail-body.mjs', 'server/mail-sync.mjs'];
for (const file of serverFiles) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) continue;
  const stat = fs.statSync(full);
  const git = fs.readFileSync(full, 'utf8');
  if (git.includes('BRAND-SHELL-POLISH-002')) {
    console.error(`brand-002-model-check: runtime file must not reference brand slice: ${file}`);
    process.exit(1);
  }
}

console.log('brand-002-model-check: pass');

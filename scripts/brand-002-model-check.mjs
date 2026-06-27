#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const indexHtml = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
const polish001 = fs.readFileSync(path.join(root, 'public/brand-shell-polish-001.css'), 'utf8');
const polish002 = fs.readFileSync(path.join(root, 'public/brand-shell-polish-002.css'), 'utf8');
const polish002bPath = path.join(root, 'public/brand-shell-polish-002b.css');
const polish002b = fs.existsSync(polish002bPath)
  ? fs.readFileSync(polish002bPath, 'utf8')
  : '';
const previewJs = fs.readFileSync(path.join(root, 'public/inbox-preview.js'), 'utf8');

const ROUTES = ['home', 'mail', 'calendar', 'tasks', 'automations', 'activity', 'integrations'];

function fail(message) {
  console.error(`brand-002-model-check: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(path.join(root, 'public/brand-shell-polish-002.css'))) {
  fail('missing public/brand-shell-polish-002.css');
}

if (!fs.existsSync(polish002bPath)) {
  fail('missing public/brand-shell-polish-002b.css (BRAND-SHELL-POLISH-002B)');
}

const logoPath = path.join(root, 'public/assets/brand/xi-io-inbox-logo.png');
if (!fs.existsSync(logoPath)) {
  fail('missing public/assets/brand/xi-io-inbox-logo.png');
}

if (!indexHtml.includes('brand-shell-polish-002.css')) {
  fail('index.html must load brand-shell-polish-002.css after 001');
}

if (!indexHtml.includes('brand-shell-polish-002b.css')) {
  fail('index.html must load brand-shell-polish-002b.css after 002');
}

const idx001 = indexHtml.indexOf('brand-shell-polish-001.css');
const idx002 = indexHtml.indexOf('brand-shell-polish-002.css');
const idx002b = indexHtml.indexOf('brand-shell-polish-002b.css');
if (idx002 <= idx001 || idx002b <= idx002) {
  fail('brand CSS load order must be 001 → 002 → 002b');
}

const brandCssBundle = indexHtml + polish001 + polish002 + polish002b;
if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(brandCssBundle)) {
  fail('external font CDN forbidden (route smoke policy)');
}

for (const fontFile of ['inter-latin.woff2', 'jetbrains-mono-latin.woff2', 'oswald-light-latin.woff2']) {
  if (!fs.existsSync(path.join(root, 'public/assets/fonts', fontFile))) {
    fail(`missing self-hosted font ${fontFile}`);
  }
}

for (const file of [polish001, polish002, polish002b]) {
  if (/linear-gradient|radial-gradient/.test(file)) {
    fail('brand CSS must not declare gradients (002B flat-surface policy)');
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
    fail(`brand-shell-polish-002.css missing ${token}`);
  }
}

for (const token of [
  'BRAND-SHELL-POLISH-002B',
  '--route-home-accent',
  '--route-mail-accent',
  '--route-calendar-accent',
  '--route-tasks-accent',
  '--route-automations-accent',
  '--route-activity-accent',
  '--route-integrations-accent',
  '--route-accent',
  '--route-accent-soft',
  '--route-accent-border',
  '--route-accent-bg',
  '--route-accent-text',
  '--radius-none',
  '--radius-xs',
  '--radius-sm',
  '--radius-md',
  '--radius-lg',
  '--radius-xl',
  '--radius-pill',
  '--space-page-gutter',
  '--space-card-padding',
]) {
  if (!polish002b.includes(token)) {
    fail(`brand-shell-polish-002b.css missing ${token}`);
  }
}

for (const route of ROUTES) {
  if (!polish002b.includes(`--route-${route}-accent`)) {
    fail(`missing --route-${route}-accent token`);
  }
  const laneClass =
    route === 'mail'
      ? '.is-inbox-lane'
      : route === 'activity'
        ? '.is-receipts-lane'
        : route === 'integrations'
          ? '.is-extensions-lane'
          : `.is-${route}-lane`;
  if (!polish002b.includes(laneClass)) {
    fail(`missing lane mapping for ${route} (${laneClass})`);
  }
}

const tokenStart = polish002b.indexOf('/* BRAND-002B-TOKENS-START */');
const tokenEnd = polish002b.indexOf('/* BRAND-002B-TOKENS-END */');
if (tokenStart < 0 || tokenEnd < 0 || tokenEnd <= tokenStart) {
  fail('002b token block markers missing');
}
const tokenBlock = polish002b.slice(tokenStart, tokenEnd);
const styleBlock = polish002b.slice(tokenEnd);
const hexOutsideTokens = styleBlock.match(/#[0-9a-fA-F]{3,8}\b/g);
if (hexOutsideTokens?.length) {
  fail(`hardcoded hex outside token block: ${[...new Set(hexOutsideTokens)].join(', ')}`);
}

const selectedRules = polish002b.match(/\.is-(?:selected|active)[^{]*\{[^}]+\}/g) ?? [];
if (!selectedRules.some((rule) => rule.includes('--route-accent'))) {
  fail('selected/active rules must reference --route-accent');
}

if (!polish002b.includes('.thread-row.is-selected') || !polish002b.includes('.context-nav-item.is-active')) {
  fail('002b must normalize thread and context nav selected states');
}

if (!previewJs.includes('is-owner-shell') || !previewJs.includes('/assets/brand/xi-io-inbox-logo.png')) {
  fail('preview JS missing owner shell or logo asset path');
}

const serverFiles = ['server/local-web-runtime.mjs', 'server/mail-body.mjs', 'server/mail-sync.mjs'];
for (const file of serverFiles) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) continue;
  const git = fs.readFileSync(full, 'utf8');
  if (/BRAND-SHELL-POLISH-002[B]?/.test(git)) {
    fail(`runtime file must not reference brand slice: ${file}`);
  }
}

console.log('brand-002-model-check: pass (002 + 002B token enforcement)');

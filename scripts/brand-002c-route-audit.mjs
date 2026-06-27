#!/usr/bin/env node
/**
 * BRAND-SHELL-POLISH-002C route audit + accessibility enforcement.
 * Static checks: token inventory, contrast ratios, focus policy, route audit receipt.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const ROUTES = ['Home', 'Mail', 'Calendar', 'Tasks', 'Automations', 'Activity', 'Integrations'];
const SHARED_REGIONS = [
  'Shared header',
  'Shared left rail',
  'Shared right rail',
  'Inputs / search',
  'Buttons / chips / action links',
  'Cards / detail panes',
  'Disclosure rows',
  'List rows / tables',
];

function fail(message) {
  console.error(`brand-002c-route-audit: ${message}`);
  process.exit(1);
}

function parseColor(value) {
  const v = value.trim();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h.slice(0, 6), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const rgb = v.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (rgb) {
    return {
      r: Number(rgb[1]),
      g: Number(rgb[2]),
      b: Number(rgb[3]),
      a: rgb[4] === undefined ? 1 : Number(rgb[4]),
    };
  }
  return null;
}

function blend(fg, bg) {
  const a = fg.a + bg.a * (1 - fg.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  return {
    r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
    g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
    b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
    a,
  };
}

function luminance({ r, g, b }) {
  const chan = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
}

function contrastRatio(fg, bg) {
  const fgBlended = fg.a < 1 ? blend(fg, bg) : fg;
  const l1 = luminance(fgBlended);
  const l2 = luminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function extractTokenMap(css, startMarker, endMarker) {
  let block;
  if (startMarker === '.app-shell.is-owner-shell {') {
    const start = css.indexOf(startMarker);
    if (start < 0) return {};
    let depth = 0;
    for (let i = start; i < css.length; i += 1) {
      if (css[i] === '{') depth += 1;
      if (css[i] === '}') {
        depth -= 1;
        if (depth === 0) {
          block = css.slice(start, i + 1);
          break;
        }
      }
    }
    if (!block) return {};
  } else {
    const start = css.indexOf(startMarker);
    const end = css.indexOf(endMarker);
    if (start < 0 || end < 0 || end <= start) return {};
    block = css.slice(start, end);
  }
  const map = {};
  for (const match of block.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    map[`--${match[1]}`] = match[2].trim();
  }
  return map;
}

function tokenDefined(name, maps) {
  for (let i = maps.length - 1; i >= 0; i -= 1) {
    if (maps[i][name]) return true;
  }
  return false;
}

function resolveToken(name, maps, depth = 0) {
  if (depth > 12) return null;
  for (let i = maps.length - 1; i >= 0; i -= 1) {
    const map = maps[i];
    const raw = map[name];
    if (!raw) continue;
    if (raw.startsWith('var(')) {
      const inner = raw.match(/var\(\s*(--[^,)]+)/)?.[1];
      if (inner) return resolveToken(inner, maps, depth + 1);
    }
    const color = parseColor(raw);
    if (color) return color;
  }
  return null;
}

const indexHtml = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
const polish002 = fs.readFileSync(path.join(root, 'public/brand-shell-polish-002.css'), 'utf8');
const polish002b = fs.readFileSync(path.join(root, 'public/brand-shell-polish-002b.css'), 'utf8');
const polish002cPath = path.join(root, 'public/brand-shell-polish-002c.css');
const auditDocPath = path.join(root, 'docs/ui/polish/brand-shell-polish-002c-route-audit.md');

if (!fs.existsSync(polish002cPath)) {
  fail('missing public/brand-shell-polish-002c.css');
}
if (!fs.existsSync(auditDocPath)) {
  fail('missing docs/ui/polish/brand-shell-polish-002c-route-audit.md');
}

const polish002c = fs.readFileSync(polish002cPath, 'utf8');

if (!indexHtml.includes('brand-shell-polish-002c.css')) {
  fail('index.html must load brand-shell-polish-002c.css after 002b');
}

const idx002b = indexHtml.indexOf('brand-shell-polish-002b.css');
const idx002c = indexHtml.indexOf('brand-shell-polish-002c.css');
if (idx002c <= idx002b) {
  fail('brand CSS load order must be 001 → 002 → 002b → 002c');
}

if (/linear-gradient|radial-gradient/.test(polish002c)) {
  fail('002c brand CSS must not declare gradients');
}

const tokenMaps = [
  extractTokenMap(polish002, '.app-shell.is-owner-shell {', 'font-family: var(--font-body)'),
  extractTokenMap(polish002b, '/* BRAND-002B-TOKENS-START */', '/* BRAND-002B-TOKENS-END */'),
  extractTokenMap(polish002c, '/* BRAND-002C-TOKENS-START */', '/* BRAND-002C-TOKENS-END */'),
];

const requiredTokens = [
  '--color-bg-root',
  '--token-bg',
  '--token-surface',
  '--token-panel',
  '--token-panel-raised',
  '--token-border',
  '--token-shadow',
  '--radius-md',
  '--space-page-gutter',
  '--font-display',
  '--font-body',
  '--state-selected-bg',
  '--state-hover-bg',
  '--focus-ring-color',
  '--state-disabled-text',
  '--route-accent',
  '--state-success',
  '--state-warn',
  '--state-danger',
  '--state-info',
];

for (const token of requiredTokens) {
  if (!tokenDefined(token, tokenMaps)) {
    fail(`token inventory missing ${token}`);
  }
}

const panelBg = resolveToken('--color-bg-panel', tokenMaps);
if (!panelBg) fail('unable to resolve panel background for contrast checks');

const contrastChecks = [
  { name: 'text-primary on panel', fg: '--color-text-primary', bg: '--color-bg-panel', min: 4.5 },
  { name: 'text-secondary on panel', fg: '--color-text-secondary', bg: '--color-bg-panel', min: 4.5 },
  { name: 'text-muted on panel', fg: '--color-text-muted', bg: '--color-bg-panel', min: 4.5 },
  { name: 'primary text on raised panel', fg: '--color-text-primary', bg: '--color-bg-panel-raised', min: 4.5 },
  { name: 'focus ring on panel (non-text)', fg: '--focus-ring-color', bg: '--color-bg-panel', min: 3 },
  { name: 'route accent indicator on panel (non-text)', fg: '--route-mail-accent', bg: '--color-bg-panel', min: 3 },
  { name: 'border-strong on panel (non-text)', fg: '--color-border-strong', bg: '--color-bg-panel', min: 3 },
];

for (const check of contrastChecks) {
  const fg = resolveToken(check.fg, tokenMaps);
  if (!fg) fail(`contrast check missing foreground token ${check.fg}`);
  const bg = check.bg === '--color-bg-panel' ? panelBg : resolveToken(check.bg, tokenMaps) ?? panelBg;
  const ratio = contrastRatio(fg, bg);
  if (ratio < check.min) {
    fail(`${check.name} contrast ${ratio.toFixed(2)}:1 below ${check.min}:1 (${check.fg} on ${check.bg})`);
  }
}

if (!/:focus-visible/.test(polish002c) || !polish002c.includes('--focus-ring-color')) {
  fail('002c must define tokenized :focus-visible rules');
}

if (!polish002c.includes('inset') || !polish002c.includes('--state-selected-indicator')) {
  fail('002c must reinforce selected affordance beyond color (inset indicator token)');
}

const styleBlock = polish002c.slice(polish002c.indexOf('/* BRAND-002C-TOKENS-END */'));
const badRadius = styleBlock.match(/border-radius:\s*(?!var\()[^;]+;/g);
if (badRadius?.length) {
  fail(`002c style block uses non-token border-radius: ${badRadius.join(' ')}`);
}

const cStart = polish002c.indexOf('/* BRAND-002C-TOKENS-START */');
const cEnd = polish002c.indexOf('/* BRAND-002C-TOKENS-END */');
const hexOutside = polish002c.slice(cEnd).match(/#[0-9a-fA-F]{3,8}\b/g);
if (hexOutside?.length) {
  fail(`hardcoded hex outside 002c token block: ${[...new Set(hexOutside)].join(', ')}`);
}

const auditDoc = fs.readFileSync(auditDocPath, 'utf8');
if (!auditDoc.includes('DESIGN-SYSTEM-EXTRACTION-001')) {
  fail('route audit doc must capture DESIGN-SYSTEM-EXTRACTION-001 future refactor');
}

for (const region of [...ROUTES, ...SHARED_REGIONS]) {
  const row = auditDoc.split('\n').find((line) => line.includes(`| ${region} |`));
  if (!row) fail(`route audit doc missing row for ${region}`);
  if (!/\|\s*PASS\s*\|/.test(row)) {
    fail(`route audit doc ${region} row must end with PASS status`);
  }
}

const serverFiles = ['server/local-web-runtime.mjs', 'server/mail-body.mjs', 'server/mail-sync.mjs'];
for (const file of serverFiles) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) continue;
  if (/BRAND-SHELL-POLISH-002[C]?/.test(fs.readFileSync(full, 'utf8'))) {
    fail(`runtime file must not reference brand slice: ${file}`);
  }
}

console.log('brand-002c-route-audit: pass (token inventory, WCAG contrast, route audit receipt)');

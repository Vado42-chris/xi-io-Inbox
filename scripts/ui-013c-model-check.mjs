import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = fs.readFileSync(path.join(root, 'public/inbox-preview.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'public/inbox-preview.js'), 'utf8');

const requiredCss = [
  'UI-013C',
  'trust-affordance-warn',
  'font-display',
  'calendar-workspace-grid',
];
const requiredJs = [
  'brand-mark',
  'trust-affordance',
  'app-frame-lane-',
  'Calendar writes locked until you connect a provider',
];

for (const token of requiredCss) {
  if (!css.includes(token)) {
    console.error(`ui-013c-model-check: fail — missing CSS token ${token}`);
    process.exit(1);
  }
}
for (const token of requiredJs) {
  if (!js.includes(token)) {
    console.error(`ui-013c-model-check: fail — missing JS token ${token}`);
    process.exit(1);
  }
}

console.log('ui-013c-model-check: pass');

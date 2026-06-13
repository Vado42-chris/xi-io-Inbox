import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const js = fs.readFileSync(path.join(root, 'public/inbox-preview.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'public/inbox-preview.css'), 'utf8');

assert.match(css, /UI-012E — accessibility \/ contrast \/ focus polish/);
assert.match(css, /\.skip-to-main/);
assert.match(css, /prefers-reduced-motion/);
assert.match(js, /Skip to main content/);
assert.match(js, /id="appMainLane"/);

console.log('ui-012e-model-check: pass');

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const js = fs.readFileSync(path.join(root, 'public/inbox-preview.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'public/inbox-preview.css'), 'utf8');

assert.match(css, /UI-012D — interaction \/ state polish/);
assert.match(css, /\.ibal-proposal-card\.is-proposed/);
assert.match(css, /\.mail-list-pane \.thread-row\.mail-thread-row:focus-visible/);
assert.match(css, /\.is-interactive-hint/);
assert.match(js, /function ibalProposalCardStateClass\(/);
assert.match(js, /contextSubNavByWorkspace/);
assert.match(js, /is-interactive-hint/);
assert.match(js, /is-rail-compact/);
assert.match(js, /settings-workspace-grid is-rail-driven/);
assert.match(js, /aria-current="\$\{active \? 'page' : 'false'\}"/);
assert.match(js, /const STORAGE_SCHEMA_VERSION = 11;/);

console.log('ui-012d-model-check: pass');

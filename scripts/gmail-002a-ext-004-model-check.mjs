import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsPath = path.join(root, 'public/inbox-preview.js');
const cliPath = path.join(root, 'tools/gmail/cli.js');
const adapterPath = path.join(root, 'tools/gmail/lib/adapter.js');
const syncStatusPath = path.join(root, 'tools/gmail/lib/sync-status.js');

const js = fs.readFileSync(jsPath, 'utf8');
const cli = fs.readFileSync(cliPath, 'utf8');
const adapter = fs.readFileSync(adapterPath, 'utf8');
const syncStatus = fs.readFileSync(syncStatusPath, 'utf8');

assert.match(cli, /sync-history/);
assert.match(cli, /runHistorySync/);
assert.match(adapter, /export async function runHistorySync\(/);
assert.match(adapter, /users\.history\.list/);
assert.match(adapter, /setHistoryState\(/);
assert.match(syncStatus, /historyState/);
assert.match(js, /historyComplete/);
assert.match(js, /History cursor/);

console.log('gmail-002a-ext-004-model-check: pass');

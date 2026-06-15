import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsPath = path.join(root, 'public/inbox-preview.js');
const cssPath = path.join(root, 'public/inbox-preview.css');
const samplePath = path.join(root, 'public/data/gmail-sync-status.sample.json');

const js = fs.readFileSync(jsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const sample = JSON.parse(fs.readFileSync(samplePath, 'utf8'));

assert.match(js, /function applySyncStatusToAccounts\(/);
assert.match(js, /function resolveGmailSyncStatusEmail\(/);
assert.match(js, /function syncStateFromGmailSyncStatus\(/);
assert.match(js, /function operatorMailAccounts\(/);
assert.match(js, /function isDemoFixtureMailAccount\(/);
assert.match(js, /applySyncStatusToAccounts\(status\)/);
assert.doesNotMatch(js, /gmail-cli-account@example\.com/);
assert.doesNotMatch(js, /if \(!map\.size\) \{\s*map\.set\('personal-gmail-preview'/);
assert.match(js, /No connected mail accounts yet/);
assert.match(js, /mail-account-state \$\{accountSyncStatusClass/);
assert.match(css, /\.mail-account-state\.is-syncing/);
assert.match(css, /\.mail-account-state\.is-failed/);

const email = sample.artifacts?.metadataSnapshot?.accountEmail;
assert.ok(email, 'sample sync status must include account email');
assert.equal(sample.lastSync?.event, 'completed');

console.log('acc-sync-ui-001-model-check: pass');

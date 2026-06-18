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

assert.match(js, /GMAIL_SYNC_STATUS_LOCAL_URL/);
assert.match(js, /GMAIL_SYNC_STATUS_SAMPLE_URL/);
assert.match(js, /function renderGmailSyncStatusPanel\(/);
assert.match(js, /function importGmailSyncStatus\(/);
assert.match(js, /function mapGmailSyncReceiptToActivity\(/);
assert.match(js, /data-account-action="import-sync-status"/);
assert.match(js, /gmailSyncStatusActive\(\)/);
assert.match(js, /browserOAuth === false/);
assert.match(js, /status\.gates\?\.draftWrite/);
assert.match(js, /status\.gates\?\.send/);
assert.match(js, /status\.gates\?\.mutation/);
assert.match(css, /\.gmail-sync-status-panel/);

assert.equal(sample.mode, 'sync-status');
assert.equal(sample.browserOAuth, false);
assert.equal(sample.gates.send, 'blocked');
assert.ok(Array.isArray(sample.syncReceipts));
assert.ok(sample.syncReceipts.some((entry) => entry.event === 'completed'));
assert.doesNotMatch(JSON.stringify(sample), /access_token/);
assert.doesNotMatch(JSON.stringify(sample), /sanitizedPlainText/);

console.log('gmail-002a-ext-003-model-check: pass');

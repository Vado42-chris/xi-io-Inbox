import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const js = fs.readFileSync(path.join(root, 'public/inbox-preview.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'public/inbox-preview.css'), 'utf8');

assert.match(js, /function metadataSnapshotAccountId\(/);
assert.match(js, /function renderMailWorkspaceHeader\(/);
assert.match(js, /function renderMetadataReadingPane\(/);
assert.match(js, /function renderAccountMailboxButton\(/);
assert.match(js, /select-account-smart/);
assert.match(js, /select-account-label/);
assert.match(js, /threadSourceBadge\(/);
assert.match(js, /mail-thread-row/);
assert.match(js, /Body not imported yet/);
assert.match(js, /draftWriteState: 'blocked'/);
assert.match(js, /sendState: 'blocked'/);
assert.match(js, /mutationState: 'blocked'/);
assert.match(js, /const STORAGE_KEY = 'xiioInbox\.preview\.state';/);
assert.match(js, /const STORAGE_SCHEMA_VERSION = 11;/);
assert.match(css, /MAIL-001/);
assert.match(css, /mail-workbench-center/);
assert.match(css, /is-rail-compact/);

console.log('mail-001-model-check: pass');

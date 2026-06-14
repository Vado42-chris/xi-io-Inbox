import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsPath = path.join(root, 'public/inbox-preview.js');
const cssPath = path.join(root, 'public/inbox-preview.css');
const samplePath = path.join(root, 'public/data/gcal-events.sample.json');
const cliPath = path.join(root, 'tools/gcal/cli.js');

const js = fs.readFileSync(jsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const sample = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
const cli = fs.readFileSync(cliPath, 'utf8');

assert.match(js, /GCAL_EVENTS_LOCAL_URL/);
assert.match(js, /importGcalEventsSnapshot\(/);
assert.match(js, /gcalEventsSnapshotActive\(/);
assert.match(js, /data-account-action="import-calendar-snapshot"/);
assert.match(js, /kind === 'imported'/);
assert.match(css, /\.calendar-day-chip\.is-imported/);
assert.match(cli, /export-calendar-snapshot/);

assert.equal(sample.mode, 'read-only-metadata');
assert.equal(sample.source, 'local-gcal-cli');
assert.ok(Array.isArray(sample.events));
assert.doesNotMatch(JSON.stringify(sample), /access_token/);
assert.doesNotMatch(JSON.stringify(sample), /attendees/);

console.log('gcal-001-model-check: pass');

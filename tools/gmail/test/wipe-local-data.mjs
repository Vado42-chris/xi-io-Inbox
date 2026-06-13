import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { wipeLocalAdapterData } from '../lib/local-data.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dataDir = path.join(root, 'data');
const receiptsDir = path.join(root, 'receipts');
const probeData = path.join(dataDir, 'wipe-probe.json');
const probeReceipt = path.join(receiptsDir, 'wipe-probe.json');
const tokenPath = path.join(dataDir, 'token.json');

await fs.mkdir(dataDir, { recursive: true });
await fs.mkdir(receiptsDir, { recursive: true });

let tokenBackup = null;
try {
  tokenBackup = await fs.readFile(tokenPath);
} catch {
  // no operator token present
}

await fs.writeFile(probeData, '{"probe":true}\n', 'utf8');
await fs.writeFile(probeReceipt, '{"probe":true}\n', 'utf8');

const dryRun = await wipeLocalAdapterData({ dryRun: true });
assert.equal(dryRun.dryRun, true);
assert.ok(dryRun.paths.some((entry) => entry.endsWith('wipe-probe.json')));

await fs.access(probeData);
await fs.access(probeReceipt);

const wiped = await wipeLocalAdapterData({ dryRun: false });
assert.equal(wiped.dryRun, false);
await assert.rejects(() => fs.access(probeData));
await assert.rejects(() => fs.access(probeReceipt));

if (tokenBackup) {
  await fs.writeFile(tokenPath, tokenBackup);
}

console.log('wipe-local-data: pass');

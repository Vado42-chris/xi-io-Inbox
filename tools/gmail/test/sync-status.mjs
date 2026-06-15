import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSyncStatus, writeSyncStatusFile } from '../lib/sync-status.js';
import { readSyncReceiptEvents, writeSyncReceipt } from '../lib/receipts.js';
import { saveMailIndex, createEmptyMailIndex } from '../lib/local-mail-index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function withTempEnv(vars, fn) {
  const previous = {};
  for (const [key, value] of Object.entries(vars)) {
    previous[key] = process.env[key];
    if (value == null) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    await fn();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value == null) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

async function runTests() {
  const status = await buildSyncStatus();
  assert.equal(status.schemaVersion, 1);
  assert.equal(status.mode, 'sync-status');
  assert.equal(status.browserOAuth, false);
  assert.equal(status.gates.draftWrite, 'blocked');
  assert.equal(status.gates.send, 'blocked');
  assert.equal(status.gates.mutation, 'blocked');
  assert.equal(status.gates.bodyRead, 'blocked');
  assert.ok(Array.isArray(status.syncReceipts));
  assert.ok(Array.isArray(status.warnings));
  const serialized = JSON.stringify(status);
  assert.doesNotMatch(serialized, /access_token/);
  assert.doesNotMatch(serialized, /refresh_token/);
  assert.doesNotMatch(serialized, /sanitizedPlainText/);

  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'sync-status-test-'));
  const receiptsDir = path.join(tempRoot, 'receipts');
  const indexPath = path.join(tempRoot, 'mail-index.json');
  await fs.mkdir(receiptsDir, { recursive: true });

  await withTempEnv({
    GMAIL_RECEIPTS_DIR: receiptsDir,
    GMAIL_MAIL_INDEX_PATH: indexPath,
  }, async () => {
    writeSyncReceipt({
      method: 'gmail.metadataSync.started',
      event: 'started',
      success: true,
      details: { job: 'inbox_recent' },
    });
    writeSyncReceipt({
      method: 'gmail.metadataSync.completed',
      event: 'completed',
      success: true,
      details: { pagesFetched: 1, threadCount: 3, messageCount: 4, stoppedReason: 'complete' },
    });
    writeSyncReceipt({
      method: 'gmail.metadataSync.failed',
      event: 'failed',
      success: false,
      error: 'simulated failure',
    });

    const receipts = await readSyncReceiptEvents({ limit: 10 });
    assert.ok(receipts.length >= 3);
    assert.ok(receipts.some((entry) => entry.event === 'completed'));
    assert.ok(receipts.some((entry) => entry.event === 'failed'));
    const completed = receipts.find((entry) => entry.event === 'completed');
    assert.equal(completed.details?.threadCount, 3);

    const emptyIndex = createEmptyMailIndex();
    emptyIndex.threads = [{ id: 't1', labelIds: ['INBOX'], messages: [], accountEmail: 'demo@example.com', accountId: 'gmail:demo@example.com' }];
    await saveMailIndex(emptyIndex, { indexPath });

    const withArtifacts = await buildSyncStatus();
    assert.equal(withArtifacts.artifacts.mailIndex.present, true);
    assert.equal(withArtifacts.artifacts.mailIndex.threadCount, 1);
    assert.ok(withArtifacts.lastSync.at);
    assert.equal(withArtifacts.lastSync.threadCount, 3);

    const outPath = path.join(tempRoot, 'sync-status.json');
    const written = await writeSyncStatusFile(outPath);
    assert.equal(written.path, outPath);
    const parsed = JSON.parse(await fs.readFile(outPath, 'utf8'));
    assert.equal(parsed.mode, 'sync-status');
    assert.doesNotMatch(JSON.stringify(parsed), /sanitizedPlainText/);
  });

  await fs.rm(tempRoot, { recursive: true, force: true });
  console.log('sync-status: pass');
}

runTests().catch((err) => {
  console.error('sync-status test failed:', err);
  process.exit(1);
});

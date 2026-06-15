import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_MAIL_INDEX_PATH,
  MailIndexError,
  createEmptyMailIndex,
  loadMailIndex,
  saveMailIndex,
  upsertToMailIndex,
  queryMailIndex,
  mergeMessage,
  mergeThread,
  migrateLegacyMailIndex,
} from '../lib/local-mail-index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);
const REAL_OPERATOR_MAIL_INDEX_PATH = DEFAULT_MAIL_INDEX_PATH;

async function createTestIndexPath() {
  const testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mail-index-test-'));
  const testIndexPath = path.join(testDir, 'mail-index.json');
  assert.notEqual(
    path.resolve(testIndexPath),
    path.resolve(REAL_OPERATOR_MAIL_INDEX_PATH),
    'test index path must not equal operator mail index path',
  );
  return { testDir, testIndexPath };
}

async function removeTestDir(testDir) {
  await fs.rm(testDir, { recursive: true, force: true });
}

async function runTests() {
  let realStatBefore = null;
  try {
    realStatBefore = await fs.stat(REAL_OPERATOR_MAIL_INDEX_PATH);
  } catch {
    // operator index may not exist
  }

  const { testDir, testIndexPath } = await createTestIndexPath();

  try {
    // Test 1: missing index initializes empty envelope
    const emptyIndex = await loadMailIndex({ indexPath: testIndexPath });
    assert.equal(emptyIndex.schemaVersion, 1);
    assert.deepEqual(emptyIndex.threads, []);
    assert.deepEqual(emptyIndex.messages, []);
    assert.equal(emptyIndex.mode, 'metadata-index');

    // Test 2: save and load envelope works
    const sample = createEmptyMailIndex();
    sample.threads = [{ id: 't1', messages: [{ id: 'm1', threadId: 't1', labelIds: ['INBOX'] }] }];
    sample.messages = [{ id: 'm1', threadId: 't1', labelIds: ['INBOX'] }];
    await saveMailIndex(sample, { indexPath: testIndexPath });
    const loaded = await loadMailIndex({ indexPath: testIndexPath });
    assert.equal(loaded.threads.length, 1);
    assert.equal(loaded.messages.length, 1);

    // Test 3: corrupt JSON fails closed
    await fs.writeFile(testIndexPath, '{not-json', 'utf8');
    await assert.rejects(
      () => loadMailIndex({ indexPath: testIndexPath }),
      (err) => err instanceof MailIndexError && err.code === 'CORRUPT_INDEX',
    );

    // Test 4: invalid schema fails closed
    await fs.writeFile(testIndexPath, JSON.stringify({ schemaVersion: 999, threads: [], messages: [] }), 'utf8');
    await assert.rejects(
      () => loadMailIndex({ indexPath: testIndexPath }),
      (err) => err instanceof MailIndexError && err.code === 'INVALID_SCHEMA',
    );

    // Test 5: legacy envelope migration
    await fs.writeFile(
      testIndexPath,
      JSON.stringify({
        threads: [{ id: 't-legacy', labelIds: ['INBOX'], messages: [] }],
        messages: [{ id: 'm-legacy', threadId: 't-legacy', labelIds: ['INBOX'] }],
      }),
      'utf8',
    );
    const migrated = await loadMailIndex({ indexPath: testIndexPath });
    assert.equal(migrated.schemaVersion, 1);
    assert.equal(migrated.threads[0].id, 't-legacy');
    assert.match(migrated.warnings.join(' '), /legacy/i);

    // Test 6: invalid save preserves previous file
    const good = createEmptyMailIndex();
    good.threads = [{ id: 't-safe', labelIds: ['INBOX'], messages: [] }];
    await saveMailIndex(good, { indexPath: testIndexPath });
    const before = await fs.readFile(testIndexPath, 'utf8');
    await assert.rejects(
      () => saveMailIndex({ schemaVersion: 1, threads: 'bad', messages: [] }, { indexPath: testIndexPath }),
      MailIndexError,
    );
    const after = await fs.readFile(testIndexPath, 'utf8');
    assert.equal(after, before);

    // Test 7: mergeMessage preserves body-gate fields
    const existingMsg = {
      id: 'm1',
      threadId: 't1',
      labelIds: ['INBOX'],
      sanitizedPlainText: 'Hello redacted world',
      sanitizedBodyPreview: 'Hello...',
      bodyAvailable: true,
      redactionNotes: 'Removed details',
    };
    const incomingMsg = {
      id: 'm1',
      threadId: 't1',
      labelIds: ['INBOX', 'UNREAD'],
      subject: 'New Subject',
    };
    const mergedMsg = mergeMessage(existingMsg, incomingMsg);
    assert.equal(mergedMsg.sanitizedPlainText, 'Hello redacted world');
    assert.equal(mergedMsg.sanitizedBodyPreview, 'Hello...');
    assert.equal(mergedMsg.bodyAvailable, true);
    assert.equal(mergedMsg.redactionNotes, 'Removed details');
    assert.deepEqual(mergedMsg.labelIds, ['INBOX', 'UNREAD']);
    assert.equal(mergedMsg.subject, 'New Subject');

    // Test 8: mergeThread merges messages correctly
    const mergedThread = mergeThread(
      { id: 't1', messages: [existingMsg] },
      { id: 't1', messages: [incomingMsg] },
    );
    assert.equal(mergedThread.messages.length, 1);
    assert.equal(mergedThread.messages[0].sanitizedPlainText, 'Hello redacted world');
    assert.deepEqual(mergedThread.labelIds, ['INBOX', 'UNREAD']);

    // Test 9: upsert preserves body-gate fields and account identity
    await fs.unlink(testIndexPath).catch(() => {});
    await upsertToMailIndex({
      indexPath: testIndexPath,
      accountEmail: 'owner@example.com',
      threads: [
        {
          id: 't1',
          messages: [{
            id: 'm1',
            threadId: 't1',
            labelIds: ['INBOX'],
            date: '2026-06-14T12:00:00Z',
            unread: true,
          }],
        },
      ],
      messages: [{
        id: 'm1',
        threadId: 't1',
        labelIds: ['INBOX'],
        date: '2026-06-14T12:00:00Z',
        unread: true,
      }],
    });

    const curIndex = await loadMailIndex({ indexPath: testIndexPath });
    curIndex.messages[0].sanitizedPlainText = 'Body Content';
    curIndex.threads[0].messages[0].sanitizedPlainText = 'Body Content';
    await saveMailIndex(curIndex, { indexPath: testIndexPath });

    const upsert2 = await upsertToMailIndex({
      indexPath: testIndexPath,
      accountEmail: 'owner@example.com',
      threads: [
        {
          id: 't1',
          messages: [{
            id: 'm1',
            threadId: 't1',
            labelIds: ['INBOX'],
            date: '2026-06-14T12:00:00Z',
            unread: false,
          }],
        },
      ],
      messages: [{
        id: 'm1',
        threadId: 't1',
        labelIds: ['INBOX'],
        date: '2026-06-14T12:00:00Z',
        unread: false,
      }],
    });
    const checkMsg = upsert2.messages.find((m) => m.id === 'm1');
    assert.equal(checkMsg.sanitizedPlainText, 'Body Content');
    assert.equal(checkMsg.unread, false);
    assert.equal(checkMsg.accountEmail, 'owner@example.com');
    assert.equal(checkMsg.accountId, 'gmail:owner@example.com');
    assert.equal(upsert2.threads[0].unread, false);
    assert.equal(upsert2.accounts.length, 1);

    // Test 10: query filters, account filter, and privacy-safe default output
    await fs.unlink(testIndexPath).catch(() => {});
    await upsertToMailIndex({
      indexPath: testIndexPath,
      accountEmail: 'a@example.com',
      threads: [
        {
          id: 't1',
          date: '2026-06-14T10:00:00Z',
          labelIds: ['INBOX'],
          subject: 'Alpha',
          messages: [{
            id: 'm1',
            labelIds: ['INBOX'],
            sanitizedPlainText: 'secret-body',
            sanitizedBodyPreview: 'sec...',
          }],
        },
        {
          id: 't2',
          date: '2026-06-14T11:00:00Z',
          labelIds: ['INBOX', 'STARRED'],
          subject: 'Beta',
          messages: [{ id: 'm2', labelIds: ['INBOX', 'STARRED'] }],
        },
        {
          id: 't3',
          date: '2026-06-14T09:00:00Z',
          labelIds: ['SENT'],
          subject: 'Sent',
          messages: [{ id: 'm3', labelIds: ['SENT'] }],
        },
      ],
      messages: [
        { id: 'm1', labelIds: ['INBOX'], sanitizedPlainText: 'secret-body', sanitizedBodyPreview: 'sec...' },
        { id: 'm2', labelIds: ['INBOX', 'STARRED'] },
        { id: 'm3', labelIds: ['SENT'] },
      ],
    });

    const otherAccountIndex = await loadMailIndex({ indexPath: testIndexPath });
    otherAccountIndex.threads[1].accountEmail = 'b@example.com';
    otherAccountIndex.threads[1].accountId = 'gmail:b@example.com';
    await saveMailIndex(otherAccountIndex, { indexPath: testIndexPath });

    const inboxDesc = await queryMailIndex({ indexPath: testIndexPath, labelId: 'INBOX' });
    assert.equal(inboxDesc.total, 2);
    assert.equal(inboxDesc.threads[0].id, 't2');
    assert.equal(inboxDesc.threads[0].messageCount, 1);
    assert.equal(inboxDesc.threads[0].messages, undefined);
    assert.equal(inboxDesc.threads[0].sanitizedBodyPreview, undefined);
    assert.equal(inboxDesc.threads[0].sanitizedPlainText, undefined);

    const withPreview = await queryMailIndex({
      indexPath: testIndexPath,
      labelId: 'INBOX',
      includeBodyPreview: true,
    });
    assert.equal(withPreview.threads.find((t) => t.id === 't1')?.sanitizedBodyPreview, 'sec...');
    assert.equal(withPreview.threads.find((t) => t.id === 't1')?.sanitizedPlainText, undefined);

    const accountFiltered = await queryMailIndex({
      indexPath: testIndexPath,
      labelId: 'INBOX',
      accountEmail: 'a@example.com',
    });
    assert.equal(accountFiltered.total, 1);
    assert.equal(accountFiltered.threads[0].id, 't1');

    const inboxAsc = await queryMailIndex({ indexPath: testIndexPath, labelId: 'INBOX', sort: 'asc' });
    assert.equal(inboxAsc.threads[0].id, 't1');
    assert.equal(inboxAsc.threads[1].id, 't2');

    const paginated = await queryMailIndex({
      indexPath: testIndexPath,
      labelId: 'INBOX',
      limit: 1,
      offset: 1,
    });
    assert.equal(paginated.threads.length, 1);
    assert.equal(paginated.threads[0].id, 't1');

    // Test 11: migrateLegacyMailIndex helper
    const legacy = migrateLegacyMailIndex({ threads: [{ id: 'x', messages: [] }], messages: [] });
    assert.equal(legacy.schemaVersion, 1);
  } finally {
    await removeTestDir(testDir);
  }

  if (realStatBefore) {
    const realStatAfter = await fs.stat(REAL_OPERATOR_MAIL_INDEX_PATH);
    assert.equal(
      realStatAfter.mtimeMs,
      realStatBefore.mtimeMs,
      'operator mail index must not be modified by tests',
    );
  } else {
    await assert.rejects(
      () => fs.access(REAL_OPERATOR_MAIL_INDEX_PATH),
      (err) => err && err.code === 'ENOENT',
    );
  }

  console.log('mail-index: pass');
}

runTests().catch((err) => {
  console.error('mail-index test failed:', err);
  process.exit(1);
});

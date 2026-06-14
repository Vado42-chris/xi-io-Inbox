import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadMailIndex,
  saveMailIndex,
  upsertToMailIndex,
  queryMailIndex,
  MAIL_INDEX_PATH,
  mergeMessage,
  mergeThread,
} from '../lib/local-mail-index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);

async function cleanIndexFile() {
  try {
    await fs.unlink(MAIL_INDEX_PATH);
  } catch {
    // ignore
  }
}

async function runTests() {
  await cleanIndexFile();

  // Test 1: loadMailIndex returns empty when file doesn't exist
  const emptyIndex = await loadMailIndex();
  assert.deepEqual(emptyIndex, { threads: [], messages: [] });

  // Test 2: save and load works
  const sample = {
    threads: [{ id: 't1', messages: [{ id: 'm1', threadId: 't1', labelIds: ['INBOX'] }] }],
    messages: [{ id: 'm1', threadId: 't1', labelIds: ['INBOX'] }],
  };
  await saveMailIndex(sample);
  const loaded = await loadMailIndex();
  assert.deepEqual(loaded, sample);

  // Test 3: mergeMessage preserves body-gate fields
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
    labelIds: ['INBOX', 'UNREAD'], // labels changed/updated
    subject: 'New Subject',
  };
  const mergedMsg = mergeMessage(existingMsg, incomingMsg);
  assert.equal(mergedMsg.sanitizedPlainText, 'Hello redacted world');
  assert.equal(mergedMsg.sanitizedBodyPreview, 'Hello...');
  assert.equal(mergedMsg.bodyAvailable, true);
  assert.equal(mergedMsg.redactionNotes, 'Removed details');
  assert.deepEqual(mergedMsg.labelIds, ['INBOX', 'UNREAD']);
  assert.equal(mergedMsg.subject, 'New Subject');

  // Test 4: mergeThread merges messages correctly
  const existingThread = {
    id: 't1',
    messages: [existingMsg],
  };
  const incomingThread = {
    id: 't1',
    messages: [incomingMsg],
  };
  const mergedThread = mergeThread(existingThread, incomingThread);
  assert.equal(mergedThread.messages.length, 1);
  assert.equal(mergedThread.messages[0].sanitizedPlainText, 'Hello redacted world');
  assert.deepEqual(mergedThread.labelIds, ['INBOX', 'UNREAD']);

  // Test 5: upsertToMailIndex increments index correctly
  await cleanIndexFile();
  const upsert1 = await upsertToMailIndex({
    threads: [
      {
        id: 't1',
        messages: [{ id: 'm1', threadId: 't1', labelIds: ['INBOX'], date: '2026-06-14T12:00:00Z', unread: true }],
      },
    ],
    messages: [{ id: 'm1', threadId: 't1', labelIds: ['INBOX'], date: '2026-06-14T12:00:00Z', unread: true }],
  });
  assert.equal(upsert1.threads.length, 1);
  assert.equal(upsert1.messages.length, 1);

  // Add body gate info to the index message directly
  const curIndex = await loadMailIndex();
  curIndex.messages[0].sanitizedPlainText = 'Body Content';
  curIndex.threads[0].messages[0].sanitizedPlainText = 'Body Content';
  await saveMailIndex(curIndex);

  // Sync again with updated metadata (unread removed)
  const upsert2 = await upsertToMailIndex({
    threads: [
      {
        id: 't1',
        messages: [{ id: 'm1', threadId: 't1', labelIds: ['INBOX'], date: '2026-06-14T12:00:00Z', unread: false }],
      },
    ],
    messages: [{ id: 'm1', threadId: 't1', labelIds: ['INBOX'], date: '2026-06-14T12:00:00Z', unread: false }],
  });
  // Verify body content was NOT lost
  const checkMsg = upsert2.messages.find((m) => m.id === 'm1');
  assert.equal(checkMsg.sanitizedPlainText, 'Body Content');
  assert.equal(checkMsg.unread, false);
  // Verify thread status was updated
  assert.equal(upsert2.threads[0].unread, false);

  // Test 6: queryMailIndex filtering and sorting
  await cleanIndexFile();
  const multipleThreads = [
    { id: 't1', date: '2026-06-14T10:00:00Z', labelIds: ['INBOX'], messages: [{ id: 'm1', labelIds: ['INBOX'] }] },
    { id: 't2', date: '2026-06-14T11:00:00Z', labelIds: ['INBOX', 'STARRED'], messages: [{ id: 'm2', labelIds: ['INBOX', 'STARRED'] }] },
    { id: 't3', date: '2026-06-14T09:00:00Z', labelIds: ['SENT'], messages: [{ id: 'm3', labelIds: ['SENT'] }] },
  ];
  await upsertToMailIndex({ threads: multipleThreads, messages: multipleThreads.map((t) => t.messages[0]) });

  // Query in desc (recent first)
  const inboxDesc = await queryMailIndex({ labelId: 'INBOX' });
  assert.equal(inboxDesc.total, 2);
  assert.equal(inboxDesc.threads[0].id, 't2'); // 11:00 > 10:00
  assert.equal(inboxDesc.threads[1].id, 't1');

  // Query in asc (oldest first)
  const inboxAsc = await queryMailIndex({ labelId: 'INBOX', sort: 'asc' });
  assert.equal(inboxAsc.threads[0].id, 't1');
  assert.equal(inboxAsc.threads[1].id, 't2');

  // Query limit and offset
  const paginated = await queryMailIndex({ labelId: 'INBOX', limit: 1, offset: 1 });
  assert.equal(paginated.threads.length, 1);
  assert.equal(paginated.threads[0].id, 't1');

  // Clean up test file
  await cleanIndexFile();

  console.log('mail-index: pass');
}

runTests().catch((err) => {
  console.error('mail-index test failed:', err);
  process.exit(1);
});

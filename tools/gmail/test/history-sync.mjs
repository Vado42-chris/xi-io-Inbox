import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  collectHistoryMutations,
  isHistoryIdNotFoundError,
} from '../lib/metadata-sync.js';
import {
  createEmptyMailIndex,
  loadMailIndex,
  saveMailIndex,
  upsertToMailIndex,
  removeFromMailIndex,
  setHistoryState,
} from '../lib/local-mail-index.js';

const mutations = collectHistoryMutations([
  {
    messagesAdded: [{ message: { id: 'm1', threadId: 't1' } }],
    labelsAdded: [{ message: { id: 'm2', threadId: 't2' } }],
    messagesDeleted: [{ message: { id: 'm3', threadId: 't3' } }],
  },
]);
assert.deepEqual(mutations.threadIds.sort(), ['t1', 't2']);
assert.deepEqual(mutations.messageIds.sort(), ['m1', 'm2']);
assert.deepEqual(mutations.removedMessageIds, ['m3']);
assert.deepEqual(mutations.removedThreadIds, ['t3']);

assert.equal(isHistoryIdNotFoundError({ code: 404 }), true);
assert.equal(isHistoryIdNotFoundError({ message: 'History not found for startHistoryId' }), true);
assert.equal(isHistoryIdNotFoundError({ message: 'other error' }), false);

const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'history-sync-test-'));
const indexPath = path.join(tempRoot, 'mail-index.json');

try {
  const index = createEmptyMailIndex();
  setHistoryState(index, { lastHistoryId: '12345', lastSyncMode: 'full' });
  assert.equal(index.historyState.lastHistoryId, '12345');
  assert.equal(index.historyState.lastSyncMode, 'full');
  await saveMailIndex(index, { indexPath });

  await upsertToMailIndex({
    indexPath,
    accountEmail: 'sample@example.com',
    threads: [{
      id: 't1',
      messages: [{ id: 'm1', threadId: 't1', labelIds: ['INBOX'], unread: true }],
      messageIds: ['m1'],
      labelIds: ['INBOX'],
      unread: true,
    }],
    messages: [{ id: 'm1', threadId: 't1', labelIds: ['INBOX'], unread: true }],
  });

  await removeFromMailIndex({
    indexPath,
    messageIds: ['m1'],
    threadIds: ['t1'],
  });
  const afterRemove = await loadMailIndex({ indexPath });
  assert.equal(afterRemove.messages.length, 0);
  assert.equal(afterRemove.threads.length, 0);
  assert.equal(afterRemove.historyState.lastHistoryId, '12345');
} finally {
  await fs.rm(tempRoot, { recursive: true, force: true });
}

console.log('history-sync: pass');

import assert from 'node:assert/strict';
import {
  MetadataQueryError,
  metadataListParams,
  resolveSyncLabelJobs,
  shouldStopPagination,
  paginateListParams,
  mergeThreadRows,
  flattenMessagesFromThreads,
  buildMetadataSyncPlan,
  METADATA_SYNC_JOB_PRESETS,
} from '../lib/adapter.js';

assert.throws(
  () => metadataListParams({ query: 'from:test@example.com', maxResults: 10 }),
  MetadataQueryError,
);

const inboxJobs = resolveSyncLabelJobs({ mailbox: 'inbox' });
assert.equal(inboxJobs.length, 1);
assert.deepEqual(inboxJobs[0].labelIds, ['INBOX']);

const presetJobs = resolveSyncLabelJobs({ jobs: ['inbox_recent', 'unread'] });
assert.equal(presetJobs.length, 2);
assert.deepEqual(presetJobs[0].labelIds, ['INBOX']);
assert.deepEqual(presetJobs[1].labelIds, ['UNREAD']);

const plan = buildMetadataSyncPlan({
  labelJobs: presetJobs,
  maxPages: 2,
  maxThreads: 40,
  dryRun: true,
  planOnly: true,
});
assert.equal(plan.mode, 'metadata-only');
assert.equal(plan.qParameter, 'blocked');
assert.equal(plan.bodyRead, 'blocked');
assert.equal(plan.draftWrite, 'blocked');
assert.equal(plan.send, 'blocked');
assert.equal(plan.mutation, 'blocked');
assert.equal(plan.jobs.length, 2);

assert.equal(
  shouldStopPagination({ pagesFetched: 1, maxPages: 1, itemCount: 10, maxItems: 25, nextPageToken: 'tok' }),
  'maxPages',
);
assert.equal(
  shouldStopPagination({ pagesFetched: 0, maxPages: 3, itemCount: 25, maxItems: 25, nextPageToken: 'tok' }),
  'maxItems',
);
assert.equal(
  shouldStopPagination({ pagesFetched: 1, maxPages: 3, itemCount: 10, maxItems: 25, nextPageToken: null }),
  'noNextPageToken',
);

const params = paginateListParams({
  labelIds: ['INBOX'],
  maxResultsPerPage: 25,
  pageToken: 'abc',
  remaining: 10,
});
assert.deepEqual(params, { userId: 'me', labelIds: ['INBOX'], maxResults: 10, pageToken: 'abc' });
assert.equal(Object.hasOwn(params, 'q'), false);

const merged = mergeThreadRows(
  [{ id: 't1', messages: [{ id: 'm1' }] }],
  [{ id: 't1', messages: [{ id: 'm1' }] }, { id: 't2', messages: [{ id: 'm2' }] }],
  5,
);
assert.equal(merged.length, 2);

const messages = flattenMessagesFromThreads([
  { messages: [{ id: 'm1' }, { id: 'm2' }] },
  { messages: [{ id: 'm2' }, { id: 'm3' }] },
], 3);
assert.equal(messages.length, 3);

assert.ok(METADATA_SYNC_JOB_PRESETS.inbox_recent);

console.log('metadata-sync: pass');

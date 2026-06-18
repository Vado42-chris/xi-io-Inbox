export const METADATA_SYNC_JOB_PRESETS = {
  inbox_recent: { labelIds: ['INBOX'], description: 'INBOX recent metadata (default recent-first)' },
  unread: { labelIds: ['UNREAD'], description: 'UNREAD metadata' },
  starred: { labelIds: ['STARRED'], description: 'STARRED metadata' },
  sent_recent: { labelIds: ['SENT'], description: 'SENT recent metadata' },
};

export const DEFAULT_SYNC_LIMITS = {
  maxResultsPerPage: 25,
  maxPages: 1,
  maxThreads: 25,
  maxMessages: 50,
};

export function shouldStopPagination({
  pagesFetched,
  maxPages,
  itemCount,
  maxItems,
  nextPageToken,
}) {
  if (pagesFetched >= maxPages) return 'maxPages';
  if (itemCount >= maxItems) return 'maxItems';
  if (!nextPageToken) return 'noNextPageToken';
  return null;
}

export function buildMetadataSyncPlan({
  accountEmail = null,
  labelJobs,
  maxPages = DEFAULT_SYNC_LIMITS.maxPages,
  maxThreads = DEFAULT_SYNC_LIMITS.maxThreads,
  maxMessages = DEFAULT_SYNC_LIMITS.maxMessages,
  maxResultsPerPage = DEFAULT_SYNC_LIMITS.maxResultsPerPage,
  dryRun = false,
  planOnly = false,
} = {}) {
  return {
    accountEmail,
    mode: 'metadata-only',
    scope: 'gmail.metadata',
    qParameter: 'blocked',
    bodyRead: 'blocked',
    draftWrite: 'blocked',
    send: 'blocked',
    mutation: 'blocked',
    backfillPolicy: 'recent-first label-scoped only; no all-mail default',
    dryRun,
    planOnly,
    limits: { maxPages, maxThreads, maxMessages, maxResultsPerPage },
    jobs: labelJobs.map((job) => ({
      name: job.name,
      labelIds: job.labelIds,
      source: job.source,
      maxPages,
      maxThreads,
    })),
  };
}

export function mergeThreadRows(existing, incoming, maxThreads) {
  const byId = new Map(existing.map((row) => [row.id, row]));
  for (const row of incoming) {
    if (byId.size >= maxThreads) break;
    if (!byId.has(row.id)) byId.set(row.id, row);
  }
  return [...byId.values()];
}

export function flattenMessagesFromThreads(threads, maxMessages) {
  const messages = [];
  const seen = new Set();
  for (const thread of threads) {
    for (const message of thread.messages || []) {
      if (messages.length >= maxMessages) return messages;
      if (seen.has(message.id)) continue;
      seen.add(message.id);
      messages.push(message);
    }
  }
  return messages;
}

export function paginateListParams({
  labelIds,
  maxResultsPerPage,
  pageToken,
  remaining,
}) {
  const params = {
    userId: 'me',
    labelIds,
    maxResults: Math.min(maxResultsPerPage, remaining),
  };
  if (pageToken) params.pageToken = pageToken;
  if (Object.hasOwn(params, 'q')) {
    throw new Error('metadata sync must not include q parameter');
  }
  return params;
}

export function collectHistoryMutations(historyRecords = []) {
  const threadIds = new Set();
  const messageIds = new Set();
  const removedMessageIds = new Set();
  const removedThreadIds = new Set();

  for (const record of historyRecords) {
    for (const bucket of ['messagesAdded', 'labelsAdded', 'labelsRemoved']) {
      for (const entry of record[bucket] || []) {
        if (entry.message?.id) messageIds.add(entry.message.id);
        if (entry.message?.threadId) threadIds.add(entry.message.threadId);
      }
    }
    for (const entry of record.messagesDeleted || []) {
      if (entry.message?.id) removedMessageIds.add(entry.message.id);
    }
  }

  return {
    threadIds: [...threadIds],
    messageIds: [...messageIds],
    removedMessageIds: [...removedMessageIds],
    removedThreadIds: [...removedThreadIds],
  };
}

export function isHistoryIdNotFoundError(err) {
  const status = err?.code || err?.response?.status;
  const message = String(err?.message || err?.errors?.[0]?.message || '');
  return status === 404
    || /history.*not found/i.test(message)
    || /startHistoryId/i.test(message);
}

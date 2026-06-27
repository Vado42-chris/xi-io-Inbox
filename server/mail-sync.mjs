import { runHistorySync, runMetadataSync } from '../tools/gmail/lib/adapter.js';
import { bodyGateStatus } from '../tools/gmail/lib/body-gate.js';
import { loadMailIndex } from '../tools/gmail/lib/local-mail-index.js';
import { buildSyncStatus } from '../tools/gmail/lib/sync-status.js';
import { loadToken } from '../tools/gmail/lib/token-store.js';

const DEFAULT_SYNC_OPTIONS = {
  jobs: ['inbox_recent'],
  maxPages: 10,
  maxThreads: 500,
  maxMessages: 50,
};

let syncBusy = false;
let lastCheckedAt = null;
let lastSyncMode = null;
let lastError = null;
let lastIngressEvent = null;

export function getMailSyncState() {
  return {
    busy: syncBusy,
    lastCheckedAt,
    lastSyncMode,
    lastError,
    lastIngressEvent,
  };
}

export async function isGmailConnected() {
  const token = await loadToken();
  return Boolean(token?.access_token || token?.refresh_token);
}

export async function resolveSyncMode() {
  const connected = await isGmailConnected();
  if (!connected) return 'none';
  const index = await loadMailIndex().catch(() => null);
  if (index?.historyState?.lastHistoryId) return 'history';
  return 'metadata';
}

export async function resolveConnectionState() {
  const connected = await isGmailConnected();
  const syncState = getMailSyncState();
  const index = await loadMailIndex().catch(() => null);
  const indexThreadCount = index?.threads?.length || 0;

  if (syncState.busy) return 'syncing_metadata';
  if (!connected) {
    if (indexThreadCount > 0) return 'cached_offline';
    return 'disconnected';
  }
  if (syncState.lastError) return 'sync_error';
  if (syncState.lastCheckedAt || indexThreadCount > 0) return 'connected_fresh';
  return 'connecting';
}

export async function runMailIngressSync({ reason = 'interval' } = {}) {
  if (syncBusy) return { ok: false, skipped: true, reason: 'busy' };

  const connected = await isGmailConnected();
  const syncMode = await resolveSyncMode();
  if (!connected) {
    if (reason === 'manual_repair') {
      lastError = 'OAuth token missing. Connect Gmail before sync.';
      return { ok: false, skipped: true, reason: 'not-connected', error: lastError };
    }
    return { ok: false, skipped: true, reason: 'not-connected' };
  }
  if (syncMode === 'none') {
    return { ok: false, skipped: true, reason: 'not-connected' };
  }

  syncBusy = true;
  lastError = null;
  let activeMode = syncMode;

  try {
    let result;
    if (activeMode === 'history') {
      result = await runHistorySync(DEFAULT_SYNC_OPTIONS);
      if (!result.success && reason === 'manual_repair') {
        activeMode = 'metadata';
        result = await runMetadataSync(DEFAULT_SYNC_OPTIONS);
      }
    } else {
      activeMode = 'metadata';
      result = await runMetadataSync(DEFAULT_SYNC_OPTIONS);
    }

    if (!result.success) {
      lastError = result.error || 'Mail ingress sync failed';
      return { ok: false, error: lastError, reason, syncMode: activeMode };
    }

    lastCheckedAt = new Date().toISOString();
    lastSyncMode = activeMode;
    const index = await loadMailIndex().catch(() => null);
    const event = {
      type: 'mail_updated',
      reason,
      syncMode: activeMode,
      threadCount: index?.threads?.length || 0,
      checkedAt: lastCheckedAt,
    };
    lastIngressEvent = event;
    if (connected) {
      const { syncGmailAccountLabels } = await import('./account-labels.mjs');
      await syncGmailAccountLabels().catch(() => {});
    }
    return { ok: true, ...event };
  } catch (error) {
    lastError = String(error?.message || error || 'Mail ingress sync failed');
    return { ok: false, error: lastError, reason, syncMode: activeMode };
  } finally {
    syncBusy = false;
  }
}

export async function buildMailStatusPayload() {
  const status = await buildSyncStatus();
  const syncState = getMailSyncState();
  const connected = await isGmailConnected();
  const token = await loadToken();
  const gate = bodyGateStatus({ token, secretsConfigured: true, connected });
  const index = await loadMailIndex().catch(() => null);
  const connectionState = await resolveConnectionState();
  const indexUpdatedAt = index?.updatedAt || status.artifacts?.mailIndex?.updatedAt || null;
  const lastSyncAt = syncState.lastCheckedAt || status.lastSync?.at || null;
  const { buildAccountLabelsPayload } = await import('./account-labels.mjs');
  const accountLabels = await buildAccountLabelsPayload();
  const hydrationState = !connected
    ? 'body_hydration_blocked'
    : gate.bodyReadAllowed
      ? 'body_hydration_available'
      : 'body_hydration_blocked';

  return {
    mode: 'local-web-runtime',
    connected,
    connectionState,
    indexUpdatedAt,
    hydrationState,
    accountLabels: {
      syncState: accountLabels.syncState,
      lastLabelSyncAt: accountLabels.lastLabelSyncAt,
      lastLabelSyncError: accountLabels.lastLabelSyncError,
      labelCount: accountLabels.labelCount,
    },
    oauth: status.oauth,
    lastSync: {
      ...status.lastSync,
      at: lastSyncAt,
    },
    artifacts: status.artifacts,
    gates: {
      bodyRead: gate.bodyReadAllowed ? 'on_demand' : 'blocked',
      bodyReadBlockedReason: gate.bodyReadBlockedReason,
      draftWrite: 'blocked',
      send: 'blocked',
      mutation: 'blocked',
    },
    bodyGate: gate,
    lastCheckedAt: syncState.lastCheckedAt || lastSyncAt,
    lastSyncMode: syncState.lastSyncMode || status.artifacts?.mailIndex?.historyState?.lastSyncMode || null,
    backgroundRefreshOn: connected,
    lastError: connected ? syncState.lastError : null,
    lastIngressEvent: syncState.lastIngressEvent,
  };
}

export async function buildMailAccountsPayload() {
  const index = await loadMailIndex().catch(() => null);
  const email = index?.accounts?.[0]?.accountEmail || null;
  if (!email) {
    return { accounts: [], connected: await isGmailConnected() };
  }
  return {
    connected: await isGmailConnected(),
    accounts: [{
      accountId: `gmail-${email.replace(/[^a-z0-9]+/gi, '-')}`,
      email,
      displayName: email,
      providerId: 'gmail',
      syncState: 'metadata_index',
    }],
  };
}

export async function buildMailThreadsPayload({ max = 500, label, mailbox } = {}) {
  const index = await loadMailIndex().catch(() => null);
  if (!index) {
    return { index: null, threads: [], threadCount: 0 };
  }
  let threads = index.threads || [];
  if (label) {
    const labelUpper = String(label).toUpperCase();
    threads = threads.filter((thread) => (thread.labelIds || []).map((id) => String(id).toUpperCase()).includes(labelUpper));
  }
  if (mailbox === 'inbox') {
    threads = threads.filter((thread) => (thread.labelIds || []).map((id) => String(id).toUpperCase()).includes('INBOX'));
  }
  threads = threads.slice(0, Number(max) || 500);
  return {
    index,
    threads,
    threadCount: threads.length,
    totalThreadCount: index.threads?.length || 0,
  };
}

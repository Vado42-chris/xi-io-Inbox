import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadToken } from './token-store.js';
import { SNAPSHOT_PATH, BODY_SNAPSHOT_PATH } from './local-data.js';
import {
  loadMailIndex,
  MailIndexError,
  MAIL_INDEX_RECOVERY_HINT,
  resolveMailIndexPath,
} from './local-mail-index.js';
import { readSyncReceiptEvents } from './receipts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);
const DATA_DIR = path.join(ROOT, 'data');

export const SYNC_STATUS_SCHEMA_VERSION = 1;

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveClientSecretsPath() {
  const candidates = [
    process.env.GMAIL_OAUTH_CLIENT_JSON,
    path.join(DATA_DIR, 'credentials.json'),
    path.join(ROOT, 'credentials.json'),
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate;
  }
  return null;
}

async function readJsonIfPresent(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function gateStatus(bodyReadAllowed) {
  return {
    bodyRead: bodyReadAllowed ? 'gated' : 'blocked',
    draftWrite: 'blocked',
    send: 'blocked',
    mutation: 'blocked',
  };
}

function summarizeLastSync(syncReceipts) {
  const successEvents = new Set(['completed', 'historyComplete']);
  const failedEvents = new Set(['failed', 'historyFailed']);
  const completed = syncReceipts.find((entry) => successEvents.has(entry.event) && !entry.details?.dryRun);
  const failed = syncReceipts.find((entry) => failedEvents.has(entry.event));
  const source = failed && (!completed || failed.at > completed.at) ? failed : completed;
  if (!source) {
    return {
      at: null,
      pagesFetched: null,
      threadCount: null,
      messageCount: null,
      stoppedReason: null,
      jobs: null,
      event: null,
      syncMode: null,
      startHistoryId: null,
      endHistoryId: null,
    };
  }
  return {
    at: source.at || null,
    pagesFetched: source.details?.pagesFetched ?? null,
    threadCount: source.details?.threadCount ?? null,
    messageCount: source.details?.messageCount ?? null,
    stoppedReason: source.details?.stoppedReason ?? source.details?.reason ?? null,
    jobs: source.details?.job ? String(source.details.job).split(',').filter(Boolean) : null,
    event: source.event,
    syncMode: source.event === 'historyComplete' ? 'incremental' : (source.details?.job === 'history_incremental' ? 'incremental' : 'full'),
    startHistoryId: source.details?.startHistoryId ?? null,
    endHistoryId: source.details?.endHistoryId ?? null,
    success: source.success !== false,
    error: source.error || null,
  };
}

/**
 * Build a privacy-safe local Gmail sync status model from adapter artifacts.
 */
export async function buildSyncStatus() {
  const secretsConfigured = Boolean(await resolveClientSecretsPath());
  const token = await loadToken();
  const tokenPresent = Boolean(token?.access_token || token?.refresh_token);
  let oauthStatus = 'unknown';
  if (!secretsConfigured) oauthStatus = 'disconnected';
  else if (!tokenPresent) oauthStatus = 'disconnected';
  else oauthStatus = 'connected';

  const metadataSnapshotPresent = await pathExists(SNAPSHOT_PATH);
  const metadataSnapshot = metadataSnapshotPresent ? await readJsonIfPresent(SNAPSHOT_PATH) : null;
  const mailIndexPath = resolveMailIndexPath();
  const mailIndexPresent = await pathExists(mailIndexPath);
  let mailIndexSummary = {
    present: mailIndexPresent,
    path: mailIndexPath,
    threadCount: null,
    messageCount: null,
    updatedAt: null,
    accountEmails: [],
  };
  if (mailIndexPresent) {
    try {
      const index = await loadMailIndex({ indexPath: mailIndexPath });
      mailIndexSummary = {
        present: true,
        path: mailIndexPath,
        threadCount: index.threads?.length ?? 0,
        messageCount: index.messages?.length ?? 0,
        updatedAt: index.updatedAt || null,
        accountEmails: [...new Set((index.accounts || []).map((entry) => entry.accountEmail).filter(Boolean))],
        historyState: index.historyState
          ? {
            lastHistoryId: index.historyState.lastHistoryId || null,
            updatedAt: index.historyState.updatedAt || null,
            lastSyncMode: index.historyState.lastSyncMode || null,
          }
          : null,
      };
    } catch (err) {
      mailIndexSummary = {
        present: true,
        path: mailIndexPath,
        threadCount: null,
        messageCount: null,
        updatedAt: null,
        accountEmails: [],
        corrupt: true,
        error: err instanceof MailIndexError ? err.message : String(err.message || err),
      };
    }
  }

  const syncReceipts = await readSyncReceiptEvents({ limit: 40 });
  const lastSync = summarizeLastSync(syncReceipts);
  const bodySnapshotPresent = await pathExists(BODY_SNAPSHOT_PATH);

  const liveProofStatus = !secretsConfigured
    ? 'secrets_missing'
    : !tokenPresent
      ? 'not_reconnected'
      : lastSync.at
        ? 'local_receipts_present'
        : 'deferred';

  return {
    schemaVersion: SYNC_STATUS_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    source: 'local-gmail-cli',
    mode: 'sync-status',
    browserOAuth: false,
    oauth: {
      connected: tokenPresent,
      secretsConfigured,
      status: oauthStatus,
      tokenPresent,
      tokenStorage: 'tools/gmail/data/token.json (gitignored)',
    },
    artifacts: {
      metadataSnapshot: {
        present: metadataSnapshotPresent,
        path: SNAPSHOT_PATH,
        accountEmail: metadataSnapshot?.accountEmail || null,
        threadCount: metadataSnapshot?.threads?.length ?? null,
        messageCount: metadataSnapshot?.messages?.length ?? null,
        mode: metadataSnapshot?.mode || null,
      },
      mailIndex: mailIndexSummary,
      readonlyBodySnapshot: {
        present: bodySnapshotPresent,
        path: BODY_SNAPSHOT_PATH,
      },
    },
    lastSync,
    gates: gateStatus(false),
    liveProof: {
      status: liveProofStatus,
      note: liveProofStatus === 'not_reconnected'
        ? 'Operator reconnect required: cd tools/gmail && node cli.js connect'
        : 'Live Gmail browser OAuth is not used in preview. CLI sync receipts are local-only.',
    },
    syncReceipts,
    warnings: [
      'Sync status is local-only. Browser preview does not perform OAuth or live Gmail sync.',
      'JSON mail index is a bridge scaffold — not final storage architecture.',
      mailIndexSummary.corrupt ? MAIL_INDEX_RECOVERY_HINT : null,
    ].filter(Boolean),
    blockedCapabilities: ['body_read', 'draft_write', 'send', 'provider_mutation', 'browser_oauth'],
    nextOperatorAction: !secretsConfigured
      ? 'Add OAuth client JSON under tools/gmail/data/ then run: node cli.js connect'
      : !tokenPresent
        ? 'Run: cd tools/gmail && node cli.js connect'
        : !lastSync.at
          ? 'Run: cd tools/gmail && node cli.js sync-metadata --job inbox_recent --max-pages 1 --max 25'
          : lastSync.event === 'completed' && mailIndexSummary.historyState?.lastHistoryId
            ? 'Run: node cli.js sync-history --max-pages 1 --max 25, then sync-status --out data/gmail-sync-status.local.json'
            : 'Run: node cli.js sync-status --out data/gmail-sync-status.local.json and import into preview Settings',
  };
}

export async function writeSyncStatusFile(outputPath) {
  const status = await buildSyncStatus();
  const targetPath = path.resolve(outputPath);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, `${JSON.stringify(status, null, 2)}\n`, 'utf8');
  return { path: targetPath, status };
}

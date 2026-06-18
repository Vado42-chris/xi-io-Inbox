import fs from 'fs';
import path from 'path';
import { resolveReceiptsDir } from './runtime-paths.js';

const RECEIPTS_DIR = resolveReceiptsDir();

function ensureDir() {
  if (!fs.existsSync(RECEIPTS_DIR)) fs.mkdirSync(RECEIPTS_DIR, { recursive: true });
}

export function writeReceipt({ method, success, blocked, error, event = null, details = null }) {
  ensureDir();
  const id = `receipt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const row = {
    id,
    at: new Date().toISOString(),
    method,
    success,
    blocked,
    error: error || null,
    note: 'Local only. No tokens or private payloads stored in receipt files.',
  };
  if (event) row.event = event;
  if (details && typeof details === 'object') row.details = details;
  fs.writeFileSync(path.join(RECEIPTS_DIR, `${id}.json`), `${JSON.stringify(row, null, 2)}\n`, 'utf8');
  return id;
}

const SYNC_RECEIPT_DETAIL_KEYS = new Set([
  'labelIds', 'job', 'page', 'pagesFetched', 'threadCount', 'messageCount',
  'stoppedReason', 'dryRun', 'planOnly', 'nextPageTokenPresent', 'jobName',
  'startHistoryId', 'endHistoryId', 'historyRecords', 'reason',
]);

const SYNC_RECEIPT_EVENTS = new Set([
  'planned',
  'started',
  'pageFetched',
  'labelComplete',
  'paused',
  'completed',
  'failed',
  'bodyWithheld',
  'draftWriteBlocked',
  'sendBlocked',
  'mutationBlocked',
  'historyStarted',
  'historyPageFetched',
  'historyComplete',
  'historyFallback',
  'historyFailed',
]);

function sanitizeSyncReceipt(row) {
  return {
    id: row.id,
    at: row.at,
    event: row.event,
    method: row.method,
    success: row.success !== false,
    blocked: Boolean(row.blocked),
    error: row.error || null,
    details: row.details && typeof row.details === 'object'
      ? Object.fromEntries(Object.entries(row.details).filter(([key]) => SYNC_RECEIPT_DETAIL_KEYS.has(key)))
      : null,
  };
}

export async function readSyncReceiptEvents({ limit = 50 } = {}) {
  let files = [];
  try {
    files = fs.readdirSync(RECEIPTS_DIR).filter((name) => name.endsWith('.json'));
  } catch {
    return [];
  }

  const rows = [];
  for (const name of files) {
    try {
      const raw = fs.readFileSync(path.join(RECEIPTS_DIR, name), 'utf8');
      const row = JSON.parse(raw);
      if (!row?.method?.startsWith('gmail.metadataSync.') && !SYNC_RECEIPT_EVENTS.has(row?.event)) continue;
      rows.push(sanitizeSyncReceipt({
        id: row.id || name.replace(/\.json$/, ''),
        at: row.at,
        event: row.event || row.method?.split('.').pop(),
        method: row.method,
        success: row.success,
        blocked: row.blocked,
        error: row.error,
        details: row.details,
      }));
    } catch {
      // ignore corrupt receipt files in summary
    }
  }

  rows.sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')));
  return rows.slice(0, limit);
}

export function writeSyncReceipt({ event, success = true, blocked = false, error = null, details = {} }) {
  const safeDetails = {};
  for (const [key, value] of Object.entries(details || {})) {
    if (SYNC_RECEIPT_DETAIL_KEYS.has(key)) safeDetails[key] = value;
  }
  return writeReceipt({
    method: `gmail.metadataSync.${event}`,
    event,
    success,
    blocked,
    error,
    details: safeDetails,
  });
}

import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { loadToken } from '../tools/gmail/lib/token-store.js';

const require = createRequire(import.meta.url);
const { google: googleApis } = require(path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../tools/gmail/node_modules/googleapis',
));

const SYSTEM_LABEL_IDS = new Set([
  'INBOX', 'UNREAD', 'SENT', 'DRAFT', 'SPAM', 'TRASH', 'STARRED', 'IMPORTANT',
  'CATEGORY_PERSONAL', 'CATEGORY_SOCIAL', 'CATEGORY_PROMOTIONS', 'CATEGORY_UPDATES', 'CATEGORY_FORUMS',
]);

let labelSyncBusy = false;
let lastLabelSyncAt = null;
let lastLabelSyncError = null;
let labelSyncState = 'labels_pending';

export function accountLabelsPath() {
  return path.join(process.env.GMAIL_ADAPTER_DATA_DIR, 'account-labels.json');
}

async function getOAuthGmail() {
  const secretsPath = process.env.GMAIL_OAUTH_CLIENT_PATH;
  if (!secretsPath) throw new Error('GMAIL_OAUTH_CLIENT_PATH not configured');
  const raw = await fs.readFile(secretsPath, 'utf8');
  const installed = JSON.parse(raw).installed || JSON.parse(raw).web;
  const redirectUri = process.env.XIIO_GMAIL_OAUTH_REDIRECT_URI
    || `http://${process.env.XIIO_LOCAL_WEB_HOST || '127.0.0.1'}:${process.env.XIIO_LOCAL_WEB_PORT || 8788}/api/gmail/oauth/callback`;
  const oauth2 = new googleApis.auth.OAuth2(installed.client_id, installed.client_secret, redirectUri);
  const token = await loadToken();
  oauth2.setCredentials(token);
  return googleApis.gmail({ version: 'v1', auth: oauth2 });
}

export async function loadAccountLabelsFile() {
  try {
    const raw = await fs.readFile(accountLabelsPath(), 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function syncGmailAccountLabels() {
  if (labelSyncBusy) return { ok: false, skipped: true, reason: 'busy' };
  const token = await loadToken();
  const connected = Boolean(token?.access_token || token?.refresh_token);
  if (!connected) {
    labelSyncState = 'labels_pending';
    return { ok: false, skipped: true, reason: 'not-connected' };
  }

  labelSyncBusy = true;
  lastLabelSyncError = null;
  try {
    const gmail = await getOAuthGmail();
    const listRes = await gmail.users.labels.list({ userId: 'me' });
    const rawLabels = listRes.data.labels || [];
    const labels = [];

    for (const label of rawLabels) {
      const entry = {
        id: label.id,
        providerLabelId: label.id,
        name: label.name,
        displayName: label.name,
        type: label.type || 'user',
        system: label.type === 'system' || SYSTEM_LABEL_IDS.has(String(label.id).toUpperCase()),
        messageListVisibility: label.messageListVisibility || null,
        labelListVisibility: label.labelListVisibility || null,
        messagesTotal: null,
        messagesUnread: null,
        threadsTotal: null,
        threadsUnread: null,
      };

      if (entry.system || String(label.type).toLowerCase() === 'user') {
        try {
          const detail = await gmail.users.labels.get({ userId: 'me', id: label.id });
          entry.messagesTotal = detail.data.messagesTotal ?? null;
          entry.messagesUnread = detail.data.messagesUnread ?? null;
          entry.threadsTotal = detail.data.threadsTotal ?? null;
          entry.threadsUnread = detail.data.threadsUnread ?? null;
        } catch {
          // Count unavailable for this label — keep list entry without counts.
        }
      }

      labels.push(entry);
    }

    const payload = {
      schemaVersion: 1,
      updatedAt: new Date().toISOString(),
      source: 'local-web-runtime',
      syncState: 'labels_synced',
      labels,
    };
    await fs.writeFile(accountLabelsPath(), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    lastLabelSyncAt = payload.updatedAt;
    labelSyncState = 'labels_synced';
    return { ok: true, labelCount: labels.length, updatedAt: lastLabelSyncAt };
  } catch (error) {
    lastLabelSyncError = String(error?.message || error || 'Label sync failed');
    labelSyncState = 'label_sync_error';
    return { ok: false, error: lastLabelSyncError };
  } finally {
    labelSyncBusy = false;
  }
}

export function getAccountLabelSyncState() {
  return {
    busy: labelSyncBusy,
    syncState: labelSyncState,
    lastLabelSyncAt,
    lastLabelSyncError,
  };
}

export async function buildAccountLabelsPayload() {
  const file = await loadAccountLabelsFile();
  const syncMeta = getAccountLabelSyncState();
  return {
    ok: Boolean(file?.labels?.length),
    labels: file?.labels || [],
    updatedAt: file?.updatedAt || syncMeta.lastLabelSyncAt,
    syncState: file?.syncState || syncMeta.syncState,
    lastLabelSyncAt: syncMeta.lastLabelSyncAt,
    lastLabelSyncError: syncMeta.lastLabelSyncError,
    labelCount: file?.labels?.length || 0,
  };
}

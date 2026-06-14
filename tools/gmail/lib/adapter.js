import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import { envelope, blocked } from './response.js';
import { loadToken, saveToken, wipeToken } from './token-store.js';
import { wipeLocalAdapterData, SNAPSHOT_PATH, BODY_SNAPSHOT_PATH } from './local-data.js';
import {
  CONNECT_TIMEOUT_MS,
  DEFAULT_LOOPBACK_HOST,
  DEFAULT_LOOPBACK_PORT,
  connectTimeoutMessage,
  connectPortInUseMessage,
  generateOAuthState,
  isOAuthCallbackProbe,
  resolveLoopbackFromRedirectUri,
  validateOAuthState,
} from './oauth-loopback.js';
import { validateMetadataSnapshot } from './snapshot-schema.js';
import {
  ACCESS_MODES,
  assertBodyReadAllowed,
  blockedBodyRead,
  bodyGateStatus,
  bodyReadBlockedReason,
  getAccessMode,
  getRequestedScopes,
  READONLY_SCOPE,
} from './body-gate.js';
import {
  extractBodyFromPayload,
  redactBodyContent,
  redactBodySnapshot,
} from './body-redaction.js';
import { validateReadonlyBodySnapshot } from './body-snapshot-schema.js';
import { writeSyncReceipt } from './receipts.js';
import { buildSyncStatus, writeSyncStatusFile } from './sync-status.js';
import {
  METADATA_SYNC_JOB_PRESETS,
  DEFAULT_SYNC_LIMITS,
  buildMetadataSyncPlan,
  mergeThreadRows,
  flattenMessagesFromThreads,
  paginateListParams,
} from './metadata-sync.js';
import {
  loadMailIndex,
  saveMailIndex,
  upsertToMailIndex,
  queryMailIndex,
} from './local-mail-index.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const LOOPBACK_HOST = DEFAULT_LOOPBACK_HOST;
const LOOPBACK_PORT = DEFAULT_LOOPBACK_PORT;

const BLOCKED_METHODS = new Set([
  'gmail.drafts.create',
  'gmail.drafts.update',
  'gmail.drafts.send',
  'gmail.users.messages.send',
  'gmail.users.messages.modify',
  'gmail.users.messages.trash',
  'gmail.users.messages.delete',
  'gmail.users.drafts.create',
  'gmail.users.drafts.update',
  'gmail.users.drafts.send',
]);

const METADATA_HEADERS = ['Subject', 'From', 'To', 'Date'];

const METADATA_QUERY_LABELS = {
  inbox: 'INBOX',
  sent: 'SENT',
  trash: 'TRASH',
  spam: 'SPAM',
  draft: 'DRAFT',
  drafts: 'DRAFT',
  starred: 'STARRED',
  important: 'IMPORTANT',
};

export const METADATA_MAILBOX_ALIASES = Object.keys(METADATA_QUERY_LABELS);

export class MetadataQueryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MetadataQueryError';
  }
}

function snapshotExportSummary({ outputPath, snapshot, extra = {}, includePayload = false }) {
  return {
    outputPath,
    threadCount: snapshot.threads?.length || 0,
    messageCount: snapshot.messages?.length || 0,
    labelCount: snapshot.labels?.length || 0,
    warnings: snapshot.warnings || [],
    ...extra,
    ...(includePayload ? { snapshot } : {}),
  };
}

/** Gmail metadata scope rejects search `q`; map safe in:<label> aliases to labelIds only. */
export function metadataListParams({ query, maxResults = 10, labelIds } = {}) {
  const params = { userId: 'me', maxResults };
  if (labelIds?.length) {
    params.labelIds = labelIds;
    return params;
  }
  const normalized = String(query ?? '').trim().toLowerCase();
  if (!normalized) {
    params.labelIds = ['INBOX'];
    return params;
  }
  const inMatch = /^in:([a-z_]+)$/.exec(normalized);
  if (!inMatch) {
    throw new MetadataQueryError(
      `General Gmail search is unavailable under gmail.metadata scope (no q parameter). Unsupported query: "${query}". Use explicit labelIds, --label LABEL_ID, or --mailbox inbox|sent|trash|spam|starred|important.`,
    );
  }
  const alias = inMatch[1];
  const label = METADATA_QUERY_LABELS[alias];
  if (!label) {
    throw new MetadataQueryError(
      `Unsupported in: alias "${alias}" under gmail.metadata scope. Allowed mailboxes: ${METADATA_MAILBOX_ALIASES.join(', ')}.`,
    );
  }
  params.labelIds = [label];
  return params;
}

function headersMap(payload) {
  return Object.fromEntries((payload?.headers || []).map((h) => [h.name, h.value]));
}

function messageMetadataFromApi(message) {
  const headers = headersMap(message.payload);
  const labelIds = message.labelIds || [];
  return {
    id: message.id,
    threadId: message.threadId,
    labelIds,
    subject: headers.Subject || '',
    from: headers.From || '',
    to: headers.To || '',
    date: headers.Date || (message.internalDate ? new Date(Number(message.internalDate)).toISOString() : ''),
    unread: labelIds.includes('UNREAD'),
    snippet: message.snippet || '',
    provider: 'gmail-metadata',
  };
}

function defaultClientSecretsPath() {
  return path.resolve(ROOT, '../../secrets/gmail-oauth-client.json');
}

export async function resolveClientSecretsPath() {
  const configured = process.env.GMAIL_OAUTH_CLIENT_PATH;
  const candidate = configured ? path.resolve(configured) : defaultClientSecretsPath();
  try {
    await fs.access(candidate);
    return candidate;
  } catch {
    return null;
  }
}

async function loadOAuthClient() {
  const { oauth2 } = await loadOAuthClientBundle();
  return oauth2;
}

async function loadOAuthClientBundle() {
  const secretsPath = await resolveClientSecretsPath();
  if (!secretsPath) {
    throw new Error('OAuth client secrets missing. Place JSON at secrets/gmail-oauth-client.json (gitignored) or set GMAIL_OAUTH_CLIENT_PATH.');
  }
  const raw = await fs.readFile(secretsPath, 'utf8');
  const config = JSON.parse(raw);
  const installed = config.installed || config.web;
  if (!installed?.client_id || !installed?.client_secret) {
    throw new Error('Invalid OAuth client JSON. Expected installed or web client with client_id and client_secret.');
  }
  const redirectUri = installed.redirect_uris?.[0]
    || `http://${LOOPBACK_HOST}:${LOOPBACK_PORT}/oauth2callback`;
  const loopback = resolveLoopbackFromRedirectUri(redirectUri, process.env.GMAIL_OAUTH_PORT);
  const oauth2 = new google.auth.OAuth2(installed.client_id, installed.client_secret, loopback.redirectUri);
  const tokens = await loadToken();
  if (tokens) oauth2.setCredentials(tokens);
  return { oauth2, loopback, warnings: loopback.warnings };
}

async function getGmail() {
  const auth = await loadOAuthClient();
  return google.gmail({ version: 'v1', auth });
}

export function guardMethod(name) {
  if (BLOCKED_METHODS.has(name)) {
    return blocked(name, `${name} blocked in metadata/read-only adapter (draft write, send, mutation)`);
  }
  if (name === 'gmail.messages.getBody' || name === 'gmail.messages.get') {
    const token = null;
    const reason = bodyReadBlockedReason({ token, connected: false });
    return envelope({
      success: false,
      blocked: true,
      providerGate: reason || 'Body read blocked',
      method: name,
      error: reason || 'Body read blocked',
    });
  }
  return null;
}

export async function providerStatus() {
  const secretsPath = await resolveClientSecretsPath();
  const token = await loadToken();
  const connected = Boolean(token?.access_token || token?.refresh_token);
  const gate = bodyGateStatus({ token, secretsConfigured: Boolean(secretsPath), connected });
  return envelope({
    success: true,
    method: 'provider.status',
    token,
    payload: {
      connected,
      secretsConfigured: Boolean(secretsPath),
      tokenStorage: 'tools/gmail/data/token.json (gitignored)',
      accessMode: gate.accessMode,
      bodyReadAllowed: gate.bodyReadAllowed,
      bodyReadBlockedReason: gate.bodyReadBlockedReason,
      bodiesBlocked: !gate.bodyReadAllowed,
      sendBlocked: true,
      draftWriteBlocked: true,
      mutationBlocked: true,
      bodyGate: gate,
    },
  });
}

export async function providerSyncStatus({ outputPath } = {}) {
  if (outputPath) {
    const written = await writeSyncStatusFile(outputPath);
    return envelope({
      success: true,
      method: 'gmail.syncStatus.write',
      payload: {
        path: written.path,
        status: written.status,
      },
    });
  }
  const status = await buildSyncStatus();
  return envelope({
    success: true,
    method: 'gmail.syncStatus',
    payload: status,
  });
}

export async function providerConnectStart() {
  const { oauth2, loopback, warnings } = await loadOAuthClientBundle();
  const expectedState = generateOAuthState();
  const scopes = getRequestedScopes();
  const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    state: expectedState,
  });

  return new Promise((resolve, reject) => {
    let settled = false;
    let timeoutId = null;
    let finish;

    finish = (err, result) => {
      if (settled) return;
      settled = true;
      if (timeoutId) clearTimeout(timeoutId);
      server.close(() => {
        if (err) reject(err);
        else resolve(result);
      });
    };

    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url, `http://${loopback.host}:${loopback.port}`);
        if (url.pathname !== loopback.pathname) {
          if (!res.headersSent) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Not found');
          }
          return;
        }

        if (isOAuthCallbackProbe(url.searchParams)) {
          if (!res.headersSent) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<p>Waiting for OAuth callback from Google. Complete approval in the browser tab opened by <code>node cli.js connect</code>. Do not open this URL manually.</p>');
          }
          return;
        }

        const oauthError = url.searchParams.get('error');
        if (oauthError) {
          if (!res.headersSent) {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<p>OAuth denied: ${oauthError}. Restart connect after fixing consent or redirect URI.</p>`);
          }
          finish(new Error(`OAuth denied: ${oauthError}`));
          return;
        }

        const stateCheck = validateOAuthState(url.searchParams.get('state'), expectedState);
        if (!stateCheck.ok) {
          if (!res.headersSent) {
            res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<p>${stateCheck.reason}</p>`);
          }
          finish(new Error(stateCheck.reason));
          return;
        }

        const code = url.searchParams.get('code');
        if (!code) {
          if (!res.headersSent) {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<p>OAuth callback missing authorization code. Complete browser approval and retry connect.</p>');
          }
          finish(new Error('OAuth callback missing authorization code.'));
          return;
        }

        const { tokens } = await oauth2.getToken(code);
        await saveToken(tokens);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<p>Gmail metadata connect complete. You may close this window.</p>');
        finish(null, envelope({
          success: true,
          method: 'provider.connect.callback',
          payload: {
            connected: true,
            scopes,
            accessMode: getAccessMode(),
            callback: loopback.redirectUri,
            warnings,
          },
        }));
      } catch (err) {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<p>OAuth token exchange failed. Check client JSON, redirect URI, and callback port, then retry connect.</p>');
        }
        finish(err);
      }
    });

    server.on('error', (err) => {
      if (err?.code === 'EADDRINUSE') {
        finish(new Error(connectPortInUseMessage(loopback)));
        return;
      }
      finish(err);
    });

    timeoutId = setTimeout(() => {
      finish(new Error(connectTimeoutMessage(loopback)));
    }, CONNECT_TIMEOUT_MS);

    server.listen(loopback.port, loopback.host, () => {
      for (const warning of warnings) {
        console.error(`warning: ${warning}`);
      }
      console.error(`Open this URL in your browser:\n${authUrl}`);
      console.error(`Waiting for OAuth callback on ${loopback.redirectUri}`);
      console.error(`Connect timeout: ${Math.round(CONNECT_TIMEOUT_MS / 1000)}s (override with GMAIL_OAUTH_TIMEOUT_MS)`);
    });
  });
}

export async function providerDisconnect() {
  await wipeToken();
  return envelope({
    success: true,
    method: 'provider.disconnect',
    payload: { connected: false },
  });
}

export async function providerWipeLocalData({ dryRun = false } = {}) {
  const wipeResult = await wipeLocalAdapterData({ dryRun });
  return envelope({
    success: true,
    method: 'provider.wipeLocalData',
    payload: {
      dryRun,
      wiped: !dryRun,
      removed: wipeResult.removed,
      paths: wipeResult.paths,
      note: 'Wipes token, metadata snapshot, receipts, and other generated files under tools/gmail/data and tools/gmail/receipts only.',
    },
  });
}

export async function gmailProfileGet() {
  const gmail = await getGmail();
  const profile = await gmail.users.getProfile({ userId: 'me' });
  return envelope({
    success: true,
    method: 'gmail.profile.get',
    payload: {
      emailAddress: profile.data.emailAddress,
      messagesTotal: profile.data.messagesTotal,
      threadsTotal: profile.data.threadsTotal,
      historyId: profile.data.historyId,
    },
  });
}

export async function gmailLabelsList() {
  const gmail = await getGmail();
  const res = await gmail.users.labels.list({ userId: 'me' });
  const labels = (res.data.labels || []).map((label) => ({
    id: label.id,
    name: label.name,
    type: label.type,
    messageListVisibility: label.messageListVisibility,
    labelListVisibility: label.labelListVisibility,
  }));
  return envelope({
    success: true,
    method: 'gmail.labels.list',
    payload: { count: labels.length, labels },
  });
}

export async function gmailLabelsCounts() {
  const gmail = await getGmail();
  const res = await gmail.users.labels.list({ userId: 'me' });
  const labels = res.data.labels || [];
  const counts = {};
  for (const label of labels) {
    const detail = await gmail.users.labels.get({ userId: 'me', id: label.id });
    counts[label.name] = {
      id: label.id,
      type: label.type,
      messagesTotal: detail.data.messagesTotal ?? null,
      messagesUnread: detail.data.messagesUnread ?? null,
      threadsTotal: detail.data.threadsTotal ?? null,
      threadsUnread: detail.data.threadsUnread ?? null,
    };
  }
  return envelope({
    success: true,
    method: 'gmail.labels.counts',
    payload: { labelCount: labels.length, counts },
  });
}

export async function gmailDraftsListMetadata({ maxResults = 10 } = {}) {
  const gmail = await getGmail();
  const res = await gmail.users.drafts.list({ userId: 'me', maxResults });
  const drafts = (res.data.drafts || []).map((draft) => ({
    id: draft.id,
    messageId: draft.message?.id || null,
    threadId: draft.message?.threadId || null,
  }));
  return envelope({
    success: true,
    method: 'gmail.drafts.listMetadata',
    payload: { count: drafts.length, drafts },
  });
}

async function gmailMessagesMetadataRows(gmail, query, maxResults) {
  const listParams = metadataListParams({ query, maxResults });
  const res = await gmail.users.messages.list(listParams);
  const messages = [];
  for (const row of res.data.messages || []) {
    const meta = await gmail.users.messages.get({
      userId: 'me',
      id: row.id,
      format: 'metadata',
      metadataHeaders: METADATA_HEADERS,
    });
    messages.push(messageMetadataFromApi(meta.data));
  }
  return messages;
}

export async function gmailMessagesListMetadata({ query = 'in:inbox', maxResults = 10 } = {}) {
  const gmail = await getGmail();
  const messages = await gmailMessagesMetadataRows(gmail, query, maxResults);
  return envelope({
    success: true,
    method: 'gmail.messages.listMetadata',
    payload: { query, count: messages.length, messages },
  });
}

export async function gmailMessagesSearchMetadata({ query = 'in:inbox', maxResults = 5 } = {}) {
  const gmail = await getGmail();
  const messages = await gmailMessagesMetadataRows(gmail, query, maxResults);
  return envelope({
    success: true,
    method: 'gmail.messages.searchMetadata',
    payload: { query, count: messages.length, messages },
  });
}

export async function gmailThreadsListMetadata({ query = 'in:inbox', maxResults = 10 } = {}) {
  const gmail = await getGmail();
  const listParams = metadataListParams({ query, maxResults });
  const res = await gmail.users.threads.list(listParams);
  const threads = [];
  for (const row of res.data.threads || []) {
    const thread = await gmail.users.threads.get({
      userId: 'me',
      id: row.id,
      format: 'metadata',
      metadataHeaders: METADATA_HEADERS,
    });
    const messages = (thread.data.messages || []).map(messageMetadataFromApi);
    const head = messages[0] || {};
    threads.push({
      id: thread.data.id,
      snippet: thread.data.snippet || head.snippet || '',
      subject: head.subject || '',
      from: head.from || '',
      date: head.date || '',
      unread: messages.some((entry) => entry.unread),
      labelIds: [...new Set(messages.flatMap((entry) => entry.labelIds))],
      messageIds: messages.map((entry) => entry.id),
      messages,
      provider: 'gmail-metadata',
    });
  }
  return envelope({
    success: true,
    method: 'gmail.threads.listMetadata',
    payload: { query, count: threads.length, threads },
  });
}

export async function gmailThreadMetadata({ threadId } = {}) {
  if (!threadId) {
    return blocked('gmail.threads.getMetadata', 'threadId required');
  }
  const gmail = await getGmail();
  const thread = await gmail.users.threads.get({
    userId: 'me',
    id: threadId,
    format: 'metadata',
    metadataHeaders: METADATA_HEADERS,
  });
  const messages = (thread.data.messages || []).map(messageMetadataFromApi);
  return envelope({
    success: true,
    method: 'gmail.threads.getMetadata',
    payload: {
      id: thread.data.id,
      snippet: thread.data.snippet || '',
      messages,
    },
  });
}

async function fetchPaginatedMetadata({
  labelIds = [],
  mailbox,
  mailboxes = [],
  jobs = [],
  query,
  maxPages = DEFAULT_SYNC_LIMITS.maxPages,
  maxThreads = DEFAULT_SYNC_LIMITS.maxThreads,
  maxMessages = DEFAULT_SYNC_LIMITS.maxMessages,
  maxResultsPerPage = DEFAULT_SYNC_LIMITS.maxResultsPerPage,
  emitReceipts = false,
} = {}) {
  const labelJobs = resolveSyncLabelJobs({ labelIds, mailbox, mailboxes, jobs, query });
  const gmail = await getGmail();
  let allThreads = [];
  const jobResults = [];
  let pagesFetched = 0;
  let stoppedReason = null;

  for (const job of labelJobs) {
    const perJobLimits = {
      maxPages,
      maxThreads: Math.max(0, maxThreads - allThreads.length),
      maxResultsPerPage,
    };
    if (perJobLimits.maxThreads <= 0) {
      stoppedReason = 'maxThreads';
      if (emitReceipts) writeSyncReceipt({ event: 'paused', details: { stoppedReason, jobName: job.name } });
      break;
    }

    const result = await fetchLabelThreadsPaginated(gmail, job, perJobLimits, emitReceipts);
    pagesFetched += result.pagesFetched;
    allThreads = mergeThreadRows(allThreads, result.threads, maxThreads);
    jobResults.push({ ...job, ...result, threadCount: result.threads.length });
    if (emitReceipts) {
      writeSyncReceipt({
        event: 'labelComplete',
        details: {
          jobName: job.name,
          labelIds: job.labelIds,
          pagesFetched: result.pagesFetched,
          threadCount: result.threads.length,
          stoppedReason: result.stoppedReason,
        },
      });
    }
    if (allThreads.length >= maxThreads) {
      stoppedReason = 'maxThreads';
      break;
    }
  }

  const messages = flattenMessagesFromThreads(allThreads, maxMessages);
  return {
    labelJobs,
    threads: allThreads,
    messages,
    jobResults,
    summary: {
      pagesFetched,
      threadCount: allThreads.length,
      messageCount: messages.length,
      stoppedReason: stoppedReason || jobResults.at(-1)?.stoppedReason || 'complete',
    },
  };
}

function buildMetadataSnapshotFile({ profileResult, labelsResult, threads, messages, summary }) {
  return {
    accountEmail: profileResult.payload?.emailAddress || null,
    generatedAt: new Date().toISOString(),
    source: 'local-gmail-cli',
    mode: 'metadata-only',
    labels: Object.entries(labelsResult.payload?.counts || {}).map(([name, entry]) => ({
      id: entry.id,
      name,
      type: entry.type,
      messagesTotal: entry.messagesTotal,
      messagesUnread: entry.messagesUnread,
      threadsTotal: entry.threadsTotal,
      threadsUnread: entry.threadsUnread,
    })),
    counts: labelsResult.payload?.counts || {},
    threads,
    messages,
    warnings: [
      'Metadata-only snapshot. Message bodies, attachments, OAuth tokens, and raw payloads are excluded.',
      'Browser preview does not perform OAuth. Import this file manually after CLI export.',
      `Paginated metadata sync: ${summary.pagesFetched || 0} page(s), ${threads.length} thread(s), stopped: ${summary.stoppedReason || 'complete'}.`,
      'No all-mail backfill by default. Use label-scoped sync jobs with explicit page limits.',
    ],
    blockedCapabilities: [
      'body_read',
      'draft_write',
      'send',
      'provider_mutation',
      'browser_oauth',
    ],
  };
}

export async function exportMetadataSnapshot({
  maxThreads = 25,
  maxMessages = 50,
  maxPages = 1,
  maxResultsPerPage = 25,
  threadQuery = 'in:inbox',
  labelIds,
  mailbox,
  mailboxes = [],
  jobs = [],
  outputPath = SNAPSHOT_PATH,
  includePayload = false,
} = {}) {
  const profileResult = await gmailProfileGet();
  const labelsResult = await gmailLabelsCounts();
  const fetched = await fetchPaginatedMetadata({
    labelIds,
    mailbox,
    mailboxes,
    jobs,
    query: labelIds?.length ? undefined : threadQuery,
    maxPages,
    maxThreads,
    maxMessages,
    maxResultsPerPage,
    emitReceipts: false,
  });

  const snapshot = buildMetadataSnapshotFile({
    profileResult,
    labelsResult,
    threads: fetched.threads,
    messages: fetched.messages,
    summary: fetched.summary,
  });

  const validation = validateMetadataSnapshot(snapshot);
  if (!validation.ok) {
    throw new Error(`Metadata snapshot validation failed: ${validation.errors.join('; ')}`);
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

  return envelope({
    success: true,
    method: 'gmail.exportMetadataSnapshot',
    payload: snapshotExportSummary({
      outputPath,
      snapshot,
      includePayload,
      extra: { syncSummary: fetched.summary },
    }),
  });
}

async function requireBodyReadGate() {
  const token = await loadToken();
  const connected = Boolean(token?.access_token || token?.refresh_token);
  assertBodyReadAllowed({ token, connected });
  return token;
}

function messageRowWithRedactedBody(message) {
  const headers = headersMap(message.payload);
  const labelIds = message.labelIds || [];
  const rawBody = extractBodyFromPayload(message.payload);
  const redacted = redactBodyContent(rawBody);
  return {
    id: message.id,
    threadId: message.threadId,
    labelIds,
    subject: headers.Subject || '',
    from: headers.From || '',
    to: headers.To || '',
    date: headers.Date || (message.internalDate ? new Date(Number(message.internalDate)).toISOString() : ''),
    unread: labelIds.includes('UNREAD'),
    snippet: message.snippet || '',
    sanitizedBodyPreview: redacted.sanitizedBodyPreview,
    sanitizedPlainText: redacted.sanitizedPlainText,
    bodyAvailable: redacted.bodyAvailable,
    redactionNotes: redacted.redactionNotes,
    provider: 'gmail-readonly',
  };
}

export async function bodyGateStatusCommand() {
  const secretsPath = await resolveClientSecretsPath();
  const token = await loadToken();
  const connected = Boolean(token?.access_token || token?.refresh_token);
  const gate = bodyGateStatus({ token, secretsConfigured: Boolean(secretsPath), connected });
  return envelope({
    success: true,
    method: 'gmail.bodyGate.status',
    token,
    dataClassification: gate.bodyReadAllowed ? 'body_redacted' : 'metadata_redacted',
    payload: gate,
  });
}

export async function readMessageBody({ messageId } = {}) {
  if (!messageId) {
    return blocked('gmail.messages.readBody', 'messageId required');
  }
  try {
    await requireBodyReadGate();
  } catch (err) {
    return envelope({
      success: false,
      blocked: true,
      providerGate: err.message,
      method: 'gmail.messages.readBody',
      error: err.message,
    });
  }
  const gmail = await getGmail();
  const message = await gmail.users.messages.get({ userId: 'me', id: messageId, format: 'full' });
  const row = messageRowWithRedactedBody(message.data);
  return envelope({
    success: true,
    method: 'gmail.messages.readBody',
    dataClassification: 'body_redacted',
    payload: { message: row },
  });
}

export async function readThreadBodies({ threadId, maxMessages = 5 } = {}) {
  if (!threadId) {
    return blocked('gmail.threads.readBodies', 'threadId required');
  }
  try {
    await requireBodyReadGate();
  } catch (err) {
    return envelope({
      success: false,
      blocked: true,
      providerGate: err.message,
      method: 'gmail.threads.readBodies',
      error: err.message,
    });
  }
  const gmail = await getGmail();
  const thread = await gmail.users.threads.get({ userId: 'me', id: threadId, format: 'full' });
  const messages = (thread.data.messages || []).slice(0, maxMessages).map(messageRowWithRedactedBody);
  return envelope({
    success: true,
    method: 'gmail.threads.readBodies',
    dataClassification: 'body_redacted',
    payload: {
      id: thread.data.id,
      snippet: thread.data.snippet || '',
      messages,
    },
  });
}

export function assertReadonlyBodyExportSelection({
  messageId,
  threadId,
  inputPath,
  allowBatchReadonlyExport = false,
} = {}) {
  if (inputPath) return;
  if (messageId || threadId) return;
  if (allowBatchReadonlyExport) return;
  throw new Error(
    'Read-only body export requires explicit --message-id, --thread-id, --in PATH, or --allow-batch-readonly-export (not valid for default LIVE-PROOF).',
  );
}

export async function exportReadonlyBodySnapshot({
  messageId,
  threadId,
  inputPath,
  allowBatchReadonlyExport = false,
  maxThreads = 5,
  maxMessages = 10,
  threadQuery = 'in:inbox',
  outputPath = BODY_SNAPSHOT_PATH,
  includePayload = false,
} = {}) {
  assertReadonlyBodyExportSelection({ messageId, threadId, inputPath, allowBatchReadonlyExport });

  if (inputPath) {
    return redactBodySnapshotFile({ inputPath, outputPath, includePayload });
  }

  await requireBodyReadGate();
  const profileResult = await gmailProfileGet();
  let threads = [];
  let messages = [];

  if (messageId) {
    const body = await readMessageBody({ messageId });
    if (!body.success) throw new Error(body.error || 'Failed to read message body');
    const row = body.payload.message;
    messages = [row];
    threads = [{
      id: row.threadId,
      snippet: row.snippet || '',
      subject: row.subject,
      from: row.from,
      date: row.date,
      unread: row.unread,
      labelIds: row.labelIds,
      messageIds: [row.id],
      messages: [row],
      provider: 'gmail-readonly',
    }];
  } else if (threadId) {
    const bodies = await readThreadBodies({ threadId, maxMessages });
    if (!bodies.success) throw new Error(bodies.error || 'Failed to read thread bodies');
    threads = [{
      id: bodies.payload.id,
      snippet: bodies.payload.snippet || '',
      subject: bodies.payload.messages[0]?.subject || '',
      from: bodies.payload.messages[0]?.from || '',
      date: bodies.payload.messages[0]?.date || '',
      unread: bodies.payload.messages.some((entry) => entry.unread),
      labelIds: [...new Set(bodies.payload.messages.flatMap((entry) => entry.labelIds || []))],
      messageIds: bodies.payload.messages.map((entry) => entry.id),
      messages: bodies.payload.messages,
      provider: 'gmail-readonly',
    }];
    messages = bodies.payload.messages;
  } else {
    const threadsResult = await gmailThreadsListMetadata({ query: threadQuery, maxResults: maxThreads });
    for (const thread of threadsResult.payload?.threads || []) {
      const bodies = await readThreadBodies({ threadId: thread.id, maxMessages });
      if (!bodies.success) throw new Error(bodies.error || 'Failed to read thread bodies');
      threads.push({
        id: bodies.payload.id,
        snippet: bodies.payload.snippet || thread.snippet,
        subject: thread.subject,
        from: thread.from,
        date: thread.date,
        unread: thread.unread,
        labelIds: thread.labelIds,
        messageIds: bodies.payload.messages.map((entry) => entry.id),
        messages: bodies.payload.messages,
        provider: 'gmail-readonly',
      });
      messages.push(...bodies.payload.messages);
    }
  }

  let snapshot = {
    accountEmail: profileResult.payload?.emailAddress || null,
    generatedAt: new Date().toISOString(),
    source: 'local-gmail-cli',
    mode: 'read-only-body',
    scopeRequired: READONLY_SCOPE,
    threads,
    messages,
    warnings: [
      'Read-only body snapshot with redaction applied. Attachments, raw payloads, OAuth tokens, and remote HTML resources excluded.',
      'Browser preview does not perform OAuth. Import manually after CLI export.',
      'gmail.readonly is a restricted scope; production use requires Google verification.',
    ],
    blockedCapabilities: ['draft_write', 'send', 'provider_mutation', 'browser_oauth'],
    redactionStatus: 'applied',
  };

  snapshot = redactBodySnapshot(snapshot);
  const validation = validateReadonlyBodySnapshot(snapshot);
  if (!validation.ok) {
    throw new Error(`Body snapshot validation failed: ${validation.errors.join('; ')}`);
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

  return envelope({
    success: true,
    method: 'gmail.exportReadonlyBodySnapshot',
    dataClassification: 'body_redacted',
    payload: snapshotExportSummary({ outputPath, snapshot, includePayload }),
  });
}

export async function redactBodySnapshotFile({ inputPath, outputPath, includePayload = false } = {}) {
  if (!inputPath) {
    return blocked('gmail.bodySnapshot.redact', 'inputPath required');
  }
  const raw = JSON.parse(await fs.readFile(inputPath, 'utf8'));
  const snapshot = redactBodySnapshot(raw);
  const validation = validateReadonlyBodySnapshot(snapshot);
  if (!validation.ok) {
    throw new Error(`Body snapshot validation failed: ${validation.errors.join('; ')}`);
  }
  if (outputPath) {
    await fs.writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  }
  return envelope({
    success: true,
    method: 'gmail.bodySnapshot.redact',
    dataClassification: 'body_redacted',
    payload: snapshotExportSummary({
      outputPath: outputPath || null,
      snapshot,
      includePayload,
    }),
  });
}

export async function invokeBlocked(name) {
  if (BLOCKED_METHODS.has(name)) {
    return guardMethod(name);
  }
  if (name === 'gmail.messages.getBody' || name === 'gmail.messages.get') {
    const token = await loadToken();
    const reason = bodyReadBlockedReason({
      token,
      connected: Boolean(token?.access_token || token?.refresh_token),
    });
    if (reason) {
      return envelope({
        success: false,
        blocked: true,
        providerGate: reason,
        method: name,
        error: reason,
        token,
      });
    }
    return envelope({
      success: false,
      blocked: false,
      method: name,
      error: 'Body read allowed in readonly mode via read-message-body command only.',
      token,
    });
  }
  return blocked(name, 'unknown blocked method');
}

export { validateMetadataSnapshot } from './snapshot-schema.js';
export { validateReadonlyBodySnapshot } from './body-snapshot-schema.js';
export { validateOAuthState, resolveLoopbackFromRedirectUri } from './oauth-loopback.js';
export { wipeLocalAdapterData } from './local-data.js';
export { bodyGateStatus, getAccessMode, READONLY_SCOPE } from './body-gate.js';
export { redactBodyContent, redactBodySnapshot } from './body-redaction.js';
export {
  loadMailIndex,
  saveMailIndex,
  upsertToMailIndex,
  queryMailIndex,
} from './local-mail-index.js';
export {
  METADATA_SYNC_JOB_PRESETS,
  DEFAULT_SYNC_LIMITS,
  buildMetadataSyncPlan,
  shouldStopPagination,
  paginateListParams,
  mergeThreadRows,
  flattenMessagesFromThreads,
} from './metadata-sync.js';

export function resolveSyncLabelJobs({
  labelIds = [],
  mailbox,
  mailboxes = [],
  jobs = [],
  query,
} = {}) {
  const jobList = [];
  const seen = new Set();

  const pushJob = (entry) => {
    const key = entry.labelIds.join('+');
    if (seen.has(key)) return;
    seen.add(key);
    jobList.push(entry);
  };

  for (const id of labelIds.filter(Boolean)) {
    pushJob({ name: `label:${id}`, labelIds: [id], source: 'label' });
  }

  for (const mb of [mailbox, ...mailboxes].filter(Boolean)) {
    const alias = String(mb).trim().toLowerCase();
    const mapped = METADATA_QUERY_LABELS[alias];
    if (!mapped) {
      throw new MetadataQueryError(
        `Unsupported mailbox "${mb}". Allowed: ${METADATA_MAILBOX_ALIASES.join(', ')}`,
      );
    }
    pushJob({ name: `mailbox:${alias}`, labelIds: [mapped], source: 'mailbox', mailbox: alias });
  }

  for (const job of jobs.filter(Boolean)) {
    const preset = METADATA_SYNC_JOB_PRESETS[job];
    if (!preset) {
      throw new Error(`Unknown sync job "${job}". Allowed: ${Object.keys(METADATA_SYNC_JOB_PRESETS).join(', ')}`);
    }
    pushJob({ name: `job:${job}`, labelIds: [...preset.labelIds], source: 'job', job });
  }

  if (query) {
    const params = metadataListParams({ query });
    pushJob({ name: `query:${query}`, labelIds: [...params.labelIds], source: 'query', query });
  }

  if (!jobList.length) {
    pushJob({ name: 'default:inbox', labelIds: ['INBOX'], source: 'default' });
  }

  return jobList;
}

async function threadMetadataRow(gmail, threadId) {
  const thread = await gmail.users.threads.get({
    userId: 'me',
    id: threadId,
    format: 'metadata',
    metadataHeaders: METADATA_HEADERS,
  });
  const messages = (thread.data.messages || []).map(messageMetadataFromApi);
  const head = messages[0] || {};
  return {
    id: thread.data.id,
    snippet: thread.data.snippet || head.snippet || '',
    subject: head.subject || '',
    from: head.from || '',
    date: head.date || '',
    unread: messages.some((entry) => entry.unread),
    labelIds: [...new Set(messages.flatMap((entry) => entry.labelIds))],
    messageIds: messages.map((entry) => entry.id),
    messages,
    provider: 'gmail-metadata',
  };
}

async function fetchLabelThreadsPaginated(gmail, labelJob, limits, emitReceipts = false) {
  const threads = [];
  let pageToken;
  let pagesFetched = 0;
  let stoppedReason = null;

  while (threads.length < limits.maxThreads && pagesFetched < limits.maxPages) {
    const listParams = paginateListParams({
      labelIds: labelJob.labelIds,
      maxResultsPerPage: limits.maxResultsPerPage,
      pageToken,
      remaining: limits.maxThreads - threads.length,
    });
    const res = await gmail.users.threads.list(listParams);
    pagesFetched += 1;
    if (emitReceipts) {
      writeSyncReceipt({
        event: 'pageFetched',
        details: {
          jobName: labelJob.name,
          labelIds: labelJob.labelIds,
          page: pagesFetched,
          pagesFetched,
          nextPageTokenPresent: Boolean(res.data.nextPageToken),
        },
      });
    }

    for (const row of res.data.threads || []) {
      if (threads.length >= limits.maxThreads) {
        stoppedReason = 'maxThreads';
        break;
      }
      threads.push(await threadMetadataRow(gmail, row.id));
    }

    pageToken = res.data.nextPageToken;
    if (!pageToken) {
      stoppedReason = stoppedReason || 'noNextPageToken';
      break;
    }
    if (pagesFetched >= limits.maxPages) {
      stoppedReason = stoppedReason || 'maxPages';
      break;
    }
  }

  return { threads, pagesFetched, stoppedReason, nextPageToken: pageToken || null };
}

export async function runMetadataSync({
  labelIds = [],
  mailbox,
  mailboxes = [],
  jobs = [],
  query,
  maxPages = DEFAULT_SYNC_LIMITS.maxPages,
  maxThreads = DEFAULT_SYNC_LIMITS.maxThreads,
  maxMessages = DEFAULT_SYNC_LIMITS.maxMessages,
  maxResultsPerPage = DEFAULT_SYNC_LIMITS.maxResultsPerPage,
  dryRun = false,
  planOnly = false,
  outputPath,
} = {}) {
  const labelJobs = resolveSyncLabelJobs({ labelIds, mailbox, mailboxes, jobs, query });
  let accountEmail = null;

  if (!planOnly && !dryRun) {
    const profileResult = await gmailProfileGet();
    accountEmail = profileResult.payload?.emailAddress || null;
  }

  const plan = buildMetadataSyncPlan({
    accountEmail,
    labelJobs,
    maxPages,
    maxThreads,
    maxMessages,
    maxResultsPerPage,
    dryRun,
    planOnly,
  });

  writeSyncReceipt({
    event: 'planned',
    details: {
      dryRun,
      planOnly,
      labelIds: labelJobs.flatMap((job) => job.labelIds),
      job: labelJobs.map((entry) => entry.name).join(','),
    },
  });
  writeSyncReceipt({ event: 'bodyWithheld', blocked: true, success: true });
  writeSyncReceipt({ event: 'draftWriteBlocked', blocked: true, success: true });
  writeSyncReceipt({ event: 'sendBlocked', blocked: true, success: true });
  writeSyncReceipt({ event: 'mutationBlocked', blocked: true, success: true });

  if (planOnly) {
    return envelope({
      success: true,
      method: 'gmail.metadataSync.plan',
      payload: { plan },
    });
  }

  if (dryRun) {
    writeSyncReceipt({ event: 'completed', details: { dryRun: true, threadCount: 0, messageCount: 0 } });
    return envelope({
      success: true,
      method: 'gmail.metadataSync.dryRun',
      payload: { plan, progress: 'dry-run only; no Gmail API list calls performed.' },
    });
  }

  writeSyncReceipt({ event: 'started', details: { job: labelJobs.map((entry) => entry.name).join(',') } });

  try {
    const fetched = await fetchPaginatedMetadata({
      labelIds,
      mailbox,
      mailboxes,
      jobs,
      query,
      maxPages,
      maxThreads,
      maxMessages,
      maxResultsPerPage,
      emitReceipts: true,
    });

    writeSyncReceipt({
      event: 'completed',
      details: {
        pagesFetched: fetched.summary.pagesFetched,
        threadCount: fetched.summary.threadCount,
        messageCount: fetched.summary.messageCount,
        stoppedReason: fetched.summary.stoppedReason,
      },
    });

    await upsertToMailIndex({
      threads: fetched.threads,
      messages: fetched.messages,
      accountEmail,
    });

    if (outputPath) {
      const profileResult = await gmailProfileGet();
      const labelsResult = await gmailLabelsCounts();
      const snapshot = buildMetadataSnapshotFile({
        profileResult,
        labelsResult,
        threads: fetched.threads,
        messages: fetched.messages,
        summary: fetched.summary,
      });
      const validation = validateMetadataSnapshot(snapshot);
      if (!validation.ok) {
        throw new Error(`Metadata snapshot validation failed: ${validation.errors.join('; ')}`);
      }
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
    }

    return envelope({
      success: true,
      method: 'gmail.metadataSync.run',
      payload: {
        plan,
        summary: fetched.summary,
        threads: fetched.threads,
        messages: fetched.messages,
        jobResults: fetched.jobResults,
        outputPath: outputPath || null,
      },
    });
  } catch (err) {
    writeSyncReceipt({ event: 'failed', success: false, error: err.message || String(err) });
    throw err;
  }
}

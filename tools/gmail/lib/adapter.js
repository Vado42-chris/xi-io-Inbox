import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import { envelope, blocked } from './response.js';
import { loadToken, saveToken, wipeToken } from './token-store.js';
import { wipeLocalAdapterData, SNAPSHOT_PATH } from './local-data.js';
import {
  CONNECT_TIMEOUT_MS,
  DEFAULT_LOOPBACK_HOST,
  DEFAULT_LOOPBACK_PORT,
  connectTimeoutMessage,
  generateOAuthState,
  resolveLoopbackFromRedirectUri,
  validateOAuthState,
} from './oauth-loopback.js';
import { validateMetadataSnapshot } from './snapshot-schema.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SCOPES = [
  'openid',
  'email',
  'https://www.googleapis.com/auth/gmail.metadata',
];
const LOOPBACK_HOST = DEFAULT_LOOPBACK_HOST;
const LOOPBACK_PORT = DEFAULT_LOOPBACK_PORT;

const BLOCKED_METHODS = new Set([
  'gmail.messages.getBody',
  'gmail.messages.get',
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
    return blocked(name, `${name} blocked in GMAIL-001C metadata-only adapter`);
  }
  return null;
}

export async function providerStatus() {
  const secretsPath = await resolveClientSecretsPath();
  const token = await loadToken();
  return envelope({
    success: true,
    method: 'provider.status',
    payload: {
      connected: Boolean(token?.access_token || token?.refresh_token),
      secretsConfigured: Boolean(secretsPath),
      tokenStorage: 'tools/gmail/data/token.json (gitignored)',
      bodiesBlocked: true,
      sendBlocked: true,
      draftWriteBlocked: true,
    },
  });
}

export async function providerConnectStart() {
  const { oauth2, loopback, warnings } = await loadOAuthClientBundle();
  const expectedState = generateOAuthState();
  const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
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
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<p>OAuth callback path mismatch. Check redirect URI in Google Cloud Console.</p>');
          }
          finish(new Error('OAuth callback path mismatch.'));
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
            scopes: SCOPES,
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
  const res = await gmail.users.messages.list({ userId: 'me', q: query, maxResults });
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
  const res = await gmail.users.threads.list({ userId: 'me', q: query, maxResults });
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

export async function exportMetadataSnapshot({
  maxThreads = 25,
  maxMessages = 50,
  threadQuery = 'in:inbox',
  messageQuery = 'in:inbox',
  outputPath = SNAPSHOT_PATH,
} = {}) {
  const profileResult = await gmailProfileGet();
  const labelsResult = await gmailLabelsCounts();
  const threadsResult = await gmailThreadsListMetadata({ query: threadQuery, maxResults: maxThreads });
  const messagesResult = await gmailMessagesListMetadata({ query: messageQuery, maxResults: maxMessages });

  const snapshot = {
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
    threads: threadsResult.payload?.threads || [],
    messages: messagesResult.payload?.messages || [],
    warnings: [
      'Metadata-only snapshot. Message bodies, attachments, OAuth tokens, and raw payloads are excluded.',
      'Browser preview does not perform OAuth. Import this file manually after CLI export.',
    ],
    blockedCapabilities: [
      'body_read',
      'draft_write',
      'send',
      'provider_mutation',
      'browser_oauth',
    ],
  };

  const validation = validateMetadataSnapshot(snapshot);
  if (!validation.ok) {
    throw new Error(`Metadata snapshot validation failed: ${validation.errors.join('; ')}`);
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

  return envelope({
    success: true,
    method: 'gmail.exportMetadataSnapshot',
    payload: {
      outputPath,
      threadCount: snapshot.threads.length,
      messageCount: snapshot.messages.length,
      labelCount: snapshot.labels.length,
      snapshot,
    },
  });
}

export async function invokeBlocked(name) {
  return guardMethod(name) || blocked(name, 'unknown blocked method');
}

export { validateMetadataSnapshot } from './snapshot-schema.js';
export { validateOAuthState, resolveLoopbackFromRedirectUri } from './oauth-loopback.js';
export { wipeLocalAdapterData } from './local-data.js';

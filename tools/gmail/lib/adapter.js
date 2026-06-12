import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import { envelope, blocked } from './response.js';
import { loadToken, saveToken, wipeToken } from './token-store.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SCOPES = [
  'openid',
  'email',
  'https://www.googleapis.com/auth/gmail.metadata',
];
const LOOPBACK_HOST = '127.0.0.1';
const LOOPBACK_PORT = Number(process.env.GMAIL_OAUTH_PORT || 8787);

const BLOCKED_METHODS = new Set([
  'gmail.messages.getBody',
  'gmail.messages.get',
  'gmail.drafts.create',
  'gmail.drafts.update',
  'gmail.drafts.send',
  'gmail.users.messages.send',
  'gmail.users.messages.modify',
  'gmail.users.messages.trash',
  'gmail.users.drafts.create',
  'gmail.users.drafts.update',
  'gmail.users.drafts.send',
]);

const METADATA_HEADERS = ['Subject', 'From', 'To', 'Date'];
const SNAPSHOT_PATH = path.join(ROOT, 'data', 'metadata-snapshot.json');

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
  const redirectUri = installed.redirect_uris?.[0] || `http://${LOOPBACK_HOST}:${LOOPBACK_PORT}/oauth2callback`;
  const oauth2 = new google.auth.OAuth2(installed.client_id, installed.client_secret, redirectUri);
  const tokens = await loadToken();
  if (tokens) oauth2.setCredentials(tokens);
  return oauth2;
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
  const oauth2 = await loadOAuthClient();
  const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url, `http://${LOOPBACK_HOST}:${LOOPBACK_PORT}`);
        if (url.pathname !== '/oauth2callback') {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        const code = url.searchParams.get('code');
        if (!code) {
          res.writeHead(400);
          res.end('Missing code');
          return;
        }
        const { tokens } = await oauth2.getToken(code);
        await saveToken(tokens);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<p>Gmail metadata connect complete. You may close this window.</p>');
        server.close();
        resolve(envelope({
          success: true,
          method: 'provider.connect.callback',
          payload: { connected: true, scopes: SCOPES },
        }));
      } catch (err) {
        server.close();
        reject(err);
      }
    });

    server.on('error', reject);
    server.listen(LOOPBACK_PORT, LOOPBACK_HOST, () => {
      console.error(`Open this URL in your browser:\n${authUrl}`);
      console.error(`Waiting for OAuth callback on http://${LOOPBACK_HOST}:${LOOPBACK_PORT}/oauth2callback`);
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

export async function providerWipeLocalData() {
  await wipeToken();
  return envelope({
    success: true,
    method: 'provider.wipeLocalData',
    payload: { wiped: true },
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

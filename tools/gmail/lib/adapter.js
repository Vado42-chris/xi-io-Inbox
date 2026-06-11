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
  'gmail.drafts.create',
  'gmail.drafts.update',
  'gmail.drafts.send',
  'gmail.users.messages.send',
  'gmail.users.messages.modify',
  'gmail.users.messages.trash',
]);

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

export async function gmailMessagesSearchMetadata({ query = 'in:inbox', maxResults = 5 } = {}) {
  const gmail = await getGmail();
  const res = await gmail.users.messages.list({ userId: 'me', q: query, maxResults });
  const messages = [];
  for (const row of res.data.messages || []) {
    const meta = await gmail.users.messages.get({
      userId: 'me',
      id: row.id,
      format: 'metadata',
      metadataHeaders: ['Subject', 'From', 'Date'],
    });
    const headers = Object.fromEntries(
      (meta.data.payload?.headers || []).map((h) => [h.name, h.value]),
    );
    messages.push({
      id: row.id,
      threadId: meta.data.threadId,
      labelIds: meta.data.labelIds || [],
      snippet: meta.data.snippet || '',
      subject: headers.Subject || '',
      from: headers.From || '',
      date: headers.Date || '',
    });
  }
  return envelope({
    success: true,
    method: 'gmail.messages.searchMetadata',
    payload: { query, count: messages.length, messages },
  });
}

export async function invokeBlocked(name) {
  return guardMethod(name) || blocked(name, 'unknown blocked method');
}

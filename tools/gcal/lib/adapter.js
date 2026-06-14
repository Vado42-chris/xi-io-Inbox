import fs from 'fs/promises';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import { envelope, blocked } from './response.js';
import { loadToken, saveToken, wipeToken } from './token-store.js';
import { SNAPSHOT_PATH, wipeLocalAdapterData } from './local-data.js';
import { validateCalendarSnapshot } from './snapshot-schema.js';
import {
  CONNECT_TIMEOUT_MS,
  connectPortInUseMessage,
  connectTimeoutMessage,
  generateOAuthState,
  isOAuthCallbackProbe,
  resolveLoopbackFromRedirectUri,
  validateOAuthState,
} from './oauth-loopback.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);
const READONLY_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
const BASE_SCOPES = ['openid', 'email'];
const REQUESTED_SCOPES = [...BASE_SCOPES, READONLY_SCOPE];

const BLOCKED_METHODS = new Set([
  'calendar.events.insert',
  'calendar.events.update',
  'calendar.events.patch',
  'calendar.events.delete',
  'calendar.events.move',
  'calendar.events.import',
  'calendar.events.quickAdd',
  'calendar.calendars.insert',
  'calendar.calendars.update',
  'calendar.calendars.patch',
  'calendar.calendars.delete',
  'calendar.acl.insert',
  'calendar.acl.update',
  'calendar.acl.patch',
  'calendar.acl.delete',
]);

function truncate(text, max = 240) {
  const value = String(text || '').trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

function defaultClientSecretsPath() {
  return path.resolve(ROOT, '../../secrets/gcal-oauth-client.json');
}

export async function resolveClientSecretsPath() {
  const configured = process.env.GCAL_OAUTH_CLIENT_PATH;
  const candidate = configured ? path.resolve(configured) : defaultClientSecretsPath();
  try {
    await fs.access(candidate);
    return candidate;
  } catch {
    return null;
  }
}

async function loadOAuthClientBundle() {
  const secretsPath = await resolveClientSecretsPath();
  if (!secretsPath) {
    throw new Error('OAuth client secrets missing. Place JSON at secrets/gcal-oauth-client.json (gitignored) or set GCAL_OAUTH_CLIENT_PATH.');
  }
  const raw = await fs.readFile(secretsPath, 'utf8');
  const config = JSON.parse(raw);
  const installed = config.installed || config.web;
  if (!installed?.client_id || !installed?.client_secret) {
    throw new Error('Invalid OAuth client JSON. Expected installed or web client with client_id and client_secret.');
  }
  const redirectUri = installed.redirect_uris?.[0]
    || `http://127.0.0.1:8788/oauth2callback`;
  const loopback = resolveLoopbackFromRedirectUri(redirectUri, process.env.GCAL_OAUTH_PORT);
  const oauth2 = new google.auth.OAuth2(installed.client_id, installed.client_secret, loopback.redirectUri);
  const tokens = await loadToken();
  if (tokens) oauth2.setCredentials(tokens);
  return { oauth2, loopback, warnings: loopback.warnings };
}

async function getCalendarAuth() {
  const bundle = await loadOAuthClientBundle();
  return { calendar: google.calendar({ version: 'v3', auth: bundle.oauth2 }), oauth2: bundle.oauth2 };
}

async function resolveAccountEmail(auth) {
  try {
    const oauth2 = google.oauth2({ version: 'v2', auth });
    const res = await oauth2.userinfo.get();
    return res.data.email || null;
  } catch {
    return null;
  }
}

async function getCalendar() {
  const { calendar } = await getCalendarAuth();
  return calendar;
}

function calendarMetadataFromApi(entry) {
  return {
    id: entry.id,
    summary: entry.summary || entry.id,
    primary: Boolean(entry.primary),
    accessRole: entry.accessRole || null,
    timeZone: entry.timeZone || null,
  };
}

function eventMetadataFromApi(event, calendarId) {
  return {
    id: event.id,
    calendarId,
    summary: event.summary || '(no title)',
    description: truncate(event.description),
    location: truncate(event.location, 120),
    start: event.start?.dateTime || event.start?.date || null,
    end: event.end?.dateTime || event.end?.date || null,
    status: event.status || 'confirmed',
    allDay: Boolean(event.start?.date && !event.start?.dateTime),
    provider: 'gcal-readonly',
  };
}

function buildCalendarSnapshotFile({ profileEmail, calendars, events, summary }) {
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: 'local-gcal-cli',
    mode: 'read-only-metadata',
    accountEmail: profileEmail || null,
    calendars,
    events,
    summary,
    warnings: [
      'Read-only Calendar metadata export. No attendee lists, conference links, or write paths.',
      'Browser preview import is local-only — not live Google Calendar sync.',
    ],
    blockedCapabilities: ['event_write', 'calendar_mutation', 'browser_oauth'],
  };
}

function snapshotExportSummary({ outputPath, snapshot, includePayload, extra = {} }) {
  const base = {
    outputPath,
    accountEmail: snapshot.accountEmail,
    calendarCount: snapshot.calendars?.length ?? 0,
    eventCount: snapshot.events?.length ?? 0,
    mode: snapshot.mode,
    ...extra,
  };
  return includePayload ? { ...base, snapshot } : base;
}

export function guardMethod(name) {
  if (BLOCKED_METHODS.has(name)) {
    return blocked(name, `${name} blocked in read-only calendar adapter (event write and calendar mutation)`);
  }
  return null;
}

export async function providerStatus() {
  const secretsPath = await resolveClientSecretsPath();
  const token = await loadToken();
  const connected = Boolean(token?.access_token || token?.refresh_token);
  return envelope({
    success: true,
    method: 'provider.status',
    payload: {
      connected,
      secretsConfigured: Boolean(secretsPath),
      tokenStorage: 'tools/gcal/data/token.json (gitignored)',
      scopeRequired: READONLY_SCOPE,
      eventWriteBlocked: true,
      calendarMutationBlocked: true,
      browserOAuth: false,
    },
  });
}

export async function providerConnectStart() {
  const { oauth2, loopback, warnings } = await loadOAuthClientBundle();
  const expectedState = generateOAuthState();
  const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    scope: REQUESTED_SCOPES,
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
            res.end('<p>Waiting for OAuth callback from Google. Complete approval in the browser tab opened by <code>node cli.js connect</code>.</p>');
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
            res.end('<p>OAuth callback missing authorization code.</p>');
          }
          finish(new Error('OAuth callback missing authorization code.'));
          return;
        }

        const { tokens } = await oauth2.getToken(code);
        await saveToken(tokens);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<p>Google Calendar read-only connect complete. You may close this window.</p>');
        finish(null, envelope({
          success: true,
          method: 'provider.connect.callback',
          payload: {
            connected: true,
            scopes: REQUESTED_SCOPES,
            callback: loopback.redirectUri,
            warnings,
          },
        }));
      } catch (err) {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<p>OAuth token exchange failed. Check client JSON, redirect URI, and callback port.</p>');
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
      for (const warning of warnings) console.error(`warning: ${warning}`);
      console.error(`Open this URL in your browser:\n${authUrl}`);
      console.error(`Waiting for OAuth callback on ${loopback.redirectUri}`);
      console.error(`Connect timeout: ${Math.round(CONNECT_TIMEOUT_MS / 1000)}s (override with GCAL_OAUTH_TIMEOUT_MS)`);
    });
  });
}

export async function providerDisconnect() {
  const removed = await wipeToken();
  return envelope({
    success: true,
    method: 'provider.disconnect',
    payload: { disconnected: true, tokenRemoved: removed },
  });
}

export async function providerWipeLocalData(options) {
  const result = await wipeLocalAdapterData(options);
  return envelope({
    success: true,
    method: 'provider.wipeLocalData',
    payload: result,
  });
}

export async function calendarProfileGet() {
  const { calendar, oauth2 } = await getCalendarAuth();
  const accountEmail = await resolveAccountEmail(oauth2);
  const res = await calendar.calendarList.list({ maxResults: 10 });
  const primary = (res.data.items || []).find((entry) => entry.primary) || (res.data.items || [])[0];
  return envelope({
    success: true,
    method: 'calendar.profile.get',
    payload: {
      accountEmail,
      primaryCalendarId: primary?.id || 'primary',
      timeZone: primary?.timeZone || null,
    },
  });
}

export async function calendarList({ maxResults = 10 } = {}) {
  const calendar = await getCalendar();
  const res = await calendar.calendarList.list({ maxResults });
  const items = (res.data.items || []).map(calendarMetadataFromApi);
  return envelope({
    success: true,
    method: 'calendar.calendars.list',
    payload: { calendars: items, count: items.length },
  });
}

export async function calendarEventsList({
  calendarId = 'primary',
  maxResults = 25,
  timeMin,
  timeMax,
  singleEvents = true,
  orderBy = 'startTime',
} = {}) {
  const calendar = await getCalendar();
  const now = new Date();
  const defaultMin = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const defaultMax = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const res = await calendar.events.list({
    calendarId,
    maxResults,
    singleEvents,
    orderBy,
    timeMin: timeMin || defaultMin,
    timeMax: timeMax || defaultMax,
  });
  const events = (res.data.items || []).map((event) => eventMetadataFromApi(event, calendarId));
  return envelope({
    success: true,
    method: 'calendar.events.list',
    payload: {
      calendarId,
      events,
      count: events.length,
      timeMin: timeMin || defaultMin,
      timeMax: timeMax || defaultMax,
    },
  });
}

export async function exportCalendarSnapshot({
  calendarId = 'primary',
  maxResults = 25,
  timeMin,
  timeMax,
  outputPath = SNAPSHOT_PATH,
  includePayload = false,
} = {}) {
  const calendar = await getCalendar();
  const { oauth2 } = await getCalendarAuth();
  const accountEmail = await resolveAccountEmail(oauth2);
  const listRes = await calendar.calendarList.list({ maxResults: 10 });
  const calendars = (listRes.data.items || []).map(calendarMetadataFromApi);
  const primary = calendars.find((entry) => entry.primary)?.id || calendarId;
  const eventsResult = await calendarEventsList({
    calendarId: primary,
    maxResults,
    timeMin,
    timeMax,
  });
  const events = eventsResult.payload.events;
  const snapshot = buildCalendarSnapshotFile({
    profileEmail: accountEmail,
    calendars,
    events,
    summary: {
      calendarId: primary,
      eventCount: events.length,
      timeMin: eventsResult.payload.timeMin,
      timeMax: eventsResult.payload.timeMax,
    },
  });

  const validation = validateCalendarSnapshot(snapshot);
  if (!validation.ok) {
    throw new Error(`Calendar snapshot validation failed: ${validation.errors.join('; ')}`);
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

  return envelope({
    success: true,
    method: 'calendar.exportSnapshot',
    payload: snapshotExportSummary({
      outputPath,
      snapshot,
      includePayload,
      extra: { summary: snapshot.summary },
    }),
  });
}

export async function invokeBlocked(methodName) {
  const guard = guardMethod(methodName);
  if (guard) return guard;
  return blocked(methodName, 'unknown blocked method');
}

export { wipeLocalAdapterData } from './local-data.js';
export { validateCalendarSnapshot } from './snapshot-schema.js';
export { validateOAuthState, resolveLoopbackFromRedirectUri } from './oauth-loopback.js';

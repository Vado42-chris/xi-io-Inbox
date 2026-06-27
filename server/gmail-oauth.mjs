import fs from 'fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { assertLocalWebRuntimePaths } from './paths.mjs';
import {
  generateOAuthState,
  generatePkcePair,
  validateOAuthState,
} from '../tools/gmail/lib/oauth-loopback.js';
import { getRequestedScopes } from '../tools/gmail/lib/body-gate.js';

const require = createRequire(import.meta.url);
const { google } = require(path.join(path.dirname(fileURLToPath(import.meta.url)), '../tools/gmail/node_modules/googleapis'));

/** @type {Map<string, { createdAt: number, codeVerifier: string }>} */
const pendingOAuthSessions = new Map();
const STATE_TTL_MS = 10 * 60 * 1000;

function pruneOAuthSessions() {
  const now = Date.now();
  for (const [state, session] of pendingOAuthSessions.entries()) {
    if (now - session.createdAt > STATE_TTL_MS) pendingOAuthSessions.delete(state);
  }
}

async function loadInstalledClient() {
  const secretsPath = process.env.GMAIL_OAUTH_CLIENT_PATH;
  if (!secretsPath) throw new Error('GMAIL_OAUTH_CLIENT_PATH not configured');
  const raw = await fs.readFile(secretsPath, 'utf8');
  const config = JSON.parse(raw);
  const installed = config.installed || config.web;
  if (!installed?.client_id || !installed?.client_secret) {
    throw new Error('Invalid OAuth client JSON');
  }
  return installed;
}

function resolveRedirectUri(baseUrl) {
  return process.env.XIIO_GMAIL_OAUTH_REDIRECT_URI || `${baseUrl}/api/gmail/oauth/callback`;
}

export async function startGmailOAuth(baseUrl) {
  pruneOAuthSessions();
  const installed = await loadInstalledClient();
  const redirectUri = resolveRedirectUri(baseUrl);
  const oauth2 = new google.auth.OAuth2(installed.client_id, installed.client_secret, redirectUri);
  const state = generateOAuthState();
  const { codeVerifier, codeChallenge, codeChallengeMethod } = generatePkcePair();
  pendingOAuthSessions.set(state, { createdAt: Date.now(), codeVerifier });
  const scopes = getRequestedScopes();
  const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: codeChallengeMethod,
  });
  return { authUrl, redirectUri, scopes };
}

export async function completeGmailOAuth(baseUrl, searchParams) {
  const installed = await loadInstalledClient();
  const redirectUri = resolveRedirectUri(baseUrl);
  const oauth2 = new google.auth.OAuth2(installed.client_id, installed.client_secret, redirectUri);

  const oauthError = searchParams.get('error');
  if (oauthError) throw new Error(`OAuth denied: ${oauthError}`);

  const state = searchParams.get('state');
  const session = state ? pendingOAuthSessions.get(state) : undefined;
  const stateCheck = validateOAuthState(state, session ? state : undefined);
  if (!stateCheck.ok) throw new Error(stateCheck.reason);
  if (!session?.codeVerifier) throw new Error('OAuth session expired or missing PKCE verifier.');

  const code = searchParams.get('code');
  if (!code) throw new Error('OAuth callback missing authorization code');

  try {
    assertLocalWebRuntimePaths();
    const { saveToken, tokenPath } = await import('../tools/gmail/lib/token-store.js');
    let tokens;
    try {
      ({ tokens } = await oauth2.getToken({ code, codeVerifier: session.codeVerifier }));
    } catch (error) {
      const detail = error?.response?.data?.error_description || error?.response?.data?.error || error?.message;
      throw new Error(String(detail || 'OAuth token exchange failed'));
    }
    await saveToken(tokens);
    const writtenPath = path.resolve(tokenPath());
    await fs.access(writtenPath);
    const expectedDir = path.resolve(process.env.GMAIL_ADAPTER_DATA_DIR);
    if (!writtenPath.startsWith(`${expectedDir}${path.sep}`)) {
      throw new Error(`OAuth token saved outside runtime data dir: ${writtenPath}`);
    }
    if (writtenPath.includes(`${path.sep}tools${path.sep}gmail${path.sep}`)) {
      throw new Error(`OAuth token must not save under tools/gmail: ${writtenPath}`);
    }
    return { connected: true, scopes: getRequestedScopes(), redirectUri, tokenPath: writtenPath };
  } finally {
    pendingOAuthSessions.delete(state);
  }
}

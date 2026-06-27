import crypto from 'crypto';

export const DEFAULT_LOOPBACK_HOST = '127.0.0.1';
export const DEFAULT_LOOPBACK_PORT = 8787;
export const CONNECT_TIMEOUT_MS = Number(process.env.GMAIL_OAUTH_TIMEOUT_MS || 300000);

export function resolveLoopbackFromRedirectUri(redirectUri, envPort) {
  const parsed = new URL(redirectUri);
  const host = parsed.hostname || DEFAULT_LOOPBACK_HOST;
  const port = parsed.port
    ? Number(parsed.port)
    : (parsed.protocol === 'https:' ? 443 : DEFAULT_LOOPBACK_PORT);
  const pathname = parsed.pathname || '/oauth2callback';
  const warnings = [];
  if (envPort && Number(envPort) !== port) {
    warnings.push(
      `GMAIL_OAUTH_PORT (${envPort}) differs from OAuth redirect URI port (${port}). Using redirect URI port ${port}.`,
    );
  }
  return { host, port, pathname, redirectUri, warnings };
}

export function generateOAuthState() {
  return crypto.randomBytes(32).toString('hex');
}

/** RFC 7636 PKCE pair for loopback / installed-app OAuth. */
export function generatePkcePair() {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: 'S256',
  };
}

export function validateOAuthState(received, expected) {
  if (!expected) {
    return { ok: false, reason: 'OAuth session missing state.' };
  }
  if (!received) {
    return { ok: false, reason: 'OAuth callback missing state parameter.' };
  }
  if (received !== expected) {
    return { ok: false, reason: 'OAuth state mismatch. Possible CSRF or stale callback.' };
  }
  return { ok: true };
}

export function connectTimeoutMessage(loopback) {
  return [
    'OAuth connect timed out.',
    'Check: secrets/gmail-oauth-client.json (or GMAIL_OAUTH_CLIENT_PATH)',
    `Redirect URI must match callback: ${loopback.redirectUri}`,
    'Complete browser approval and ensure redirect URI is registered in Google Cloud Console.',
    'Run: cd tools/gmail && node cli.js connect — do not reuse old auth URLs; state is one-time.',
  ].join(' ');
}

export function connectPortInUseMessage(loopback) {
  return [
    `OAuth loopback port ${loopback.port} is already in use (${loopback.redirectUri}).`,
    'Identify the process: lsof -i :' + loopback.port,
    'If it is a stale xi-io Gmail connect listener, stop that process only, then rerun: node cli.js connect',
    'Do not kill unrelated processes. Do not reuse expired OAuth URLs from prior connect attempts.',
  ].join(' ');
}

/** True when request has no OAuth params — probes must not abort connect. */
export function isOAuthCallbackProbe(searchParams) {
  const code = searchParams.get('code');
  const oauthError = searchParams.get('error');
  const state = searchParams.get('state');
  return !code && !oauthError && !state;
}

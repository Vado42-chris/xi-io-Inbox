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
  ].join(' ');
}

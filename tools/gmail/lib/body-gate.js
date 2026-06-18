export const METADATA_SCOPE = 'https://www.googleapis.com/auth/gmail.metadata';
export const READONLY_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';
export const BASE_SCOPES = ['openid', 'email'];

export const ACCESS_MODES = {
  METADATA: 'metadata',
  READONLY: 'readonly',
};

const BLOCKED_ESCALATION_SCOPES = new Set([
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://mail.google.com/',
]);

export function getAccessMode() {
  const raw = String(process.env.GMAIL_ACCESS_MODE || ACCESS_MODES.METADATA).trim().toLowerCase();
  return raw === ACCESS_MODES.READONLY ? ACCESS_MODES.READONLY : ACCESS_MODES.METADATA;
}

export function getRequestedScopes(mode = getAccessMode()) {
  if (mode === ACCESS_MODES.READONLY) {
    return [...BASE_SCOPES, METADATA_SCOPE, READONLY_SCOPE];
  }
  return [...BASE_SCOPES, METADATA_SCOPE];
}

export function parseTokenScopes(token) {
  if (!token?.scope) return [];
  return String(token.scope).split(/\s+/).filter(Boolean);
}

export function hasReadonlyScope(token) {
  return parseTokenScopes(token).includes(READONLY_SCOPE);
}

export function hasMetadataScope(token) {
  return parseTokenScopes(token).includes(METADATA_SCOPE);
}

export function hasBroadScope(token) {
  return parseTokenScopes(token).some((scope) => BLOCKED_ESCALATION_SCOPES.has(scope));
}

export function bodyGateStatus({ token, secretsConfigured, connected }) {
  const mode = getAccessMode();
  const scopes = parseTokenScopes(token);
  return {
    accessMode: mode,
    defaultMode: ACCESS_MODES.METADATA,
    readonlyOptInEnv: 'GMAIL_ACCESS_MODE=readonly',
    scopeRequiredForBodyRead: READONLY_SCOPE,
    restrictedScopeNotice: 'gmail.readonly is a restricted Google scope. Production use requires Google verification and security assessment.',
    secretsConfigured: Boolean(secretsConfigured),
    connected: Boolean(connected),
    tokenScopes: scopes,
    metadataScopeGranted: hasMetadataScope(token),
    readonlyScopeGranted: hasReadonlyScope(token),
    broadScopeBlocked: hasBroadScope(token),
    bodyReadAllowed: mode === ACCESS_MODES.READONLY && hasReadonlyScope(token),
    bodyReadBlockedReason: bodyReadBlockedReason({ mode, token, connected }),
    draftWriteBlocked: true,
    sendBlocked: true,
    mutationBlocked: true,
  };
}

export function bodyReadBlockedReason({ mode = getAccessMode(), token, connected } = {}) {
  if (mode !== ACCESS_MODES.READONLY) {
    return 'Body read requires operator opt-in: set GMAIL_ACCESS_MODE=readonly and reconnect OAuth.';
  }
  if (!connected) {
    return 'OAuth token missing. Run connect after setting GMAIL_ACCESS_MODE=readonly.';
  }
  if (!hasReadonlyScope(token)) {
    return 'Token lacks gmail.readonly scope. Reconnect with GMAIL_ACCESS_MODE=readonly.';
  }
  if (hasBroadScope(token)) {
    return 'Broad Gmail scopes are blocked for this adapter.';
  }
  return null;
}

export function assertBodyReadAllowed({ token, connected }) {
  const reason = bodyReadBlockedReason({ token, connected });
  if (reason) {
    const err = new Error(reason);
    err.code = 'BODY_READ_BLOCKED';
    throw err;
  }
}

export function blockedBodyRead(method, reason) {
  return {
    success: false,
    blocked: true,
    providerGate: reason,
    method,
    error: reason,
  };
}

export function getScopeStateForResponse(token) {
  const granted = parseTokenScopes(token);
  if (granted.length) return granted;
  return getRequestedScopes();
}

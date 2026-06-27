/**
 * RUNTIME-INGRESS-EVENT-001A — Gmail local live-read spine (strategy + event bus).
 * Tauri-only: incremental history sync when historyId exists, metadata fallback otherwise.
 */

export const MAIL_INGRESS_EVENT = 'xiio:mail-ingress';

export function dispatchMailIngressEvent(detail) {
  if (typeof document === 'undefined') return;
  document.dispatchEvent(new CustomEvent(MAIL_INGRESS_EVENT, { detail }));
}

/**
 * @param {{ historyId?: string|null, oauthConnected?: boolean, reason?: string }} input
 * @returns {'history'|'metadata'|'none'}
 */
export function resolveIngressSyncMode({ historyId = null, oauthConnected = false, reason = 'interval' } = {}) {
  if (!oauthConnected && reason !== 'manual_repair') return 'none';
  if (historyId) return 'history';
  if (oauthConnected || reason === 'manual_repair' || reason === 'startup' || reason === 'connect') return 'metadata';
  return 'none';
}

/**
 * @param {{ isTauri?: boolean, busy?: boolean, oauthConnected?: boolean, syncMode?: string }} input
 */
export function shouldSkipIngressSync({
  isTauri = false,
  busy = false,
  oauthConnected = false,
  syncMode = 'none',
} = {}) {
  if (!isTauri) return { skip: true, reason: 'static-preview' };
  if (busy) return { skip: true, reason: 'busy' };
  if (syncMode === 'none' && !oauthConnected) return { skip: true, reason: 'not-connected' };
  return { skip: false, reason: null };
}

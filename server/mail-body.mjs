import { readThreadBodies } from '../tools/gmail/lib/adapter.js';
import { bodyGateStatus } from '../tools/gmail/lib/body-gate.js';
import { loadMailIndex } from '../tools/gmail/lib/local-mail-index.js';
import { loadToken } from '../tools/gmail/lib/token-store.js';

const MAX_MESSAGES_CAP = 5;

function deriveBodyMetadata(message) {
  if (!message) return null;
  const labelIds = (message.labelIds || []).map((id) => String(id));
  return {
    sender: message.from || null,
    recipients: message.to ? String(message.to).split(',').map((entry) => entry.trim()).filter(Boolean) : [],
    date: message.date || null,
    subject: message.subject || null,
    snippet: message.snippet || message.sanitizedBodyPreview || null,
    bodyTextAvailable: Boolean(message.bodyAvailable && message.sanitizedPlainText),
    attachmentPresence: Boolean(message.hasAttachments),
    labels: labelIds,
    replyNeededCandidate: labelIds.map((id) => id.toUpperCase()).includes('UNREAD'),
    provider: message.provider || 'gmail-readonly',
    hydratedAt: new Date().toISOString(),
  };
}

export async function buildBodyGatePayload() {
  const token = await loadToken();
  const connected = Boolean(token?.access_token || token?.refresh_token);
  return bodyGateStatus({ token, secretsConfigured: true, connected });
}

/** Selected-thread body read only — no bulk import. */
export async function readSelectedThreadBody({ threadId, messageId = null, maxMessages = 1 } = {}) {
  if (!threadId) {
    return { ok: false, blocked: true, error: 'threadId required' };
  }

  const capped = Math.min(Math.max(1, Number(maxMessages) || 1), MAX_MESSAGES_CAP);
  const gate = await buildBodyGatePayload();

  if (!gate.bodyReadAllowed) {
    return {
      ok: false,
      blocked: true,
      error: gate.bodyReadBlockedReason || 'Body read blocked',
      gate,
      hydrationState: 'body_hydration_blocked',
    };
  }

  const index = await loadMailIndex().catch(() => null);
  const indexThread = index?.threads?.find((entry) => entry.id === threadId);
  const resolvedMessageId = messageId
    || indexThread?.messageIds?.[0]
    || indexThread?.messages?.[0]?.id
    || null;

  const result = await readThreadBodies({
    threadId,
    messageId: resolvedMessageId,
    maxMessages: capped,
  });
  if (!result.success) {
    const detail = result.error || result.providerGate || 'Body read failed';
    const scopeConflict = /metadata scope doesn't allow format full/i.test(detail);
    return {
      ok: false,
      blocked: Boolean(result.blocked) || scopeConflict,
      error: scopeConflict
        ? 'OAuth token includes gmail.metadata with gmail.readonly. Gmail blocks body read (format=FULL). Disconnect and reconnect Gmail to refresh scopes (readonly-only).'
        : detail,
      gate,
      hydrationState: scopeConflict ? 'body_hydration_blocked' : 'body_hydration_error',
      messageId: resolvedMessageId,
    };
  }

  const message = result.payload?.messages?.[0] || null;
  if (!message) {
    return {
      ok: false,
      blocked: false,
      error: 'Body read returned no message content for this thread.',
      gate,
      hydrationState: 'body_hydration_error',
      messageId: resolvedMessageId,
    };
  }
  const derivedMetadata = deriveBodyMetadata(message);

  return {
    ok: true,
    threadId,
    messageId: message.id || resolvedMessageId,
    messages: result.payload?.messages || [],
    derivedMetadata,
    maxMessages: capped,
    gate,
    hydrationState: 'body_hydrated',
  };
}

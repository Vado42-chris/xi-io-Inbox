const REMOTE_RESOURCE_PATTERN = /\b(?:https?|cid):[^\s"'<>]+/gi;
const HTML_TAG_PATTERN = /<[^>]+>/g;

export const DEFAULT_BODY_PREVIEW_MAX = 1200;

export function stripHtmlToText(html) {
  return String(html || '')
    .replace(REMOTE_RESOURCE_PATTERN, '[redacted-resource]')
    .replace(HTML_TAG_PATTERN, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function redactBodyContent(input, { maxLength = DEFAULT_BODY_PREVIEW_MAX } = {}) {
  const notes = [];
  let raw = String(input || '');

  if (!raw.trim()) {
    return {
      sanitizedBodyPreview: '',
      sanitizedPlainText: '',
      bodyAvailable: false,
      redactionNotes: ['empty_body'],
    };
  }

  if (/<[a-z][\s\S]*>/i.test(raw)) {
    notes.push('html_stripped');
    raw = stripHtmlToText(raw);
  }

  if (REMOTE_RESOURCE_PATTERN.test(raw)) {
    notes.push('remote_resources_removed');
    raw = raw.replace(REMOTE_RESOURCE_PATTERN, '[redacted-resource]');
  }

  if (raw.length > maxLength) {
    notes.push(`truncated_to_${maxLength}`);
    raw = `${raw.slice(0, maxLength).trim()}…`;
  }

  return {
    sanitizedBodyPreview: raw,
    sanitizedPlainText: raw,
    bodyAvailable: Boolean(raw),
    redactionNotes: notes.length ? notes : ['plain_text_redacted'],
  };
}

export function extractBodyFromPayload(payload) {
  if (!payload) return '';

  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  const parts = payload.parts || [];
  const plain = parts.find((part) => part.mimeType === 'text/plain' && part.body?.data);
  if (plain) return decodeBase64Url(plain.body.data);

  const html = parts.find((part) => part.mimeType === 'text/html' && part.body?.data);
  if (html) return decodeBase64Url(html.body.data);

  for (const part of parts) {
    const nested = extractBodyFromPayload(part);
    if (nested) return nested;
  }

  return '';
}

function decodeBase64Url(value) {
  const normalized = String(value).replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(normalized, 'base64').toString('utf8');
}

export function redactBodySnapshot(snapshot) {
  const next = structuredClone(snapshot);
  next.redactionStatus = 'applied';
  next.warnings = [...(next.warnings || []), 'Redaction pass applied to body snapshot.'];

  next.messages = (next.messages || []).map((message) => {
    const redacted = redactBodyContent(message.rawBody || message.sanitizedPlainText || message.sanitizedBodyPreview || '');
    return {
      id: message.id,
      threadId: message.threadId,
      labelIds: message.labelIds || [],
      subject: message.subject || '',
      from: message.from || '',
      to: message.to || '',
      date: message.date || '',
      unread: Boolean(message.unread),
      snippet: message.snippet || '',
      sanitizedBodyPreview: redacted.sanitizedBodyPreview,
      sanitizedPlainText: redacted.sanitizedPlainText,
      bodyAvailable: redacted.bodyAvailable,
      redactionNotes: redacted.redactionNotes,
      provider: 'gmail-readonly',
    };
  });

  next.threads = (next.threads || []).map((thread) => ({
    ...thread,
    messages: (thread.messages || []).map((message) => {
      const redacted = redactBodyContent(message.rawBody || message.sanitizedPlainText || message.sanitizedBodyPreview || '');
      return {
        id: message.id,
        threadId: message.threadId || thread.id,
        labelIds: message.labelIds || [],
        subject: message.subject || thread.subject || '',
        from: message.from || thread.from || '',
        to: message.to || '',
        date: message.date || thread.date || '',
        unread: Boolean(message.unread),
        snippet: message.snippet || thread.snippet || '',
        sanitizedBodyPreview: redacted.sanitizedBodyPreview,
        sanitizedPlainText: redacted.sanitizedPlainText,
        bodyAvailable: redacted.bodyAvailable,
        redactionNotes: redacted.redactionNotes,
        provider: 'gmail-readonly',
      };
    }),
  }));

  delete next.rawPayload;
  return next;
}

const REQUIRED_FIELDS = [
  'accountEmail',
  'generatedAt',
  'source',
  'mode',
  'scopeRequired',
  'threads',
  'messages',
  'warnings',
  'blockedCapabilities',
  'redactionStatus',
];

const FORBIDDEN_KEYS = new Set([
  'rawBody',
  'rawPayload',
  'raw',
  'attachments',
  'attachment',
  'access_token',
  'refresh_token',
  'credentials',
]);

const ALLOWED_MESSAGE_FIELDS = new Set([
  'id',
  'threadId',
  'labelIds',
  'subject',
  'from',
  'to',
  'date',
  'internalDate',
  'unread',
  'snippet',
  'sanitizedBodyPreview',
  'sanitizedPlainText',
  'bodyAvailable',
  'redactionNotes',
  'provider',
  'messages',
  'messageIds',
]);

function collectForbiddenKeys(value, pathPrefix = '', hits = []) {
  if (!value || typeof value !== 'object') return hits;
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectForbiddenKeys(entry, `${pathPrefix}[${index}]`, hits));
    return hits;
  }
  for (const [key, nested] of Object.entries(value)) {
    const nextPath = pathPrefix ? `${pathPrefix}.${key}` : key;
    if (FORBIDDEN_KEYS.has(key)) hits.push(nextPath);
    collectForbiddenKeys(nested, nextPath, hits);
  }
  return hits;
}

export function validateReadonlyBodySnapshot(snapshot) {
  const errors = [];
  if (!snapshot || typeof snapshot !== 'object') {
    return { ok: false, errors: ['snapshot must be an object'] };
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in snapshot)) errors.push(`missing required field: ${field}`);
  }

  if (snapshot.mode !== 'read-only-body') errors.push('mode must be read-only-body');
  if (snapshot.source !== 'local-gmail-cli') errors.push('source must be local-gmail-cli');
  if (snapshot.scopeRequired !== 'https://www.googleapis.com/auth/gmail.readonly') {
    errors.push('scopeRequired must be gmail.readonly');
  }

  const forbidden = collectForbiddenKeys(snapshot);
  if (forbidden.length) errors.push(`forbidden fields present: ${forbidden.join(', ')}`);

  for (const message of snapshot.messages || []) {
    for (const key of Object.keys(message)) {
      if (!ALLOWED_MESSAGE_FIELDS.has(key)) errors.push(`message field not allowed: ${key}`);
    }
    if (typeof message.sanitizedBodyPreview === 'string' && /https?:\/\//i.test(message.sanitizedBodyPreview)) {
      errors.push('sanitizedBodyPreview must not contain remote URLs');
    }
  }

  for (const capability of ['draft_write', 'send', 'provider_mutation', 'browser_oauth']) {
    if (!(snapshot.blockedCapabilities || []).includes(capability)) {
      errors.push(`blockedCapabilities must include ${capability}`);
    }
  }

  return { ok: errors.length === 0, errors };
}

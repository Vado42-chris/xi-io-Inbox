const REQUIRED_FIELDS = [
  'accountEmail',
  'generatedAt',
  'source',
  'mode',
  'labels',
  'counts',
  'threads',
  'messages',
  'warnings',
  'blockedCapabilities',
];

const FORBIDDEN_KEYS = new Set([
  'body',
  'raw',
  'rawPayload',
  'access_token',
  'refresh_token',
  'credentials',
  'attachment',
  'attachments',
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
  'provider',
  'messageIds',
  'messages',
]);

function validateMessageFields(message, path, errors) {
  for (const key of Object.keys(message || {})) {
    if (!ALLOWED_MESSAGE_FIELDS.has(key)) {
      errors.push(`${path} field not allowed: ${key}`);
    }
  }
}

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

export function validateMetadataSnapshot(snapshot) {
  const errors = [];
  if (!snapshot || typeof snapshot !== 'object') {
    return { ok: false, errors: ['snapshot must be an object'] };
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in snapshot)) errors.push(`missing required field: ${field}`);
  }

  if (snapshot.mode !== 'metadata-only') {
    errors.push('mode must be metadata-only');
  }

  if (snapshot.source !== 'local-gmail-cli') {
    errors.push('source must be local-gmail-cli');
  }

  const forbidden = collectForbiddenKeys(snapshot);
  if (forbidden.length) {
    errors.push(`forbidden fields present: ${forbidden.join(', ')}`);
  }

  (snapshot.messages || []).forEach((message, index) => {
    validateMessageFields(message, `messages[${index}]`, errors);
  });

  (snapshot.threads || []).forEach((thread, threadIndex) => {
    (thread.messages || []).forEach((message, messageIndex) => {
      validateMessageFields(message, `threads[${threadIndex}].messages[${messageIndex}]`, errors);
    });
  });

  const blocked = snapshot.blockedCapabilities || [];
  for (const capability of ['body_read', 'draft_write', 'send', 'provider_mutation']) {
    if (!blocked.includes(capability)) {
      errors.push(`blockedCapabilities must include ${capability}`);
    }
  }

  return { ok: errors.length === 0, errors };
}

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);

export const MAIL_INDEX_SCHEMA_VERSION = 1;
export const DEFAULT_MAIL_INDEX_PATH = path.join(ROOT, 'data', 'mail-index.json');
/** @deprecated Prefer resolveMailIndexPath() — kept for compatibility checks only. */
export const MAIL_INDEX_PATH = DEFAULT_MAIL_INDEX_PATH;

export const MAIL_INDEX_RECOVERY_HINT =
  'Recovery: rebuild via sync-metadata after OAuth reconnect, or remove the corrupt index after backup (tools/gmail/data/mail-index.json). Inspect wipe paths with: node cli.js wipe --dry-run';

export class MailIndexError extends Error {
  constructor(message, { code = 'MAIL_INDEX_ERROR' } = {}) {
    super(message);
    this.name = 'MailIndexError';
    this.code = code;
  }
}

export function resolveMailIndexPath(indexPath) {
  if (indexPath) return path.resolve(indexPath);
  if (process.env.GMAIL_MAIL_INDEX_PATH) return path.resolve(process.env.GMAIL_MAIL_INDEX_PATH);
  return DEFAULT_MAIL_INDEX_PATH;
}

export function createEmptyMailIndex() {
  return {
    schemaVersion: MAIL_INDEX_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    source: 'local-gmail-cli',
    mode: 'metadata-index',
    accounts: [],
    threads: [],
    messages: [],
    warnings: [],
    blockedCapabilities: ['body_read', 'draft_write', 'send', 'provider_mutation'],
  };
}

export function deriveAccountIdentity(accountEmail, provider = 'gmail') {
  if (!accountEmail) return { accountEmail: null, accountId: null, provider: null };
  return {
    accountEmail,
    accountId: `${provider}:${accountEmail}`,
    provider,
  };
}

export function stampRecord(record, { accountEmail, provider = 'gmail' } = {}) {
  if (!record || typeof record !== 'object') return record;
  const identity = deriveAccountIdentity(accountEmail || record.accountEmail, provider || record.provider || 'gmail');
  if (!identity.accountEmail) return { ...record };
  return {
    ...record,
    accountEmail: identity.accountEmail,
    accountId: identity.accountId,
    provider: identity.provider,
  };
}

export function migrateLegacyMailIndex(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new MailIndexError('Mail index file must contain a JSON object.', { code: 'INVALID_SCHEMA' });
  }
  if (raw.schemaVersion === MAIL_INDEX_SCHEMA_VERSION) {
    return normalizeMailIndexEnvelope(raw);
  }
  if (raw.schemaVersion != null && raw.schemaVersion !== MAIL_INDEX_SCHEMA_VERSION) {
    throw new MailIndexError(
      `Unsupported mail index schemaVersion: ${raw.schemaVersion}. ${MAIL_INDEX_RECOVERY_HINT}`,
      { code: 'INVALID_SCHEMA' },
    );
  }
  if (Array.isArray(raw.threads) || Array.isArray(raw.messages)) {
    return normalizeMailIndexEnvelope({
      schemaVersion: MAIL_INDEX_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      source: 'local-gmail-cli',
      mode: 'metadata-index',
      accounts: [],
      threads: raw.threads || [],
      messages: raw.messages || [],
      warnings: ['Migrated legacy mail index without schemaVersion envelope.'],
      blockedCapabilities: ['body_read', 'draft_write', 'send', 'provider_mutation'],
    });
  }
  throw new MailIndexError(
    `Unsupported mail index shape. ${MAIL_INDEX_RECOVERY_HINT}`,
    { code: 'INVALID_SCHEMA' },
  );
}

export function validateMailIndexEnvelope(index) {
  if (!index || typeof index !== 'object') {
    throw new MailIndexError('Mail index must be an object.', { code: 'INVALID_SCHEMA' });
  }
  if (index.schemaVersion !== MAIL_INDEX_SCHEMA_VERSION) {
    throw new MailIndexError(
      `Unsupported mail index schemaVersion: ${index.schemaVersion}. ${MAIL_INDEX_RECOVERY_HINT}`,
      { code: 'INVALID_SCHEMA' },
    );
  }
  if (!Array.isArray(index.threads)) {
    throw new MailIndexError('Mail index threads must be an array.', { code: 'INVALID_SCHEMA' });
  }
  if (!Array.isArray(index.messages)) {
    throw new MailIndexError('Mail index messages must be an array.', { code: 'INVALID_SCHEMA' });
  }
  if (index.accounts != null && !Array.isArray(index.accounts)) {
    throw new MailIndexError('Mail index accounts must be an array when present.', { code: 'INVALID_SCHEMA' });
  }
}

function normalizeMailIndexEnvelope(raw) {
  const envelope = {
    ...createEmptyMailIndex(),
    ...raw,
    threads: raw.threads || [],
    messages: raw.messages || [],
    accounts: raw.accounts || [],
    warnings: raw.warnings || [],
    blockedCapabilities: raw.blockedCapabilities || createEmptyMailIndex().blockedCapabilities,
  };
  validateMailIndexEnvelope(envelope);
  return envelope;
}

function isMissingFileError(err) {
  return err && (err.code === 'ENOENT' || err.code === 'ENOTDIR');
}

/**
 * Load the mail index database.
 * Missing file -> empty initialized envelope.
 * Parse/schema errors -> fail closed.
 */
export async function loadMailIndex({ indexPath } = {}) {
  const targetPath = resolveMailIndexPath(indexPath);
  try {
    const raw = await fs.readFile(targetPath, 'utf8');
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      throw new MailIndexError(
        `Mail index JSON parse failed at ${targetPath}: ${err.message}. ${MAIL_INDEX_RECOVERY_HINT}`,
        { code: 'CORRUPT_INDEX' },
      );
    }
    return migrateLegacyMailIndex(parsed);
  } catch (err) {
    if (err instanceof MailIndexError) throw err;
    if (isMissingFileError(err)) return createEmptyMailIndex();
    throw new MailIndexError(
      `Unable to read mail index at ${targetPath}: ${err.message}. ${MAIL_INDEX_RECOVERY_HINT}`,
      { code: 'READ_FAILED' },
    );
  }
}

/**
 * Atomic write: temp file in same directory, then rename.
 */
export async function saveMailIndex(index, { indexPath } = {}) {
  const targetPath = resolveMailIndexPath(indexPath);
  validateMailIndexEnvelope(index);
  const payload = {
    ...index,
    updatedAt: new Date().toISOString(),
  };
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  const tempPath = `${targetPath}.${process.pid}.${Date.now()}.tmp`;
  try {
    const content = JSON.stringify(payload, null, 2) + '\n';
    await fs.writeFile(tempPath, content, 'utf8');
    await fs.rename(tempPath, targetPath);
  } catch (err) {
    try {
      await fs.unlink(tempPath);
    } catch {
      // ignore cleanup failure
    }
    throw err;
  }
  return payload;
}

/**
 * Merges an incoming message with an existing one to preserve redacted body fields.
 */
export function mergeMessage(existing, incoming) {
  const merged = {
    ...existing,
    ...incoming,
  };
  if (existing.sanitizedBodyPreview && !incoming.sanitizedBodyPreview) {
    merged.sanitizedBodyPreview = existing.sanitizedBodyPreview;
  }
  if (existing.sanitizedPlainText && !incoming.sanitizedPlainText) {
    merged.sanitizedPlainText = existing.sanitizedPlainText;
  }
  if (existing.bodyAvailable !== undefined && incoming.bodyAvailable === undefined) {
    merged.bodyAvailable = existing.bodyAvailable;
  }
  if (existing.redactionNotes && !incoming.redactionNotes) {
    merged.redactionNotes = existing.redactionNotes;
  }
  if (existing.accountEmail && !incoming.accountEmail) {
    merged.accountEmail = existing.accountEmail;
  }
  if (existing.accountId && !incoming.accountId) {
    merged.accountId = existing.accountId;
  }
  if (existing.provider && !incoming.provider) {
    merged.provider = existing.provider;
  }
  return merged;
}

/**
 * Merges an incoming thread with an existing thread.
 */
export function mergeThread(existing, incoming) {
  const mergedMessagesMap = new Map();
  for (const m of existing.messages || []) {
    mergedMessagesMap.set(m.id, m);
  }
  for (const m of incoming.messages || []) {
    const oldMsg = mergedMessagesMap.get(m.id);
    mergedMessagesMap.set(m.id, oldMsg ? mergeMessage(oldMsg, m) : m);
  }

  const messages = [...mergedMessagesMap.values()];
  messages.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

  const merged = {
    ...existing,
    ...incoming,
    messages,
    messageIds: messages.map((m) => m.id),
  };

  merged.labelIds = [...new Set(messages.flatMap((m) => m.labelIds || []))];
  merged.unread = messages.some((m) => m.unread);

  return merged;
}

function upsertAccountRecord(index, accountEmail, provider = 'gmail') {
  const identity = deriveAccountIdentity(accountEmail, provider);
  if (!identity.accountEmail) return;
  const exists = (index.accounts || []).some((entry) => entry.accountId === identity.accountId);
  if (!exists) {
    index.accounts = [...(index.accounts || []), identity];
  }
}

/**
 * Incremental upsert of threads and messages into the index envelope.
 */
export async function upsertToMailIndex({
  threads = [],
  messages = [],
  accountEmail = null,
  provider = 'gmail',
  indexPath,
} = {}) {
  const index = await loadMailIndex({ indexPath });
  upsertAccountRecord(index, accountEmail, provider);

  const stampedThreads = threads.map((thread) => stampRecord(thread, { accountEmail, provider }));
  const stampedMessages = messages.map((message) => stampRecord(message, { accountEmail, provider }));

  const messageMap = new Map();
  for (const m of index.messages) {
    messageMap.set(m.id, m);
  }
  for (const m of stampedMessages) {
    const existing = messageMap.get(m.id);
    messageMap.set(m.id, existing ? mergeMessage(existing, m) : m);
  }

  const threadMap = new Map();
  for (const t of index.threads) {
    threadMap.set(t.id, t);
  }
  for (const t of stampedThreads) {
    const existing = threadMap.get(t.id);
    threadMap.set(t.id, existing ? mergeThread(existing, t) : t);
  }

  for (const t of threadMap.values()) {
    for (const m of t.messages || []) {
      const existing = messageMap.get(m.id);
      messageMap.set(m.id, existing ? mergeMessage(existing, stampRecord(m, { accountEmail, provider })) : stampRecord(m, { accountEmail, provider }));
    }
  }

  for (const [, t] of threadMap.entries()) {
    const updatedMessages = (t.messages || []).map((m) => messageMap.get(m.id) || m);
    t.messages = updatedMessages;
    t.labelIds = [...new Set(updatedMessages.flatMap((m) => m.labelIds || []))];
    t.unread = updatedMessages.some((m) => m.unread);
  }

  index.messages = [...messageMap.values()];
  index.threads = [...threadMap.values()];

  await saveMailIndex(index, { indexPath });
  return index;
}

export function summarizeThreadForQuery(thread, { includeBodyPreview = false } = {}) {
  const messages = thread.messages || [];
  const latestMessage = messages.at(-1) || null;
  const summary = {
    id: thread.id,
    subject: thread.subject || latestMessage?.subject || null,
    from: thread.from || latestMessage?.from || latestMessage?.fromEmail || null,
    date: thread.date || latestMessage?.date || null,
    labelIds: thread.labelIds || [],
    unread: Boolean(thread.unread),
    accountEmail: thread.accountEmail || latestMessage?.accountEmail || null,
    accountId: thread.accountId || latestMessage?.accountId || null,
    provider: thread.provider || latestMessage?.provider || null,
    messageCount: messages.length,
  };
  if (includeBodyPreview) {
    summary.sanitizedBodyPreview =
      latestMessage?.sanitizedBodyPreview || thread.sanitizedBodyPreview || null;
  }
  return summary;
}

/**
 * Query threads from the index. Default output is metadata summary only (no message bodies).
 */
export async function queryMailIndex({
  labelId,
  accountEmail,
  accountId,
  limit = 25,
  offset = 0,
  sort = 'desc',
  includeBodyPreview = false,
  indexPath,
} = {}) {
  const index = await loadMailIndex({ indexPath });
  let threads = index.threads || [];

  if (accountEmail) {
    threads = threads.filter((t) => t.accountEmail === accountEmail);
  }
  if (accountId) {
    threads = threads.filter((t) => t.accountId === accountId);
  }
  if (labelId) {
    threads = threads.filter((t) => (t.labelIds || []).includes(labelId));
  }

  threads.sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return sort === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const total = threads.length;
  const sliced = threads.slice(offset, offset + limit).map((thread) =>
    summarizeThreadForQuery(thread, { includeBodyPreview }),
  );

  return {
    total,
    threads: sliced,
    limit,
    offset,
    sort,
    ...(accountEmail ? { accountEmail } : {}),
    ...(accountId ? { accountId } : {}),
    ...(labelId ? { labelId } : {}),
    includeBodyPreview: Boolean(includeBodyPreview),
  };
}

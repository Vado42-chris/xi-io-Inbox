import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);
export const MAIL_INDEX_PATH = path.join(ROOT, 'data', 'mail-index.json');

/**
 * Load the mail index database.
 * If file does not exist, return an empty database structure.
 */
export async function loadMailIndex() {
  try {
    const raw = await fs.readFile(MAIL_INDEX_PATH, 'utf8');
    const data = JSON.parse(raw);
    return {
      threads: data.threads || [],
      messages: data.messages || [],
    };
  } catch {
    return {
      threads: [],
      messages: [],
    };
  }
}

/**
 * Write the mail index database to disk.
 */
export async function saveMailIndex(index) {
  await fs.mkdir(path.dirname(MAIL_INDEX_PATH), { recursive: true });
  const content = JSON.stringify(index, null, 2) + '\n';
  await fs.writeFile(MAIL_INDEX_PATH, content, 'utf8');
}

/**
 * Merges an incoming message with an existing one to preserve redacted body fields.
 */
export function mergeMessage(existing, incoming) {
  const merged = {
    ...existing,
    ...incoming,
  };
  // Preserve body fields if present in existing but missing/undefined/null in incoming
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
  // Sort messages in thread by date (or ID if no date)
  messages.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

  const merged = {
    ...existing,
    ...incoming,
    messages,
    messageIds: messages.map((m) => m.id),
  };

  // Re-calculate thread labelIds as union of its message labelIds
  merged.labelIds = [...new Set(messages.flatMap((m) => m.labelIds || []))];
  
  // Re-calculate thread unread status if any message is unread
  merged.unread = messages.some((m) => m.unread);

  return merged;
}

/**
 * Incremental upsert of threads and messages into the index.
 */
export async function upsertToMailIndex({ threads = [], messages = [] } = {}) {
  const index = await loadMailIndex();

  // 1. Process messages
  const messageMap = new Map();
  for (const m of index.messages) {
    messageMap.set(m.id, m);
  }
  for (const m of messages) {
    const existing = messageMap.get(m.id);
    messageMap.set(m.id, existing ? mergeMessage(existing, m) : m);
  }

  // 2. Process threads
  const threadMap = new Map();
  for (const t of index.threads) {
    threadMap.set(t.id, t);
  }
  for (const t of threads) {
    const existing = threadMap.get(t.id);
    threadMap.set(t.id, existing ? mergeThread(existing, t) : t);
  }

  // Ensure all messages belonging to threads are also in the top-level messages list
  for (const t of threadMap.values()) {
    for (const m of t.messages || []) {
      const existing = messageMap.get(m.id);
      messageMap.set(m.id, existing ? mergeMessage(existing, m) : m);
    }
  }

  // Ensure thread lists inside threads match the updated top-level messages
  for (const [id, t] of threadMap.entries()) {
    const updatedMessages = (t.messages || []).map((m) => messageMap.get(m.id) || m);
    t.messages = updatedMessages;
    t.labelIds = [...new Set(updatedMessages.flatMap((m) => m.labelIds || []))];
    t.unread = updatedMessages.some((m) => m.unread);
  }

  index.messages = [...messageMap.values()];
  index.threads = [...threadMap.values()];

  await saveMailIndex(index);
  return index;
}

/**
 * Query threads from the index.
 */
export async function queryMailIndex({ labelId, limit = 25, offset = 0, sort = 'desc' } = {}) {
  const index = await loadMailIndex();
  let threads = index.threads;

  // Filter by label
  if (labelId) {
    threads = threads.filter((t) => (t.labelIds || []).includes(labelId));
  }

  // Sort by date (default desc, recent-first)
  threads.sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return sort === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const total = threads.length;
  const sliced = threads.slice(offset, offset + limit);

  return {
    total,
    threads: sliced,
    limit,
    offset,
  };
}

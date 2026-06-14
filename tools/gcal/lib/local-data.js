import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { wipeToken, tokenPath } from './token-store.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DATA_DIR = path.join(ROOT, 'data');
const RECEIPTS_DIR = path.join(ROOT, 'receipts');
export const SNAPSHOT_PATH = path.join(DATA_DIR, 'calendar-snapshot.json');

async function listFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile()).map((entry) => path.join(dir, entry.name));
  } catch {
    return [];
  }
}

export async function wipeLocalAdapterData({ dryRun = false } = {}) {
  const targets = [
    { path: tokenPath(), kind: 'token' },
    { path: SNAPSHOT_PATH, kind: 'calendar_snapshot' },
  ];

  for (const filePath of await listFiles(RECEIPTS_DIR)) {
    targets.push({ path: filePath, kind: 'receipt' });
  }

  for (const filePath of await listFiles(DATA_DIR)) {
    if (!targets.some((target) => target.path === filePath)) {
      targets.push({ path: filePath, kind: 'data' });
    }
  }

  const removed = [];
  for (const target of targets) {
    try {
      await fs.access(target.path);
      if (!dryRun) await fs.unlink(target.path);
      removed.push(target);
    } catch {
      // missing paths are fine
    }
  }

  return { dryRun, removed, paths: removed.map((entry) => entry.path) };
}

import fs from 'fs/promises';
import path from 'path';
import { wipeToken, tokenPath } from './token-store.js';
import { resolveDataDir, resolveReceiptsDir } from './runtime-paths.js';

export function snapshotPath() {
  return path.join(resolveDataDir(), 'metadata-snapshot.json');
}

export function bodySnapshotPath() {
  return path.join(resolveDataDir(), 'readonly-body-snapshot.json');
}

/** @deprecated Use snapshotPath() — kept for CLI imports that load after env setup. */
export const SNAPSHOT_PATH = snapshotPath();
/** @deprecated Use bodySnapshotPath() — kept for CLI imports that load after env setup. */
export const BODY_SNAPSHOT_PATH = bodySnapshotPath();

function receiptsDir() {
  return resolveReceiptsDir();
}

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
    { path: snapshotPath(), kind: 'metadata_snapshot' },
    { path: bodySnapshotPath(), kind: 'readonly_body_snapshot' },
  ];

  for (const filePath of await listFiles(receiptsDir())) {
    targets.push({ path: filePath, kind: 'receipt' });
  }

  for (const filePath of await listFiles(resolveDataDir())) {
    if (!targets.some((target) => target.path === filePath)) {
      targets.push({ path: filePath, kind: 'data' });
    }
  }

  const removed = [];
  for (const target of targets) {
    try {
      await fs.access(target.path);
      if (!dryRun) {
        await fs.unlink(target.path);
      }
      removed.push(target);
    } catch {
      // missing paths are fine
    }
  }

  return {
    dryRun,
    removed,
    paths: removed.map((entry) => entry.path),
  };
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const RECEIPTS_DIR = path.join(ROOT, 'receipts');

function ensureDir() {
  if (!fs.existsSync(RECEIPTS_DIR)) fs.mkdirSync(RECEIPTS_DIR, { recursive: true });
}

export function writeReceipt({ method, success, blocked, error }) {
  ensureDir();
  const id = `receipt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const row = {
    id,
    at: new Date().toISOString(),
    method,
    success,
    blocked,
    error: error || null,
    note: 'Local only. No tokens or private payloads stored in receipt files.',
  };
  fs.writeFileSync(path.join(RECEIPTS_DIR, `${id}.json`), `${JSON.stringify(row, null, 2)}\n`, 'utf8');
  return id;
}

export function wipeReceipts() {
  fs.rmSync(RECEIPTS_DIR, { recursive: true, force: true });
}

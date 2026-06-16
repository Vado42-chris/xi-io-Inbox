import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ADAPTER_ROOT = path.dirname(__dirname);

/** Adapter install root (code + default relative data). */
export function resolveAdapterRoot() {
  if (process.env.GMAIL_ADAPTER_ROOT) {
    return path.resolve(process.env.GMAIL_ADAPTER_ROOT);
  }
  return ADAPTER_ROOT;
}

/** Runtime-owned data directory (tokens, snapshots, mail index). Never browser localStorage. */
export function resolveDataDir() {
  if (process.env.GMAIL_ADAPTER_DATA_DIR) {
    return path.resolve(process.env.GMAIL_ADAPTER_DATA_DIR);
  }
  return path.join(resolveAdapterRoot(), 'data');
}

/** Runtime-owned receipt directory for sync/connect audit rows. */
export function resolveReceiptsDir() {
  if (process.env.GMAIL_RECEIPTS_DIR) {
    return path.resolve(process.env.GMAIL_RECEIPTS_DIR);
  }
  return path.join(resolveAdapterRoot(), 'receipts');
}

export function resolveMailIndexPath(indexPath) {
  if (indexPath) return path.resolve(indexPath);
  if (process.env.GMAIL_MAIL_INDEX_PATH) return path.resolve(process.env.GMAIL_MAIL_INDEX_PATH);
  return path.join(resolveDataDir(), 'mail-index.json');
}

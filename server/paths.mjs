import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const SERVER_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function repoRoot() {
  return SERVER_ROOT;
}

export function publicRoot() {
  return path.join(SERVER_ROOT, 'public');
}

export function resolveXiioDataDir() {
  const configured = process.env.XIIO_DATA_DIR;
  if (configured) return path.resolve(configured);
  return path.join(os.homedir(), '.xiio', 'inbox');
}

/** Must run before importing tools/gmail adapter modules. */
export function configureGmailRuntimeEnv() {
  const dataRoot = path.join(resolveXiioDataDir(), 'gmail-provider');
  process.env.GMAIL_ADAPTER_DATA_DIR = path.join(dataRoot, 'data');
  process.env.GMAIL_RECEIPTS_DIR = path.join(dataRoot, 'receipts');
  process.env.GMAIL_MAIL_INDEX_PATH = path.join(dataRoot, 'data', 'mail-index.json');
  if (!process.env.GMAIL_OAUTH_CLIENT_PATH) {
    process.env.GMAIL_OAUTH_CLIENT_PATH = path.join(SERVER_ROOT, 'secrets', 'gmail-oauth-client.json');
  }
  if (!process.env.GMAIL_ACCESS_MODE) {
    process.env.GMAIL_ACCESS_MODE = 'readonly';
  }
}

export async function ensureRuntimeDirs() {
  configureGmailRuntimeEnv();
  await fs.mkdir(process.env.GMAIL_ADAPTER_DATA_DIR, { recursive: true, mode: 0o700 });
  await fs.mkdir(process.env.GMAIL_RECEIPTS_DIR, { recursive: true, mode: 0o700 });
}

export function defaultListenPort() {
  return Number(process.env.XIIO_LOCAL_WEB_PORT || 8788);
}

export function publicBaseUrl(port = defaultListenPort()) {
  const host = process.env.XIIO_LOCAL_WEB_HOST || '127.0.0.1';
  return `http://${host}:${port}`;
}

export function expectedRuntimeDataDir() {
  return path.join(resolveXiioDataDir(), 'gmail-provider', 'data');
}

/** Fail fast if local web runtime resolves Gmail data outside ~/.xiio. */
export function assertLocalWebRuntimePaths() {
  configureGmailRuntimeEnv();
  const dataDir = path.resolve(process.env.GMAIL_ADAPTER_DATA_DIR || '');
  const expected = path.resolve(expectedRuntimeDataDir());
  if (dataDir !== expected) {
    throw new Error(`Local web runtime data dir must be ${expected}, got ${dataDir || '(unset)'}`);
  }
  const forbidden = `${path.sep}tools${path.sep}gmail${path.sep}`;
  if (dataDir.includes(forbidden)) {
    throw new Error(`Local web runtime must not use tools/gmail data dir: ${dataDir}`);
  }
}

export async function resolveLocalWebRuntimeTokenPath() {
  assertLocalWebRuntimePaths();
  const { tokenPath } = await import('../tools/gmail/lib/token-store.js');
  const resolved = path.resolve(tokenPath());
  const expectedDir = path.resolve(expectedRuntimeDataDir());
  if (!resolved.startsWith(`${expectedDir}${path.sep}`) && resolved !== path.join(expectedDir, 'token.json')) {
    throw new Error(`Token path must live under ${expectedDir}, resolved ${resolved}`);
  }
  if (resolved.includes(`${path.sep}tools${path.sep}gmail${path.sep}`)) {
    throw new Error(`Token path must not resolve under tools/gmail: ${resolved}`);
  }
  return resolved;
}

import fs from 'fs/promises';
import path from 'path';
import { resolveDataDir } from './runtime-paths.js';

const DATA_DIR = resolveDataDir();
const DATA_DIR_MODE = 0o700;
const TOKEN_PATH = path.join(DATA_DIR, 'token.json');
const TOKEN_FILE_MODE = 0o600;

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true, mode: DATA_DIR_MODE });
  await fs.chmod(DATA_DIR, DATA_DIR_MODE);
}

export async function loadToken() {
  try {
    const raw = await fs.readFile(TOKEN_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveToken(tokens) {
  await ensureDataDir();
  await fs.writeFile(TOKEN_PATH, `${JSON.stringify(tokens, null, 2)}\n`, {
    encoding: 'utf8',
    mode: TOKEN_FILE_MODE,
  });
  await fs.chmod(TOKEN_PATH, TOKEN_FILE_MODE);
}

export async function wipeToken() {
  try {
    await fs.unlink(TOKEN_PATH);
    return true;
  } catch {
    return false;
  }
}

export function tokenPath() {
  return TOKEN_PATH;
}

export function tokenFileMode() {
  return TOKEN_FILE_MODE;
}

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DATA_DIR = path.join(ROOT, 'data');
const TOKEN_PATH = path.join(DATA_DIR, 'token.json');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
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
  await fs.writeFile(TOKEN_PATH, `${JSON.stringify(tokens, null, 2)}\n`, 'utf8');
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

import fs from 'fs/promises';
import path from 'path';
import { resolveDataDir } from './runtime-paths.js';

const DATA_DIR_MODE = 0o700;
const TOKEN_FILE_MODE = 0o600;

function dataDir() {
  return resolveDataDir();
}

function tokenFilePath() {
  return path.join(dataDir(), 'token.json');
}

async function ensureDataDir() {
  const dir = dataDir();
  await fs.mkdir(dir, { recursive: true, mode: DATA_DIR_MODE });
  await fs.chmod(dir, DATA_DIR_MODE);
}

export async function loadToken() {
  try {
    const raw = await fs.readFile(tokenFilePath(), 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveToken(tokens) {
  await ensureDataDir();
  const filePath = tokenFilePath();
  await fs.writeFile(filePath, `${JSON.stringify(tokens, null, 2)}\n`, {
    encoding: 'utf8',
    mode: TOKEN_FILE_MODE,
  });
  await fs.chmod(filePath, TOKEN_FILE_MODE);
}

export async function wipeToken() {
  try {
    await fs.unlink(tokenFilePath());
    return true;
  } catch {
    return false;
  }
}

export function tokenPath() {
  return tokenFilePath();
}

export function tokenFileMode() {
  return TOKEN_FILE_MODE;
}

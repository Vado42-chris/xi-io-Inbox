import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_SECRET_PATHS = [
  'secrets/API Key/olamma-api-xi-io.txt',
  'secrets/google/olamma-api-xi-io.txt',
  'secrets/ollama-api-xi-io.txt',
];

export function resolveApiKey({ root, secretsFile, apiKeyEnv = 'OLLAMA_API_KEY' } = {}) {
  if (process.env[apiKeyEnv]?.trim()) {
    return { source: `env:${apiKeyEnv}`, apiKey: process.env[apiKeyEnv].trim() };
  }

  if (secretsFile) {
    const absolute = path.isAbsolute(secretsFile) ? secretsFile : path.join(root, secretsFile);
    if (!fs.existsSync(absolute)) {
      throw new Error(`secrets file not found: ${secretsFile}`);
    }
    return { source: secretsFile, apiKey: fs.readFileSync(absolute, 'utf8').trim() };
  }

  for (const relative of DEFAULT_SECRET_PATHS) {
    const absolute = path.join(root, relative);
    if (fs.existsSync(absolute)) {
      return { source: relative, apiKey: fs.readFileSync(absolute, 'utf8').trim() };
    }
  }

  return { source: null, apiKey: null };
}

export function resolveHost({ hostFlag, apiKeyPresent }) {
  if (hostFlag === 'local') {
    return process.env.OLLAMA_HOST?.trim() || 'http://127.0.0.1:11434';
  }
  if (hostFlag === 'cloud') {
    return process.env.OLLAMA_HOST?.trim() || 'https://ollama.com';
  }
  if (process.env.OLLAMA_HOST?.trim()) {
    return process.env.OLLAMA_HOST.trim();
  }
  if (hostFlag) {
    return hostFlag;
  }
  if (apiKeyPresent) {
    return 'https://ollama.com';
  }
  return 'http://127.0.0.1:11434';
}

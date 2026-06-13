import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  redactBodyContent,
  redactBodySnapshotFile,
  validateMetadataSnapshot,
  validateReadonlyBodySnapshot,
} from '../lib/adapter.js';
import {
  bodyGateStatus,
  READONLY_SCOPE,
} from '../lib/body-gate.js';
import {
  loadToken,
  saveToken,
  tokenFileMode,
  tokenPath,
  wipeToken,
} from '../lib/token-store.js';

const metadataBase = {
  accountEmail: 'sample.user@example.com',
  generatedAt: '2026-06-13T00:00:00.000Z',
  source: 'local-gmail-cli',
  mode: 'metadata-only',
  labels: [],
  counts: {},
  threads: [],
  messages: [],
  warnings: [],
  blockedCapabilities: ['body_read', 'draft_write', 'send', 'provider_mutation'],
};

const nestedMetadataLeak = {
  ...metadataBase,
  threads: [{ id: 't1', messages: [{ id: 'm1', threadId: 't1', sanitizedBodyPreview: 'body-like nested field' }] }],
};
const nestedMetadataResult = validateMetadataSnapshot(nestedMetadataLeak);
assert.equal(nestedMetadataResult.ok, false);
assert.match(nestedMetadataResult.errors.join('; '), /threads\[0\]\.messages\[0\] field not allowed: sanitizedBodyPreview/);

const bodyBase = {
  accountEmail: 'sample.user@example.com',
  generatedAt: '2026-06-13T00:00:00.000Z',
  source: 'local-gmail-cli',
  mode: 'read-only-body',
  scopeRequired: READONLY_SCOPE,
  threads: [],
  messages: [],
  warnings: [],
  blockedCapabilities: ['draft_write', 'send', 'provider_mutation', 'browser_oauth'],
  redactionStatus: 'applied',
};

const nestedBodyUrlLeak = {
  ...bodyBase,
  threads: [{ id: 't1', messages: [{ id: 'm1', threadId: 't1', sanitizedPlainText: 'open javascript:alert(1)' }] }],
};
const nestedBodyResult = validateReadonlyBodySnapshot(nestedBodyUrlLeak);
assert.equal(nestedBodyResult.ok, false);
assert.match(nestedBodyResult.errors.join('; '), /sanitizedPlainText must not contain/);

const unsafeRedaction = redactBodyContent('<a href="javascript:alert(1)">open</a> data:text/html;base64,abc');
assert.doesNotMatch(unsafeRedaction.sanitizedPlainText, /javascript:|data:/i);

const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'xiio-gmail-hardening-'));
const inputPath = path.join(tmpDir, 'body.json');
await fs.writeFile(inputPath, `${JSON.stringify({
  ...bodyBase,
  messages: [{ id: 'm1', threadId: 't1', rawBody: '<img src="https://track.example/pixel.png">safe' }],
})}\n`, 'utf8');

const redactedSummary = await redactBodySnapshotFile({ inputPath });
assert.equal(redactedSummary.success, true);
assert.equal(Object.hasOwn(redactedSummary.payload, 'snapshot'), false);
assert.equal(redactedSummary.payload.messageCount, 1);

const redactedWithPayload = await redactBodySnapshotFile({ inputPath, includePayload: true });
assert.equal(Object.hasOwn(redactedWithPayload.payload, 'snapshot'), true);

const priorToken = await loadToken();
await saveToken({ access_token: 'test-access-token', scope: READONLY_SCOPE });
const mode = (await fs.stat(tokenPath())).mode & 0o777;
assert.equal(mode, tokenFileMode());
if (priorToken) await saveToken(priorToken);
else await wipeToken();

const previousAccessMode = process.env.GMAIL_ACCESS_MODE;
process.env.GMAIL_ACCESS_MODE = 'readonly';
const readonlyGate = bodyGateStatus({
  token: { scope: `openid email ${READONLY_SCOPE}` },
  secretsConfigured: true,
  connected: true,
});
assert.equal(readonlyGate.bodyReadAllowed, true);
assert.equal(readonlyGate.bodyReadBlockedReason, null);
if (previousAccessMode === undefined) delete process.env.GMAIL_ACCESS_MODE;
else process.env.GMAIL_ACCESS_MODE = previousAccessMode;

console.log('hardening: pass');

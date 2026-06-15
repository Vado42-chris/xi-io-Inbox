import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  guardMethod,
  invokeBlocked,
  metadataListParams,
  MetadataQueryError,
  assertReadonlyBodyExportSelection,
  validateMetadataSnapshot,
  validateReadonlyBodySnapshot,
  redactBodyContent,
  redactBodySnapshot,
} from '../lib/adapter.js';
import {
  bodyGateStatus,
  getAccessMode,
  ACCESS_MODES,
} from '../lib/body-gate.js';
import {
  validateOAuthState,
  resolveLoopbackFromRedirectUri,
} from '../lib/oauth-loopback.js';

const blockedMethods = [
  'gmail.drafts.create',
  'gmail.drafts.send',
  'gmail.users.messages.send',
  'gmail.users.messages.modify',
  'gmail.users.messages.trash',
  'gmail.users.messages.delete',
  'gmail.users.drafts.create',
];

for (const method of blockedMethods) {
  const res = guardMethod(method);
  assert.equal(res.blocked, true, `${method} must be blocked`);
  assert.equal(res.success, false, `${method} must fail closed`);
}

const bodyBlocked = guardMethod('gmail.messages.getBody');
assert.equal(bodyBlocked.blocked, true);

const unknown = await invokeBlocked('gmail.messages.getBody');
assert.equal(unknown.blocked, true);

const samplePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../public/data/gmail-metadata.sample.json',
);
const sample = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
assert.equal(validateMetadataSnapshot(sample).ok, true);

const bodySamplePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../public/data/gmail-body.sample.json',
);
const bodySample = JSON.parse(fs.readFileSync(bodySamplePath, 'utf8'));
assert.equal(validateReadonlyBodySnapshot(bodySample).ok, true, validateReadonlyBodySnapshot(bodySample).errors?.join('; '));

const htmlRedacted = redactBodyContent('<img src="https://evil.example/track.png">Hello <b>team</b>');
assert.equal(htmlRedacted.bodyAvailable, true);
assert.doesNotMatch(htmlRedacted.sanitizedBodyPreview, /https?:\/\//);

const dirtySnapshot = redactBodySnapshot({
  accountEmail: 'sample.user@example.com',
  generatedAt: '2026-06-12T00:00:00.000Z',
  source: 'local-gmail-cli',
  mode: 'read-only-body',
  scopeRequired: 'https://www.googleapis.com/auth/gmail.readonly',
  threads: [],
  messages: [{ id: 'm1', threadId: 't1', rawBody: '<a href="https://track.example/x">link</a> text' }],
  warnings: [],
  blockedCapabilities: ['draft_write', 'send', 'provider_mutation', 'browser_oauth'],
  redactionStatus: 'pending',
});
assert.equal(validateReadonlyBodySnapshot(dirtySnapshot).ok, true);

assert.equal(getAccessMode(), ACCESS_MODES.METADATA);
const gate = bodyGateStatus({ token: null, secretsConfigured: false, connected: false });
assert.equal(gate.bodyReadAllowed, false);
assert.match(gate.bodyReadBlockedReason, /GMAIL_ACCESS_MODE=readonly/);

assert.equal(validateOAuthState('expected', 'expected').ok, true);
const loopback = resolveLoopbackFromRedirectUri('http://127.0.0.1:8787/oauth2callback', '9999');
assert.equal(loopback.port, 8787);

assert.deepEqual(metadataListParams({ query: 'in:inbox', maxResults: 25 }), {
  userId: 'me',
  maxResults: 25,
  labelIds: ['INBOX'],
});
assert.deepEqual(metadataListParams({ maxResults: 10 }), {
  userId: 'me',
  maxResults: 10,
  labelIds: ['INBOX'],
});
assert.deepEqual(metadataListParams({ query: 'in:sent', maxResults: 5 }), {
  userId: 'me',
  maxResults: 5,
  labelIds: ['SENT'],
});
assert.deepEqual(metadataListParams({ labelIds: ['STARRED'], maxResults: 10 }), {
  userId: 'me',
  maxResults: 10,
  labelIds: ['STARRED'],
});
assert.throws(
  () => metadataListParams({ query: 'from:someone@example.com', maxResults: 10 }),
  MetadataQueryError,
);
assert.throws(
  () => metadataListParams({ query: 'in:customlabel', maxResults: 10 }),
  MetadataQueryError,
);
assert.equal(Object.hasOwn(metadataListParams({ query: 'in:inbox', maxResults: 10 }), 'q'), false);

console.log('metadata-guards: pass');

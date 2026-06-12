import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  guardMethod,
  invokeBlocked,
  validateMetadataSnapshot,
  validateOAuthState,
  resolveLoopbackFromRedirectUri,
} from '../lib/adapter.js';

const blockedMethods = [
  'gmail.messages.getBody',
  'gmail.messages.get',
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

const unknown = await invokeBlocked('gmail.messages.getBody');
assert.equal(unknown.blocked, true);

const samplePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../public/data/gmail-metadata.sample.json',
);
const sample = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
const sampleValidation = validateMetadataSnapshot(sample);
assert.equal(sampleValidation.ok, true, sampleValidation.errors?.join('; '));

const badSnapshot = {
  ...sample,
  body: 'must-not-export',
};
const badValidation = validateMetadataSnapshot(badSnapshot);
assert.equal(badValidation.ok, false);

const state = 'abc123';
assert.equal(validateOAuthState(state, state).ok, true);
assert.equal(validateOAuthState(null, state).ok, false);
assert.equal(validateOAuthState('wrong', state).ok, false);

const loopback = resolveLoopbackFromRedirectUri('http://127.0.0.1:8787/oauth2callback', '9999');
assert.equal(loopback.port, 8787);
assert.match(loopback.warnings.join(' '), /GMAIL_OAUTH_PORT/);

console.log('metadata-guards: pass');

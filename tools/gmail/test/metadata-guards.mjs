import assert from 'node:assert/strict';
import { guardMethod, invokeBlocked } from '../lib/adapter.js';

const blockedMethods = [
  'gmail.messages.getBody',
  'gmail.drafts.create',
  'gmail.drafts.send',
  'gmail.users.messages.send',
  'gmail.users.drafts.create',
];

for (const method of blockedMethods) {
  const res = guardMethod(method);
  assert.equal(res.blocked, true, `${method} must be blocked`);
  assert.equal(res.success, false, `${method} must fail closed`);
}

const unknown = await invokeBlocked('gmail.messages.getBody');
assert.equal(unknown.blocked, true);

console.log('metadata-guards: pass');

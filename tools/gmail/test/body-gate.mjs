import assert from 'node:assert/strict';
import {
  assertReadonlyBodyExportSelection,
} from '../lib/adapter.js';
import {
  bodyGateStatus,
  getAccessMode,
  getRequestedScopes,
  hasReadonlyScope,
  READONLY_SCOPE,
  ACCESS_MODES,
} from '../lib/body-gate.js';

assert.throws(
  () => assertReadonlyBodyExportSelection({}),
  /requires explicit --message-id/,
);
assert.doesNotThrow(() => assertReadonlyBodyExportSelection({ messageId: 'm1' }));
assert.doesNotThrow(() => assertReadonlyBodyExportSelection({ threadId: 't1' }));
assert.doesNotThrow(() => assertReadonlyBodyExportSelection({ inputPath: '/tmp/body.json' }));
assert.doesNotThrow(() => assertReadonlyBodyExportSelection({ allowBatchReadonlyExport: true }));

assert.deepEqual(getRequestedScopes(ACCESS_MODES.METADATA), [
  'openid',
  'email',
  'https://www.googleapis.com/auth/gmail.metadata',
]);

assert.ok(getRequestedScopes(ACCESS_MODES.READONLY).includes(READONLY_SCOPE));
assert.ok(!getRequestedScopes(ACCESS_MODES.READONLY).includes('https://www.googleapis.com/auth/gmail.metadata'));

process.env.GMAIL_ACCESS_MODE = 'readonly';

const conflictToken = { scope: `openid email ${READONLY_SCOPE} https://www.googleapis.com/auth/gmail.metadata` };
const conflictGate = bodyGateStatus({ token: conflictToken, secretsConfigured: true, connected: true });
assert.equal(conflictGate.bodyReadAllowed, false);
assert.match(conflictGate.bodyReadBlockedReason, /gmail\.metadata with gmail\.readonly/);

const readonlyToken = { scope: `openid email ${READONLY_SCOPE}` };
assert.equal(hasReadonlyScope(readonlyToken), true);

const gate = bodyGateStatus({ token: readonlyToken, secretsConfigured: true, connected: true });
assert.equal(gate.readonlyScopeGranted, true);
assert.equal(gate.bodyReadAllowed, true);
assert.equal(gate.bodyReadBlockedReason, null);

delete process.env.GMAIL_ACCESS_MODE;
const metadataModeGate = bodyGateStatus({ token: readonlyToken, secretsConfigured: true, connected: true });
assert.equal(metadataModeGate.bodyReadAllowed, false);
assert.match(metadataModeGate.bodyReadBlockedReason, /GMAIL_ACCESS_MODE=readonly/);

console.log('body-gate: pass');

import assert from 'node:assert/strict';
import {
  bodyGateStatus,
  getAccessMode,
  getRequestedScopes,
  hasReadonlyScope,
  READONLY_SCOPE,
  ACCESS_MODES,
} from '../lib/body-gate.js';

assert.deepEqual(getRequestedScopes(ACCESS_MODES.METADATA), [
  'openid',
  'email',
  'https://www.googleapis.com/auth/gmail.metadata',
]);

assert.ok(getRequestedScopes(ACCESS_MODES.READONLY).includes(READONLY_SCOPE));

const readonlyToken = { scope: `openid email ${READONLY_SCOPE}` };
assert.equal(hasReadonlyScope(readonlyToken), true);

const gate = bodyGateStatus({ token: readonlyToken, secretsConfigured: true, connected: true });
assert.equal(gate.readonlyScopeGranted, true);
assert.equal(gate.bodyReadAllowed, false);
assert.match(gate.bodyReadBlockedReason, /GMAIL_ACCESS_MODE=readonly/);

console.log('body-gate: pass');

import assert from 'node:assert/strict';
import {
  CONNECT_TIMEOUT_MS,
  connectTimeoutMessage,
  generateOAuthState,
  resolveLoopbackFromRedirectUri,
  validateOAuthState,
} from '../lib/oauth-loopback.js';

assert.ok(CONNECT_TIMEOUT_MS >= 60000);
assert.equal(generateOAuthState().length, 64);

const loopback = resolveLoopbackFromRedirectUri('http://127.0.0.1:8787/oauth2callback');
assert.equal(loopback.host, '127.0.0.1');
assert.equal(loopback.port, 8787);
assert.equal(loopback.pathname, '/oauth2callback');

const mismatch = resolveLoopbackFromRedirectUri('http://127.0.0.1:8787/oauth2callback', '9999');
assert.ok(mismatch.warnings.length > 0);

assert.equal(validateOAuthState('expected', 'expected').ok, true);
assert.equal(validateOAuthState('', 'expected').ok, false);
assert.match(connectTimeoutMessage(loopback), /OAuth connect timed out/);
assert.match(connectTimeoutMessage(loopback), /redirect URI/i);

console.log('oauth-hardening: pass');

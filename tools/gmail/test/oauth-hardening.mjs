import assert from 'node:assert/strict';
import {
  CONNECT_TIMEOUT_MS,
  connectTimeoutMessage,
  connectPortInUseMessage,
  isOAuthCallbackProbe,
  generateOAuthState,
  generatePkcePair,
  resolveLoopbackFromRedirectUri,
  validateOAuthState,
} from '../lib/oauth-loopback.js';

assert.ok(CONNECT_TIMEOUT_MS >= 60000);
assert.equal(generateOAuthState().length, 64);

const pkce = generatePkcePair();
assert.ok(pkce.codeVerifier.length >= 43);
assert.ok(pkce.codeChallenge.length >= 43);
assert.equal(pkce.codeChallengeMethod, 'S256');
assert.notEqual(pkce.codeVerifier, pkce.codeChallenge);

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
assert.match(connectPortInUseMessage(loopback), /lsof -i :8787/);
assert.match(connectPortInUseMessage(loopback), /Do not kill unrelated/);

const probe = new URLSearchParams('');
assert.equal(isOAuthCallbackProbe(probe), true);
assert.equal(isOAuthCallbackProbe(new URLSearchParams('code=abc&state=xyz')), false);
assert.equal(isOAuthCallbackProbe(new URLSearchParams('error=access_denied')), false);

console.log('oauth-hardening: pass');

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

for (const file of [
  'server/local-web-runtime.mjs',
  'server/paths.mjs',
  'server/http-utils.mjs',
  'server/gmail-oauth.mjs',
  'server/mail-sync.mjs',
  'server/mail-body.mjs',
  'server/account-labels.mjs',
]) {
  if (!fs.existsSync(path.join(root, file))) {
    console.error(`local-web-runtime-001-model-check: missing ${file}`);
    process.exit(1);
  }
}

const previewJs = fs.readFileSync(path.join(root, 'public/inbox-preview.js'), 'utf8');
const pkg = fs.readFileSync(path.join(root, 'package.json'), 'utf8');

for (const token of [
  'detectLocalWebRuntime',
  'loadLocalWebMailArtifacts',
  'isLocalWebRuntime',
  'local-web-connected',
  'local-web-cached-offline',
  'localWebBodyBlockedReason',
  'localWebRuntimeModeCopy',
  'localWebReadingPaneModeCopy',
  'connectionState',
  'hydrationState',
  'derivedMetadata',
  '/api/gmail/oauth/start',
  '/api/mail/status',
]) {
  if (!previewJs.includes(token)) {
    console.error(`local-web-runtime-001-model-check: preview missing ${token}`);
    process.exit(1);
  }
}

for (const token of [
  'local:web',
  'check:localwebruntime001',
  '/api/health',
  '/api/mail/threads',
  '/api/mail/sync',
  '/api/mail/labels',
  '/body',
]) {
  const haystack = token.startsWith('/')
    ? fs.readFileSync(path.join(root, 'server/local-web-runtime.mjs'), 'utf8')
    : pkg;
  if (!haystack.includes(token)) {
    console.error(`local-web-runtime-001-model-check: missing ${token}`);
    process.exit(1);
  }
}

const mailBodyServer = fs.readFileSync(path.join(root, 'server/mail-body.mjs'), 'utf8');
for (const token of ['readSelectedThreadBody', 'readThreadBodies', 'maxMessages', 'deriveBodyMetadata', 'derivedMetadata']) {
  if (!mailBodyServer.includes(token)) {
    console.error(`local-web-runtime-001-model-check: mail-body missing ${token}`);
    process.exit(1);
  }
}

for (const token of [
  'fetchLocalWebThreadBody',
  'renderOwnerLocalWebReadingPane',
  '/api/mail/threads/',
  'queueLocalWebBodyHydration',
  'runtimeGmailLabelsForNav',
  'labelSyncState',
  '/api/mail/labels',
]) {
  if (!previewJs.includes(token)) {
    console.error(`local-web-runtime-001-model-check: preview missing ${token}`);
    process.exit(1);
  }
}

const oauthServer = fs.readFileSync(path.join(root, 'server/gmail-oauth.mjs'), 'utf8');
for (const token of [
  'generatePkcePair',
  'code_challenge',
  'code_challenge_method',
  'codeVerifier: session.codeVerifier',
  'pendingOAuthSessions',
  'OAuth token must not save under tools/gmail',
]) {
  if (!oauthServer.includes(token)) {
    console.error(`local-web-runtime-001-model-check: gmail-oauth missing ${token}`);
    process.exit(1);
  }
}

const mailSyncServer = fs.readFileSync(path.join(root, 'server/mail-sync.mjs'), 'utf8');
for (const token of ['resolveConnectionState', 'connectionState', 'hydrationState', 'cached_offline', 'accountLabels']) {
  if (!mailSyncServer.includes(token)) {
    console.error(`local-web-runtime-001-model-check: mail-sync missing ${token}`);
    process.exit(1);
  }
}

const accountLabelsServer = fs.readFileSync(path.join(root, 'server/account-labels.mjs'), 'utf8');
for (const token of ['syncGmailAccountLabels', 'buildAccountLabelsPayload', 'labels_synced', 'providerLabelId']) {
  if (!accountLabelsServer.includes(token)) {
    console.error(`local-web-runtime-001-model-check: account-labels missing ${token}`);
    process.exit(1);
  }
}

const runtimeServer = fs.readFileSync(path.join(root, 'server/local-web-runtime.mjs'), 'utf8');
for (const token of [
  'assertLocalWebRuntimePaths',
  'resolveLocalWebRuntimeTokenPath',
  'tokenPath:',
  'await import(',
]) {
  if (!runtimeServer.includes(token)) {
    console.error(`local-web-runtime-001-model-check: local-web-runtime missing ${token}`);
    process.exit(1);
  }
}

const {
  assertLocalWebRuntimePaths,
  configureGmailRuntimeEnv,
  resolveLocalWebRuntimeTokenPath,
} = await import('../server/paths.mjs');

configureGmailRuntimeEnv();
assertLocalWebRuntimePaths();
const resolvedTokenPath = await resolveLocalWebRuntimeTokenPath();
if (resolvedTokenPath.includes(`${path.sep}tools${path.sep}gmail${path.sep}`)) {
  console.error(`local-web-runtime-001-model-check: token path resolves to tools/gmail: ${resolvedTokenPath}`);
  process.exit(1);
}
if (!resolvedTokenPath.includes(`${path.sep}.xiio${path.sep}`)) {
  console.error(`local-web-runtime-001-model-check: token path must be under ~/.xiio, got ${resolvedTokenPath}`);
  process.exit(1);
}

console.log('local-web-runtime-001-model-check: pass');

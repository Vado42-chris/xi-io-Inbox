#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();

const readPerm = fs.readFileSync(path.join(root, 'src-tauri/permissions/allow-gmail-runtime-read.toml'), 'utf8');
const syncPerm = fs.readFileSync(path.join(root, 'src-tauri/permissions/allow-gmail-runtime-sync.toml'), 'utf8');
const capability = fs.readFileSync(path.join(root, 'src-tauri/capabilities/default.toml'), 'utf8');
const bridgeJs = fs.readFileSync(path.join(root, 'public/src/runtime/gmail-runtime-bridge.js'), 'utf8');
const previewJs = fs.readFileSync(path.join(root, 'public/inbox-preview.js'), 'utf8');

const readAllowed = ['runtime_store_boundary', 'gmail_provider_mail_index'];
const syncAllowed = [
  'gmail_provider_connect',
  'gmail_provider_sync_metadata',
  'gmail_provider_sync_history',
  'gmail_provider_sync_status',
  'gmail_provider_mail_index',
  'runtime_store_boundary',
];

const blockedEverywhere = [
  'gmail_provider_plan_sync',
  'gmail_provider_status',
  'body_read',
  'draft_write',
  'send',
  'mutation',
  'github',
  'automation',
];

for (const command of readAllowed) {
  if (!readPerm.includes(command)) {
    console.error(`runtime-002b-model-check: read permission missing ${command}`);
    process.exit(1);
  }
}

for (const command of syncAllowed) {
  if (!syncPerm.includes(command)) {
    console.error(`runtime-002b-model-check: sync permission missing ${command}`);
    process.exit(1);
  }
}

for (const live of ['gmail_provider_connect', 'gmail_provider_sync_metadata', 'gmail_provider_sync_history']) {
  if (readPerm.includes(live)) {
    console.error(`runtime-002b-model-check: live command ${live} must not be in read permission`);
    process.exit(1);
  }
}

for (const blocked of blockedEverywhere) {
  if (syncPerm.includes(blocked) && blocked.startsWith('gmail_')) {
    console.error(`runtime-002b-model-check: unexpected command exposure ${blocked} in sync permission`);
    process.exit(1);
  }
}

if (!capability.includes('allow-gmail-runtime-read') || !capability.includes('allow-gmail-runtime-sync')) {
  console.error('runtime-002b-model-check: main capability must include read and sync permissions');
  process.exit(1);
}

for (const fn of [
  'safeInvokeRuntime',
  'getRuntimeStatus',
  'getRuntimeSyncStatus',
  'connectGmailProvider',
  'syncGmailMetadata',
  'syncGmailHistory',
  'refreshRuntimeMail',
]) {
  if (!bridgeJs.includes(`function ${fn}`) && !bridgeJs.includes(`export async function ${fn}`) && !bridgeJs.includes(`export function ${fn}`)) {
    if (!bridgeJs.includes(fn)) {
      console.error(`runtime-002b-model-check: bridge missing ${fn}`);
      process.exit(1);
    }
  }
}

if (!bridgeJs.includes('if (!isTauriRuntime())')) {
  console.error('runtime-002b-model-check: bridge missing Tauri runtime gate');
  process.exit(1);
}

for (const handler of [
  'runRuntimeGmailConnect',
  'runRuntimeGmailSyncNow',
  'runRuntimeGmailSyncHistory',
  'reloadRuntimeMailIndexAfterSync',
  'runtimeOrchestration.indexError',
]) {
  if (!previewJs.includes(handler)) {
    console.error(`runtime-002b-model-check: preview missing ${handler}`);
    process.exit(1);
  }
}

if (!previewJs.includes('runtime-connect-gmail') || !previewJs.includes('runtime-sync-metadata')) {
  console.error('runtime-002b-model-check: preview missing runtime orchestration actions');
  process.exit(1);
}

console.log('runtime-002b-model-check: pass');

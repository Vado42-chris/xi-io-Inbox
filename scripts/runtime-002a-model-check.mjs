#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();

const requiredFiles = [
  'src-tauri/src/gmail_provider/mail_index.rs',
  'src-tauri/capabilities/default.toml',
  'src-tauri/permissions/allow-gmail-runtime-read.toml',
  'public/src/runtime/gmail-runtime-bridge.js',
  'docs/ui/reviews/runtime-002a-mail-index-read-bridge-receipt.md',
];

const libRs = fs.readFileSync(path.join(root, 'src-tauri/src/lib.rs'), 'utf8');
const bridgeJs = fs.readFileSync(path.join(root, 'public/src/runtime/gmail-runtime-bridge.js'), 'utf8');
const previewJs = fs.readFileSync(path.join(root, 'public/inbox-preview.js'), 'utf8');
const capability = fs.readFileSync(path.join(root, 'src-tauri/capabilities/default.toml'), 'utf8');
const permission = fs.readFileSync(path.join(root, 'src-tauri/permissions/allow-gmail-runtime-read.toml'), 'utf8');
const mailIndexRs = fs.readFileSync(path.join(root, 'src-tauri/src/gmail_provider/mail_index.rs'), 'utf8');

for (const file of requiredFiles) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) {
    console.error(`runtime-002a-model-check: missing ${file}`);
    process.exit(1);
  }
}

if (!libRs.includes('gmail_provider_mail_index')) {
  console.error('runtime-002a-model-check: missing gmail_provider_mail_index command');
  process.exit(1);
}

for (const blocked of ['gmail_provider_connect', 'gmail_provider_sync_metadata', 'gmail_provider_sync_history']) {
  if (permission.includes(blocked)) {
    console.error(`runtime-002a-model-check: live command ${blocked} must not be in read capability`);
    process.exit(1);
  }
}

for (const allowed of ['gmail_provider_mail_index', 'runtime_store_boundary']) {
  if (!permission.includes(allowed)) {
    console.error(`runtime-002a-model-check: missing allowed command ${allowed} in capability permission`);
    process.exit(1);
  }
}

if (!capability.includes('allow-gmail-runtime-read')) {
  console.error('runtime-002a-model-check: main capability must include allow-gmail-runtime-read');
  process.exit(1);
}

if (!bridgeJs.includes('gmail_provider_mail_index')) {
  console.error('runtime-002a-model-check: bridge missing gmail_provider_mail_index invoke');
  process.exit(1);
}

if (!bridgeJs.includes('isTauriRuntime')) {
  console.error('runtime-002a-model-check: bridge missing isTauriRuntime');
  process.exit(1);
}

if (!previewJs.includes('loadRuntimeMailArtifacts')) {
  console.error('runtime-002a-model-check: preview missing loadRuntimeMailArtifacts');
  process.exit(1);
}

if (!previewJs.includes('mailIndexThreads')) {
  console.error('runtime-002a-model-check: preview missing mailIndexThreads');
  process.exit(1);
}

if (!mailIndexRs.includes('project_mail_index_for_ui')) {
  console.error('runtime-002a-model-check: mail_index missing UI projection');
  process.exit(1);
}

if (!mailIndexRs.includes('validate_mail_index')) {
  console.error('runtime-002a-model-check: mail_index missing schema validation');
  process.exit(1);
}

console.log('runtime-002a-model-check: pass');

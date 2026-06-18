#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();

const requiredFiles = [
  'src-tauri/Cargo.toml',
  'src-tauri/tauri.conf.json',
  'src-tauri/src/lib.rs',
  'src-tauri/src/runtime_store.rs',
  'src-tauri/src/gmail_provider/mod.rs',
  'src-tauri/src/gmail_provider/sidecar.rs',
  'src-tauri/src/gmail_provider/redaction.rs',
  'src-tauri/src/gmail_provider/args.rs',
  'tools/gmail/lib/runtime-paths.js',
  'docs/architecture/runtime-store-boundary-v1.md',
];

const libRs = fs.readFileSync(path.join(root, 'src-tauri/src/lib.rs'), 'utf8');
const sidecarRs = fs.readFileSync(path.join(root, 'src-tauri/src/gmail_provider/sidecar.rs'), 'utf8');
const requiredCommands = [
  'runtime_store_boundary',
  'gmail_provider_status',
  'gmail_provider_sync_status',
  'gmail_provider_plan_sync',
  'gmail_provider_connect',
  'gmail_provider_sync_metadata',
  'gmail_provider_sync_history',
];

for (const file of requiredFiles) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) {
    console.error(`runtime-001-model-check: missing ${file}`);
    process.exit(1);
  }
}

for (const command of requiredCommands) {
  if (!libRs.includes(command)) {
    console.error(`runtime-001-model-check: missing Tauri command ${command} in src-tauri/src/lib.rs`);
    process.exit(1);
  }
}

for (const allowed of ['status', 'sync-status', 'sync-plan', 'connect', 'sync-metadata', 'sync-history']) {
  if (!sidecarRs.includes(`"${allowed}"`)) {
    console.error(`runtime-001-model-check: missing allowlisted sidecar command ${allowed}`);
    process.exit(1);
  }
}

if (sidecarRs.includes('"wipe" => Ok')) {
  console.error('runtime-001-model-check: blocked sidecar command wipe must not be allowlisted');
  process.exit(1);
}

if (!sidecarRs.includes('SidecarCommand::parse')) {
  console.error('runtime-001-model-check: missing SidecarCommand allowlist parser');
  process.exit(1);
}

const runtimePaths = fs.readFileSync(path.join(root, 'tools/gmail/lib/runtime-paths.js'), 'utf8');
for (const symbol of ['resolveDataDir', 'resolveReceiptsDir', 'resolveMailIndexPath']) {
  if (!runtimePaths.includes(`export function ${symbol}`)) {
    console.error(`runtime-001-model-check: missing ${symbol} in runtime-paths.js`);
    process.exit(1);
  }
}

const syncStatus = fs.readFileSync(path.join(root, 'tools/gmail/lib/sync-status.js'), 'utf8');
if (!syncStatus.includes('resolveTokenStorageLabel')) {
  console.error('runtime-001-model-check: sync-status missing runtime tokenStorage label helper');
  process.exit(1);
}

const redaction = fs.readFileSync(path.join(root, 'src-tauri/src/gmail_provider/redaction.rs'), 'utf8');
if (!redaction.includes('deep_redact_json')) {
  console.error('runtime-001-model-check: missing deep_redact_json');
  process.exit(1);
}

const boundaryDoc = fs.readFileSync(path.join(root, 'docs/architecture/runtime-store-boundary-v1.md'), 'utf8');
if (!boundaryDoc.includes('GMAIL_ADAPTER_DATA_DIR')) {
  console.error('runtime-001-model-check: runtime store boundary doc missing env contract');
  process.exit(1);
}

console.log('runtime-001-model-check: pass');

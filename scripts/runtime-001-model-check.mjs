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
  'tools/gmail/lib/runtime-paths.js',
  'docs/architecture/runtime-store-boundary-v1.md',
];

const libRs = fs.readFileSync(path.join(root, 'src-tauri/src/lib.rs'), 'utf8');
const requiredCommands = [
  'gmail_provider_status',
  'gmail_provider_sync_status',
  'gmail_provider_plan_sync',
  'runtime_store_boundary',
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

const runtimePaths = fs.readFileSync(path.join(root, 'tools/gmail/lib/runtime-paths.js'), 'utf8');
for (const symbol of ['resolveDataDir', 'resolveReceiptsDir', 'resolveMailIndexPath']) {
  if (!runtimePaths.includes(`export function ${symbol}`)) {
    console.error(`runtime-001-model-check: missing ${symbol} in runtime-paths.js`);
    process.exit(1);
  }
}

const boundaryDoc = fs.readFileSync(path.join(root, 'docs/architecture/runtime-store-boundary-v1.md'), 'utf8');
if (!boundaryDoc.includes('GMAIL_ADAPTER_DATA_DIR')) {
  console.error('runtime-001-model-check: runtime store boundary doc missing env contract');
  process.exit(1);
}

console.log('runtime-001-model-check: pass');

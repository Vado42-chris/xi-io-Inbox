#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  gitBranch,
  gitHead,
  liveOAuthRecorded,
  readLiveOAuthMarker,
  runStep,
  writeEvidence,
} from './lib/automated-gate/runtime-002c.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  return {
    writeEvidence: argv.includes('--write-evidence'),
    ollamaDraft: argv.includes('--ollama-draft'),
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const cargoManifest = path.join(root, 'src-tauri/Cargo.toml');
  const skipCargo = process.env.CI === 'true' && process.env.TAURI_CI !== '1';

  const steps = [
    runStep(root, 'refresh loop unit tests', process.execPath, [
      path.join(root, 'scripts/test/runtime-002c-refresh-loop.test.mjs'),
    ]),
    runStep(root, 'check:runtime002c', npmCmd, ['run', 'check:runtime002c', '--silent']),
    runStep(root, 'check:runtime002b', npmCmd, ['run', 'check:runtime002b', '--silent']),
    runStep(root, 'check:runtime002a', npmCmd, ['run', 'check:runtime002a', '--silent']),
    runStep(root, 'check:runtime001', npmCmd, ['run', 'check:runtime001', '--silent']),
  ];

  if (skipCargo) {
    steps.push({
      label: 'cargo test',
      ok: true,
      output: 'skipped in CI (Static Preview Check has no Rust/GTK deps; run npm run check:full locally or TAURI-CI-001)',
    });
  } else {
    steps.push(runStep(root, 'cargo test', 'cargo', ['test', '--manifest-path', cargoManifest]));
  }

  if (options.ollamaDraft) {
    steps.push(runStep(root, 'peer-review:ollama runtime-002c --write', npmCmd, [
      'run', 'peer-review:ollama', '--silent', '--',
      '--slice', 'runtime-002c', '--write',
    ], { optional: true }));
  }

  const head = gitHead(root);
  const branch = gitBranch(root);
  const decisionTokens = ['RUNTIME_002C_AUTOMATED_STRUCTURAL_GATE_PASS'];

  let liveOAuthLine = '**Not recorded** — optional marker missing (`secrets/runtime-002c-oauth-consent.complete`, gitignored).';
  if (liveOAuthRecorded(root)) {
    const marker = readLiveOAuthMarker(root);
    liveOAuthLine = `**Recorded** — ${marker || '(marker file present, empty)'}`;
    decisionTokens.push('RUNTIME_002C_LIVE_OAUTH_CONSENT_RECORDED');
    decisionTokens.push('RUNTIME_002C_GATE_PASS_READY_FOR_PEER_REVIEW');
  } else {
    liveOAuthLine += ' Human step after automated gate: Connect Gmail once in Tauri, then create the marker file (see runbook).';
  }

  if (options.writeEvidence) {
    const outPath = writeEvidence(root, { head, branch, steps, liveOAuthLine, decisionTokens });
    console.log(`gate:runtime002c: evidence → ${path.relative(root, outPath)}`);
  }

  console.log('gate:runtime002c: pass');
  for (const token of decisionTokens) {
    console.log(`gate:runtime002c: ${token}`);
  }
}

main().catch((error) => {
  console.error(`gate:runtime002c: fail — ${error.message}`);
  process.exit(1);
});

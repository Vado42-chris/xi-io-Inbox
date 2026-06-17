/** Baked slice profiles — prompts and file lists live here so operators never re-type them. */

export const SLICE_PROFILES = {
  'runtime-002b': {
    id: 'RUNTIME-002B',
    title: 'RUNTIME-002B — Peer Review',
    implementationReceipt: 'docs/ui/reviews/runtime-002b-connect-sync-ui-orchestration-receipt.md',
    boundaryDoc: 'docs/architecture/runtime-store-boundary-v1.md',
    priorDecisionToken: 'RUNTIME_002B_PASS_READY_FOR_RUNTIME_002B_PEER_REVIEW',
    passDecisionToken: 'RUNTIME_002B_PEER_REVIEW_PASS_READY_FOR_RUNTIME_002C',
    partialDecisionToken: 'RUNTIME_002B_PEER_REVIEW_PARTIAL_FIXES_REQUIRED',
    nextPass: 'RUNTIME-002C — refresh loop + operator OAuth proof',
    modelCloud: 'qwen3-coder:480b-cloud',
    modelLocal: 'qwen3-coder:30b',
    checks: [
      'npm run check:runtime002b',
      'npm run check:runtime002a',
      'npm run check:runtime001',
      'cargo test --manifest-path src-tauri/Cargo.toml',
    ],
    excludedScope: [
      'RUNTIME-002C refresh loop + operator OAuth proof',
      'Mail UI polish',
      'GitHub / Ibal product wiring',
      'Body read, draft write, send, archive/delete/label mutation, automation execution',
      'Operator OAuth end-to-end proof claim',
      'UI-003E claim / PR ready-for-review',
      'Demo-removal WIP',
    ],
    reviewSections: [
      { heading: 'Capability split result', focus: 'Read ACL vs sync ACL; live commands not in read permission; main window binds both.' },
      { heading: 'JS bridge orchestration result', focus: 'safeInvokeRuntime gate; connect/sync helpers; static preview returns structured non-invoke failures.' },
      { heading: 'Connect UI result', focus: 'Connect Gmail triggers gmail_provider_connect in Tauri only.' },
      { heading: 'Sync UI result', focus: 'Bounded sync-metadata and sync-history; honest disabled copy when historyId missing.' },
      { heading: 'Post-sync refresh result', focus: 'reloadRuntimeMailIndexAfterSync after successful connect/sync.' },
      { heading: 'Static fallback result', focus: 'npm run dev unchanged; JSON paths preserved.' },
      { heading: 'Error handling result', focus: 'Corrupt index sets runtimeOrchestration.indexError without crashing init.' },
      { heading: 'Egress gate result', focus: 'No body/draft/send/mutation/GitHub/automation exposure.' },
    ],
    files: [
      { path: 'src-tauri/permissions/allow-gmail-runtime-read.toml', focus: 'Read-only command ACL' },
      { path: 'src-tauri/permissions/allow-gmail-runtime-sync.toml', focus: 'Live connect/sync ACL' },
      { path: 'src-tauri/capabilities/default.toml', focus: 'Main window capability binding' },
      { path: 'public/src/runtime/gmail-runtime-bridge.js', focus: 'Bridge orchestration + invoke gate' },
      {
        path: 'public/inbox-preview.js',
        focus: 'Runtime orchestration UI handlers (extracted windows)',
        extractPatterns: [
          'runRuntimeGmailConnect',
          'runRuntimeGmailSyncNow',
          'runRuntimeGmailSyncHistory',
          'reloadRuntimeMailIndexAfterSync',
          'runtimeOrchestration',
          'runtime-connect-gmail',
        ],
      },
      { path: 'scripts/runtime-002b-model-check.mjs', focus: 'Structural guard alignment' },
      { path: 'docs/ui/reviews/runtime-002b-connect-sync-ui-orchestration-receipt.md', focus: 'Scope alignment' },
      { path: 'docs/architecture/runtime-store-boundary-v1.md', focus: 'Store + command contract' },
      { path: 'package.json', focus: 'check:runtime002b wiring' },
    ],
  },
  'runtime-002a': {
    id: 'RUNTIME-002A',
    title: 'RUNTIME-002A — Peer Review',
    implementationReceipt: 'docs/ui/reviews/runtime-002a-mail-index-read-bridge-receipt.md',
    boundaryDoc: 'docs/architecture/runtime-store-boundary-v1.md',
    priorDecisionToken: 'RUNTIME_002A_PASS_READY_FOR_PEER_REVIEW',
    passDecisionToken: 'RUNTIME_002A_PEER_REVIEW_PASS_READY_FOR_RUNTIME_002B',
    partialDecisionToken: 'RUNTIME_002A_PEER_REVIEW_PARTIAL_FIXES_REQUIRED',
    nextPass: 'RUNTIME-002B — connect/sync UI orchestration',
    modelCloud: 'qwen3-coder:480b-cloud',
    modelLocal: 'qwen3-coder:30b',
    checks: [
      'npm run check:runtime002a',
      'npm run check:runtime001',
      'cargo test --manifest-path src-tauri/Cargo.toml',
    ],
    excludedScope: [
      'RUNTIME-002B / RUNTIME-002C implementation',
      'Live OAuth operator proof',
      'Mail UI polish',
      'GitHub / Ibal',
      'Body read, draft write, send, mutation, automation execution',
      'UI-003E claim / PR ready-for-review',
    ],
    reviewSections: [
      { heading: 'Read command result', focus: 'mail_index read-only path, schema validation, projection, redaction.' },
      { heading: 'Schema validation result', focus: 'Fail-closed envelope validation.' },
      { heading: 'Runtime path isolation result', focus: 'App-data only; no public/data reads.' },
      { heading: 'Redaction result', focus: 'Body/forbidden fields stripped before return.' },
      { heading: 'Capability ACL result', focus: 'Read permission only; connect/sync blocked.' },
      { heading: 'JS bridge / static fallback result', focus: 'isTauriRuntime gate; static preview unchanged.' },
    ],
    files: [
      { path: 'src-tauri/src/gmail_provider/mail_index.rs', focus: 'Read path + projection' },
      { path: 'src-tauri/permissions/allow-gmail-runtime-read.toml', focus: 'Read ACL' },
      { path: 'public/src/runtime/gmail-runtime-bridge.js', focus: 'Bridge invoke gate' },
      { path: 'scripts/runtime-002a-model-check.mjs', focus: 'Structural guard' },
      { path: 'docs/ui/reviews/runtime-002a-mail-index-read-bridge-receipt.md', focus: 'Scope alignment' },
    ],
  },
  generic: {
    id: 'GENERIC',
    title: 'Generic slice peer review',
    implementationReceipt: null,
    boundaryDoc: null,
    priorDecisionToken: 'SLICE_IMPLEMENTATION_COMPLETE',
    passDecisionToken: 'SLICE_PEER_REVIEW_PASS',
    partialDecisionToken: 'SLICE_PEER_REVIEW_PARTIAL_FIXES_REQUIRED',
    nextPass: 'Owner-defined next slice',
    modelCloud: 'qwen3-coder:480b-cloud',
    modelLocal: 'qwen3-coder:30b',
    checks: ['npm run check:quick'],
    excludedScope: ['Live OAuth proof', 'UI-003E PASS claim', 'PR ready-for-review claim'],
    reviewSections: [
      { heading: 'Scope alignment result', focus: 'Changes match stated slice scope.' },
      { heading: 'Security / egress result', focus: 'No secrets, no unintended provider mutation.' },
      { heading: 'Validation result', focus: 'Checks named in slice profile should pass.' },
    ],
    files: [],
    requiresFiles: true,
  },
};

export function listSliceIds() {
  return Object.keys(SLICE_PROFILES);
}

export function getSliceProfile(sliceId) {
  const profile = SLICE_PROFILES[sliceId];
  if (!profile) {
    throw new Error(`Unknown slice profile "${sliceId}". Run with --list-slices.`);
  }
  return profile;
}

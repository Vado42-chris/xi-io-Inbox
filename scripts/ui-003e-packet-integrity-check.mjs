import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packetPath = path.join(root, 'docs/ui/reviews/ui-003e-owner-visual-proof-packet.md');
const packet = fs.readFileSync(packetPath, 'utf8');

assert.match(packet, /Owner visual proof complete: NO \(pending owner review\)/);
assert.match(packet, /PR #12 merge readiness: BLOCKED/);
assert.match(packet, /GATE-UI-VISUAL-001: partial \(ready for owner review\)/);
assert.doesNotMatch(packet, /Owner visual proof complete: YES \(PASS\)/);
assert.doesNotMatch(packet, /Reviewer: Chris & AI Agent verification/);
assert.doesNotMatch(packet, /Merge to `main` \(Approved/);
assert.match(packet, /ui-003e-owner-session-runbook\.md/);

console.log('ui-003e-packet-integrity-check: pass');

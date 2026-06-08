# xi-io Inbox TODO

## Pass 1: bootstrap governance

Status: complete.

- [x] Create bootstrap issue.
- [x] Create source audit issue.
- [x] Create Android mail spine issue.
- [x] Add README.
- [x] Add product invariants.
- [x] Add draft-only egress policy.
- [x] Add source audit index.
- [x] Add model-provider layer plan.
- [x] Add monetization guardrails.
- [x] Add Android mail spine decision stub.
- [x] Add framework alignment doc.
- [x] Add portable inbox archive draft.
- [x] Add automation bridge plan.
- [x] Add initial schema stubs.
- [x] Add provider manifest schema.
- [x] Add AI provider manifest schema.
- [x] Add initial roadmap.
- [x] Add framework freshness issue back to `xi-io.net`.

## Pass 2: source mining and framework freshness

Status: complete for issue-level and initial file-level audit. Runtime import remains blocked.

- [x] Mine `xi-io.net` issues for provider registry, event schema, receipts, verifier gate, calendar, Ibal, and workbench contracts.
- [x] Mine `realitypools.tv` issues for calendar/event/component candidates.
- [x] Mine `google_planner` issues for approval-gated workflow patterns.
- [x] Search `xi-io_docuforge` issues for export/review packet patterns, limited issue evidence found.
- [x] Search `xi-io_AuDHD-field-guide` issues for consent/capture patterns, additional meaning UI evidence found.
- [x] Create source candidate matrix.
- [x] Identify initial reusable docs/schemas to update in `xi-io.net`.
- [x] Perform initial file-level audit for repos where issue search found limited evidence.
- [x] Update source candidate matrix after file-level audit.
- [x] Add framework-side pass 2 note to `xi-io.net#233`.

## Pass 3: Android mail spine proof plan

Status: architecture audit, operator packets, and Cursor execution prompt complete on branch `pass3/android-mail-spine-audit`; local build proof still pending.

- [x] Complete Thunderbird Android license and architecture audit.
- [x] Define preliminary fork strategy.
- [x] Define preliminary package/app rename implications.
- [x] Define preliminary provider configuration implications.
- [x] Define smallest local build proof.
- [x] Decide preliminary full fork vs sidecar-first experiment.
- [x] Add upstream build-proof packet for `ARCH-002`.
- [x] Add fork identity/provider configuration packet for `ARCH-003`.
- [x] Add Pass 3B status note.
- [x] Add Cursor execution prompt for `ARCH-002`.
- [ ] Execute local upstream build proof.
- [ ] Record build evidence or classified failure on `xi-io-Inbox#6`.
- [ ] Complete detailed license/NOTICE/dependency review before distribution.
- [ ] Finalize package/application ID, redirect URI, and provider configuration plan.

## Pass 4: runtime skeleton

Blocked until Pass 3 local build proof is complete.

- [ ] Create app skeleton or import chosen mail spine.
- [ ] Add schema validation tooling.
- [ ] Add example events/proposals.
- [ ] Add tests for schemas.
- [ ] Add CI.

## Pass estimate

Current estimated work to reach repo-ready MVP planning state: 1 remaining pass after ARCH-002 prompt handoff.

Current estimated work to reach buildable Android proof: 5 to 7 remaining passes, depending on local Thunderbird build complexity and upstream configuration requirements.

Current estimated work to complete documentation, code commenting, compliance, and two-way framework freshness for initial MVP: 8 to 12 remaining passes.

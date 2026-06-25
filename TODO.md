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

Status: architecture audit, operator packets, Cursor execution prompt, and docs-only merge decision complete. Local build proof still pending.

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
- [x] Add Pass 3E docs-only merge decision.
- [ ] Execute local upstream build proof.
- [ ] Record build evidence or classified failure on `xi-io-Inbox#6`.
- [ ] Complete detailed license/NOTICE/dependency review before distribution.
- [ ] Finalize package/application ID, redirect URI, and provider configuration plan.

## UI-001: framework UI adoption

Status: blocker added after point-of-order review. No Inbox runtime UI should be created before this is satisfied.

- [x] Identify concrete `xi-io.net` framework UI component sources.
- [x] Create `UI-001` issue.
- [x] Add framework UI adoption rule doc.
- [x] Add Inbox framework component map.
- [x] Add Cursor prompt for UI framework adoption.
- [x] Add framework-side freshness issue for reusable UI consumer contract.
- [ ] Decide direct reuse vs adapted copy vs promoted framework package.
- [ ] Create first static Inbox UI preview using framework-derived components.
- [ ] Record accessibility and draft-only egress checks.

## Evidence email ingress metadata

Status: public standards and schemas added. Private evidence hydration remains pending.

- [x] Add privacy-preserving evidence email ingress standard.
- [x] Add canonical evidence email event schema.
- [x] Add canonical tag registry for event clusters, issue lanes, evidence domains, document types, evidentiary roles, and processing states.
- [x] Add Gmail-label-to-canonical-tag mapping example.
- [x] Add Batch 002 private evidence hydration plan with no-omissions controls.
- [x] Add redacted synthetic timeline ledger example.
- [ ] Run Batch 002 in private workspace against exported email archive and current Gmail label audit.
- [ ] Produce private source inventory, attachment manifest, label mapping report, gap report, and no-omissions report.
- [ ] Validate private event JSONL against `schemas/evidence-email-event.schema.json`.
- [ ] Mirror eligible attachments to private storage and mark extracted/review state.
- [ ] Keep legal-help and support-context records segregated from primary evidence.
- [ ] Only promote redacted summaries or generic standards back to this public repo.

## Pass 4: runtime skeleton

Blocked until Pass 3 local build proof and UI-001 framework UI adoption decision are complete.

- [ ] Create app skeleton or import chosen mail spine.
- [ ] Add schema validation tooling.
- [ ] Add example events/proposals.
- [ ] Add tests for schemas.
- [ ] Add CI.

## Pass estimate

Current estimated work to reach repo-ready MVP planning state: complete, with UI adoption blocker now explicit.

Current estimated work to reach buildable Android proof: 5 to 7 remaining passes, depending on local Thunderbird build complexity and upstream configuration requirements.

Current estimated work to complete documentation, code commenting, compliance, UI adoption, and two-way framework freshness for initial MVP: 9 to 13 remaining passes.

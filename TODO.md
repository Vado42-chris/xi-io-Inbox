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

## ARCH-004: platform runtime and deployment envelope

Status: platform/runtime decision gate created after review found UI-002 could be mistaken for product-platform testing. End-product runtime is not yet decided. Cross-product framework contract and tracking now exist in `xi-io.net`.

- [x] Create `ARCH-004` issue for platform/runtime decision gate.
- [x] Add platform runtime decision matrix.
- [x] Classify UI-002 as static preview smoke proof only.
- [x] Document local cloud / home server as an explicit option.
- [x] Document local web, Tauri, Electron, Android, local cloud, hosted cloud, and multi-surface shared core options.
- [x] Set provisional planning model to multi-surface shared core.
- [x] Add framework platform/runtime envelope contract in `xi-io.net`.
- [x] Open framework tracking issue `xi-io.net#240`.
- [x] Sync Inbox platform matrix back to the framework contract and issue.
- [ ] Decide primary first runtime surface.
- [ ] Decide whether first desktop/control-room shell is local web, Tauri, or another path.
- [ ] Decide Android role after local Android mail spine proof.
- [ ] Decide local cloud/home server role and security boundary.
- [ ] Decide storage, provider secret, sync, backup, distribution, and offline behavior boundaries.

## PLAN-001: product delivery governance and backlog

Status: PLAN-001A complete as a minimum viable documentation/product-delivery governance skeleton. UI plans are necessary but not sufficient for broader build work; user stories, epics, slices, readiness gates, hydration status, and compliance validation now have initial traceable IDs.

- [x] Add product delivery governance reading order, waterfall phase map, Definition of Ready, Definition of Done, risk summary, and standing build blockers.
- [x] Add initial product requirements register with stable `REQ-` IDs, assumptions, dependencies, constraints, validation methods, and evidence artifacts.
- [x] Add initial epic and user-story backlog with stable `EPIC-` and `STORY-` IDs for each major lane and compliance/runtime area.
- [x] Add sprint/slice plan with `SLICE-` IDs, scope, excluded scope, dependencies, evidence artifacts, and block conditions.
- [x] Add build readiness gates and risk register with stable `GATE-` and `RISK-` IDs.
- [x] Add framework hydration checklist with `HYDRATE-` IDs and satisfied/partial/missing/blocked/not-applicable states.
- [x] Add compliance validation index with `COMP-` IDs and WCAG 2.2 / OWASP ASVS mappings or mapping-pending notes.
- [x] Confirm PLAN-001A is docs-only and does not change product UI code.
- [x] Run UI-004A.6 simulated wargame review using the normalized requirements, stories, slices, gates, and compliance index.
- [x] Expand PLAN-001B operability scope via UI-005A (journeys, component contracts, local operability gate, wargame scenarios) — partial; full PLAN-001B packet still optional for data/event models.

## UI-001: framework UI adoption

Status: technical static render smoke proof passed locally, but owner/framework UX review failed on 2026-06-09. PR #12 remains draft and must not merge as-is. `xi-io.net#239` is a real blocker for direct framework UI reuse, and the current adapted-copy preview must be replaced by a framework-compliant unified app shell.

- [x] Identify concrete `xi-io.net` framework UI component sources.
- [x] Create `UI-001` issue.
- [x] Add framework UI adoption rule doc.
- [x] Add Inbox framework component map.
- [x] Add Cursor prompt for UI framework adoption.
- [x] Add framework-side freshness issue for reusable UI consumer contract.
- [x] Decide direct reuse vs adapted copy vs promoted framework package for first preview.
- [x] Create first static Inbox UI preview using framework-derived components.
- [x] Record accessibility and draft-only egress checks.
- [x] Add local preview proof prompt.
- [x] Add PR #12 self-review.
- [x] Tighten static validation to check file presence, preview JSON, and JavaScript syntax.
- [x] Add GitHub Actions static preview validation workflow.
- [x] Record successful CI validation evidence.
- [x] Open framework consumer contract draft PR in `xi-io.net#238`.
- [x] Merge framework consumer contract in `xi-io.net#238` and close `xi-io.net#235`.
- [x] Track stable direct export/package follow-up in `xi-io.net#239`.
- [x] Update local preview proof prompt after framework contract merge.
- [x] Add local proof status receipt file.
- [x] Refresh CI evidence for current proof-readiness head.
- [x] Correct UI-002 docs so local proof means static preview smoke proof only.
- [x] Record owner/framework UX review failure.
- [x] Add stricter UI acceptance criteria for unified app shell, lanes, Ibal, receipts, provider gates, automations, and framework visual language.
- [x] Create `UI-003` redesign tracker in `xi-io-Inbox#14`.
- [x] Inspect real `xi-io.net` framework sources before redesign.
- [x] Propose revised UI architecture before implementation.
- [x] Add `docs/ui/ui-003-unified-app-shell-architecture.md`.
- [x] Implement UI-003A unified app shell skeleton with lane navigation, hash routes, right inspector, and safety banner.
- [x] Add UI-003B lane detail fixtures and first-pass lane content density.
- [x] Add UI-003C Inbox lane refinement so Inbox feels like email/message triage without provider integration.
- [x] Run UI-003D redesigned shell review and visual-proof readiness triage.
- [x] Record 2026-06-10 owner screenshot review failure for visual polish.
- [x] Add initial partial UI-004 shared polish standards and per-page polish plan docs.
- [x] Complete UI-004A docs/design-director packet by normalizing the partial docs into the numbered polish plan set.
- [x] Complete UI-004A.5 page leveling, wargame scenario, engine hook, and white-label framework planning.
- [x] Complete PLAN-001A product delivery governance and backlog skeleton before running UI-004A.6.
- [x] Run UI-004A.6 simulated wargame review against the current UI-003B/UI-003C/UI-003D shell using PLAN-001A requirements, stories, gates, and compliance IDs.
- [x] Implement UI-004B shell/topbar/lane navigation/safety/inspector system polish only. Required repairs: reduce status/badge noise, integrate safety as trust grammar, establish consistent right-inspector selection/focus behavior, preserve blocked egress, and keep platform/runtime/provider claims blocked.
- [x] Implement UI-004C Inbox lane polish as the first page-specific polish slice after UI-004B shell pass.
- [x] Implement UI-004D Ibal and Receipts lane polish next.
- [x] Implement UI-004E Settings and Provider Gates polish next.
- [x] Implement UI-004F Calendar and Tasks polish next.
- [x] Implement UI-004G Automations and Extensions polish next.
- [x] Record preliminary UI-003E owner review failure (one-way reporting; not human-operable; Ibal model wrong).
- [x] Reconcile local agent vs ChatGPT guidance; confirm stale UI-004B prompt must not be rerun (`docs/ui/reviews/ui-003e-agent-reconciliation.md`).
- [x] Run UI-005A operability architecture + Ibal model correction (docs/governance) before UI-005B implementation (`docs/ui/reviews/ui-005a-operability-architecture-receipt.md`).
- [x] Run UI-005B Inbox operability (compose, reply draft, triage, local state) (`docs/ui/reviews/ui-005b-inbox-operability-receipt.md`).
- [x] Run UI-005C Calendar operability (`docs/ui/reviews/ui-005c-calendar-operability-receipt.md`).
- [x] Run UI-005D Tasks operability (`docs/ui/reviews/ui-005d-tasks-operability-receipt.md`).
- [x] Run UI-005E Automations dry-run operability (`docs/ui/reviews/ui-005e-automations-operability-receipt.md`).
- [x] Run UI-005F Extensions / Provider Gates operability (`docs/ui/reviews/ui-005f-extensions-operability-receipt.md`).
- [x] Run UI-005G Settings operability (`docs/ui/reviews/ui-005g-settings-operability-receipt.md`).
- [x] Run UI-005H Ibal concierge shell (`docs/ui/reviews/ui-005h-ibal-concierge-receipt.md`).
- [x] Run UI-005I Account/session shell (`docs/ui/reviews/ui-005i-account-session-receipt.md`).
- [x] Agent structural UI-003E re-verification + owner proof packet (`docs/ui/reviews/ui-003e-operability-rereview-receipt.md`, `docs/ui/reviews/ui-003e-owner-visual-proof-packet.md`).
- [x] UI-006A Inbox progressive disclosure IA (3-pane workspace).
- [x] UI-006B Calendar progressive disclosure IA.
- [x] UI-006C Tasks progressive disclosure IA.
- [x] UI-006D Automations progressive disclosure IA.
- [ ] UI-006E Extensions progressive disclosure IA.
- [ ] UI-006F Settings progressive disclosure IA.
- [ ] Owner completes UI-003E visual checklist in proof packet (sign-off required).
- [ ] Merge-prep and `xi-io.net#239` framework freshness after owner UI-003E PASS.

## Pass 4: runtime skeleton

Blocked until Pass 3 local build proof, redesigned UI-001 static preview proof, and ARCH-004 platform/runtime envelope decisions are complete. Framework consumer contract is now merged, but direct framework package import remains blocked by `xi-io.net#239`.

- [ ] Create app skeleton or import chosen mail spine.
- [ ] Add schema validation tooling.
- [ ] Add example events/proposals.
- [ ] Add tests for schemas.
- [ ] Add CI.

## Pass estimate

Current estimated work to reach repo-ready MVP planning state: reopened for UI-002 redesign because technical render passed but owner/framework UX review failed.

Current estimated work to reach buildable Android proof: 5 to 7 remaining passes, depending on local Thunderbird build complexity and upstream configuration requirements.

Current estimated work to complete documentation, code commenting, compliance, UI adoption, two-way framework freshness, platform/runtime decision coverage, and reopened UI redesign for initial MVP: UI-005 complete; UI-006A–D complete (Inbox/Calendar/Tasks/Automations workspace IA). Remaining: UI-006E–F (~2 passes), owner UI-003E re-review (~1 owner action), merge-prep (~1 pass), `xi-io.net#239` freshness (~1–2 passes). ARCH-002/ARCH-004 separate. **~5 passes** agent work + owner sign-off.

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

## APP-PR-2026-06-13: application peer review and plan alignment

Status: complete for review, plan updates, and GMAIL-HARDEN-001 implementation. Runtime/provider write gates remain closed.

- [x] Peer-review product branch, not `main`.
- [x] Add product-branch `AGENTS.md`.
- [x] Add branch-truth operations doc.
- [x] Add multi-agent orchestration operating model.
- [x] Add UI north-star and convergence plan.
- [x] Persist peer-review findings and required plan deltas.
- [x] Mark UI-003 lane-shell doc as historical/reference.
- [x] Correct UI-012D/NAV-001 blocker from GMAIL-002A to GMAIL-002B-LIVE-PROOF.
- [x] Update product governance, sprint order, and build readiness gates.
- [x] Pass 55 label resolved — informal alias for NAV-001/GMAIL-002A/MAIL-001; see `app-peer-review-plan-alignment-2026-06-13.md` Pass 55 resolution.
- [x] Harden Gmail CLI export responses so full snapshots are not printed by default (`docs/ui/reviews/gmail-harden-001-privacy-hardening-receipt.md`).
- [x] Enforce restrictive token file permissions for `tools/gmail/data/token.json`.
- [x] Apply metadata/body schema allowed-field and URL checks to nested `threads[].messages[]`.
- [x] Decide and document Gmail `snippet` handling in metadata-only mode.
- [x] Reuse equivalent CLI validation rules before browser preview imports local Gmail snapshots.
- [x] Add tests for nested schema negatives, stdout snapshot leakage, readonly allow-path, token file mode, and redaction edge cases.
- [x] Review npm audit output for 4 moderate `tools/gmail` dependency vulnerabilities before broader provider proof (`docs/ui/reviews/npm-audit-gmail-001-dependency-audit-receipt.md`).
- [x] Amend north-star to Option B: Mail spine plus primary Home/Calendar/Tasks/Automations/Activity/Integrations (`docs/ui/reviews/ui-north-star-ratification-2026-06-13.md`).
- [x] NAV-002: restore Home, Calendar, and Tasks as primary nav destinations; dissolve `Plan` into Tasks sub-views (`docs/ui/reviews/nav-002-primary-operations-nav-receipt.md`).
- [x] UI-015 Level 4 lane purpose, journey, and failure index (`docs/ui/ui-015-level-4-lane-purpose-journey-index.md`).
- [x] UI-013A Level 2 visual experience system plan (`docs/ui/ui-013-level-2-visual-experience-system.md`).
- [x] UI-014A Level 3 contextual cross-pollination map (`docs/ui/ui-014-level-3-contextual-cross-pollination-map.md`).
- [x] UI-016A Level 5 componentization / framework-vs-repo-vs-template audit (`docs/ui/ui-016-level-5-componentization-consistency-index.md`).
- [x] UI-016B component anatomy spec (`docs/ui/ui-016b-component-anatomy-and-boundary-checks.md`).
- [x] Cross-project planning and framework document standardization (`docs/product/07-cross-project-planning-standard.md`, `docs/operations/framework-document-standardization-backfeed.md`).
- [x] UI-016C component boundary check scripts before extraction (`scripts/ui-016c-boundary-check.mjs`).
- [x] UI-013B Level 2 visual system implementation — agent CSS pass (`docs/ui/reviews/ui-013b-visual-implementation-receipt.md`); owner preliminary FAIL.
- [x] UI-014B Level 3 cross-pollination implementation (`docs/ui/reviews/ui-014b-cross-pollination-implementation-receipt.md`).
- [x] Add shared account scope lens contract for Mail, Calendar, Tasks, and Activity (`docs/ui/reviews/scope-001-shared-account-lens-receipt.md`).
- [x] Add `accountId` runtime normalization for calendar proposals and task/work items (schema v12 migration deferred — see PR-20-004).
- [x] Merge PR #20 into `ui-002/framework-derived-static-preview` after peer-review fixes (`docs/ui/reviews/pr-20-full-peer-review-2026-06-14.md`).
- [x] UI-013C owner-grade visual redesign — agent pass (`docs/ui/reviews/ui-013c-visual-implementation-receipt.md`); **owner review pending**.
- [ ] UI-003E owner visual proof — **blocked until owner reviews UI-013C at localhost:4488**.
- [ ] Create module skeleton and route-table contract without deleting working UI.

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
- [x] UI-006E Extensions progressive disclosure IA.
- [x] UI-006F Settings progressive disclosure IA.
- [x] UI-007A state reconciliation + draft workbench architecture (docs only).
- [x] Operator push local commits (7 commits pushed 2026-06-10).
- [x] `xi-io.net#239` UI-009/010 backfeed comment (2026-06-10).
- [x] Merge-prep: gates, proof packet, PR #12 body sync (2026-06-10).
- [x] Owner Inbox workbench review — FAIL 2026-06-10 (significant polish required; see proof packet).
- [x] UI-008A polish: restore product-visible lanes, sample drafts, account card, multi-inbox UX (`docs/ui/reviews/ui-008-owner-polish-receipt.md`) — **owner rejected: wrong account model**.
- [x] UI-008B polish: reply/read styling, context rail Outcomes alignment — insufficient vs product bar.
- [x] UI-008C polish (partial): Settings user preferences — insufficient vs product bar.
- [x] Owner UI-003E re-review — FAIL product UX not user-facing (`docs/ui/reviews/ui-009-product-ux-gap-audit.md`).
- [x] UI-009A: remove fixture accounts; Gmail queue + Connect CLI wizard (`docs/ui/reviews/ui-009a-account-wizard-receipt.md`).
- [x] UI-009B: calendar month-grid shell (`docs/ui/reviews/ui-009b-calendar-grid-receipt.md`).
- [x] UI-009C: tasks kanban board + mail source links (`docs/ui/reviews/ui-009c-tasks-kanban-receipt.md`).
- [x] UI-009D: Activity lane rename + filters (`docs/ui/reviews/ui-009d-activity-lane-receipt.md`).
- [x] UI-009E: Settings split User vs Advanced (`docs/ui/reviews/ui-009e-settings-split-receipt.md`).
- [x] UI-009F: mail reading polish v2; demote fixture copy (`docs/ui/reviews/ui-009f-mail-reading-polish-receipt.md`).
- [x] UI-010A–I: product UX pass — trust chrome, Home, Automations, Integrations, Activity, account, JSON, inspector (`docs/ui/reviews/ui-010-product-ux-pass-receipt.md`).
- [x] UI-010J–K: week strip, Ibal/compose polish, mail density, JSON lane demotion (`docs/ui/reviews/ui-010-product-ux-pass-receipt.md`).
- [x] GMAIL-001B: real account metadata spike plan + adapter contract (`docs/providers/gmail/gmail-001b-receipt.md`).
- [x] GMAIL-001C: local metadata-only adapter CLI (`docs/providers/gmail/gmail-001c-metadata-adapter-receipt.md`).
- [ ] GMAIL-001C smoke: owner OAuth + metadata CLI — **partial** · live proof metadata export verified locally; formal GMAIL-001C receipt smoke still optional
- [ ] GMAIL-001D: draft create/update spike (throwaway account preferred; send still blocked).
- [ ] Owner approval before primary-account metadata API smoke.
- [ ] UI-010+ product UI provider connect — after GMAIL-001C + UI-009A wizard shell.
- [x] UI-007B-R1 mail navigation graduation (`docs/ui/reviews/ui-007b-r1-mail-navigation-graduation-receipt.md`).
- [x] UI-007B-R2 Drafts / Approval Queue workbench (`docs/ui/reviews/ui-007b-r2-drafts-approval-queue-receipt.md`).
- [x] UI-007B-R3 Context rail command modes (`docs/ui/reviews/ui-007b-r3-context-rail-modes-receipt.md`).
- [x] UI-007C Send-event dry-run wiring (`docs/ui/reviews/ui-007c-send-event-dry-run-receipt.md`).
- [x] `xi-io.net#239` framework freshness UI-007 backfeed (`docs/ui/reviews/ui-007-framework-freshness-239-receipt.md`).
- [x] Merge-prep interim (owner re-review ready) — `docs/ui/reviews/ui-011-merge-prep-receipt.md`.
- [x] UI-011A Product Capability Gap Matrix — `docs/product/ui-011a-product-capability-gap-matrix.md`.
- [x] UI-011B Mail baseline parity repair — `docs/ui/reviews/ui-011b-mail-baseline-parity-repair-receipt.md`.
- [x] UI-011C Drafts + Approval Queue proof — `docs/ui/reviews/ui-011c-drafts-approval-queue-proof-receipt.md`.
- [x] UI-011D Calendar grid proof — `docs/ui/reviews/ui-011d-calendar-grid-proof-receipt.md`.
- [x] UI-011E Tasks / epics / stories / bugs / backlog proof — `docs/ui/reviews/ui-011e-tasks-planning-proof-receipt.md`.
- [x] UI-011F Automations visual builder + reusable action library — `docs/ui/reviews/ui-011f-automations-builder-proof-receipt.md`.
- [x] UI-011G Extensions taxonomy and provider cards — `docs/ui/reviews/ui-011g-extensions-taxonomy-proof-receipt.md`.
- [x] UI-011H Activity / Receipts user-facing repair — `docs/ui/reviews/ui-011h-activity-receipts-user-facing-repair-receipt.md`.
- [x] UI-011I Settings residual / cross-product cleanup — `docs/ui/reviews/ui-011i-settings-cross-product-cleanup-receipt.md`.
- [x] UI-012 visual polish governance locked — `docs/ui/polish/ui-012-visual-polish-governance.md`.
- [x] UI-012A Ibal/Rabbit visual parity brief — `docs/ui/polish/ui-012a-ibal-rabbit-visual-parity-brief.md`.
- [x] UI-012B visual token / component alignment — `docs/ui/reviews/ui-012b-visual-token-component-alignment-receipt.md`.
- [x] UI-012C layout / composition polish — `docs/ui/reviews/ui-012c-layout-composition-polish-receipt.md`.
- [x] NAV-001 app shell / navigation correction — `docs/ui/reviews/nav-001-app-shell-navigation-correction-receipt.md` · self-review `docs/ui/reviews/nav-001-self-peer-review.md`.
- [x] GMAIL-002A real Gmail metadata bridge — `docs/ui/reviews/gmail-002a-real-gmail-metadata-ingress-receipt.md`.
- [x] GMAIL-002A-HARDEN metadata adapter hardening — `docs/ui/reviews/gmail-002a-hardening-receipt.md`.
- [x] GMAIL-002B read-only body gate — `docs/ui/reviews/gmail-002b-read-only-body-gate-receipt.md`.
- [x] ACC-001 account/mail organization UX — `docs/ui/reviews/acc-001-account-mail-organization-ux-receipt.md`.
- [x] GMAIL-002B-LIVE-PROOF metadata phase — `docs/ui/reviews/gmail-002b-live-proof-receipt.md` · decision `GMAIL_002B_LIVE_PROOF_PASS_METADATA_READY_FOR_UI_012D_OR_GMAIL_002C`
- [x] MAIL-001 mail workspace IA/template repair — `docs/ui/reviews/mail-001-mail-workspace-ia-template-repair-receipt.md` · **owner visual review pending**
- [ ] VAL-EXT-001 — **blocked** · post-ingress divorce catalog + Google Sheet validation fixture
- [x] UI-012D interaction / state polish — `docs/ui/reviews/ui-012d-interaction-state-polish-receipt.md` · code pass
- [x] UI-012E accessibility / contrast / focus polish — `docs/ui/reviews/ui-012e-accessibility-contrast-focus-receipt.md` · code pass
- [x] UI-012F final visual readiness gate — `docs/ui/reviews/ui-012f-final-visual-readiness-gate-receipt.md`
- [x] Agent edit guardrails — `AGENTS.md`, `.cursor/rules/`, `.cursor/hooks.json`, `npm run check:quick`
- [x] `xi-io.net#239` UI-012/NAV/MAIL framework backfeed — `docs/ui/reviews/ui-012-framework-freshness-239-receipt.md`
- [x] Route smoke automation — `scripts/route-smoke.mjs` · `npm run check:route` · CI
- [ ] UI-003E owner visual proof — **ready for human** (PR #12 draft)
- [ ] Merge-prep final after owner UI-003E PASS — `docs/ui/reviews/ui-012-merge-prep-receipt.md` prepared

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

Current estimated work (2026-06-10): UI-012B–F **pass** · route smoke **pass** · framework backfeed **pass**. Next: **UI-003E** owner proof (human) → merge prep (~1 pass after PASS). PR #12 draft.

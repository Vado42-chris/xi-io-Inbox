# Compliance And Validation Index

## Purpose

Centralize the compliance, validation, safety, accessibility, privacy, and framework freshness rules that affect `xi-io Inbox`.

This index maps current planning rules to validation methods and evidence artifacts. Runtime/security mappings remain pending where runtime decisions do not exist yet.

## Status Values

| Status | Meaning |
| --- | --- |
| satisfied-docs | documented enough for current planning pass |
| partial | represented but needs implementation/receipt |
| blocked | cannot complete until blocker clears |
| pending | later scope |

## Compliance Items

| ID | Rule | Source Doc | Validation Method | Current Status | Blocked By | Evidence Artifact | Requirements | Gates | Mapping |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| COMP-A11Y-001 | Interactive UI must support visible focus, keyboard order, labels, names/roles/values, status messages, and predictable navigation. | `docs/ui/polish/11-interaction-standard.md`, `docs/ui/ui-002-accessibility-egress-check.md` | a11y gate hook, keyboard route smoke, visual QA | partial | UI implementation | EVIDENCE-REQ-A11Y-001 | REQ-A11Y-001 | GATE-UI-VISUAL-001 | WCAG 2.2: focus visible, focus order, name/role/value, status messages, consistent navigation |
| COMP-KEYBOARD-001 | Lane navigation, item selection, inspector update, and disabled actions must be keyboard-safe. | `docs/ui/polish/11-interaction-standard.md` | keyboard-only scenario WG-901 | partial | UI-004A.6/UI-004B | `docs/ui/reviews/ui-004a6-wargame-review.md` | REQ-A11Y-001 | GATE-UI-IMPLEMENT-001 | WCAG 2.2 keyboard/predictable navigation categories |
| COMP-STATUS-001 | Status messages must be layered by global, lane, object, and critical blocker scope. | `docs/ui/polish/00-xi-io-visual-product-standard.md` | visual QA and Rosetta label review | partial | UI polish | `docs/ui/reviews/ui-004b-shell-polish-receipt.md` | REQ-INSPECT-001 | GATE-UI-VISUAL-001 | WCAG 2.2 status messages where dynamic |
| COMP-PRIVACY-001 | Public repo fixtures and docs must not include private messages, secrets, credentials, or private framework internals. | `docs/architecture/source-audit.md` | source/privacy review, git status, fixture inspection | partial | provider/runtime future | EVIDENCE-REQ-PRIVACY-001 | REQ-PRIVACY-001 | GATE-PROVIDER-001 | OWASP ASVS mapping pending runtime design |
| COMP-CREDENTIALS-001 | Provider credentials must not be stored, loaded, committed, or implied in static preview. | `docs/architecture/source-audit.md`, `docs/ui/polish/06-extensions-polish-plan.md` | provider gate hook, repository scan | partial | provider architecture | future provider gate receipt | REQ-EXT-001, REQ-PRIVACY-001 | GATE-PROVIDER-001 | OWASP ASVS credential/session/storage categories pending architecture |
| COMP-PROVIDER-READ-001 | Provider reads must remain absent until provider identity, permission, secret, and runtime boundaries are approved. | `docs/architecture/platform-runtime-decision-matrix.md` | provider gate review | blocked | ARCH-004/provider gates | future provider read gate receipt | REQ-EXT-001 | GATE-PROVIDER-001 | OWASP ASVS mapping pending runtime/provider design |
| COMP-PROVIDER-WRITE-001 | Provider writes must remain absent or disabled until egress, permission, receipt, and runtime gates pass. | `docs/security/draft-only-egress.md` | egress safety hook | blocked | ARCH-004/provider gates | future provider write gate receipt | REQ-EGRESS-001 | GATE-PROVIDER-001 | OWASP ASVS authorization/input/output mapping pending runtime design |
| COMP-EGRESS-001 | Send, forward, delete, archive, disclose, publish, deploy, provider mutation, repo mutation, and automation execution remain blocked by default. | `docs/security/draft-only-egress.md` | egress safety hook and DOM/action review | partial | runtime gates | EVIDENCE-REQ-EGRESS-001 | REQ-EGRESS-001 | GATE-RUNTIME-001, GATE-AUTO-EXEC-001 | OWASP ASVS authorization/business logic mapping pending runtime design |
| COMP-REPO-001 | UI/product actions must not mutate repositories unless explicitly designed, permissioned, and receipted. | `docs/security/draft-only-egress.md`, `docs/ui/polish/14-ui-wargame-scenario-matrix.md` | egress safety review | partial | runtime/tooling | future repo mutation gate receipt | REQ-EGRESS-001 | GATE-RUNTIME-001 | OWASP ASVS mapping pending tool integration |
| COMP-AUTO-001 | Automations must remain dry-run/proposal-only until execution gates, receipts, and approvals exist. | `docs/ui/polish/05-automations-polish-plan.md`, `docs/ui/polish/15-framework-engine-hook-plan.md` | dry-run scenario WG-401 | partial | automation execution gate | future automation dry-run receipt | REQ-AUTO-001 | GATE-AUTO-EXEC-001 | OWASP ASVS business logic mapping pending runtime |
| COMP-RECEIPT-001 | Confirmed actions, proposals, drafts, gates, blocked events, and future runtime evidence require receipt expectations. | `docs/product/invariants.md`, `docs/ui/polish/07-receipts-polish-plan.md` | receipt hook | partial | runtime receipt schema later | EVIDENCE-REQ-RECEIPTS-001 | REQ-RECEIPTS-001 | GATE-MVP-001 | audit/logging mapping pending runtime |
| COMP-IBAL-001 | Ibal may propose, explain, cite evidence, and identify blockers; it may not execute. | `docs/ui/polish/08-ibal-polish-plan.md`, `docs/ui/polish/15-framework-engine-hook-plan.md` | Ibal proposal hook, WG-701 | partial | runtime/model provider gates | EVIDENCE-REQ-IBAL-001 | REQ-IBAL-001 | GATE-UI-VISUAL-001 | AI assurance mapping pending framework hook implementation |
| COMP-PLATFORM-001 | Static preview must not claim Electron, Tauri, Android, local web, local cloud, hosted cloud, storage, sync, backup, or distribution decisions. | `docs/architecture/platform-runtime-decision-matrix.md` | architecture gate review | partial | ARCH-004 | EVIDENCE-REQ-RUNTIME-001 | REQ-RUNTIME-001, REQ-PORT-001 | GATE-RUNTIME-001 | platform/security mapping pending ARCH-004 |
| COMP-FRAMEWORK-001 | Reusable product patterns must be reported to `xi-io.net#239` and not trapped as undocumented local forks. | `docs/architecture/xiio-framework-alignment.md`, `docs/ui/polish/16-white-label-framework-feedback-plan.md` | framework freshness hook | partial | UI proof, `xi-io.net#239` | EVIDENCE-REQ-FRAMEWORK-001 | REQ-FRAMEWORK-001 | GATE-FRAMEWORK-EXPORT-001 | framework-specific mapping |
| COMP-PERF-001 | Static preview should avoid layout instability and remain usable at desktop/mobile proof sizes. | `docs/ui/polish/00-xi-io-visual-product-standard.md` | route screenshot smoke and visual QA | pending | UI-004B+ | EVIDENCE-REQ-PERF-001 | REQ-PERF-001 | GATE-UI-VISUAL-001 | performance mapping pending implementation |
| COMP-RELIABILITY-001 | Unknown, failed, skipped, and blocked states must not become silent success. | `docs/ui/polish/13-page-leveling-and-wargame-standard.md`, `TODO.md` | review receipt and TODO audit | partial | validation tooling later | EVIDENCE-REQ-RELIABILITY-001 | REQ-RELIABILITY-001, REQ-REPAIR-001 | GATE-DONE-001 | framework no-silent-green rule |
| COMP-MAINT-001 | Components and docs must avoid duplicate competing patterns and use framework candidates when reusable. | `docs/ui/polish/10-component-pattern-inventory.md` | component inventory review | partial | UI proof/framework export | EVIDENCE-REQ-MAINT-001 | REQ-MAINT-001 | GATE-FRAMEWORK-EXPORT-001 | maintainability mapping pending component contracts |
| COMP-PORT-001 | Product decisions must preserve portability until ARCH-004 resolves final surfaces. | `docs/architecture/platform-runtime-decision-matrix.md` | architecture review | blocked | ARCH-004 | EVIDENCE-REQ-PORT-001 | REQ-PORT-001 | GATE-RUNTIME-001 | portability mapping pending ARCH-004 |
| COMP-LOCAL-001 | Product must preserve local-first/data ownership guardrails and avoid forced hosted/cloud/payment paths. | `docs/product/monetization.md`, `docs/product/invariants.md` | architecture/compliance review | pending | ARCH-004 | EVIDENCE-REQ-LOCAL-001 | REQ-LOCAL-001 | GATE-MVP-001 | privacy/security mapping pending runtime |
| COMP-LOCAL-PERSIST-001 | Local preview persistence must use documented client storage only; no credentials or private bodies in overlay. | `docs/ui/ui-005-local-operability-contract.md` | localStorage inspection, clear/restore smoke | partial | UI-005B+ implementation | EVIDENCE-REQ-OPERABILITY-001 | REQ-LOCAL-001, REQ-PRIVACY-001 | GATE-LOCAL-OPERABILITY-001 | OWASP ASVS storage mapping pending runtime |
| COMP-LOCAL-DRAFT-001 | Unsaved and saved local drafts/proposals must be labeled; send/commit language must not imply Tier 2 completion. | `docs/ui/ui-005-local-operability-contract.md`, `docs/ui/polish/11-interaction-standard.md` | form copy review, wargame WG-005-003/004/005 | partial | UI-005B+ | EVIDENCE-REQ-OPERABILITY-001 | REQ-EGRESS-001 | GATE-LOCAL-OPERABILITY-001 | WCAG 2.2 status messages |
| COMP-LOCAL-CLEAR-001 | User must be able to clear local preview data with confirm and status feedback. | `docs/ui/ui-005-local-operability-contract.md` | WG-005-007 scenario | partial | UI-005B+ | EVIDENCE-REQ-OPERABILITY-001 | REQ-RELIABILITY-001 | GATE-LOCAL-OPERABILITY-001 | privacy/data control mapping |
| COMP-IBAL-PROPOSAL-001 | Ibal must remain proposal-only with evidence; concierge must not auto-execute or replace human entry. | `docs/ui/ui-005-ibal-concierge-model.md` | WG-005-001/002, Ibal proposal hook | partial | UI-005H | EVIDENCE-REQ-IBAL-001 | REQ-IBAL-001 | GATE-LOCAL-OPERABILITY-001 | AI assurance mapping pending |
| COMP-RUNTIME-ESCALATION-001 | Blocked runtime escalation must show gate reason; Tier 2 actions must not execute from Tier 1 UI. | `docs/ui/ui-005-local-operability-contract.md` | WG-005-008, egress hook | partial | UI-005B+ | EVIDENCE-REQ-OPERABILITY-001 | REQ-EGRESS-001 | GATE-LOCAL-OPERABILITY-001, GATE-RUNTIME-001 | OWASP ASVS authorization mapping pending |

## Validation Evidence Rules

- Every compliance item must name an evidence artifact.
- If exact WCAG 2.2 or OWASP ASVS mapping is not possible yet, mark `mapping pending` and name the missing dependency.
- A passing static check does not prove product quality, accessibility conformance, runtime security, or framework alignment.
- Failed checks must update TODO with route, scenario/gate, failed expectation, and required repair.

## Decision

```text
PLAN_001A_COMPLIANCE_VALIDATION_INDEX_CENTRALIZED
```

# Epic And Story Backlog

## Purpose

Create the initial product backlog skeleton for `xi-io Inbox`.

This backlog is minimum viable. It is not a full final product backlog and does not authorize runtime work.

## Status Values

| Status | Meaning |
| --- | --- |
| planned | documented and not started |
| partial | partially represented by current docs/static preview |
| blocked | cannot start until named blockers clear |
| deferred | intentionally later scope |

## Epics

### EPIC-INBOX-001: Inbox Triage

- Goal: make inbound message/thread review safe, source-backed, and convertible into draft/task/calendar proposals.
- User value: users can process urgent communication without unsafe AI sending.
- Out of scope: live Gmail/OAuth/provider reads, real send/forward/delete/archive.
- Dependencies: REQ-INGRESS-001, REQ-EGRESS-001, REQ-INBOX-001, REQ-INSPECT-001.
- Blocked by: UI-004A.6 before polish; provider gates before runtime integration.
- Acceptance criteria: Inbox has lane-specific mail triage structure, source evidence, draft-only action model, blocked egress, and inspector context.
- Validation evidence required: EVIDENCE-REQ-INBOX-001, EVIDENCE-REQ-EGRESS-001.
- Compliance: COMP-EGRESS-001, COMP-PRIVACY-001, COMP-A11Y-001.

Stories:

| ID | Story | Requirements | Acceptance Criteria | Safety / Compliance | Validation Evidence | Status | Blocked By | Related Docs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| STORY-INBOX-001 | As a user reviewing inbound messages, I need message threads represented as source records, so that I can inspect context without loading private provider data in a static proof. | REQ-INGRESS-001, REQ-PRIVACY-001 | thread list and selected thread show sanitized fixture metadata and source refs | no private message bodies or credentials | EVIDENCE-REQ-INGRESS-001 | partial | provider gates | `docs/ui/polish/02-inbox-polish-plan.md` |
| STORY-INBOX-002 | As a user with an urgent thread, I need a draft proposal path, so that I can respond safely without AI sending. | REQ-INBOX-001, REQ-EGRESS-001 | draft proposal is visibly draft-only and send remains blocked/absent | draft-only egress | EVIDENCE-REQ-INBOX-001 | partial | UI-004C | `docs/security/draft-only-egress.md` |
| STORY-INBOX-003 | As a user managing follow-up, I need an inbox thread to become a task or calendar proposal, so that time/work can be tracked without provider writes. | REQ-INBOX-001, REQ-CALENDAR-001, REQ-TASKS-001 | cross-lane source links exist and proposals are not confirmed actions | provider writes blocked | EVIDENCE-REQ-INBOX-001 | planned | UI-004A.6 | `docs/ui/polish/14-ui-wargame-scenario-matrix.md` |

### EPIC-CALENDAR-001: Calendar Proposals

- Goal: show time-sensitive proposals with source evidence and blocked provider writes.
- User value: users can see scheduling pressure without accidental calendar mutation.
- Out of scope: provider calendar creation, invite sending, sync.
- Dependencies: REQ-CALENDAR-001, REQ-EGRESS-001, REQ-INSPECT-001.
- Blocked by: provider gates, ARCH-004 for runtime.
- Acceptance criteria: proposal-only agenda, source links, conflicts/reminders placeholders, event receipt expectation.
- Validation evidence required: EVIDENCE-REQ-CALENDAR-001.
- Compliance: COMP-EGRESS-001, COMP-PROVIDER-001.

Stories:

| ID | Story | Requirements | Acceptance Criteria | Safety / Compliance | Validation Evidence | Status | Blocked By | Related Docs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| STORY-CALENDAR-001 | As a user reviewing time pressure, I need calendar proposals to link back to source messages/tasks, so that I can verify why they exist. | REQ-CALENDAR-001, REQ-INSPECT-001 | proposal displays source refs and inspector evidence | no provider write implied | EVIDENCE-REQ-CALENDAR-001 | partial | UI-004F | `docs/ui/polish/03-calendar-polish-plan.md` |
| STORY-CALENDAR-002 | As a user, I need proposed events to remain uncommitted, so that a preview cannot create obligations. | REQ-CALENDAR-001, REQ-EGRESS-001 | event create/invite actions are absent or disabled | draft/proposal-only | EVIDENCE-REQ-CALENDAR-001 | partial | provider gates | `docs/security/draft-only-egress.md` |

### EPIC-TASKS-001: Task Extraction And Tracking

- Goal: convert ingress into trackable work with source references and safe next actions.
- User value: users can move communication into work without losing provenance.
- Out of scope: external task provider mutation and repo mutation.
- Dependencies: REQ-TASKS-001, REQ-INSPECT-001, REQ-RECEIPTS-001.
- Blocked by: UI-004F for polish, runtime gates for real provider writes.
- Acceptance criteria: task states, due/source metadata, cross-lane links, receipt expectation.
- Validation evidence required: EVIDENCE-REQ-TASKS-001.
- Compliance: COMP-EGRESS-001, COMP-REPO-001.

Stories:

| ID | Story | Requirements | Acceptance Criteria | Safety / Compliance | Validation Evidence | Status | Blocked By | Related Docs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| STORY-TASKS-001 | As a user converting communication into work, I need tasks to retain source references, so that I can verify why work exists. | REQ-TASKS-001, REQ-INSPECT-001 | task shows inbox/calendar/receipt source refs | no repo/provider mutation | EVIDENCE-REQ-TASKS-001 | partial | UI-004F | `docs/ui/polish/04-tasks-polish-plan.md` |
| STORY-TASKS-002 | As a user deciding what to do next, I need a next safe action for tasks, so that work can advance without unsafe egress. | REQ-TASKS-001, REQ-EGRESS-001 | next action is proposal-only and blocked actions remain disabled | draft/proposal-only | EVIDENCE-REQ-TASKS-001 | planned | UI-004F | `docs/ui/polish/14-ui-wargame-scenario-matrix.md` |

### EPIC-AUTO-001: Automation Dry-Run Workflows

- Goal: make automations understandable as dry-run proposals before any execution is possible.
- User value: users can inspect rules safely before trusting them.
- Out of scope: automation execution, provider mutation, repo mutation.
- Dependencies: REQ-AUTO-001, REQ-EGRESS-001, REQ-RECEIPTS-001.
- Blocked by: automation execution gate, ARCH-004, provider gates.
- Acceptance criteria: rule templates show trigger, condition, proposal, approval gate, receipt requirement, and execution blocked state.
- Validation evidence required: EVIDENCE-REQ-AUTO-001.
- Compliance: COMP-AUTO-001, COMP-EGRESS-001.

Stories:

| ID | Story | Requirements | Acceptance Criteria | Safety / Compliance | Validation Evidence | Status | Blocked By | Related Docs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| STORY-AUTO-001 | As a user evaluating an automation, I need to see what it would do before it can run, so that unsafe rules cannot execute silently. | REQ-AUTO-001, REQ-RECEIPTS-001 | dry-run path shows trigger, proposal, approval, receipt expectation | execution blocked | EVIDENCE-REQ-AUTO-001 | partial | UI-004G | `docs/ui/polish/05-automations-polish-plan.md` |

### EPIC-EXT-001: Extensions And Provider Gates

- Goal: expose provider/tool state, permissions, secrets boundary, and integration blockers before real connections.
- User value: users understand trust boundaries before connecting accounts.
- Out of scope: OAuth, credentials, provider reads/writes.
- Dependencies: REQ-EXT-001, REQ-PRIVACY-001, REQ-FRAMEWORK-001.
- Blocked by: ARCH-003/ARCH-004 and provider gate decisions.
- Acceptance criteria: provider status, permission state, no credentials, secret boundary, framework export blocker.
- Validation evidence required: EVIDENCE-REQ-EXT-001.
- Compliance: COMP-PROVIDER-001, COMP-PRIVACY-001.

Stories:

| ID | Story | Requirements | Acceptance Criteria | Safety / Compliance | Validation Evidence | Status | Blocked By | Related Docs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| STORY-EXT-001 | As a privacy-sensitive user, I need to see provider connection state and secret boundaries, so that I know no account is connected. | REQ-EXT-001, REQ-PRIVACY-001 | provider cards show blocked/no credentials and inspector explains why | no OAuth/credentials | EVIDENCE-REQ-EXT-001 | partial | provider gates | `docs/ui/polish/06-extensions-polish-plan.md` |

### EPIC-RECEIPTS-001: Receipts And Audit

- Goal: make proposals, drafts, gates, blocked events, proof receipts, and future runtime evidence auditable.
- User value: users can verify what happened, what did not happen, and why.
- Out of scope: false runtime receipts for unimplemented behavior.
- Dependencies: REQ-RECEIPTS-001, REQ-INSPECT-001, REQ-RELIABILITY-001.
- Blocked by: runtime for confirmed provider receipts.
- Acceptance criteria: Receipts lane is first-class and does not execute actions.
- Validation evidence required: EVIDENCE-REQ-RECEIPTS-001.
- Compliance: COMP-RECEIPT-001.

Stories:

| ID | Story | Requirements | Acceptance Criteria | Safety / Compliance | Validation Evidence | Status | Blocked By | Related Docs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| STORY-RECEIPTS-001 | As a user auditing the app, I need receipts to distinguish proof, proposal, draft, gate, and blocked events, so that I can verify state accurately. | REQ-RECEIPTS-001, REQ-RELIABILITY-001 | ledger classifications are visible and inspector explains limitations | no execution from receipts | EVIDENCE-REQ-RECEIPTS-001 | partial | UI-004D | `docs/ui/polish/07-receipts-polish-plan.md` |

### EPIC-IBAL-001: Ibal Orchestration

- Goal: make Ibal the conductor of next safe action, source synthesis, and blockers without execution.
- User value: users get help deciding what matters and what can safely happen next.
- Out of scope: chatbot-only UI, execution, model-provider routing claims.
- Dependencies: REQ-IBAL-001, REQ-INSPECT-001, REQ-EGRESS-001.
- Blocked by: UI polish and runtime/model-provider gates later.
- Acceptance criteria: Ibal proposal includes why, sources, blockers, safe next action, and proposal-only state.
- Validation evidence required: EVIDENCE-REQ-IBAL-001.
- Compliance: COMP-IBAL-001, COMP-EGRESS-001.

Stories:

| ID | Story | Requirements | Acceptance Criteria | Safety / Compliance | Validation Evidence | Status | Blocked By | Related Docs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| STORY-IBAL-001 | As a user overwhelmed by incoming work, I need Ibal to propose the next safe action, so that I can decide without reading every lane first. | REQ-IBAL-001, REQ-INSPECT-001 | recommendation cites source lanes, blockers, and receipt expectation | proposal-only | EVIDENCE-REQ-IBAL-001 | partial | UI-004D | `docs/ui/polish/08-ibal-polish-plan.md` |
| STORY-IBAL-002 | As an AI-skeptical user, I need Ibal to show evidence and limits, so that I can trust the recommendation boundary. | REQ-IBAL-001, REQ-PRIVACY-001 | evidence and blocked execution state are visible | no execution/no hidden data | EVIDENCE-REQ-IBAL-001 | planned | UI-004D | `docs/ui/polish/15-framework-engine-hook-plan.md` |

### EPIC-COMPLIANCE-001: Accessibility, Privacy, Security, Egress Safety

- Goal: centralize safety, privacy, accessibility, and no-silent-failure requirements.
- User value: users can trust the product to block unsafe behavior and remain usable.
- Out of scope: final runtime security certification before runtime exists.
- Dependencies: REQ-EGRESS-001, REQ-PRIVACY-001, REQ-A11Y-001, REQ-RELIABILITY-001, REQ-LOCAL-001, REQ-REPAIR-001.
- Blocked by: runtime-specific mapping until ARCH-004 resolves.
- Acceptance criteria: compliance index names validation method and evidence artifact for each rule.
- Validation evidence required: EVIDENCE-COMP-001.
- Compliance: all COMP-* items.

Stories:

| ID | Story | Requirements | Acceptance Criteria | Safety / Compliance | Validation Evidence | Status | Blocked By | Related Docs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| STORY-COMP-001 | As a user, I need dangerous egress blocked by default, so that AI cannot create external consequences without permission. | REQ-EGRESS-001 | dangerous actions absent/disabled and explained | draft-only egress | EVIDENCE-REQ-EGRESS-001 | partial | runtime gates | `docs/security/draft-only-egress.md` |
| STORY-COMP-002 | As a privacy-sensitive user, I need secrets and private messages excluded from public fixtures, so that repo work does not leak data. | REQ-PRIVACY-001 | fixtures remain sanitized; secrets untracked | privacy/source audit | EVIDENCE-REQ-PRIVACY-001 | partial | provider/runtime | `docs/architecture/source-audit.md` |
| STORY-COMP-003 | As a keyboard-only user, I need predictable focus and activation behavior, so that I can navigate lanes and inspector. | REQ-A11Y-001 | tab order and Enter/Space behavior are verified | WCAG 2.2 mapping | EVIDENCE-REQ-A11Y-001 | partial | UI implementation | `docs/ui/polish/11-interaction-standard.md` |
| STORY-COMP-004 | As a user on different screen sizes, I need responsive layout that preserves primary work, so that the app stays usable. | REQ-PERF-001 | desktop/mobile route screenshots pass QA | responsive validation | EVIDENCE-REQ-PERF-001 | planned | UI-004B | `docs/ui/polish/00-xi-io-visual-product-standard.md` |
| STORY-COMP-005 | As an operator, I need failed checks to become concrete TODOs, so that nothing fails silently. | REQ-RELIABILITY-001, REQ-REPAIR-001 | failed scenario records route/category/repair | no-silent-green | EVIDENCE-REQ-REPAIR-001 | partial | validation tooling later | `docs/ui/polish/13-page-leveling-and-wargame-standard.md` |
| STORY-COMP-006 | As a user, I need local-first/data ownership preserved, so that hosted or paid paths do not control my data. | REQ-LOCAL-001 | no forced hosted cloud/payment architecture | monetization guardrails | EVIDENCE-REQ-LOCAL-001 | planned | ARCH-004 | `docs/product/monetization.md` |
| STORY-COMP-007 | As a reviewer, I need build/readiness gates to identify blocked work, so that agents do not over-claim completion. | REQ-REPAIR-001 | gates list pass/fail state and evidence | no silent failure | EVIDENCE-GATE-001 | partial | PLAN-001A | `docs/product/04-build-readiness-gates.md` |

### EPIC-FRAMEWORK-001: Framework Reuse And Freshness

- Goal: promote reusable Inbox patterns back to `xi-io.net` instead of duplicating framework logic.
- User value: the product improves the framework and future projects.
- Out of scope: direct framework import before `xi-io.net#239` resolves.
- Dependencies: REQ-FRAMEWORK-001, REQ-MAINT-001.
- Blocked by: Level 4/5 proof, `xi-io.net#239`.
- Acceptance criteria: reusable candidates have promotion timing and feedback route.
- Validation evidence required: EVIDENCE-REQ-FRAMEWORK-001.
- Compliance: COMP-FRAMEWORK-001.

Stories:

| ID | Story | Requirements | Acceptance Criteria | Safety / Compliance | Validation Evidence | Status | Blocked By | Related Docs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| STORY-FRAMEWORK-001 | As a framework maintainer, I need reusable Inbox shell/gate/receipt/Ibal patterns reported back, so that xi-io products do not fork component doctrine. | REQ-FRAMEWORK-001 | candidates are linked to `xi-io.net#239` | framework freshness | EVIDENCE-REQ-FRAMEWORK-001 | partial | UI proof | `docs/ui/polish/16-white-label-framework-feedback-plan.md` |
| STORY-FRAMEWORK-002 | As a product maintainer, I need component candidates documented before promotion, so that reusable pieces are not premature abstractions. | REQ-MAINT-001 | anatomy/accessibility/safety rules exist before promotion | Level 5 rule | EVIDENCE-REQ-MAINT-001 | partial | UI-004B/page polish | `docs/ui/polish/10-component-pattern-inventory.md` |

### EPIC-RUNTIME-001: Runtime / Platform Readiness

- Goal: resolve runtime/platform boundaries before importing runtime code or connecting providers.
- User value: runtime work remains safe, portable, and correctly scoped.
- Out of scope: Pass 4 implementation before gates clear.
- Dependencies: REQ-RUNTIME-001, REQ-PORT-001, REQ-LOCAL-001.
- Blocked by: ARCH-004, ARCH-002, UI proof.
- Acceptance criteria: platform/runtime decision receipt exists and build gates pass.
- Validation evidence required: EVIDENCE-REQ-RUNTIME-001.
- Compliance: COMP-PLATFORM-001, COMP-PROVIDER-001.

Stories:

| ID | Story | Requirements | Acceptance Criteria | Safety / Compliance | Validation Evidence | Status | Blocked By | Related Docs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| STORY-RUNTIME-001 | As a maintainer, I need platform/runtime decisions recorded before Pass 4, so that implementation does not choose web, Android, Tauri, Electron, local cloud, or hosted cloud by accident. | REQ-RUNTIME-001, REQ-PORT-001 | ARCH-004 receipt exists before runtime skeleton | platform claims blocked | EVIDENCE-REQ-RUNTIME-001 | blocked | ARCH-004 | `docs/architecture/platform-runtime-decision-matrix.md` |
| STORY-RUNTIME-002 | As a maintainer, I need Android mail spine build proof before import, so that Thunderbird/K-9 usage is evidence-based. | REQ-RUNTIME-001 | build proof or classified failure recorded | source/import safety | EVIDENCE-REQ-RUNTIME-001 | blocked | ARCH-002 | `docs/architecture/android-mail-spine-audit-pass-3.md` |

## Backlog Rule

Future stories must include stable IDs, parent epic, related requirement IDs, acceptance criteria, safety/compliance requirements, validation evidence, current status, blockers, and related docs.

## Decision

```text
PLAN_001A_EPIC_STORY_BACKLOG_INITIALIZED_WITH_TRACEABLE_IDS
```

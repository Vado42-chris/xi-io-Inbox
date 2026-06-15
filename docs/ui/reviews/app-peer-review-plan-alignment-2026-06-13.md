# App Peer Review and Plan Alignment

## Date

2026-06-13

## Branch

`cursor/app-peer-review-plan-5e1b`, based on `origin/ui-002/framework-derived-static-preview`.

## Review scope

- `public/inbox-preview.js`
- `public/inbox-preview.css`
- `public/index.html`
- `public/data/*.json`
- `tools/gmail/**`
- `TODO.md`
- `docs/product/**`
- `docs/ui/**`
- `docs/operations/**`

## Decision

```text
APP_PEER_REVIEW_PLAN_ALIGNMENT_COMPLETE_PRODUCT_BRANCH_NEEDS_CONVERGENCE_BEFORE_MERGE
```

PR #12 and owner UI-003E remain blocked. The branch contains substantial product work, but
the application should not proceed by adding more features to the current monolith.

## Findings

| ID | Severity | Finding | Verified evidence | Required plan update |
| --- | --- | --- | --- | --- |
| APP-PR-001 | high | Product branch lacked local branch-truth and agent instructions. | No `AGENTS.md`, no `docs/operations/branch-truth.md` before this pass. | Added both files on this branch. |
| APP-PR-002 | high | Strategic PR #17 content was absent from the product branch. | No `docs/operations/multi-agent-orchestration.md`; no `docs/ui/ui-north-star-and-convergence-plan.md`. | Added adapted orchestration and north-star docs. |
| APP-PR-003 | high | The preview remains a single-file application architecture. | `public/inbox-preview.js` owns state, migrations, rendering, routing, event handlers, and Gmail import; `public/inbox-preview.css` owns all visual layers. | Convergence plan now requires strangler migration and no monolith growth. |
| APP-PR-004 | high | Navigation is not one source of truth. | `PRODUCT_LEVEL_NAV`, hash lanes, `activeProductWorkspace()`, and contextual rail state are separate. Mail/Drafts/Approvals map through `#/inbox`. | North-star plan requires one route table and deep-linkable workbench states. |
| APP-PR-005 | medium | UI-003 lane architecture remains in the reading path without a current supersession header. | `docs/ui/ui-003-unified-app-shell-architecture.md` still states lane-first shell and Ibal lane assumptions. | Added supersession header. |
| APP-PR-006 | medium | UI-012D blocker text was stale. | `TODO.md` says `GMAIL-002B-LIVE-PROOF` is partial; `ui-012-visual-polish-governance.md` and NAV-001 plan still referred to GMAIL-002A. | Updated blocker to `GMAIL-002B-LIVE-PROOF` or explicit owner choice. |
| APP-PR-007 | medium | Gmail adapter exports include full snapshots in CLI JSON payloads. | `exportMetadataSnapshot`, `exportReadonlyBodySnapshot`, and `redactBodySnapshotFile` return `payload.snapshot`. | Added hardening work item before broader provider proof. |
| APP-PR-008 | medium | Gmail snapshot schemas do not apply the same allowed-field checks to nested thread messages as top-level messages. | Validators iterate `snapshot.messages`; nested `threads[].messages[]` need equivalent checks. | Added hardening work item and test requirement. |
| APP-PR-009 | medium | Metadata mode includes Gmail snippets, which can be body fragments. | `normalizeMessageMetadata()` stores `snippet`; sample metadata includes snippets. | Added explicit privacy hardening decision point. |
| APP-PR-010 | medium | Local token storage needs stronger file-permission handling. | `tools/gmail/lib/token-store.js` writes token JSON; review found no explicit restrictive mode requirement. | Added hardening work item. |
| APP-PR-011 | medium | Browser import gate is weaker than CLI validators. | `inbox-preview.js` accepts local JSON snapshots by mode/source and renders imported values. | Added hardening work item to reuse validators or shared schema before render. |
| APP-PR-012 | low | `activeContextSubNav` is not persisted and resets on reload. | NAV-001 self-review already tracks this as accepted debt. | Kept as UI-012D debt. |
| APP-PR-013 | low | Pass 55 is still not verifiable from repo artifacts. | Repo receipts mark Pass 55 unverified; conversation claims completion, but no terminal receipt is committed here. | Added action to persist the terminal receipt before marking verified. |

## Best-practice evaluation

| Question | Answer |
| --- | --- |
| Are we doing this the best way possible? | Not yet. The current static preview proved capability breadth, but continuing feature work in the monolith conflicts with maintainable SPA practice. |
| Correct fix or different approach? | Different approach: stop growing the monolith, ratify one product spine, create module boundaries, then migrate by strangler slices. |
| Any truncation found? | Yes. Product branch lacked PR #17 strategic docs; older plan surfaces omitted NAV-001/GMAIL-002B state. |
| Any hallucination found? | Pass 55 completion cannot be verified from repo artifacts. It must remain unverified until the receipt is persisted. |
| Duplicated work? | Yes. Navigation models, receipts panels, lane plans, and Ibal lane/concierge concepts overlap. |
| More efficient path? | One route table, one north-star doc, one module map, and receipt updates in the same pass as implementation. |
| Other standards to evaluate by? | Least-privilege secrets handling, no-silent-green status, deep-linkable routes, focus preservation, schema validation at trust boundaries, and evidence-backed receipts. |

## Required plan updates made in this pass

- Added `AGENTS.md`.
- Added `docs/operations/branch-truth.md`.
- Added `docs/operations/multi-agent-orchestration.md`.
- Added `docs/ui/ui-north-star-and-convergence-plan.md`.
- Updated `README.md` to describe product-branch status.
- Added supersession guidance to `docs/ui/ui-003-unified-app-shell-architecture.md`.
- Updated UI-012D/NAV-001 blockers to reference `GMAIL-002B-LIVE-PROOF`.
- Updated product governance and sprint sequence for current branch state.
- Updated `TODO.md` with the peer-review and hardening follow-ups.

## Pass 55 resolution (2026-06-13 merge)

**Pass 55 is not an official slice ID.** It was an informal external peer-review label for
"bounded metadata alignment." That work is covered by official receipts:

- `nav-001-app-shell-navigation-correction-receipt.md`
- `gmail-002a-real-gmail-metadata-ingress-receipt.md` + hardening
- `mail-001-mail-workspace-ia-template-repair-receipt.md`
- `gmail-002b-live-proof-receipt.md` (metadata phase)

Do not create a separate Pass 55 receipt. Update legacy "Pass 55 unverified" notes to point
here or to the receipts above.

## Required next work

1. ~~Persist Pass 55 terminal receipt~~ — **resolved:** use official slice receipts above.
2. ~~Harden Gmail adapter output, token permissions, nested schema validation, snippet policy,
   browser import validation, and tests.~~ Complete in `gmail-harden-001-privacy-hardening-receipt.md`.
3. Review npm audit output for the remaining `tools/gmail` dependency warnings.
4. Ratify or reject the draft-centered spine.
5. Start design-system/shell skeleton only after the product model is ratified.


# User language map

## Status

```text
Type: copy and QA dependency (docs)
Date: 2026-06-19
Authority: docs/product/competitive-inbox-ingress-positioning-2026-06.md
Applies to: owner-mode default UI, Activity, Ibal, Mail actions, ingress cards (future)
Excluded: internal agent receipts, slice IDs, decision tokens, schema field names
```

## Purpose

Translate internal xi-io terms into **literal, calm, user-facing language**. Competitor research validated that users respond to job outcomes, not operator vocabulary. This map is a design-system dependency — not a strategy-only note.

## Rules

1. **Primary UI** uses the User-facing column. Never lead with internal terms.
2. **Advanced / Developer / Proof disclosure** may show internal terms parenthetically when needed for power users.
3. **Code, schemas, storage, and agent docs** keep internal identifiers unchanged.
4. **QA and visual review** fail if banned terms appear above the fold in owner-mode default.
5. **Competitor product names** must not appear in UI copy.

## Core map

| Internal (keep in code/docs) | User-facing (owner default) | Context / notes |
| --- | --- | --- |
| receipt | proof saved · proof note | Badge: Proof saved / Proof missing / Proof needed |
| receipts ledger | proof history · what happened | Activity lane subtitle; not “Receipts” as nav label |
| egress | send · share · export | Always pair with preview or “blocked safely” |
| ingress | added item · new item | “Something was added” not “ingress received” |
| ingress object | item · message · file · link | Type-specific: email, file, GitHub update |
| classify / classification | understood as · looks like | “Understood as: review request” |
| provider mutation | changes outside xi-io | “This would change Gmail/GitHub — blocked until you approve” |
| body-gate | message body access | “Body not read” / “Body available” — never “gate” alone |
| dry-run | preview only · not sent | Automations and send flows |
| proposal | suggested next step | Ibal and approval queue |
| blocked egress | blocked safely · needs your approval | Prefer safety over “denied” |
| framework report | project status update | External-facing only when relevant |
| agent receipt | proof note | Activity detail, not primary label |
| capability ACL | what this view can do | Settings/Advanced only |
| sync / connect (runtime) | connect mailbox · sync mail | Honest blocked states in static preview |
| fixture / scaffold | preview data · sample | Developer/Advanced only |
| pass gate / UI-003E | (do not surface) | Owner/agent governance only |
| schemaVersion | (do not surface) | Developer/Advanced only |
| OAuth / token | sign in · connect account | Never show “OAuth” to default users |

## Five literal jobs (canonical user verbs)

Use these as primary action labels in owner-mode default UI. Map internally to existing draft/approval/Activity flows.

| User action | Internal flow (today) | Blocked in Tier 1? |
| --- | --- | --- |
| Preserve as proof | Write receipt / Activity entry | No (local preview) |
| Export summary | Summarize + optional export proposal | External export yes |
| Create task / issue | Tasks lane / draft-linked work item | Provider write yes |
| Share work packet | Scoped share proposal (future) | Egress yes |
| Draft reply / response | Draft workbench | Send yes |

## Proof states (UI badges)

| State | User label | When |
| --- | --- | --- |
| saved | Proof saved | Action or classification recorded locally |
| missing | Proof missing | Expected record not yet written |
| needed | Proof needed | User action required before egress |

Tone: **“Proof saved for you”** — not “audit log recorded” or “system logged your action.”

## Blocked-state lexicon

| Situation | User label |
| --- | --- |
| Send disabled | Not sent · preview only |
| Provider write disabled | Changes outside xi-io are blocked |
| Automation disabled | Automations are preview-only |
| Body not read | Message body not inspected |
| Needs owner | Needs your approval |
| Ambiguous ingress | Needs review — not auto-handled |

## GitHub work-object labels (future UI)

Human states for GitHub ingress — not raw PR jargon in owner default:

```text
Needs my eyes
Failed check
Agent drift
Ready to merge (still not auto-merge)
Proof missing
Blocked by owner
Docs-only
Runtime risk
```

Internal refs remain `github:pr:*`, checks API fields, etc.

## Banned above the fold (owner-mode QA)

Fail visual QA if these appear in primary UI chrome, card titles, or default action labels:

```text
ingress · egress · receipt (as primary noun) · provider mutation
body-gate · schemaVersion · fixture · scaffold · dry-run (alone)
pass gate · UI-003E · framework backfeed · capability ACL
OAuth · token · ACL · operator · mutation · egress preview (alone)
commit SHA · pass ID · agent receipt · Bugbot (as UI chrome)
```

Allowed in **Advanced automation details**, **Developer**, or **Proof** disclosure panels.

## Related standards

- Visual product standard: `docs/ui/polish/00-xi-io-visual-product-standard.md`
- Ibal concierge model: `docs/ui/ui-005-ibal-concierge-model.md`
- Activity user-facing repair: `docs/ui/reviews/ui-011h-activity-receipts-user-facing-repair-receipt.md`
- Industry positioning capture: `docs/product/competitive-inbox-ingress-positioning-2026-06.md`
- Visual language (border minimization, open surfaces): `docs/ui/ui-visual-language-001-editorial-surfaces-and-border-minimization.md`
- Owner vs scaffold modes: `docs/ui/reviews/peer-review/owner-vs-scaffold-mode.md`

## Acceptance criteria (COPY-LITERAL-001)

- [ ] Owner-mode default on Mail, Home, Activity, Ibal uses this map for primary labels
- [ ] Proof badges use saved / missing / needed states
- [ ] Five literal jobs appear as contextual actions where applicable
- [ ] Visual QA rubric includes banned-term check for owner-mode
- [ ] Internal terms unchanged in `public/inbox-preview.js` state keys and receipt objects

## Decision

```text
USER_LANGUAGE_MAP_001_READY_FOR_COPY_LITERAL_SLICE
```

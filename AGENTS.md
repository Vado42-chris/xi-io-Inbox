# AGENTS.md

## Start here

This checkout is the active static-preview product line when based on
`ui-002/framework-derived-static-preview`.

```text
main = planning documents + shared JSON schemas only.
ui-002/framework-derived-static-preview = active static preview product line.
```

Before auditing product state, verify the branch. Do not infer product gaps from `main`
unless the task is explicitly scoped to `main`.

## Product invariants

- `xi-io Inbox` is a privacy-first personal operations command center: ingress, analysis,
  draft preparation, controlled egress, and receipts.
- AI may summarize, classify, tag, draft, export, decompose, and propose actions.
- AI must not send, delete, forward, archive, externally disclose, publish, or deploy by
  default.
- Outbound actions remain draft-only unless the user deliberately enables advanced
  automation and accepts explicit risk.
- All confirmed or simulated actions must generate receipts.
- No secrets, tokens, credentials, real private message bodies, or private framework
  internals belong in this public repo.

## Required reading for UI/product work

1. `docs/operations/branch-truth.md`
2. `docs/ui/reviews/app-peer-review-plan-alignment-2026-06-13.md`
3. `docs/ui/ui-north-star-and-convergence-plan.md`
4. `docs/operations/multi-agent-orchestration.md`
5. `TODO.md`
6. `docs/product/03-sprint-slice-plan.md`

Historical architecture docs remain useful as receipts, but current work should follow the
north-star convergence plan when older UI-003/UI-005/UI-007 documents conflict.

## Validation

- Product smoke suite: `npm run check`
- Schema metaschema validation when schema files change:
  `python3 -m check_jsonschema --check-metaschema schemas/*.json`
- Patch hygiene: `git diff --check`
- For visible UI changes, run `npm run dev` and capture browser evidence.

## Module ownership target

Parallel agents should stay within owned paths as the monolith is strangled out of
`public/inbox-preview.js`:

```text
public/src/design/        design tokens and reusable components
public/src/shell/         app frame, single nav, router, state store, inspector
public/src/workbench/     mail spine: Inbox -> Drafts -> Approvals -> Sent/Receipts
public/src/capabilities/  calendar, tasks, automations, extensions, settings
public/src/ibal/          concierge drawer and command entry, not a nav lane
public/src/lib/, fixtures/ view-model adapters and preview data
tools/gmail/, schemas/    adapter and contracts
docs/                     operating docs, receipts, gates
```

Do not grow `public/inbox-preview.js`; migration work should remove code from it over time.


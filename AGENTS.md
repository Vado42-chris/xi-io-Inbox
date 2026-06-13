# AGENTS.md

## Start here

This repository has branch-specific truth. Do not treat `main` as the product branch.

```text
main = planning documents + shared JSON schemas only.
ui-002/framework-derived-static-preview = active static preview product line.
```

Before any UI, Gmail adapter, static preview, route-smoke, CI, or product-convergence work,
fetch and check out `ui-002/framework-derived-static-preview` or a branch based on it. Work
on `main` only when the task is explicitly about planning docs, schemas, issue hygiene, or
cross-branch operating instructions.

## Branch selection

| Task type | Correct branch |
| --- | --- |
| JSON schema validation, bootstrap docs, issue hygiene, branch-truth docs | `main` |
| Static preview, `public/`, `package.json`, CI, route smoke, Gmail adapter | `ui-002/framework-derived-static-preview` |
| UI convergence, single-nav shell, north-star work, module skeleton | branch from `ui-002/framework-derived-static-preview` |
| Android/Thunderbird build proof | follow the operation packet from `main` unless a product branch is named |

If a cloud-agent audit was written from `main`, read it as a `main` audit only. It is not
evidence that the product preview is missing from `ui-002`.

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

## Cursor Cloud instructions

### On `main`

`main` is intentionally light. It carries planning/bootstrap documentation and shared JSON
schemas, not the active static preview.

Useful checks:

- `python3 -m check_jsonschema --check-metaschema schemas/*.json`
- `git diff --check`

Do not open PRs that describe the whole repository as docs-and-schemas-only without this
branch qualification.

### On `ui-002/framework-derived-static-preview`

The product branch carries the static preview and local Gmail-adapter work. Before changing
it, read these if present on the checked-out branch:

1. `docs/operations/branch-truth.md`
2. `docs/operations/multi-agent-orchestration.md`
3. `docs/ui/ui-north-star-and-convergence-plan.md`

Standard validation on that branch is `npm run check`. For UI changes, also run the preview
with `npm run dev` and capture browser evidence.

### PR context

- PR #15 (`main`) is unsafe as the sole repo brief unless it clearly says `main` is docs and
  schemas only while product work lives on `ui-002`.
- PR #16 (`main`) is useful only as a `main` freshness audit; reconcile it against
  `ui-002` before treating findings as product gaps.
- PR #17 (`ui-002`) contains the useful strategic layer for multi-agent orchestration and
  the draft-centered UI north-star RFC. Merge or adapt it into `ui-002`; do not blindly
  replace local Cursor/Zed instructions.

## Module ownership target for UI convergence

When working on `ui-002`, parallel agents should stay within owned paths as the monolith is
strangled out of `public/inbox-preview.js`:

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


# RECON-GMAIL-001 Source Truth and Gmail Adapter Contract Repair Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`93c35010702f488efa1f25f982290b416497d0b1`

## Scope

Reconcile PR #12 body, plan docs, and Gmail adapter contracts before GMAIL-002A-EXT-001. Metadata query fail-closed repair, readonly body export selection gate, CLI help alignment, GMAIL-002A-EXT slice boundaries.

## Excluded scope

- GMAIL-002A-EXT implementation (pagination, index, historyId)
- Product UI changes
- Owner UI-003E proof
- PR #12 merge or ready-for-review
- Gmail draft write, send, mutation

## Files changed

- `tools/gmail/lib/adapter.js`
- `tools/gmail/cli.js`
- `tools/gmail/test/metadata-guards.mjs`
- `tools/gmail/test/body-gate.mjs`
- `docs/product/gmail-002-real-email-ingress-plan.md`
- `docs/product/03-sprint-slice-plan.md`
- `docs/product/06-compliance-validation-index.md`
- `TODO.md`
- `docs/ui/reviews/recon-gmail-001-source-truth-contract-repair-receipt.md`
- PR #12 body (via `gh pr edit`)

## PR body reconciliation result

**pass** — PR #12 body updated to match `gmail-002b-live-proof-receipt.md`: metadata phase passed; readonly body optional; PR remains draft; UI-003E not passed; GMAIL-002C/D blocked; UI-013C owner direction PASS / UI-003E pending.

## Receipt stamp reconciliation result

**pass (documented, not bulk-edited)** — Legacy receipts with “uncommitted at receipt write” (e.g. `mail-001`, `ui-012d`) were not rewritten with invented SHAs. Authoritative evidence is PR #12 head and slice-specific receipts on branch. Pass 55 resolution lives in `app-peer-review-plan-alignment-2026-06-13.md` § Pass 55 resolution.

## Pass 55 reconciliation result

**pass** — Pass 55 is a **non-authoritative historical alias** for NAV-001/GMAIL-002A/MAIL-001 cluster work, not a formal slice ID. TODO and app-peer-review doc agree; no separate Pass 55 receipt required.

## Metadata query contract result

**pass** — `metadataListParams()` now:

- uses `labelIds` when explicit
- defaults to INBOX only when query omitted/empty
- maps only known `in:<mailbox>` aliases (`inbox`, `sent`, `trash`, `spam`, `draft`, `drafts`, `starred`, `important`)
- throws `MetadataQueryError` for general search strings (`from:`, free text, unknown `in:` aliases)
- never emits `q` under gmail.metadata

## CLI help result

**pass** — Help documents `--mailbox`, `--label`, safe `--query in:<alias>` only, and states general Gmail search is unavailable under gmail.metadata. `search-metadata` documented as deprecated alias for mailbox metadata list.

## Readonly body export safety result

**pass** — `assertReadonlyBodyExportSelection()` requires `--message-id`, `--thread-id`, `--in PATH`, or explicit `--allow-batch-readonly-export`. Default batch inbox export fails closed before OAuth/body read.

## GMAIL-002A-EXT boundary result

**pass** — `gmail-002-real-email-ingress-plan.md` splits EXT into 001–004 (pagination → index → sync status → historyId). Sprint plan and TODO updated; EXT-001 blocked until this receipt passes.

## Tests / checks result

| Check | Result |
| --- | --- |
| metadata query safety | pass |
| no `q` under gmail.metadata | pass |
| unsupported query fail-closed | pass |
| default metadata export INBOX | pass |
| readonly body export requires selection | pass |
| draft write blocked | pass |
| send blocked | pass |
| mutation blocked | pass |

## npm run check result

**pass**

## git diff --check result

**pass**

## Secrets status

No OAuth client JSON, tokens, or secrets staged or committed.

## Real data committed

**no**

## PR draft state

**draft** — PR #12 remains draft; not marked ready for review.

## Owner proof state

UI-013C owner direction PASS; formal UI-003E owner visual proof **not passed**.

## Next recommended pass

**GMAIL-002A-EXT-001** — metadata pagination + label-scoped sync jobs only.

## Decision value

`RECON_GMAIL_001_PASS_READY_FOR_GMAIL_002A_EXT_001`

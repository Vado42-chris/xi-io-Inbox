# FRAMEWORK-BACKFEED-001 xi-io.net `#239` Receipt

## Date

2026-06-15

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`6ed2b65af9cc375c48cf763957e4d862e8e16b17`

## Scope

Documentation and framework-contract backfeed only:

- Two-way freshness packet for `xi-io.net#239`.
- CI workflow repair for nested GCal adapter install (unblocks Static Preview Check).
- Governance updates (TODO, sprint slice plan).

## Excluded scope

New Inbox product behavior, ACC-SYNC-UI-001 stash, merge prep, PR ready-for-review, UI-003E pass claims, live OAuth proof, IBAL-001 implementation, framework package/export implementation.

## Files changed (Inbox)

- `docs/product/framework-backfeed-001-inbox-to-xi-io-net-239-packet.md` (new)
- `docs/ui/reviews/framework-backfeed-001-xi-io-net-239-receipt.md` (new)
- `.github/workflows/static-preview-check.yml` (GCal `npm ci` + path trigger)
- `docs/product/03-sprint-slice-plan.md`
- `TODO.md`

## Source receipts referenced

- `catchup-review-002-ext004-repair-peer-review.md`
- `gmail-002a-ext-004-repair-receipt.md`
- `gcal-001-calendar-readonly-import-receipt.md`
- `ui-converge-001-route-table-receipt.md`
- `docs/operations/framework-document-standardization-backfeed.md`

## xi-io.net issue updated

**yes** — comment on `#239` with packet summary and link.

## xi-io.net files changed

**yes** — freshness note + framework receipt (separate commit in `xi-io.net`).

## Patterns backfed

- Route table contract (PRIMARY_NAV, lane/hash, scope lens, mail workbench sub-views)
- Receipt-first slice governance + compliance index linkage
- Gmail staged ingress pattern (metadata → index → sync status → history sync post-repair)
- GCAL read-only separate-adapter pattern
- Blocked provider-write default + preview-safe action grammar

## Patterns explicitly withheld

- ACC-SYNC-UI-001 account factory (stash)
- UI-003E owner visual proof
- IBAL-001 real behavior
- Gmail send/draft/mutation
- Live OAuth proof claims
- ARCH-004 runtime decision
- Long-term storage decision

## Validation result

| Check | Result |
| --- | --- |
| `npm run check` (Inbox) | pass (this pass) |
| `git diff --check` | pass (this pass) |
| ACC-SYNC-UI-001 stash untouched | yes |
| UI-003E state unchanged | yes (reverted unauthorized local edit to proof packet) |

## CI note

GitHub Static Preview Check failed on `fa78f8e` because workflow installed Gmail nested deps but not GCal before `npm run check`. Fixed in this slice. User-reported Dependabot alert is separate from that job failure.

## PR #12 draft state

**draft** — not marked ready for review.

## UI-003E state

**not passed** — owner-only gate unchanged.

## Next recommended pass

**ACC-SYNC-UI-001** — separate branch/slice from stash; own receipt + peer review.

## Decision value

`FRAMEWORK_BACKFEED_001_PASS_XI_IO_NET_239_UPDATED`

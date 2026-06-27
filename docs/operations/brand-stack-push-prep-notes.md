# Brand stack push prep notes (do not apply until owner approves push)

**Status:** Prepared only — **not applied** to PR #12 or `branch-truth.md` until `521d639 + 2bf632f + af0bc61` are pushed.

## When brand stack lands (after owner visual review)

Update PR #12 body and `docs/operations/branch-truth.md` to state:

- `BRAND-SHELL-POLISH-002` stack landed (002 + 002B + 002C)
- Visual polish only — logo, black shell, tokens, route audit, accessibility checks
- **No** runtime/provider/egress/OAuth changes in brand commits
- `LOCAL-WEB-RUNTIME-001I` still **not started**
- `DESIGN-SYSTEM-EXTRACTION-001` remains future work (canonical JSON tokens)
- Product scope expansion captured separately in ledger (provisioning, renderer, settings matrix — capture only)

## GitHub truth before push

| Surface | Current |
| --- | --- |
| PR #12 | Draft, not merge-ready, head `dcd2a17` |
| Local only | `521d639`, `2bf632f`, `af0bc61` |

## Ledger events (brand — pending owner)

- `brand.shell.002.pass_pending_owner`
- `brand.shell.002b.token_enforcement_recorded`
- `brand.shell.002c.route_audit_recorded`

Do not emit PASS tokens until owner approves push.

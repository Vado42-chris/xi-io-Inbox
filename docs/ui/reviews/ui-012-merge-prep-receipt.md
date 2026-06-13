# UI-012 Merge-Prep Receipt (Owner UI-003E Gate)

## Date

2026-06-10

## Scope

Merge-prep after UI-012F visual readiness. **Does not claim UI-003E PASS or PR merge.**

## Pre-push validation

| Check | Command / artifact |
| --- | --- |
| Static checks | `npm run check` |
| Whitespace | `git diff --check` |
| Owner checklist | `docs/ui/reviews/ui-003e-owner-visual-proof-packet.md` (UI-012F section) |
| Framework backfeed | `docs/ui/reviews/ui-012-framework-freshness-239-receipt.md` |
| Secrets | no `secrets/`, `token.json`, `gmail-metadata.local.json` staged |

## PR #12 body (operator: paste on push)

```markdown
## Summary
- NAV-001 app shell + contextual sub-nav persistence
- MAIL-001 mail workspace IA (metadata import honest)
- GMAIL adapter metadata scope fix + live proof metadata phase
- UI-012B–F visual polish (interaction, a11y, readiness gate)
- Framework backfeed candidates for xi-io.net#239

## Blocked
- UI-003E owner visual proof (human)
- Provider send/connect/runtime (ARCH-004)
- PR remains **draft**

## Test plan
- [ ] `npm run check` (includes `check:route` Playwright smoke)
- [ ] Owner: `docs/ui/reviews/ui-003e-owner-visual-proof-packet.md`
- [ ] Optional metadata: `public/data/gmail-metadata.local.json` (gitignored)
```

## Operator sequence (after owner PASS)

1. Commit inbox batch (adapter + preview + checks + docs)
2. Push branch; post `#239` comment from `ui-012-framework-freshness-239-receipt.md`
3. Push xi-io.net freshness note commit
4. Mark PR ready only after owner signs `UI_003E_PASS_OWNER_VISUAL_PROOF_COMPLETE`

## Decision

```text
UI_012_MERGE_PREP_READY_PENDING_OWNER_UI_003E_PASS
```

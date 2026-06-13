# GMAIL-HARDEN-001 Privacy Hardening Receipt

## Date

2026-06-13

## Branch

`cursor/gmail-harden-5e1b`

## Scope

Close APP-PR-007 through APP-PR-011 from
`docs/ui/reviews/app-peer-review-plan-alignment-2026-06-13.md`.

## Files changed

- `tools/gmail/lib/adapter.js`
- `tools/gmail/lib/token-store.js`
- `tools/gmail/lib/snapshot-schema.js`
- `tools/gmail/lib/body-snapshot-schema.js`
- `tools/gmail/lib/body-redaction.js`
- `tools/gmail/cli.js`
- `tools/gmail/test/hardening.mjs`
- `public/inbox-preview.js`
- `tools/gmail/README.md`
- `tools/gmail/provider-contract.md`
- `TODO.md`
- `docs/product/03-sprint-slice-plan.md`
- `docs/product/04-build-readiness-gates.md`
- `docs/ui/reviews/app-peer-review-plan-alignment-2026-06-13.md`

## Changes

| Finding | Result |
| --- | --- |
| APP-PR-007: CLI exports printed full snapshots by default | Export/redact commands now print summary payloads by default; full snapshot stdout requires `--include-payload`. |
| APP-PR-008: nested thread messages bypassed schema field checks | Metadata and read-only validators now apply allowed-field checks to `threads[].messages[]`. |
| APP-PR-009: snippet/body-fragment policy unclear | Contract and README now state snippets are sensitive provider metadata and must not be committed as live proof or printed by default. |
| APP-PR-010: token file permissions not explicit | `tools/gmail/data` is owner-only and `token.json` is written/chmodded `0600`. |
| APP-PR-011: browser import gate was weaker than CLI validators | Preview import now checks required shape, blocked capabilities, forbidden keys, nested message fields, and unsafe URL schemes before render. |

Route smoke exposed one additional honesty gap during self-review: default fixture reading
pane copy did not include the expected body-import status. The normal reading pane now shows
`Body not imported` copy, matching metadata snapshot behavior.

## Self peer review

| Question | Answer |
| --- | --- |
| Best way possible? | Yes for this slice: harden the existing local adapter and import boundary before provider expansion; no new framework or runtime was introduced. |
| Correct fix vs different approach? | Correct bounded fix. Replacing the whole adapter would be disproportionate and risk truncating working GMAIL-002A/B proof. |
| Truncation found? | No scope truncation found after comparing TODO, sprint order, gate table, README, provider contract, and app peer-review receipt. |
| Hallucination found? | No new external claims added. Live Gmail counts remain only in the existing live-proof receipt. |
| Duplicated work? | Reduced duplicate schema assumptions by applying equivalent checks at CLI validators and browser import gate. Full shared browser/Node schema can wait for module migration. |
| Accuracy improvement | Export commands no longer put full snapshots in terminal output by default, reducing accidental receipt/log leakage. |
| Efficiency improvement | One test file covers nested schema negatives, stdout payload suppression, token mode, readonly allow path, and unsafe URL redaction. |
| Other standard applied | Least privilege, fail-closed import validation, no-silent-green gate update, evidence-backed receipt, no provider mutation. |

## Validation

```text
npm run setup:gmail
npm run check:gmail
npm run check
```

Result: pass. `npm ci --prefix tools/gmail` initially reported 4 moderate dependency
vulnerabilities; `SLICE-NPM-AUDIT-GMAIL-001` resolved them by updating `googleapis` to
`^173.0.0`. Full route smoke passed after the fixture reading-pane honesty copy fix.

## Gate updates

- `GATE-GMAIL-METADATA-001`: pass for local metadata/read-only adapter; provider writes remain blocked.
- `SLICE-GMAIL-HARDEN-001`: complete.
- `SLICE-NPM-AUDIT-GMAIL-001`: complete.

## Remaining work estimate

Working estimate to complete documentation, code comments where needed, compliance evidence,
and two-way framework freshness:

```text
1 pass  UI-003E owner visual-proof packet support (owner decision still human)
1 pass  module skeleton / route-table contract
1 pass  first route/nav strangler extraction
1 pass  PR #12 merge-prep update after owner PASS
1 pass  xi-io.net#239 framework freshness backfeed after convergence proof
2-4 passes ARCH-004 / ARCH-002 / Pass 4 decision packets, depending on owner runtime choices
```

Estimate status: **6 to 9 remaining agent passes plus owner UI-003E decision**.

## Decision value

`GMAIL_HARDEN_001_PRIVACY_HARDENING_COMPLETE_PROVIDER_WRITES_STILL_BLOCKED`


# RUNTIME-NORTHSTAR-001 — Connected Runtime Capture Receipt

## Date

2026-06-15

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`3522dc4984fc0bc27f9b8ef405c1dcb9aa4e5bdb`

## Scope

Product direction capture pass only:

- Connected local operations cockpit as product target
- Static preview + JSON import demoted to development scaffold
- Provisional ARCH-004 runtime host decision (Tauri primary)
- Next-phase slice plans (RUNTIME-001, RUNTIME-002, GITHUB-001, IBAL-001, EGRESS-001)
- UI copy state plan (no mass production copy change)
- Framework backfeed posture update (scaffold vs runtime provider)

## Excluded scope

- Live Gmail implementation
- Live GitHub implementation
- Mail UI polish
- ACC-SYNC-UI-001 stash work
- Merge prep / PR ready-for-review
- UI-003E owner PASS claim
- Removal of static preview path
- Removal of CLI adapter work

## Files changed

| File | Action |
| --- | --- |
| `docs/product/runtime-north-star-001-connected-operations-cockpit.md` | created |
| `docs/architecture/arch-004-runtime-host-decision.md` | created |
| `docs/product/runtime-001-gmail-provider-service-plan.md` | created |
| `docs/product/github-001-notifications-ingress-plan.md` | created |
| `docs/product/03-sprint-slice-plan.md` | updated |
| `docs/architecture/platform-runtime-decision-matrix.md` | pointer to ARCH-004 decision |
| `docs/product/framework-backfeed-001-inbox-to-xi-io-net-239-packet.md` | scaffold vs runtime addendum |
| `TODO.md` | RUNTIME-NORTHSTAR-001 tracking + blockers |
| `docs/ui/reviews/runtime-north-star-001-connected-runtime-capture-receipt.md` | this receipt |

## Runtime target decision

**Tauri local desktop runtime** is the provisional primary next-phase host.

Rationale: local-first, Rust async provider services, Tauri commands for UI,
desktop OAuth loopback, runtime local stores replacing manual JSON import.

## Static preview status

**Retained as scaffold.** Static preview + `tools/gmail` CLI + JSON bridge remain
for UI/gate/CI proof. Not the product destination.

## Gmail product target

Live in-app Gmail via runtime provider service (RUNTIME-001 → RUNTIME-002).
Poll-based sync with historyId; Pub/Sub push deferred.

## GitHub product target

Live notifications/issues ingress via runtime provider (GITHUB-001).
Poll-based; mutation blocked until EGRESS gates.

## OAuth / token policy

- Browser OAuth in static preview: **blocked**
- Tokens outside browser localStorage and outside repo: **required**
- Desktop loopback OAuth in Tauri runtime: **primary path**

## Egress gate policy

Draft write, send, mail mutation, GitHub mutation, automation execution remain
gated with receipts. Connected ingress does not imply open egress.

## ARCH-004 status

**Provisional decision captured** in `docs/architecture/arch-004-runtime-host-decision.md`.

Formal closeout target:

```text
ARCH_004_PASS_TAURI_LOCAL_RUNTIME_PRIMARY
```

## TODO / sprint updates

- RUNTIME-NORTHSTAR-001 marked complete (this receipt)
- Mail UI polish, merge prep, framework backfeed expansion **blocked** until ARCH-004 formal PASS + RUNTIME-001
- Next implementation slice: **RUNTIME-001** (after ARCH-004 formal pass)

## PR #12 draft state

**Remains draft.** Not marked ready for review. UI-003E not claimed PASS.

## UI-003E state

**Not passed** — human gate unchanged.

## Next recommended pass

1. Owner confirms ARCH-004 provisional Tauri decision (`ARCH_004_PASS_TAURI_LOCAL_RUNTIME_PRIMARY`)
2. **RUNTIME-001** — Gmail runtime provider service (Tauri sidecar parity first)
3. **RUNTIME-002** — UI binding to runtime store; connected-state copy

Do **not** start another Mail UI polish pass before RUNTIME-001.

## Self review

| Question | Answer |
| --- | --- |
| Captures product correction? | Yes — live Gmail/GitHub in runtime; scaffold demoted |
| Implements live providers? | No — docs only per scope |
| Removes static preview? | No |
| Removes CLI work? | No — promotes to provider prototype |
| Framework backfeed corrected? | Yes — JSON bridge labeled scaffold |

## Decision value

```text
RUNTIME_NORTH_STAR_001_PASS_READY_FOR_ARCH_004_DECISION
```

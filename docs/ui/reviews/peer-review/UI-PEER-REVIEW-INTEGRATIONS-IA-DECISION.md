# UI-PEER-REVIEW — Integrations IA decision (Connect Gmail)

## Status

**Open — owner/product decision required** before Integrations implementation batch

## Problem

After FIX-BATCH-002, three surfaces overlap around **Connect Gmail**:

| Surface | Current owner-mode role |
| --- | --- |
| Account drawer | Primary connect/sync/add + session status (`FIX-BATCH-002`) |
| Settings → Accounts | Same connect/sync path; operator tools in Advanced |
| Integrations lane | Catalog-first grid; Gmail card metadata-only in browser preview (`UI-PEER-REVIEW-007`) |

Without a decision, future agents may duplicate connect CTAs, divergent copy, or conflicting primary paths.

## Decision owner

Owner / product session — agents document options only until a choice is recorded here.

## Options

| ID | Choice | Integrations lane | Account drawer + Settings → Accounts |
| --- | --- | --- | --- |
| **A** | Accounts primary | Catalog + provider metadata in Advanced; link to Account/Settings for connect | Remains primary connect/sync surface |
| **B** | Integrations primary | “Connect Gmail” hero + short provider list | Session status only; deep link to Integrations for connect |
| **C** | Split (discouraged) | Hero connect | Also shows connect — requires identical copy and one backend path |

## Required before FIX-BATCH-Integrations

1. Record chosen option (A, B, or C with constraints) in **Decision** below
2. Update `UI-PEER-REVIEW-007-integrations.md` fix batch to match
3. Ensure Account drawer receipt (`FIX-BATCH-002`) cross-links — no contradictory primary CTA

## Related docs

- `UI-PEER-REVIEW-007-integrations.md`
- `UI-PEER-REVIEW-009-account-drawer.md`
- `UI-PEER-REVIEW-FIX-BATCH-002-account-drawer-owner-mode-receipt.md`
- `UI-PEER-REVIEW-PROGRAM-CONTINUATION-2026-06-18.md`

## Decision

```text
PENDING_OWNER — record chosen option and date when decided
```

## Agent rule

Do not wire a second primary Connect Gmail flow in Integrations until this decision is closed.

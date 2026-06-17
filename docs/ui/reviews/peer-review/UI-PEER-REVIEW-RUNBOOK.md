# UI peer review runbook (one workspace at a time)

## Goal

Review each primary nav workspace without missing component drift, scaffold noise, or trust breaks. Output feeds `component-drift-register.md` and workspace receipts — not ad-hoc chat-only findings.

## Prerequisites

- Branch: `ui-002/framework-derived-static-preview`
- Static preview: `npm run dev` → http://localhost:4488
- Optional live path: `npm run tauri:dev` (record host mode in receipt)
- Screenshot: full page + inspector open + any overlay (Account, Ibal)

## Three passes (do not mix)

### Pass A — Purpose (owner lens, ~10 min)

| Question | Pass if |
| --- | --- |
| What is this page for in one sentence? | Clear, user language |
| What is the **one** action the user should take? | Single primary CTA |
| What should be hidden until needed? | Listed explicitly |

If pass A fails, fix IA before pixel polish.

### Pass B — Component framework (~20 min)

Walk top → bottom. Log every instance of:

| Atomic element | Token / standard |
| --- | --- |
| Top bar | `--radius-chrome`, env badge, nav active state |
| Page title | `--type-display` / `--type-title` |
| Setup / warning card | One CTA max · `trust-affordance` |
| Sidebar nav item | `--density-row`, active indicator |
| Primary button | `--radius-chrome` vs pill drift |
| Secondary / link button | Same family as primary |
| Card / panel | `--radius-md`, `--surface-*`, padding `--space-*` |
| Status chip | `--type-label`, semantic colors |
| Right inspector rail | Template vs page-specific |
| Blocked / empty state | One line + one action |

Each finding:

```text
Region · Element · Expected · Actual · Severity (P0|P1|P2)
```

### Pass C — Scaffold vs product (~10 min)

Tag each visible block:

| Tag | Meaning |
| --- | --- |
| **Real** | Data or action the user cares about |
| **Scaffold** | Dev/governance proof (fixtures, receipts, gates) |
| **AI proposal** | Ibal text that does not mutate state |
| **Blocked** | Correctly disabled but should not dominate |

Rule: scaffold + AI + blocked must not occupy primary real estate in **Owner mode** (see `owner-vs-scaffold-mode.md`).

## Severity

| Level | Definition | Examples |
| --- | --- | --- |
| **P0** | Trust break or unusable | Misleading live mail, overlapping text, unsafe affordance |
| **P1** | Framework drift or IA overload | Radius mix, duplicate status, four-column noise |
| **P2** | Polish | Spacing rhythm, copy tone, motion |

## Scoring (from visual QA rubric)

Score each category 0–3 in the workspace receipt:

- Page purpose clarity
- Visual hierarchy
- Object model clarity
- Interaction clarity
- Component consistency
- Page-specific identity
- Status / safety clarity
- Density control
- Accessibility readiness

Target for owner release: **≥2 every category, ≥3 on purpose + hierarchy + density**.

## Fix discipline

1. Triage all P0 in the workspace receipt.
2. Group fixes by **component** (e.g. all inspector rails, all setup cards) — see `component-drift-register.md`.
3. Implement owner-mode simplifications before re-expanding scaffold surfaces.
4. Re-screenshot same viewport after fix batch.
5. Update workspace receipt status → `Retested`.

Do **not** claim UI-003E PASS from peer review alone; owner eyes still required per `ui-003e-owner-session-runbook.md`.

## External agent handoff (ChatGPT, etc.)

When reviewing remotely:

1. Read `UI-PEER-REVIEW-GLOBAL-FINDINGS.md`
2. Read the workspace file for the lane under review
3. Append findings to **Findings log** section with date and reviewer id
4. Do not invent PASS tokens; propose fix batches only

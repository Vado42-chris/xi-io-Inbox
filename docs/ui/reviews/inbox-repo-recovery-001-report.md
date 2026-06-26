# INBOX-REPO-RECOVERY-001 — Repo truth, ledger, PR hygiene, framework compliance

## Date

2026-06-19

## Verdict

```text
STOP-THE-LINE
Reason: repo / PR / ledger / host-mode truth disagree with owner product decision.
No product proof is valid until recovery actions below are chosen and applied.
```

## Decision token

```text
INBOX_REPO_RECOVERY_001_AUDIT_COMPLETE_HOLD_IMPLEMENTATION
```

---

## 1. Working tree state

### Committed HEAD (remote-aligned)

| Field | Value |
| --- | --- |
| Branch | `ui-002/framework-derived-static-preview` |
| HEAD | `735addf` — `fix(mail): restore owner folders and saved-snapshot honesty (FIX-BATCH-008)` |
| Remote sync | In sync with `origin/ui-002/framework-derived-static-preview` |
| Last pushed product work | FIX-BATCH-008 @ `735addf` |

### Uncommitted delta (local only — **not on CI, not on GitHub**)

**Modified (9 files, +660 / −154):**

| File | Primary slice(s) | Risk |
| --- | --- | --- |
| `public/inbox-preview.js` | **MIXED** — LOCAL-WEB-RUNTIME-001 + FIX-BATCH-009 + RUNTIME-INGRESS-001A | **High cross-contamination** (~597 lines) |
| `public/inbox-preview.css` | FIX-BATCH-009 (+ possible local-web labels) | Medium |
| `package.json` | LOCAL-WEB-RUNTIME-001 + RUNTIME-INGRESS-001A checks | Medium |
| `tools/gmail/lib/oauth-loopback.js` | LOCAL-WEB-RUNTIME-001 PKCE | Low — isolated |
| `tools/gmail/test/oauth-hardening.mjs` | LOCAL-WEB-RUNTIME-001 PKCE tests | Low |
| `scripts/route-smoke.mjs` | Minor (verify before commit) | Low |
| `public/src/runtime/gmail-runtime-refresh-loop.js` | RUNTIME-INGRESS-001A | Medium — wrong primary path if v1 = local web |
| `docs/product/03-sprint-slice-plan.md` | **Group B** | Must not mix into product commits |
| `docs/ui/reviews/shell-layout-001-owner-scroll-proof-packet.md` | Shell proof FAIL record @ 735addf | Ledger — separate commit |

**Untracked (must classify before any commit):**

| Path | Slice | Action |
| --- | --- | --- |
| `server/` (5 files) | LOCAL-WEB-RUNTIME-001 | Keep for atomic runtime commit |
| `scripts/local-web-runtime-001-model-check.mjs` | LOCAL-WEB-RUNTIME-001 | Same |
| `docs/ui/reviews/local-web-runtime-001-receipt.md` | LOCAL-WEB-RUNTIME-001 | Same — mark **uncommitted / local** until commit |
| `public/src/runtime/gmail-mail-ingress-sync.js` | RUNTIME-INGRESS-001A | **Park or revert** if Tauri is subordinate |
| `scripts/runtime-ingress-event-001a-*` | RUNTIME-INGRESS-001A | Same |
| `docs/ui/reviews/runtime-ingress-event-001a-*.md` | RUNTIME-INGRESS-001A | Same |
| `docs/ui/reviews/peer-review/UI-PEER-REVIEW-FIX-BATCH-009-*.md` | FIX-BATCH-009 | Separate commit after split |
| `docs/product/cloudhq-industry-audit-001.md` | **Group B** | Do not commit with product |
| `docs/product/mail-client-baseline-001.md` | **Group B** | Do not commit |
| `docs/product/webernetes-cba-2026-06.md` | **Group B** | Do not commit |
| `docs/architecture/orchestration-spec-status-controller-model-v1.md` | **Group B** | Do not commit |
| `docs/ui/orchestration-simulation-ux-v1.md` | **Group B** | Do not commit |
| `.tmp/` | Accidental test artifacts | **Never commit** — add to `.gitignore` or delete |

### Cross-project contamination

`public/inbox-preview.js` is the main integrity failure: one working tree diff bundles **three independent slices**. Any single atomic commit from current tree would violate slice boundaries and make receipts un-auditable.

---

## 2. PR #12 truth

| Field | GitHub state | Problem |
| --- | --- | --- |
| State | Open, **draft** | Correct — not merge-ready |
| Mergeable | **CONFLICTING** | Cannot merge without conflict resolution |
| Merge state | **DIRTY** | Branch diverged from merge base hygiene |
| Size | **271 commits**, **368 files**, ~**70.6k** additions | Not a reviewable unit |
| CI @ `735addf` | Static Preview Check ✅ · Tauri Runtime Check ✅ (2026-06-18) | Green on **committed** HEAD only |
| Bugbot | Skipping on latest check | Not a blocker; not a substitute for owner proof |

### PR body staleness (must fix before review continues)

The PR body still claims:

- Owner Mail retest path = `npm run dev` → `:4488`
- Live Gmail = `npm run tauri:dev`
- Remote HEAD = `17f1cd3` (actual remote HEAD = **`735addf`**)
- Static preview framed as primary owner review surface

**Owner product truth (2026-06-19):**

```text
v1 product host = local web runtime @ http://127.0.0.1:8788 (npm run local:web)
:4488 = demo / CI / static scaffold only
Tauri = subordinate / interim — not primary live-mail proof path
```

PR body must **not** claim UI-003E PASS, live mail proof, or merge readiness. Those remain false.

---

## 3. Ledger / receipt state

### Receipts tied to committed HEAD `735addf`

| Receipt | Commit binding | Status |
| --- | --- | --- |
| `UI-PEER-REVIEW-FIX-BATCH-008-mail-owner-folder-restore-receipt.md` | Landed in `735addf` commit | ✅ Consistent — documents 008A/008B |
| `shell-layout-001-owner-scroll-proof-packet.md` (committed base) | Was DEFER pending scroll rerun | ⚠️ **Locally modified** with owner FAIL @ 735addf — change **uncommitted** |

### Receipts created this session — **uncommitted / local only**

| Receipt | Says landed? | Actual |
| --- | --- | --- |
| `local-web-runtime-001-receipt.md` | Implementation landed pending owner proof | ✅ Honest — code is local only |
| `UI-PEER-REVIEW-FIX-BATCH-009-mail-owner-state-model-receipt.md` | Ready for shell rerun | ✅ Honest — code uncommitted |
| `runtime-ingress-event-001a-gmail-local-live-read-spine-receipt.md` | Tauri ingress spine | ⚠️ **Conflicts with v1 host decision** — should be parked or marked superseded by LOCAL-WEB-RUNTIME-001 |

### Ledger inconsistencies to fix

1. **FIX-BATCH-008 receipt** records `MAIL_OWNER_RETEST: PASS` on `:4488` — valid for static scaffold honesty, but **not** live mail. Do not conflate with LOCAL-WEB-RUNTIME-001 proof.
2. **Shell proof FAIL @ 735addf** is recorded in local packet edit but **not committed** — GitHub/agents reading HEAD still see pre-FAIL defer state unless packet commit lands separately.
3. **AGENTS.md** (committed) still lists Tauri as live-mail path and `:4488` as UX gate — **conflicts with owner v1 decision**. Not updated in uncommitted work.
4. **`docs/operations/branch-truth.md`** still describes branch as "static preview + Tauri runtime spine" without local web runtime as v1.

### Missing receipts

| Slice | Receipt | Notes |
| --- | --- | --- |
| LOCAL-WEB-RUNTIME-001 | Present (uncommitted) | OK — explicitly pending owner proof |
| INBOX-REPO-RECOVERY-001 | This report | Audit deliverable |
| PKCE hardening | Covered inside LOCAL-WEB-RUNTIME-001 receipt | No separate slice required |

---

## 4. Validation state

| Check | Last run | Scope | Result |
| --- | --- | --- | --- |
| `npm run check` | Agent pass (2026-06-19, local tree) | **Includes uncommitted** runtimeingress + localwebruntime checks | ✅ Pass locally |
| `npm run check:localwebruntime001` | Same | Uncommitted `server/` + PKCE | ✅ Pass |
| `npm run check:runtimeingress001a` | Same | Uncommitted Tauri ingress | ✅ Pass |
| `npm run check:route` / route-smoke | Same | Committed + local JS | ✅ Pass |
| GitHub Actions @ `735addf` | 2026-06-18 | **Committed only** — no local web runtime on remote | ✅ Static + Tauri green |
| GitHub Actions on uncommitted tree | Not run | — | **Unknown / not pushed** |

**Important:** Local `npm run check` pass does **not** prove remote CI on uncommitted work. Pushing without splitting would re-run CI on a mixed diff.

---

## 5. Security state (local web runtime — uncommitted)

| Control | Status |
| --- | --- |
| OAuth `state` (CSRF) | ✅ Present in `server/gmail-oauth.mjs` |
| PKCE S256 | ✅ Present (local, uncommitted) — `generatePkcePair` + token exchange with `code_verifier` |
| Loopback redirect | `http://127.0.0.1:8788/api/gmail/oauth/callback` — must match Google Cloud |
| Token storage | ✅ Server filesystem `~/.xiio/inbox/gmail-provider/data/` — not browser `localStorage` |
| Gmail scopes | Read-only metadata path via `tools/gmail` adapter — unchanged |
| Provider write actions | Not live in product UI (send/archive/delete/label write remain blocked) |

**Not proven:** OAuth completion, token write, sync, historyId incremental path — owner browser proof still pending and **frozen** until recovery gate clears.

---

## 6. Framework compliance

| Requirement | Current state | Gap |
| --- | --- | --- |
| Privacy-first / AI proposes only | ✅ Preserved in code paths reviewed | — |
| Owner-gated egress | ✅ No live provider mutation | — |
| Receipts without foregrounding to users | ⚠️ FIX-BATCH-008/009 tension — snapshot/diagnostic copy dominated UI until 009 | 009 uncommitted |
| Stop lines in AGENTS.md | ✅ Present | Host-mode table **stale** |
| Framework consumer truth back to xi-io.net | ⚠️ PR #12 body + AGENTS.md + branch-truth disagree with v1 local web decision | **Must align before proof** |
| Single reviewable PR unit | ❌ PR #12 too large + merge conflicts | Recovery required |
| Proof chain of custody | ⚠️ Mixed uncommitted slices break audit trail | Split commits required |

**Framework rule violated today:**

```text
No product proof is valid if repo truth, PR truth, and receipt truth disagree.
```

---

## 7. Recovery report — answers

### What is safe?

- Committed HEAD `735addf` (FIX-BATCH-008) — pushed, CI green on GitHub
- RUNTIME-002A/B/C spine on branch — complete per existing receipts
- UI peer review FIX-BATCH-001–007 on branch — committed
- Local `npm run check` on current tree — passes (informational only until split/push)
- LOCAL-WEB-RUNTIME-001 **design direction** — owner-approved; implementation exists locally with PKCE

### What is stale?

- PR #12 body (host modes, remote HEAD SHA, owner gate table)
- `AGENTS.md` host-mode table (`tauri:dev` as live mail primary)
- `docs/operations/branch-truth.md` product description
- PR #12 mergeability (conflicts / dirty)
- Bugbot summary referencing `:4488`-era assumptions without local web runtime

### What is uncommitted?

See §1 — **~25 paths**, with **critical mixing** in `inbox-preview.js`.

### What must be reverted or parked?

| Item | Recommendation |
| --- | --- |
| RUNTIME-INGRESS-001A (Tauri ingress) | **Park** — superseded as primary path by LOCAL-WEB-RUNTIME-001; do not commit alongside local web runtime |
| `.tmp/` | Delete or gitignore — never commit |
| Group B planning docs | Keep local or separate branch — **never** bundle with product commits |

### What must be split into atomic commits? (order TBD by owner)

1. **INBOX-REPO-RECOVERY-001B** — Governance only: PR #12 body, `AGENTS.md`, `branch-truth.md` host-mode alignment (no product behavior)
2. **Shell proof ledger** — Commit `shell-layout-001-owner-scroll-proof-packet.md` FAIL @ 735addf alone
3. **FIX-BATCH-009** — Split `inbox-preview.js` / `.css` 009-only hunks + receipt (static `:4488` presentation)
4. **LOCAL-WEB-RUNTIME-001** — `server/`, PKCE oauth, package scripts, model check, UI backend binding hunks only — **after owner proof on 8788**
5. **Group B** — Separate docs-only commit or hold

**Do not** commit current monolithic diff as one slice.

### What must be updated in PR #12 before review continues?

- Host-mode truth table (8788 v1, 4488 demo, Tauri subordinate)
- Remote HEAD SHA → `735addf` (refresh after each push)
- Remove implication that `:4488` is live-mail or primary connected path
- Explicit: UI-003E not passed · live mail proof not passed · draft · not merge-ready
- Note merge conflicts must be resolved before any merge prep

### Next single allowed action (choose one — owner decision)

```text
Option A (recommended): INBOX-REPO-RECOVERY-001B — governance alignment only
  - Update PR #12 body + AGENTS.md + branch-truth.md for v1 local web runtime truth
  - Commit shell proof FAIL packet separately (ledger)
  - No LOCAL-WEB-RUNTIME-001 product commit until browser proof PASS

Option B: Split FIX-BATCH-009 first (static :4488 calm UI) before any runtime work
  - Requires careful hunk split from inbox-preview.js

Option C: Resume LOCAL-WEB-RUNTIME-001 owner proof on 8788
  - BLOCKED until Option A at minimum — repo truth must lead product proof
```

**Agent recommendation:** **Option A** — align PR/ledger/host-mode truth, commit shell FAIL packet, then split FIX-BATCH-009 vs LOCAL-WEB-RUNTIME-001 in the working tree before any further proof or push.

---

## Process locks (unchanged)

```text
STOP FEATURE WORK until owner picks next allowed action from §7.
No commit. No push.
No Group B in product commits.
No Activity B6, Integrations IA, CloudHQ audit, ingress cards, GitHub WO, automation execution, provider egress, big features.
Live mail proof (when resumed) = http://127.0.0.1:8788 only.
Static UI proof = :4488 only.
No product proof valid while repo/PR/receipt truth disagree.
```

## Owner decision required

Reply with chosen next action:

```text
INBOX_REPO_RECOVERY_001_NEXT_ACTION: A | B | C
Reviewed by: Chris
Notes:
```

---

## INBOX-REPO-RECOVERY-001B — Governance alignment (landed)

### Owner decision

```text
INBOX_REPO_RECOVERY_001_NEXT_ACTION: A
Reviewed by: Chris
```

### Changes (governance only — no runtime code)

| Artifact | Update |
| --- | --- |
| `docs/ui/reviews/shell-layout-001-owner-scroll-proof-packet.md` | Owner FAIL @ `735addf` committed as ledger chain-of-custody |
| `AGENTS.md` | v1 = local web `@8788`; `:4488` demo/CI; Tauri subordinate |
| `docs/operations/branch-truth.md` | Same host-mode truth; recovery pointer; HEAD note |
| PR #12 body | Host-mode truth, no merge readiness, LOCAL-WEB-RUNTIME-001 uncommitted |

### Explicitly not in 001B commits

- LOCAL-WEB-RUNTIME-001 runtime code (`server/`, PKCE, UI binding)
- FIX-BATCH-009
- Group B planning docs
- RUNTIME-INGRESS-001A

### Decision token

```text
INBOX_REPO_RECOVERY_001B_GOVERNANCE_ALIGNED_READY_FOR_LOCAL_WEB_RUNTIME_PROOF
```

### Next single allowed action

```text
Resume LOCAL-WEB-RUNTIME-001 owner browser proof at http://127.0.0.1:8788.
If PASS → one atomic commit: LOCAL-WEB-RUNTIME-001 — local browser runtime with Gmail read-only ingress.
If FAIL → patch runtime only; no UI copy churn; no :4488 live-mail review.
```

```text
No product proof is valid if repo truth, PR truth, and receipt truth disagree.
```


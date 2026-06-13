# Issue Freshness Audit

## Purpose

Investigate every GitHub issue in `Vado42-chris/xi-io-Inbox` and validate what is
current in the local repository versus what still requires a local freshness update.

This is a docs-only audit. It does not authorize runtime import or change any
schema, source, or product decision.

## Method

- Enumerated all open/closed issues and PRs with `gh`.
- Cross-referenced each issue against `README.md`, `TODO.md`, `docs/`, and `schemas/`.
- Compared timestamps: local `main` HEAD is `0de349b` dated **2026-06-08**; several
  issues and PR #12 advanced on **2026-06-09**, after the last local commit.

## Core finding

Local `main` is frozen at the end of the 2026-06-08 UI-001 work. The issue tracker
moved forward on 2026-06-09 with `ARCH-004` (#13), `UI-003` (#14), the `UI-002`
static-preview PR (#12), and the formal `ARCH-001` closure (#9). None of that
2026-06-09 state is reflected in `TODO.md`, `docs/product/roadmap.md`, or any local
doc. That is the primary freshness gap.

## Per-issue validation

| Issue | GH state | Local reflection | Verdict |
| --- | --- | --- | --- |
| #1 BOOTSTRAP-001 | OPEN (root tracker) | `README.md` + `TODO.md` Pass 1 all `[x]` | Current locally. Intentionally stays open as root tracker. |
| #2 SOURCE-AUDIT-001 | OPEN | `docs/architecture/source-audit.md`, `source-candidate-matrix.md`, `framework-mining-pass-2.md`; TODO Pass 2 complete | Current locally (issue-level audit done). |
| #3 ARCH-001 | OPEN (duplicate) | Decision recorded; PR #8 merged | Stale on GitHub: duplicate of #9 (CLOSED). Local state is current; needs GitHub-side close of #3. |
| #9 ARCH-001 | CLOSED | `docs/architecture/android-mail-spine-audit-pass-3.md`, `pass-3e-merge-decision.md` | Current. |
| #4 SOURCE-AUDIT-002 | OPEN | `docs/architecture/file-level-source-audit-pass-2b.md`; TODO Pass 2 file-level audit complete | Current locally. Ref check: issue says push freshness candidates to `xi-io.net#232`, but `TODO.md` logged `xi-io.net#233` — confirm which framework issue is canonical. |
| #5 FRAMEWORK-FRESHNESS-001 | OPEN | Candidate contracts listed; `xiio-framework-alignment.md` says "framework adoption pending" | Partially current. Acceptance step 1 ("validate contracts inside Inbox first") is now executable: the five `schemas/*.json` validate clean against JSON Schema draft 2020-12 and against sample documents. Promotion back to `xi-io.net` is still pending. |
| #6 ARCH-002 | OPEN | TODO Pass 3 `[ ] Execute local upstream build proof`; `thunderbird-upstream-build-proof-packet.md`, `pass-3b-status.md` | Current and accurate: build proof genuinely not executed. Real outstanding work, not a doc-staleness issue. |
| #7 ARCH-003 | OPEN | `thunderbird-fork-identity-packet.md`; TODO `[ ] Finalize package/application ID...` | Current: packet ready, decisions pending. |
| #10 UI-001 | OPEN | `docs/ui/framework-ui-adoption.md`, `inbox-framework-component-map.md`, cursor prompt; TODO UI-001 first 5 `[x]`, last 3 `[ ]` | Partially stale: TODO still shows `[ ] Create first static Inbox UI preview`, but that work shipped as `UI-002`/PR #12 on 2026-06-09. Local TODO needs update. |
| PR #12 UI-002 | DRAFT | Not referenced anywhere locally | Stale/missing: no local doc records the static preview's existence or its failed owner/framework UX review (2026-06-09). Requires local freshness update. |
| #13 ARCH-004 | OPEN | Not referenced locally | Missing: platform/runtime + deployment envelope decision is not in `TODO.md` or `roadmap.md`. Per the issue, runtime-skeleton work is blocked until this is documented. Requires local freshness update. |
| #14 UI-003 | OPEN | Not referenced locally | Missing: unified xi-io app-shell requirement (Home/Inbox/Calendar/Tasks/Automations/Extensions/Receipts/Ibal/Settings lanes) and the UI-002 UX-review failure are unrecorded. Requires local freshness update. |

## Framework (`xi-io.net`) cross-reference drift

Local docs cite `xi-io.net#132`, `#143`, `#233`. The newer issues cite `xi-io.net#232`
(freshness candidates), `#238` (framework UI consumer contract, reported merged in #13),
and `#239` (direct framework export/package reuse, future work). The `#238`/`#239`
linkage is not captured in any local doc and should be added during the freshness update.

## What is CURRENT locally

- Bootstrap governance (Pass 1) and source mining (Pass 2): complete and accurately tracked.
- ARCH-001 mail-spine decision: recorded; matches CLOSED issue #9.
- ARCH-002 / ARCH-003 packets: present; correctly marked pending.
- All five JSON schemas: valid and self-consistent.

## What REQUIRES a local freshness update

1. `TODO.md` and `docs/product/roadmap.md` do not reflect `ARCH-004` (#13), `UI-002` (#12), or `UI-003` (#14).
2. `TODO.md` UI-001 still lists the static preview as not started, though it shipped as PR #12.
3. No local record of the 2026-06-09 owner/framework UX-review failure for UI-002.
4. No local record of the `xi-io.net#238`/`#239` framework UI/export linkage.
5. (GitHub-side, not local) duplicate `ARCH-001` issue #3 should be closed in favor of #9.
6. Confirm the canonical framework-freshness tracker: `xi-io.net#232` (issues) vs `#233` (local TODO).

## Outstanding real work (not doc staleness)

- `ARCH-002`: execute the upstream Thunderbird Android local build proof. Not runnable in
  this environment (no Android SDK / JDK 21 Gradle toolchain provisioned). Tracked as still pending.

## Decision value

`ISSUE_FRESHNESS_AUDIT_COMPLETE_LOCAL_MAIN_BEHIND_2026_06_09_ISSUE_STATE`

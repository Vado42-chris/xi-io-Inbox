# UI-002 Local Proof Status

## Purpose

Track the local browser smoke proof required before PR #12 leaves draft.

## Status

```text
Result: PENDING
```

## Scope correction

This receipt is for static preview smoke proof only.

A PASS here means the current static preview renders and behaves as expected in a local browser. It does not mean the product platform is decided or ready.

Platform/runtime decisions are tracked in `xi-io-Inbox#13` and documented in:

```text
docs/architecture/platform-runtime-decision-matrix.md
```

## Framework state

- `xi-io.net#238` merged the Workbench UI consumer contract.
- `xi-io.net#235` is closed as completed.
- `xi-io.net#239` tracks future stable direct export/package work.

The PR #12 preview uses the adapted-copy/static-preview path. Direct framework package import is not complete.

## Required commands

```bash
npm run check
npm run dev
```

Open:

```text
http://localhost:4488
```

## Evidence receipt

```text
Date:
Machine:
Branch:
Commit SHA:
npm run check result:
npm run dev result:
Local URL opened:
Browser:
Console errors:
Rail / stream / context verified: yes | no
Click selection verified: yes | no
Keyboard selection verified: yes | no
Warning banner verified: yes | no
Privacy state verified: yes | no
Blocked action state verified: yes | no
No provider data verified: yes | no
No provider request required: yes | no
Screenshot captured: yes | no
Result: PASS | FAIL | BLOCKED
Notes:
```

## PASS means

- The static preview opens locally.
- The rail / stream / context UI renders.
- Basic click and keyboard smoke behavior works.
- Draft-only blocked-action language is visible.
- No provider data or provider request is required.

## PASS does not mean

- final web app decision,
- Electron decision,
- Tauri decision,
- native Android decision,
- local cloud/home server decision,
- product runtime readiness,
- storage/security model readiness,
- provider integration readiness.

## PR gate

PR #12 remains draft until this file records PASS evidence from a real local browser run.

After PASS, PR #12 may leave draft only as a static preview PR. Product/runtime testing remains blocked by `ARCH-004`.

## Decision value

`UI_002_LOCAL_PROOF_PENDING_STATIC_PREVIEW_ONLY_PLATFORM_UNDECIDED`

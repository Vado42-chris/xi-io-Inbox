# RUNTIME-002C — Operator OAuth Proof Runbook

## Status

```text
Type: owner human gate (operator proof)
Blocked claim until owner completes checklist below
Decision token (owner only): RUNTIME_002C_OPERATOR_OAUTH_PROOF_PASS
```

## Purpose

Prove live Gmail connect + metadata sync + runtime mail index visibility end-to-end in **Tauri**
(`npm run tauri:dev`), not static preview (`npm run dev`).

Agents must **not** check PASS items or invent the decision token.

## Prerequisites

- `secrets/gmail-oauth-client.json` present (gitignored)
- `npm run setup:gmail` completed once
- Branch: `ui-002/framework-derived-static-preview`
- `npm run check:runtime002c` passes

## Operator steps

1. Start Tauri runtime:
   ```bash
   npm run tauri:dev
   ```
2. Open **Settings → Accounts** (or account session panel).
3. Click **Connect Gmail** and complete the desktop OAuth loopback flow.
4. Confirm orchestration panel shows **Connection: connected** (or equivalent honest state).
5. Click **Sync now** (bounded metadata sync).
6. Confirm **Mail index** shows thread count > 0 (or honest empty with warnings if mailbox empty).
7. Wait up to 60s or click **Refresh now** — confirm **Last refresh** updates without crash.
8. Open **Mail** lane — confirm runtime threads appear (metadata headers only; no bodies).
9. Verify egress copy still blocks body read, draft write, send, mutation.

## Evidence to record (owner)

In this file or a separate owner proof note, record:

| Field | Value |
| --- | --- |
| Date | |
| Commit SHA | `git rev-parse HEAD` |
| Host mode | Tauri |
| Thread count after sync | |
| Auto refresh observed | yes/no |
| Blocking issues | none / describe |

## PASS criteria

All must be true:

- OAuth completed via Tauri loopback (not browser preview OAuth)
- Metadata sync succeeded or produced honest bounded warnings
- Runtime mail index visible in Mail lane without JSON import
- Refresh loop or manual refresh updates status without init crash
- No body/send/mutation paths observed

## FAIL criteria

Stop and file a repair slice if:

- Connect succeeds but index never populates after sync
- Corrupt index crashes app init (should set `indexError` only)
- Static preview claims connected/live mail
- Body content appears from runtime path

## After PASS

Owner may record:

```text
RUNTIME_002C_OPERATOR_OAUTH_PROOF_PASS
```

Then agent may update governance docs to unblock downstream gates that depend on live-mail operator proof (not UI-003E scaffold proof — that remains separate on `:4488`).

## Related

- `docs/ui/reviews/runtime-002c-refresh-loop-operator-proof-receipt.md`
- `docs/architecture/runtime-store-boundary-v1.md`

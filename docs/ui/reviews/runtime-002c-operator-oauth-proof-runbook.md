# RUNTIME-002C — Live OAuth Consent (minimal human step)

## Status

```text
Type: minimal human gate (OAuth consent only)
Automated structural proof: npm run gate:runtime002c -- --write-evidence
Decision token (automated when marker exists): RUNTIME_002C_LIVE_OAUTH_CONSENT_RECORDED
```

## What is automated (no human checklist)

- Refresh loop unit tests
- Runtime structural checks (`check:runtime002c` / `002b` / `002a` / `001`)
- `cargo test`
- Evidence file generation
- Ollama peer review draft (`--slice runtime-002c`)

See `docs/operations/automated-gates-runbook.md`.

## What only a human can do

Click **Allow** on Google OAuth in the Tauri desktop connect flow. One session.

## Minimal steps

1. Ensure structural gate already passed:

```bash
cd "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox" && npm run gate:runtime002c -- --write-evidence
```

2. Start Tauri:

```bash
cd "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox" && npm run tauri:dev
```

3. In the app: **Connect Gmail** → Google consent → **Sync now** → glance at Mail lane for metadata threads.

4. Record consent (gitignored marker):

```bash
printf '%s OAuth consent completed in Tauri\n' "$(date -Iseconds)" > "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox/secrets/runtime-002c-oauth-consent.complete"
```

5. Upgrade gate tokens:

```bash
cd "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox" && npm run gate:runtime002c -- --write-evidence
```

Expect: `RUNTIME_002C_GATE_PASS_READY_FOR_PEER_REVIEW`.

## Agents

- Do **not** create the marker file without owner OAuth.
- Do **not** claim UI-003E PASS here (separate scaffold gate on `:4488`).

## Related

- `docs/ui/reviews/runtime-002c-refresh-loop-operator-proof-receipt.md`
- `docs/ui/reviews/runtime-002c-automated-gate-evidence.md`

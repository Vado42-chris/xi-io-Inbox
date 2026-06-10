# Gmail Local Adapter (GMAIL-001B+)

Local-only Gmail provider spike location. **No OAuth implementation in GMAIL-001B** — plan and contract only.

## Rules

- Credentials and tokens live under `secrets/` or ignored paths here — never in repo.
- Default mode: metadata read only; bodies blocked; send blocked.
- See `docs/providers/gmail/` for policies and `provider-contract.md` for method boundaries.

## Next pass

GMAIL-001C: implement metadata-only adapter CLI after GATE-GMAIL-METADATA-001 pass.

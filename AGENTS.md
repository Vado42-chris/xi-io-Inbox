# AGENTS.md

## Start here (read before any UI work)

This branch carries the `xi-io Inbox` static preview. Before changing UI:

1. Read `docs/ui/ui-north-star-and-convergence-plan.md` — the single UI source of truth
   (reconciles the superseded UI-003 / UI-005 / UI-007 models).
2. Read `docs/operations/multi-agent-orchestration.md` — how work is divided across agents.

The product is **draft-centered, human-first, AI-augmented, privacy-first, fully
auditable** — not just a mail client. AI proposes and drafts; only the user sends; every
confirmed or simulated action produces a receipt.

## Module ownership (do not edit outside your module)

Parallel agents must stay in their lane. Target module map (during the strangler migration
out of `public/inbox-preview.js`):

```text
public/src/design/        design system (tokens, components)
public/src/shell/         app frame, single nav, router, state store, inspector
public/src/workbench/     mail spine: Inbox → Drafts → Approvals → Sent/Receipts
public/src/capabilities/  calendar/ tasks/ automations/ extensions/ settings/
public/src/ibal/          concierge drawer + command entry (NOT a nav lane)
public/src/lib/, fixtures/ view-model adapters + preview data
tools/gmail/, schemas/    spine adapter + contracts
```

A PR editing files outside the agent's owned module is rejected unless the orchestrator
authorizes a small, explicit cross-module change.

## Non-negotiable invariants (every PR is reviewed for these)

- Draft-only egress: `send/forward/delete/archive/disclose/publish/deploy` stay disabled
  with a visible gate reason, enforced in code (not just hidden in UI).
- No secrets, tokens, credentials, or real private message bodies in code, fixtures, or
  storage. Redaction happens in `tools/gmail/lib/` at the adapter boundary; UI consumes
  sanitized view models only.
- Use design-system tokens/components; do not invent new pill/card/banner systems.
- Do not grow `public/inbox-preview.js`; migration only removes code from it.
- No-silent-green: status must never imply success that did not happen.
- This repo is public: no private framework internals or personal data.

## Cursor Cloud specific instructions

### What this repository is

`xi-io Inbox` is a privacy-first personal operations command center (email-first). The
`main` branch is planning/docs + JSON schemas; this `ui-002` lineage adds a static,
no-provider preview (`public/`) and a local Gmail adapter (`tools/gmail/`). There is no
production runtime yet; provider connection, OAuth, send, and automation execution are all
gated off (`GATE-RUNTIME-001`, `GATE-PROVIDER-001`, `GATE-AUTO-EXEC-001`).

### Run / validate the preview

Standard commands live in `package.json`. Key ones:

- Serve the preview (static, no build step): `npm run dev` → http://localhost:4488 (uses
  `python3 -m http.server`; no Node server, no bundler).
- Validate without a browser: `npm run check` (files + JSON + `node --check` JS + a11y
  model check + Gmail adapter check). The Gmail check needs deps: `npm run setup:gmail`
  first (`npm ci --prefix tools/gmail`), or run the lighter `npm run check:js` /
  `check:json` / `check:acc` which need no install.
- The preview renders client-side into `#inboxPreviewMount`; give it a moment after load.

### JSON schema validation (shared with `main`)

`schemas/*.json` are JSON Schema draft 2020-12. Validate with `check-jsonschema`
(`python3 -m check_jsonschema --check-metaschema schemas/*.json`); installs to
`~/.local/bin`, so invoke via `python3 -m check_jsonschema` to avoid PATH issues.

### Non-obvious gotchas

- The current monolith (`public/inbox-preview.js`) mixes three superseded nav models;
  expect duplicate/redundant lanes. Follow the north-star plan rather than the old
  `ui-003/005/007` docs when they conflict.
- A passing `npm run check` is a smoke test, not product proof — capture browser evidence.

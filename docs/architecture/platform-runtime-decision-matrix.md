# Platform Runtime Decision Matrix

## Purpose

Capture the platform and deployment decisions that must be made before `xi-io Inbox` moves from static preview proof into product/runtime testing.

## Current correction

`UI-002` is ready only for static preview smoke proof.

It is not yet ready for end-product testing because the product runtime envelope is not decided.

## Framework contract

Framework-level rule:

```text
xi-io.net/docs/framework/platform-runtime-envelope-contract-v1.md
```

Framework tracking issue:

```text
xi-io.net#240
```

Core framework rule:

```text
A preview surface is not a platform decision.
```

## Current known state

- `xi-io Inbox` is a unified ingress, analysis, and controlled-egress command center.
- Email is the first adapter, not the full product boundary.
- The current PR #12 UI is a static framework-derived preview.
- The preview runs as a local web/static preview for UI shape verification only.
- Android mail spine proof remains pending.
- Framework UI consumer contract is merged in `xi-io.net#238`.
- Stable direct framework export/package work remains future work in `xi-io.net#239`.
- Platform/runtime decision is tracked in `xi-io-Inbox#13`.
- Cross-product platform/runtime envelope is tracked in `xi-io.net#240`.

## Non-decision warning

The existence of `public/index.html`, `npm run dev`, and a browser preview does not mean the final product is a web app.

The current preview also does not mean the final product is Electron, Tauri, native Android, or local cloud.

## Candidate platform layers

| Layer | Role | Current status | Notes |
| --- | --- | --- | --- |
| Android mobile | Mail spine candidate and mobile inbox surface | undecided / proof pending | Thunderbird Android remains a candidate source, not imported runtime. |
| Local web app | Browser-based local UI surface | preview only | Good for fast UI proof, not a final architecture decision. |
| Tauri desktop | Local desktop shell option | undecided | Smaller native shell candidate, likely useful for local-first desktop. |
| Electron desktop | Local desktop shell option | undecided | Mature but heavier. Should not be chosen by inertia. |
| Local cloud / home server | Private LAN/server companion | undecided | Potential xi-io local-first control plane and sync hub. |
| Hosted cloud | Optional future convenience service | not current scope | Must not weaken privacy defaults or force unsafe egress. |

## Candidate runtime shapes

### Option A: Android-first native mail spine

Use a mobile mail client spine as the primary runtime.

Potential benefits:

- Real email-provider integration path.
- Mobile-first inbox access.
- Can inherit mature mail client behavior if license and architecture allow.

Risks:

- Fork complexity.
- Android build and provider configuration burden.
- Harder to share rich desktop control-room UI.
- License, branding, and distribution details must be settled before shipping.

### Option B: Local-first web app

Use a local web application as the primary UI.

Potential benefits:

- Fast iteration.
- Easy to align with `xi-io.net` framework UI contracts.
- Can run locally without app-store gates.
- Natural fit for Ibal-style operations dashboard.

Risks:

- Browser storage and secret handling need hard boundaries.
- Real email provider integration needs a safe local adapter or server.
- Mobile integration may be weaker than native.

### Option C: Tauri desktop app

Use Tauri as a desktop shell around a local-first UI.

Potential benefits:

- Smaller desktop shell than Electron.
- Good fit for local-first desktop control center.
- Can integrate with local files and local services with explicit permissions.

Risks:

- Requires Rust/Tauri build workflow.
- Mobile story is separate.
- Provider secrets and local service boundaries still need design.

### Option D: Electron desktop app

Use Electron as a desktop shell around a web UI.

Potential benefits:

- Mature desktop app ecosystem.
- Strong web UI compatibility.
- Easier for many JavaScript developers.

Risks:

- Heavier runtime.
- Larger attack surface and resource cost.
- May be unnecessary if Tauri or local web is enough.

### Option E: Local cloud / home server plus thin clients

Run a local service on a trusted machine or home server, with browser/mobile/desktop clients connecting to it.

Potential benefits:

- Strong fit for private local-first AI and xi-io orchestration.
- Can centralize provider adapters, indexing, receipts, and local model access.
- Supports multiple devices without default hosted cloud.

Risks:

- Network/security complexity.
- User setup complexity.
- Requires clear local auth, TLS, backup, and device trust model.

### Option F: Multi-surface shared core

Use shared contracts and adapters with multiple UI surfaces:

- Android for mobile mail access,
- local web/Tauri desktop for control room,
- optional local cloud/home server for sync and local AI orchestration.

Potential benefits:

- Best fit for `xi-io` as a framework of products.
- Avoids forcing one surface to solve every problem.
- Lets Inbox grow from email adapter into broader ingress/egress command center.

Risks:

- More architecture discipline required.
- Needs strict shared contracts before runtime code expands.
- Requires careful sequencing to avoid fragmented implementations.

## Recommended provisional direction

Use **Option F: multi-surface shared core** as the provisional planning model.

Near-term practical sequence:

1. Keep `UI-002` as static preview smoke proof only.
2. Complete Android mail spine build proof before importing mail runtime.
3. Define local-first storage and secret boundary before provider integration.
4. Decide whether the first desktop/control-room shell is local web or Tauri.
5. Treat local cloud/home server as a first-class architecture option, not an afterthought.
6. Do not select Electron unless a concrete requirement makes it preferable to Tauri/local web.

## Platform decision gates

Before product testing, decide:

- primary first runtime surface,
- secondary supported surfaces,
- local storage boundary,
- provider secret storage boundary,
- local cloud/home server role,
- offline behavior,
- sync behavior,
- import/export/backup model,
- distribution model,
- privacy threat model,
- receipt and audit model.

## Required decision receipt

Use the framework receipt shape from `xi-io.net`:

```text
Product:
Issue/PR:
Primary runtime surface:
Secondary surfaces:
Storage boundary:
Provider secret boundary:
Local cloud/home server role:
Hosted cloud role:
Offline behavior:
Sync behavior:
Backup/export/import behavior:
Distribution model:
Audit/receipt behavior:
Privacy/threat assumptions:
Rejected options:
Reasoning:
Follow-up issues:
Decision value:
```

## What UI-002 may test

Allowed:

- rail / stream / context layout,
- preview data rendering,
- keyboard smoke behavior,
- blocked action visibility,
- draft-only egress language,
- framework-derived UI fit.

Not allowed:

- product platform readiness,
- email provider integration,
- local cloud behavior,
- Android runtime behavior,
- desktop shell behavior,
- Tauri/Electron packaging,
- final storage/security model.

## Decision value

`PLATFORM_RUNTIME_DECISION_MATRIX_SYNCED_WITH_FRAMEWORK_CONTRACT`

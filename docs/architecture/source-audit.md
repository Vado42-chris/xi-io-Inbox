# Source Audit Index

## Purpose

This document tracks candidate upstream sources before code, docs, schemas, or components are imported into `xi-io Inbox`.

The goal is to update and reuse proven xi-io work where safe, not recreate local one-off systems.

## Import states

| State | Meaning |
| --- | --- |
| `reference-only` | Use as planning/context, do not copy code. |
| `pattern-candidate` | Inspect for reusable patterns, recreate in Inbox-native form if useful. |
| `copy-candidate` | May copy after license/privacy review. |
| `blocked` | Do not copy. |
| `approved` | Approved for implementation/import with documented boundary. |

## Source inventory

| Source | Visibility | Current state | Candidate use |
| --- | --- | --- | --- |
| `Vado42-chris/xi-io.net` | private | reference-only | Framework governance, provider contracts, event schema doctrine, verifier gates, Ibal/workbench concepts. |
| `Vado42-chris/realitypools.tv` | private | pattern-candidate | Calendar views, event feeds, route shells, cards, panels, empty/loading states. |
| `thunderbird/thunderbird-android` | public | blocked until ARCH-001 complete | Android mail spine candidate. |
| `Vado42-chris/google_planner` | public | pattern-candidate | Approval-gated workflow, calendar planning, document recipes. |
| `Vado42-chris/xi-io_docuforge` | public | pattern-candidate | Export/review/document packet patterns. |
| `Vado42-chris/xi-io_AuDHD-field-guide` | public | pattern-candidate | Consent, low-friction capture, cognitive-load design. |
| `Vado42-chris/xi-io-emulator` | public | reference-only | Product shell discipline, proof gates, controller-first lessons. |

## Public repository boundary

`xi-io Inbox` is public. Do not import:

- secrets
- credentials
- private emails
- private legal facts
- personal data
- private repo implementation details that should remain private
- copied source code without license review

## Current decision

Before any Android runtime import, complete:

- ARCH-001 mail spine decision
- license review
- package naming strategy
- source attribution plan
- provider sign-in configuration plan
- build proof plan

## Framework-first alignment

When a reusable concept already exists in `xi-io.net`, this repo should either:

1. reference it as upstream framework doctrine, or
2. recreate a public-safe Inbox-specific contract derived from the doctrine.

Do not fork framework meaning locally unless a product-specific divergence is documented.

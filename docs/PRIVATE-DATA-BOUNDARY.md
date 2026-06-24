# xi-io Inbox Private Data Boundary

Status: LOCKED DIRECTION  
Date: 2026-06-24

## Purpose

xi-io Inbox handles private personal operations data. The product must separate public UI assets from private mail, account, evidence, and analysis data.

## Public assets may include

- compiled frontend files
- static UI assets
- public documentation
- public-safe route shells
- non-secret app configuration

## Public assets must not include

- email bodies
- `.eml` source files
- attachments
- account tokens
- OAuth secrets
- provider credentials
- evidence packages
- manifests containing private metadata
- private model outputs
- legal or personal case data
- local filesystem paths that reveal private structure

## AI and agent boundary

AI may summarize, classify, tag, draft, export, decompose, and propose actions.

AI must not send, delete, forward, or externally disclose messages by default.

Outbound actions must remain draft-only unless deliberate advanced automation is explicitly enabled by policy.

## Evidence archive boundary

Offline evidence exports must be stored outside public deploy folders.

The evidence archive system must preserve sources unchanged, hash files, write manifests, and verify archives before any egress.

## Framework alignment

This boundary must align with:

- `xi-io.net` chatbot ingress standard
- project kernel standard
- local model provider gate standard
- legal-private ingress boundary standard when evidence/legal data is involved

END OF BOUNDARY

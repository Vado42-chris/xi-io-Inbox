# Email Evidence Archive Architecture

Status: LOCKED DIRECTION  
Date: 2026-06-24  
Framework parent: `Vado42-chris/xi-io.net`

## Purpose

xi-io Inbox will eventually support evidence-grade email export and review workflows.

The first implementation must be offline and source-preserving.

## First implementation boundary

Allowed:

- accept a local folder of exported `.eml` files
- preserve each `.eml` unchanged
- extract deterministic headers
- extract attachments into deterministic folders
- write manifest JSON and CSV
- hash every source `.eml`, attachment, manifest, and final archive
- create a zip package
- verify package integrity
- write receipts

Forbidden in first implementation:

- live Gmail connection
- live Outlook connection
- live IMAP connection
- Thunderbird profile mutation
- sending messages
- deleting messages
- moving messages
- archiving messages remotely
- label mutation
- provider-write behavior

## Evidence package flow

```text
exported .eml folder
  -> source preservation
  -> deterministic metadata extraction
  -> attachment extraction
  -> manifest generation
  -> hashing
  -> zip packaging
  -> verification
  -> receipt
```

## Required metadata

For each message:

- source filename
- source hash
- Date
- From
- To
- Cc
- Bcc
- Subject
- Message-ID
- In-Reply-To
- References
- attachment list
- attachment hashes

## Future account connectors

Future live connectors must be provider-gated and separate from the offline evidence exporter.

Potential future connectors:

- Gmail OAuth
- Microsoft OAuth
- Proton Bridge
- generic IMAP
- Thunderbird export import path

## Relationship to framework

This subsystem must follow:

- chatbot ingress standard
- project kernel standard
- local model provider gate standard
- legal-private ingress boundary standard where evidence/legal use applies

## Public/private rule

No private email bodies, attachments, manifests, source exports, or evidence packages may be deployed under a public web folder.

END OF ARCHITECTURE

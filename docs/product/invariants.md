# xi-io Inbox Product Invariants

## Purpose

This document locks the non-negotiable product rules for `xi-io Inbox`.

## Primary loop

```text
Ingress -> Analysis -> Controlled Egress -> Receipt
```

## Ingress

Ingress includes messages, email, attachments, contacts, calendar signals, cloud file references, workflow events, and future supported provider events.

Email is the first adapter. It is not the final boundary of the product.

## Analysis

Ibal and task agents may analyze inbound records to produce:

- summaries
- risk flags
- tags and bins
- task proposals
- bug proposals
- calendar proposals
- draft replies
- export packets
- contact suggestions
- automation proposals

Analysis must preserve source references so the user can inspect why a proposal exists.

## Controlled egress

Egress includes more than sending. It includes:

- draft creation
- archive/export creation
- task creation
- bug creation
- calendar proposal creation
- folder or label changes
- contact updates
- reminders
- external webhooks
- provider actions

By default, AI may prepare egress but must not execute externally visible egress without user confirmation.

## Draft-only default

AI-assisted sending is disabled by default.

```text
AI_ASSISTED_SEND = false
```

The default product behavior is:

```text
AI can draft.
Only the user can send.
```

## Receipts

Every confirmed action must generate a receipt containing:

- source event reference
- proposed action
- confirming user action
- timestamp
- provider or local target
- risk level
- model/provider used, if AI participated
- result status

## Framework-first rule

Reusable contracts, provider manifests, event schema patterns, verifier gates, and receipt rules should align with `xi-io.net` before local invention.

## Public repo rule

This repository is public. Private framework internals, secrets, personal data, provider credentials, and private repo implementation details must not be copied here.

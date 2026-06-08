# Monetization Guardrails

## Purpose

`xi-io Inbox` may eventually support freemium payment, donations, tip jar / buy-me-a-coffee style support, hosted convenience features, or paid service tiers.

Monetization must not weaken the safety, privacy, or audit defaults.

## Product stance

The core product should remain useful without payment.

Possible future support paths:

- donation/tip support
- buy-me-a-coffee style support link
- freemium convenience tier
- paid hosted AI routing
- paid hosted sync/backup, if privacy model supports it
- paid export/automation convenience features, if clearly separated from user-owned data

## Non-negotiable limits

Monetization must not:

- require unsafe AI sending
- force cloud AI use for private inbox analysis
- hide draft-only egress behind a paywall
- sell user inbox data
- weaken local-first/self-hosted options
- obscure model/provider routing
- make export portability a hostage feature
- charge users to retrieve their own data

## Freemium candidates

Free/core:

- local app usage
- connected email accounts, subject to implementation limits
- manual analysis
- draft-only AI policy
- local export basics
- public archive standard
- user-provided AI keys
- local/self-hosted endpoint support, where practical

Paid/convenience, later:

- hosted model proxy
- higher-volume analysis queues
- cross-device sync
- encrypted hosted backup
- advanced automation recipes
- team/workspace features
- premium export templates
- hosted OCR/document pipeline

## Trust rule

The user should always be able to understand:

- what is free
- what costs money
- where private data goes
- which provider/model was used
- what the AI was allowed to do
- how to export their own records

## Current decision

No payment implementation is planned during bootstrap. This document exists to prevent architecture choices that would block ethical freemium later.

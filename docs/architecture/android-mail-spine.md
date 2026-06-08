# Android Mail Spine Decision

## Status

Pending decision. Runtime import is blocked.

## Leading candidate

`thunderbird/thunderbird-android`, formerly K-9 Mail, remains the leading Android mail-client spine candidate.

## Why use an existing spine

The project should not rewrite mail transport, sync, account setup, message rendering, IMAP/SMTP behavior, or Android mail storage from scratch unless there is no safe alternative.

The xi-io value layer is:

- normalized ingress events
- Ibal assistant surface
- draft-only egress gate
- task/action compiler
- archive/export standard
- provider and AI manifests
- receipts

## Decision questions

- What license obligations apply?
- How will attribution be handled?
- Will this be a full fork, partial fork, or delayed integration?
- How will the package/app name change?
- How will provider sign-in configuration be handled?
- How will upstream changes be tracked?
- How will xi-io sidecar events attach without destabilizing sync?
- What is the smallest build proof?

## Recommended first proof

1. Clone/build upstream locally.
2. Confirm Android Studio/Gradle requirements.
3. Confirm app launches.
4. Confirm account setup and test message read path.
5. Identify message/thread domain objects.
6. Add no code until source boundary is documented.

## Integration boundary

The mail spine owns:

- accounts
- sync
- message storage
- folder/mailbox handling
- message rendering
- draft storage
- provider transport

xi-io sidecar owns:

- event normalization
- agent proposals
- egress policy
- receipts
- export packets
- automation bridge
- model-provider routing

## Non-goals

- No autonomous AI sending.
- No unofficial provider scraping.
- No messaging-platform integrations before email proof.
- No provider-specific mail API rewrite before spine proof.

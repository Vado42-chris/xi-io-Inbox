# Thunderbird Android Fork Identity Packet

## Purpose

Define the decisions required before `xi-io Inbox` distributes any Android build based on `thunderbird/thunderbird-android`.

This supports `ARCH-003`.

## Why this exists

Thunderbird Android upstream explicitly requires forks to replace OAuth client setup and use a distinct redirect URI so the fork does not conflict with official Thunderbird or K-9 installs on the same device.

## Current decision

Runtime import is blocked until fork identity and provider configuration are documented.

```text
No upstream OAuth client setup in xi-io builds.
No upstream redirect URI in xi-io builds.
No Thunderbird/K-9 branding confusion.
```

## Required product identity decisions

| Field | Initial recommendation | Status |
| --- | --- | --- |
| App display name | `xi-io Inbox` | proposed |
| Android application ID | `net.xiio.inbox` or `com.xiio.inbox` | pending |
| Debug application ID suffix | `.debug` | proposed |
| Future beta suffix | `.beta` | proposed |
| Release signing | separate xi-io signing key | pending |
| App icon/branding | xi-io/Ibal-owned, no Thunderbird marks | pending |
| Attribution | clear Apache-2.0 / Thunderbird Android / K-9 lineage notice | required |

## Provider configuration decisions

Required before distributable builds:

- own OAuth client configuration
- own redirect URI
- provider scopes documented
- per-provider permission manifest
- no credentials committed to repo
- debug/test/prod environment separation
- local-only placeholder config for non-distributed build proofs

## Suggested redirect URI strategy

Use a scheme and host owned by the fork identity, for example:

```text
net.xiio.inbox:/oauth2redirect
```

or another reviewed value consistent with Android intent handling and provider requirements.

Do not reuse upstream Thunderbird or K-9 redirect URIs.

## Signing strategy

### Debug

Use default/debug local signing only for local proof.

### Internal test

Use a test signing key that is not committed to the repo.

### Release

Use a dedicated xi-io release signing key stored outside the repo and backed up securely.

## Trademark and attribution boundary

Allowed:

- state that xi-io Inbox is based on or forked from Thunderbird for Android/K-9 where required by attribution and clarity
- retain Apache-2.0 license notices
- preserve required notices and modified-file markings

Not allowed:

- imply Mozilla/Thunderbird endorsement
- use Thunderbird marks as the app identity
- use K-9 branding as xi-io branding
- confuse users into thinking xi-io Inbox is the official Thunderbird Android app

## Upstream update strategy

Recommended initial strategy:

1. keep upstream proof separate until build succeeds,
2. record upstream commit SHA used for proof,
3. avoid large edits during identity proof,
4. after proof, decide fork repo vs monorepo/subtree strategy,
5. keep a documented upstream-sync cadence,
6. do not mix upstream sync commits with xi-io feature commits.

## Environment and secrets rule

Do not commit:

- OAuth client secrets
- signing keys
- keystores
- provider credentials
- real user account data
- production config

Use examples only:

```text
.env.example
provider-config.example.json
local.properties.example
```

Real values must live in local ignored files or secure provider dashboards.

## Open questions

- Should the Android package use `net.xiio.inbox` or `com.xiio.inbox`?
- Should the first runtime proof be a direct fork repo instead of importing into this repo?
- Should official distribution start outside app stores first, or target internal testing only?
- Which provider should be the first OAuth proof account?
- Does the project require a separate private config repo later?

## Exit criteria

This packet becomes complete when:

- package/application ID decision is made,
- app display name is confirmed,
- redirect URI is selected,
- provider configuration plan exists,
- attribution plan exists,
- signing plan exists,
- upstream sync strategy exists,
- runtime import/fork decision is approved.

## Decision value

`THUNDERBIRD_FORK_IDENTITY_PACKET_READY_RUNTIME_IMPORT_STILL_BLOCKED`

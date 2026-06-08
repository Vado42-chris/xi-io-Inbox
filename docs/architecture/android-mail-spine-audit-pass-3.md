# Android Mail Spine Audit Pass 3

## Purpose

Audit `thunderbird/thunderbird-android` as the leading Android mail spine candidate before importing runtime code.

Runtime import remains blocked until the fork/build strategy is approved.

## Upstream candidate

Repository: `thunderbird/thunderbird-android`

Current role: leading candidate for Android mail spine.

## Findings

### Product fit

Thunderbird for Android is a privacy-focused email app that supports multiple email accounts and a Unified Inbox. It is based on K-9 Mail and has an open-source history.

Inbox interpretation:

- strong fit for email-first adapter
- avoids rewriting IMAP/POP3/SMTP, mail storage, folder handling, and message UI from scratch
- gives xi-io a mature mail base so our work can focus on Ibal, events, drafting, export, receipts, and controlled egress

### License

Thunderbird for Android is licensed under Apache License 2.0.

Inbox obligations to track:

- retain license notices
- retain required attribution notices
- mark modified files when distributed
- do not imply trademark permission
- include NOTICE handling if upstream has NOTICE requirements
- verify all third-party dependency licenses before shipping

### Forking requirement

Upstream README gives explicit fork guidance: replace OAuth client setup in both K-9 and Thunderbird app OAuth configuration factories and ensure the redirect URI is different from upstream to avoid conflicts when both apps are installed on the same device.

Inbox implication:

- provider sign-in configuration is not optional
- OAuth/fork identity must be documented before any distributed build
- package/app identity must differ from Thunderbird and K-9
- test installs must not conflict with official apps

### Build requirements

Upstream development docs require:

- JDK 21 or higher
- Android Studio
- Git
- Gradle wrapper from repo
- Android SDK and command-line tools

Command-line build candidates:

```bash
./gradlew assemble
./gradlew build
./gradlew :app-thunderbird:assembleDebug
./gradlew :app-k9mail:assembleDebug
```

Quality gates include:

```bash
./gradlew lint
./gradlew detekt
./gradlew spotlessCheck
./gradlew test
```

### Architecture fit

Upstream architecture is modular, offline-first, and based on clean separation of UI, domain, and data layers.

Relevant modules found in settings include:

- `app-thunderbird`
- `app-k9mail`
- `app-common`
- mail account/folder/message reader/message list/composer/export modules
- `feature:mail:message:export:api`
- `feature:mail:message:export:impl-eml`
- `mail:protocols:imap`
- `mail:protocols:pop3`
- `mail:protocols:smtp`
- `backend:imap`
- `backend:pop3`
- `backend:jmap`
- `core:logging:*`
- `core:validation`

Inbox interpretation:

- xi-io sidecar should attach at domain/event boundaries, not by mutating protocol internals first
- existing EML export modules are especially relevant to xi-io Portable Inbox Archive
- JMAP modules are worth later audit for normalized mail data possibilities
- core logging/validation patterns may support no-silent-failure discipline

### Logging and PII

Upstream development docs explicitly say to avoid logging personally identifiable information.

Inbox interpretation:

- provider errors must be visible but redacted
- receipts should reference source IDs, not leak raw message bodies or private file paths
- AI/model call receipts must record routing and permission level without dumping content by default

## Recommended strategy

### Phase 3 decision

Use Thunderbird Android as the leading spine candidate, but do not import runtime yet.

### Preferred path

1. Keep `xi-io-Inbox` as planning/control repo until mail-spine proof is complete.
2. Create a separate fork or branch strategy for Thunderbird Android proof.
3. First prove upstream builds unchanged.
4. Then prove package/app identity can be changed safely.
5. Then prove OAuth/provider configuration can be replaced safely.
6. Then identify the smallest xi-io sidecar integration point.
7. Only after proof, decide whether to merge/import forked runtime into this repo, keep a fork, or use a multi-repo architecture.

## Sidecar boundary

Thunderbird spine owns:

- mail transport
- account setup
- sync
- local mail storage
- folders/mailboxes
- message rendering
- composer/drafts
- protocol implementations

xi-io sidecar owns:

- normalized InboxEvent records
- ActionProposal records
- EgressPermission and verifier gate
- AI provider routing
- Ibal assistant panel/drawer
- export packet orchestration
- receipts
- automation bridge
- task/bug/calendar proposal compiler

## Initial proof checklist

- [ ] Clone upstream locally.
- [ ] Confirm JDK 21+ and Android SDK availability.
- [ ] Build `:app-thunderbird:assembleDebug` unchanged.
- [ ] Build `:app-k9mail:assembleDebug` unchanged, optional.
- [ ] Record build logs and failures using evidence-bearing failure categories.
- [ ] Locate message/thread/domain objects for event normalization.
- [ ] Locate draft composer boundary.
- [ ] Locate EML export boundary.
- [ ] Locate logging/redaction practices.
- [ ] Document package rename and OAuth replacement plan before distribution.

## Blockers before import

- license/NOTICE review not complete
- package rename plan not complete
- provider configuration plan not complete
- build proof not complete
- upstream update strategy not complete
- xi-io sidecar attachment point not confirmed

## Decision

`THUNDERBIRD_ANDROID_REMAINS_LEADING_SPINE_CANDIDATE_RUNTIME_IMPORT_BLOCKED`

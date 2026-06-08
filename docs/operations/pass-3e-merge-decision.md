# Pass 3E Merge Decision

## Purpose

Record the decision to merge PR #8 as documentation-only planning while keeping runtime work blocked.

## PR

`#8 ARCH-001/002/003: Audit Android mail spine and prepare build proof`

## Decision

Merge the PR as planning documentation so `main` stays hydrated for Cursor and future agents.

This does not authorize runtime import.

## Why merge now

- The PR is docs-only.
- No Thunderbird source code is imported.
- No Android package changes are introduced.
- No provider configuration is added.
- The blockers are explicit and tracked in GitHub issues.
- Cursor needs the build-proof prompt and operation packets available from `main`.

## Runtime blockers that remain

- `ARCH-002`: prove upstream Thunderbird Android builds unchanged.
- `ARCH-003`: define fork identity, package/application ID, redirect URI, and provider configuration plan.
- detailed license/NOTICE/dependency review before distribution.
- final decision on fork repo vs monorepo/subtree strategy.

## Safety invariant

```text
Planning documentation is not permission to import runtime code.
Build proof is not permission to send messages.
Model capability is not permission to act.
Runtime egress remains draft-only by default.
```

## Post-merge next action

Execute `ARCH-002` using:

```text
docs/operations/cursor-arch-002-build-proof-prompt.md
```

## Decision value

`PR_8_DOCS_ONLY_MERGE_APPROVED_RUNTIME_IMPORT_STILL_BLOCKED`

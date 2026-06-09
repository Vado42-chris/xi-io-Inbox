# PR 12 Self Review

## PR

`#12 UI-002: Add framework-derived static Inbox preview`

## Review status

Docs and static preview review complete. Keep PR as draft until local static preview smoke proof is captured.

## Scope correction

PR #12 is not product/runtime/platform proof.

It is a static framework-derived preview PR only.

The product platform/runtime envelope is undecided and now tracked in:

```text
xi-io-Inbox#13
```

Decision matrix:

```text
docs/architecture/platform-runtime-decision-matrix.md
```

## Framework state

The framework-side Workbench UI consumer contract is merged in `xi-io.net#238`.

`xi-io.net#235` is closed as completed.

Stable direct framework export/package promotion remains future work in `xi-io.net#239`.

This means the adapted-copy/static-preview path used by PR #12 is now covered by framework policy, but direct framework package reuse is not claimed complete.

## Scope check

| Check | Status |
| --- | --- |
| Framework-derived rail / stream / context preview | yes |
| New local UI system invented first | no |
| Provider connection added | no |
| Real email data added | no |
| Runtime send action added | no |
| Runtime forward action added | no |
| Runtime delete action added | no |
| Final web app architecture decided | no |
| Electron architecture decided | no |
| Tauri architecture decided | no |
| Native Android runtime decided | no |
| Local cloud/home server role decided | no |
| Static file check added | yes |
| JSON validity check added | yes |
| JavaScript syntax check added | yes |
| Accessibility smoke checklist recorded | yes |
| Draft-only egress checklist recorded | yes |
| Framework consumer contract merged | yes |
| Stable direct export/package follow-up tracked | yes, `xi-io.net#239` |
| Platform runtime decision tracked | yes, `xi-io-Inbox#13` |
| Local static preview smoke proof captured | pending |

## Safety review

The preview uses static placeholder data only. It does not connect to Gmail or any other provider, and it does not include runtime email operations.

The UI copies the framework Workbench shape:

```text
left rail / center stream / right context
```

The adapted-copy path is allowed by the merged framework consumer contract. Direct framework package import remains future work until `xi-io.net#239` resolves a stable export/package path.

## Validation now available

```bash
npm run check
```

This runs:

```text
check:files
check:json
check:js
```

GitHub Actions static preview validation has passed previously for this PR. Local browser/static preview smoke proof remains separate and pending.

## Merge recommendation

Do not merge yet.

Keep draft until local static preview smoke proof confirms:

- preview opens locally,
- rail / stream / context renders correctly,
- click selection works,
- keyboard selection works,
- warning banner is visible,
- blocked actions are visibly blocked,
- no provider data is connected,
- no provider/network call is required for preview rendering,
- screenshot or evidence note is attached.

After local PASS, PR #12 may leave draft only as a static preview PR. Product/runtime testing remains blocked by `ARCH-004`.

## Decision value

`PR_12_SELF_REVIEW_STATIC_PREVIEW_ONLY_PLATFORM_RUNTIME_UNDECIDED`

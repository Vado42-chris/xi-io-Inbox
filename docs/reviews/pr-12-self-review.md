# PR 12 Self Review

## PR

`#12 UI-002: Add framework-derived static Inbox preview`

## Review status

Docs and static preview review complete. Keep PR as draft until local visual proof is captured.

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
| Static file check added | yes |
| JSON validity check added | yes |
| JavaScript syntax check added | yes |
| Accessibility smoke checklist recorded | yes |
| Draft-only egress checklist recorded | yes |
| Local visual proof captured | pending |

## Safety review

The preview uses static placeholder data only. It does not connect to Gmail or any other provider, and it does not include runtime email operations.

The UI copies the framework Workbench shape:

```text
left rail / center stream / right context
```

The direct framework package import remains blocked until `xi-io.net#235` defines a consumer contract.

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

## Merge recommendation

Do not merge yet.

Keep draft until local proof confirms:

- preview opens locally,
- rail / stream / context renders correctly,
- keyboard selection works,
- blocked actions are visibly blocked,
- no provider data is connected,
- screenshot or evidence note is attached.

## Decision value

`PR_12_SELF_REVIEW_COMPLETE_LOCAL_VISUAL_PROOF_PENDING`

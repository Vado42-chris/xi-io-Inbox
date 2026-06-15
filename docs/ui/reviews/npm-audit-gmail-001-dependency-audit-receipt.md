# NPM-AUDIT-GMAIL-001 Dependency Audit Receipt

## Date

2026-06-13

## Branch

`cursor/gmail-harden-5e1b`

## Scope

Resolve the 4 moderate `tools/gmail` dependency vulnerabilities reported during
GMAIL-HARDEN-001 validation.

## Finding

`npm audit --prefix tools/gmail --json` reported 4 moderate vulnerabilities:

- `googleapis`
- `googleapis-common`
- `gaxios`
- `uuid`

The audit fix path was the direct dependency `googleapis` major update to `173.0.0`.

## Change

Updated `tools/gmail/package.json` and lockfile by running:

```text
npm install googleapis@latest --prefix tools/gmail
```

Resulting direct dependency:

```text
googleapis ^173.0.0
```

## Validation

```text
npm audit --prefix tools/gmail --json
npm run check:gmail
```

Result:

```text
0 vulnerabilities
metadata-guards: pass
oauth-hardening: pass
wipe-local-data: pass
body-gate: pass
hardening: pass
```

## Self peer review

| Question | Answer |
| --- | --- |
| Best fix? | Yes. Updating the direct dependency through npm is the supported fix path. |
| Truncation? | No. All four audit findings shared the same transitive path and are covered by the `googleapis` update. |
| Hallucination? | No external claims added; results come from local `npm audit` and `npm run check:gmail`. |
| Duplicated work? | No new dependency system added. Existing npm lockfile was updated. |
| Silent failure? | No. Deprecation warnings remain warnings, but audit vulnerabilities are zero. |

## Decision value

`NPM_AUDIT_GMAIL_001_ZERO_VULNERABILITIES_AFTER_GOOGLEAPIS_UPDATE`


# Cursor Prompt: ARCH-002 Thunderbird Android Build Proof

## Purpose

Use this prompt in Cursor to execute `ARCH-002` safely.

This prompt must be treated as a build proof, not an implementation pass.

## Paste into Cursor

```text
You are working on `ARCH-002` for `xi-io Inbox`.

Goal: prove that upstream `thunderbird/thunderbird-android` builds unchanged before xi-io imports, forks, or modifies runtime code.

Read first:
1. `docs/operations/thunderbird-upstream-build-proof-packet.md`
2. `docs/architecture/android-mail-spine-audit-pass-3.md`
3. `TODO.md`

Critical rules:
- Do not modify Thunderbird source during this proof.
- Do not import Thunderbird runtime code into `xi-io-Inbox`.
- Do not commit provider config, signing files, OAuth values, secrets, account data, or local absolute paths.
- Unknown is not success.
- A failed build is evidence, not permission to edit runtime code.
- If the build fails, classify the failure and stop.

Work outside the `xi-io-Inbox` repo unless explicitly instructed otherwise.

Recommended scratch location:

```bash
mkdir -p ~/dev/upstream-audits
cd ~/dev/upstream-audits
```

Run the proof:

```bash
git clone https://github.com/thunderbird/thunderbird-android.git
cd thunderbird-android
git status --short
git rev-parse HEAD
git branch --show-current
java -version
./gradlew --version
./gradlew :app-thunderbird:assembleDebug
```

Optional after Thunderbird debug succeeds:

```bash
./gradlew :app-k9mail:assembleDebug
```

Do not run broad fixes or source edits. If Gradle, SDK, Java, dependency, network, lint, or compile errors occur, classify them using this taxonomy:

- JAVA_VERSION_FAILURE
- ANDROID_SDK_FAILURE
- GRADLE_BOOT_FAILURE
- DEPENDENCY_RESOLUTION_FAILURE
- NETWORK_FAILURE
- COMPILE_FAILURE
- LINT_FAILURE
- TEST_FAILURE
- LOCAL_ENV_FAILURE
- UNKNOWN_FAILURE

Create a local evidence note with this template:

```text
Date:
Machine:
OS:
JDK version:
Android Studio version, if known:
Android SDK status:
Upstream repo:
Upstream branch:
Upstream commit SHA:
Command run:
Result: pass | fail | blocked
Failure category, if any:
Short failure summary:
Next recommended action:
```

After the proof:

1. Do not commit raw logs with private local paths.
2. Summarize evidence safely.
3. Update GitHub issue `Vado42-chris/xi-io-Inbox#6` with the result.
4. If successful, recommend the next bounded issue for fork identity/package/provider configuration.
5. If failed, recommend a bounded remediation issue and keep runtime import blocked.

Expected final response:

```text
ARCH-002 result: PASS | FAIL | BLOCKED
Upstream SHA:
Command:
Failure category, if any:
Runtime import remains blocked: yes
Next action:
```
```

## Success condition

`./gradlew :app-thunderbird:assembleDebug` passes unchanged and the upstream SHA is recorded.

## Failure condition

Any build blocker occurs and is classified without modifying upstream runtime source.

## Decision value

`CURSOR_ARCH_002_BUILD_PROOF_PROMPT_READY_RUNTIME_IMPORT_STILL_BLOCKED`

# Thunderbird Android Upstream Build Proof Packet

## Purpose

This packet gives Cursor or a local operator a narrow, evidence-first path for proving `thunderbird/thunderbird-android` builds unchanged before `xi-io Inbox` imports or forks runtime code.

This supports `ARCH-002`.

## Rule

Do not modify Thunderbird source during this proof.

The goal is not to fix Thunderbird. The goal is to learn whether the upstream project builds in the local environment and, if not, record the failure clearly.

```text
Unknown is not success.
A failed build is evidence, not permission to start editing runtime code.
```

## Preconditions

Required locally:

- Git
- JDK 21 or higher
- Android Studio
- Android SDK and command-line tools
- enough disk space for Android/Gradle dependencies
- network access for dependency download

## Safe working location

Use a local scratch/dev folder outside `xi-io-Inbox`.

Example:

```bash
mkdir -p ~/dev/upstream-audits
cd ~/dev/upstream-audits
```

Do not clone Thunderbird Android inside the `xi-io-Inbox` repository unless a later issue explicitly approves a submodule/subtree/import strategy.

## Commands

### 1. Clone upstream

```bash
git clone https://github.com/thunderbird/thunderbird-android.git
cd thunderbird-android
```

### 2. Record upstream state

```bash
git status --short
git rev-parse HEAD
git branch --show-current
```

Expected:

- clean working tree
- branch usually `main`
- commit SHA captured in evidence

### 3. Check Java

```bash
java -version
./gradlew --version
```

Expected:

- Java 21 or higher
- Gradle wrapper runs

### 4. Build Thunderbird debug APK unchanged

```bash
./gradlew :app-thunderbird:assembleDebug
```

### 5. Optional K-9 build proof

```bash
./gradlew :app-k9mail:assembleDebug
```

### 6. Optional quality checks

Run only after the debug build proof is understood:

```bash
./gradlew test
./gradlew lint
./gradlew detekt
./gradlew spotlessCheck
```

## Evidence to capture

Create a short local report. Do not paste huge logs into GitHub unless needed.

Required fields:

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

## Failure taxonomy

Use one or more categories:

| Failure | Meaning |
| --- | --- |
| `JAVA_VERSION_FAILURE` | JDK missing or below 21. |
| `ANDROID_SDK_FAILURE` | Android SDK or command-line tools missing/misconfigured. |
| `GRADLE_BOOT_FAILURE` | Gradle wrapper cannot start. |
| `DEPENDENCY_RESOLUTION_FAILURE` | Dependencies cannot download or resolve. |
| `NETWORK_FAILURE` | Network issue blocks dependency download. |
| `COMPILE_FAILURE` | Kotlin/Java/Android compile failure. |
| `LINT_FAILURE` | Lint check fails. |
| `TEST_FAILURE` | Unit or instrumented test failure. |
| `LOCAL_ENV_FAILURE` | Machine-specific setup issue. |
| `UNKNOWN_FAILURE` | Cause not yet classified. Unknown is not success. |

## Redaction rules

Do not commit or paste:

- local absolute home paths unless needed and redacted
- API keys
- OAuth client IDs/secrets
- keystore files
- signing credentials
- email account details
- private user data

Safe evidence examples:

```text
/home/<user>/dev/upstream-audits/thunderbird-android
JAVA_VERSION_FAILURE: found Java 17, upstream requires 21+
DEPENDENCY_RESOLUTION_FAILURE: Maven timeout downloading dependency group X
```

## Exit criteria

This proof is complete when one of the following is true:

### Success

- `./gradlew :app-thunderbird:assembleDebug` passes unchanged.
- upstream SHA is recorded.
- local environment summary is recorded.
- no upstream source edits were made.

### Classified blocker

- build does not pass,
- failure category is recorded,
- logs are preserved locally or summarized safely,
- next action is clear,
- no runtime import occurs.

## After proof passes

Only after upstream build proof passes:

1. continue `ARCH-003` fork identity/package/provider configuration planning,
2. decide whether to create a dedicated Thunderbird fork repo or keep the proof external,
3. identify the smallest xi-io sidecar attachment point,
4. keep autonomous send/delete/forward blocked.

## After proof fails

Do not edit upstream code immediately.

Instead:

1. classify the failure,
2. update `ARCH-002`,
3. decide whether the failure is local setup, upstream issue, dependency issue, or project-blocking,
4. only then create a bounded remediation issue.

## Decision value

`THUNDERBIRD_UPSTREAM_BUILD_PROOF_PACKET_READY_RUNTIME_IMPORT_STILL_BLOCKED`

mod sidecar;

use serde_json::{json, Value};
use sidecar::run_gmail_cli;
use tauri::AppHandle;

const PROVIDER_ID: &str = "gmail-runtime-sidecar-v1";
const LIVE_SYNC_EXECUTION: &str = "deferred-runtime-001b";

pub fn provider_status(app: &AppHandle) -> Result<Value, String> {
    let mut envelope = run_gmail_cli(app, "status", &[])?;
    sanitize_provider_envelope(&mut envelope);
    attach_runtime_meta(
        &mut envelope,
        "status",
        "Gmail provider not connected",
        "Gmail provider connected",
    );
    Ok(envelope)
}

pub fn sync_status(app: &AppHandle) -> Result<Value, String> {
    let mut envelope = run_gmail_cli(app, "sync-status", &[])?;
    sanitize_provider_envelope(&mut envelope);
    attach_runtime_meta(&mut envelope, "sync-status", "Sync status unavailable", "Sync status");
    Ok(envelope)
}

pub fn plan_sync(app: &AppHandle) -> Result<Value, String> {
    let mut envelope = run_gmail_cli(app, "sync-plan", &[])?;
    sanitize_provider_envelope(&mut envelope);
    attach_runtime_meta(
        &mut envelope,
        "plan-sync",
        "Sync planned",
        "Sync planned",
    );
    if let Some(obj) = envelope.as_object_mut() {
        obj.insert(
            "liveSyncExecution".into(),
            Value::String(LIVE_SYNC_EXECUTION.into()),
        );
    }
    Ok(envelope)
}

fn attach_runtime_meta(
    envelope: &mut Value,
    command: &str,
    disconnected_copy: &str,
    connected_copy: &str,
) {
    let boundary = envelope
        .pointer("/payload/connected")
        .and_then(Value::as_bool)
        .unwrap_or(false);
    let ui_state = if boundary {
        connected_copy
    } else {
        disconnected_copy
    };

    if let Some(obj) = envelope.as_object_mut() {
        obj.insert(
            "runtimeProvider".into(),
            json!({
                "id": PROVIDER_ID,
                "host": "tauri-local-desktop",
                "command": command,
                "sidecar": "tools/gmail/cli.js",
                "browserOAuth": "blocked",
                "browserLocalStorageTokens": "blocked",
                "liveSyncExecution": LIVE_SYNC_EXECUTION,
                "uiState": ui_state,
            }),
        );
    }
}

fn sanitize_provider_envelope(envelope: &mut Value) {
    if let Some(obj) = envelope.as_object_mut() {
        obj.remove("token");
        if let Some(payload) = obj.get_mut("payload").and_then(Value::as_object_mut) {
            payload.remove("token");
            if let Some(storage) = payload.get_mut("tokenStorage") {
                *storage = Value::String("runtime-app-data (gitignored)".into());
            }
        }
        if let Some(scope) = obj.get_mut("scopeState").and_then(Value::as_object_mut) {
            scope.remove("refreshTokenPresent");
            scope.remove("accessTokenPresent");
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sanitize_removes_token_fields() {
        let mut envelope = json!({
            "success": true,
            "token": { "access_token": "secret" },
            "payload": {
                "connected": false,
                "tokenStorage": "tools/gmail/data/token.json"
            }
        });
        sanitize_provider_envelope(&mut envelope);
        assert!(envelope.get("token").is_none());
        assert_eq!(
            envelope["payload"]["tokenStorage"],
            "runtime-app-data (gitignored)"
        );
    }
}

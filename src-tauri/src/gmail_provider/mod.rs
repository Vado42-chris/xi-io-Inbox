mod args;
mod mail_index;
mod redaction;
mod sidecar;

use args::{build_sync_history_args, build_sync_metadata_args, SyncHistoryOptions, SyncMetadataOptions};
use redaction::sanitize_provider_envelope;
use serde::Deserialize;
use serde_json::{json, Value};
use sidecar::{run_gmail_cli, SidecarCommand};
use tauri::AppHandle;

const PROVIDER_ID: &str = "gmail-runtime-sidecar-v1";
const LIVE_SYNC_PLAN_ONLY: &str = "plan-only";
const LIVE_SYNC_EXECUTION: &str = "runtime-sidecar-v1";

fn invoke_sidecar(
    app: &AppHandle,
    command: SidecarCommand,
    args: Vec<String>,
    runtime_command: &str,
    ui_state: &str,
    live_sync_execution: &str,
) -> Result<Value, String> {
    let mut envelope = run_gmail_cli(app, command, &args)?;
    sanitize_provider_envelope(&mut envelope);
    attach_runtime_meta(
        &mut envelope,
        runtime_command,
        ui_state,
        live_sync_execution,
    );
    Ok(envelope)
}

pub fn provider_status(app: &AppHandle) -> Result<Value, String> {
    invoke_sidecar(
        app,
        SidecarCommand::Status,
        vec![],
        "status",
        "Gmail provider status",
        LIVE_SYNC_PLAN_ONLY,
    )
}

pub fn sync_status(app: &AppHandle) -> Result<Value, String> {
    invoke_sidecar(
        app,
        SidecarCommand::SyncStatus,
        vec![],
        "sync-status",
        "Sync status",
        LIVE_SYNC_PLAN_ONLY,
    )
}

pub fn plan_sync(app: &AppHandle) -> Result<Value, String> {
    let mut envelope = invoke_sidecar(
        app,
        SidecarCommand::SyncPlan,
        vec![],
        "plan-sync",
        "Sync planned",
        LIVE_SYNC_PLAN_ONLY,
    )?;
    if let Some(obj) = envelope.as_object_mut() {
        obj.insert(
            "liveSyncExecution".into(),
            Value::String(LIVE_SYNC_PLAN_ONLY.into()),
        );
    }
    Ok(envelope)
}

pub fn provider_connect(app: &AppHandle) -> Result<Value, String> {
    invoke_sidecar(
        app,
        SidecarCommand::Connect,
        vec![],
        "connect",
        "Gmail provider connect attempted",
        LIVE_SYNC_EXECUTION,
    )
}

pub fn sync_metadata(app: &AppHandle, options: SyncMetadataOptions) -> Result<Value, String> {
    let args = build_sync_metadata_args(&options)?;
    let string_args: Vec<String> = args;
    invoke_sidecar(
        app,
        SidecarCommand::SyncMetadata,
        string_args,
        "sync-metadata",
        "Metadata sync completed",
        LIVE_SYNC_EXECUTION,
    )
}

pub fn sync_history(app: &AppHandle, options: SyncHistoryOptions) -> Result<Value, String> {
    let args = build_sync_history_args(&options)?;
    invoke_sidecar(
        app,
        SidecarCommand::SyncHistory,
        args,
        "sync-history",
        "History sync completed",
        LIVE_SYNC_EXECUTION,
    )
}

pub fn mail_index(app: &AppHandle) -> Result<Value, String> {
    mail_index::read_mail_index(app)
}

fn attach_runtime_meta(
    envelope: &mut Value,
    command: &str,
    ui_state: &str,
    live_sync_execution: &str,
) {
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
                "liveSyncExecution": live_sync_execution,
                "uiState": ui_state,
            }),
        );
    }
}

#[derive(Debug, Clone, Default, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct GmailSyncMetadataRequest {
    pub max_pages: Option<u32>,
    pub max_threads: Option<u32>,
    pub job: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct GmailSyncHistoryRequest {
    pub max_pages: Option<u32>,
    pub max_threads: Option<u32>,
    pub job: Option<String>,
}

impl From<GmailSyncMetadataRequest> for SyncMetadataOptions {
    fn from(value: GmailSyncMetadataRequest) -> Self {
        Self {
            max_pages: value.max_pages,
            max_threads: value.max_threads,
            job: value.job,
        }
    }
}

impl From<GmailSyncHistoryRequest> for SyncHistoryOptions {
    fn from(value: GmailSyncHistoryRequest) -> Self {
        Self {
            max_pages: value.max_pages,
            max_threads: value.max_threads,
            job: value.job,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use redaction::sanitize_provider_envelope;
    use serde_json::json;

    #[test]
    fn connect_envelope_sanitization_removes_token_fields() {
        let mut envelope = json!({
            "success": true,
            "token": { "access_token": "secret", "refresh_token": "secret2" },
            "payload": {
                "connected": true,
                "nested": { "id_token": "secret3" }
            }
        });
        sanitize_provider_envelope(&mut envelope);
        assert!(envelope.get("token").is_none());
        assert!(envelope.get("token").is_none());
        assert!(envelope["payload"]["nested"].get("id_token").is_none());
    }

    #[test]
    fn sync_metadata_request_maps_to_bounded_args() {
        let args = build_sync_metadata_args(&SyncMetadataOptions {
            max_pages: None,
            max_threads: None,
            job: None,
        })
        .expect("args");
        assert!(args.contains(&"1".to_string()));
        assert!(args.contains(&"25".to_string()));
    }
}

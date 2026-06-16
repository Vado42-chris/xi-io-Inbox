use serde::Serialize;
use std::path::PathBuf;
use tauri::AppHandle;
use tauri::Manager;

const RUNTIME_STORE_SCHEMA_VERSION: u8 = 1;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RuntimeStoreBoundary {
    pub schema_version: u8,
    pub runtime_host: &'static str,
    pub store_kind: &'static str,
    pub browser_local_storage_tokens: &'static str,
    pub browser_oauth: &'static str,
    pub gmail_data_dir: String,
    pub gmail_receipts_dir: String,
    pub gmail_mail_index_path: String,
    pub static_preview_json_import: &'static str,
    pub egress_gates: EgressGates,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EgressGates {
    pub body_read: &'static str,
    pub draft_write: &'static str,
    pub send: &'static str,
    pub mutation: &'static str,
    pub github_mutation: &'static str,
    pub automation_execution: &'static str,
}

pub fn gmail_runtime_root(app: &AppHandle) -> Result<PathBuf, String> {
    let base = app
        .path()
        .app_data_dir()
        .map_err(|err| format!("runtime app_data_dir unavailable: {err}"))?;
    Ok(base.join("runtime").join("gmail-provider"))
}

pub fn boundary_for_app(app: &AppHandle) -> Result<RuntimeStoreBoundary, String> {
    let root = gmail_runtime_root(app)?;
    let data_dir = root.join("data");
    let receipts_dir = root.join("receipts");
    let mail_index = data_dir.join("mail-index.json");

    Ok(RuntimeStoreBoundary {
        schema_version: RUNTIME_STORE_SCHEMA_VERSION,
        runtime_host: "tauri-local-desktop",
        store_kind: "filesystem-app-data",
        browser_local_storage_tokens: "blocked",
        browser_oauth: "blocked",
        gmail_data_dir: data_dir.to_string_lossy().into_owned(),
        gmail_receipts_dir: receipts_dir.to_string_lossy().into_owned(),
        gmail_mail_index_path: mail_index.to_string_lossy().into_owned(),
        static_preview_json_import: "scaffold-only",
        egress_gates: EgressGates {
            body_read: "gated",
            draft_write: "blocked",
            send: "blocked",
            mutation: "blocked",
            github_mutation: "blocked",
            automation_execution: "blocked",
        },
    })
}

pub fn sidecar_env(app: &AppHandle) -> Result<Vec<(String, String)>, String> {
    let boundary = boundary_for_app(app)?;
    Ok(vec![
        (
            "GMAIL_ADAPTER_DATA_DIR".into(),
            boundary.gmail_data_dir.clone(),
        ),
        (
            "GMAIL_RECEIPTS_DIR".into(),
            boundary.gmail_receipts_dir.clone(),
        ),
        (
            "GMAIL_MAIL_INDEX_PATH".into(),
            boundary.gmail_mail_index_path.clone(),
        ),
    ])
}

mod gmail_provider;
mod runtime_store;

use gmail_provider::{
    mail_index, plan_sync, provider_connect, provider_status, sync_history, sync_metadata,
    sync_status, GmailSyncHistoryRequest, GmailSyncMetadataRequest,
};
use runtime_store::RuntimeStoreBoundary;
use tauri::AppHandle;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            gmail_provider_status,
            gmail_provider_sync_status,
            gmail_provider_plan_sync,
            gmail_provider_connect,
            gmail_provider_sync_metadata,
            gmail_provider_sync_history,
            gmail_provider_mail_index,
            runtime_store_boundary,
        ])
        .run(tauri::generate_context!())
        .expect("error while running xi-io Inbox runtime");
}

#[tauri::command(rename_all = "snake_case")]
fn runtime_store_boundary(app: AppHandle) -> Result<RuntimeStoreBoundary, String> {
    runtime_store::boundary_for_app(&app)
}

#[tauri::command(rename_all = "snake_case")]
fn gmail_provider_status(app: AppHandle) -> Result<serde_json::Value, String> {
    provider_status(&app)
}

#[tauri::command(rename_all = "snake_case")]
fn gmail_provider_sync_status(app: AppHandle) -> Result<serde_json::Value, String> {
    sync_status(&app)
}

#[tauri::command(rename_all = "snake_case")]
fn gmail_provider_plan_sync(app: AppHandle) -> Result<serde_json::Value, String> {
    plan_sync(&app)
}

#[tauri::command(rename_all = "snake_case")]
fn gmail_provider_connect(app: AppHandle) -> Result<serde_json::Value, String> {
    provider_connect(&app)
}

#[tauri::command(rename_all = "snake_case")]
fn gmail_provider_sync_metadata(
    app: AppHandle,
    options: Option<GmailSyncMetadataRequest>,
) -> Result<serde_json::Value, String> {
    sync_metadata(&app, options.unwrap_or_default().into())
}

#[tauri::command(rename_all = "snake_case")]
fn gmail_provider_sync_history(
    app: AppHandle,
    options: Option<GmailSyncHistoryRequest>,
) -> Result<serde_json::Value, String> {
    sync_history(&app, options.unwrap_or_default().into())
}

#[tauri::command(rename_all = "snake_case")]
fn gmail_provider_mail_index(app: AppHandle) -> Result<serde_json::Value, String> {
    mail_index(&app)
}

mod gmail_provider;
mod runtime_store;

use gmail_provider::{plan_sync, provider_status, sync_status};
use runtime_store::RuntimeStoreBoundary;
use tauri::AppHandle;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            gmail_provider_status,
            gmail_provider_sync_status,
            gmail_provider_plan_sync,
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

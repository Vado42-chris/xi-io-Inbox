use crate::runtime_store;
use super::redaction::{format_sidecar_error, redact_sensitive_text, truncate_error_excerpt};
use serde_json::Value;
use std::path::{Path, PathBuf};
use std::process::Command;
use tauri::AppHandle;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SidecarCommand {
    Status,
    SyncStatus,
    SyncPlan,
    Connect,
    SyncMetadata,
    SyncHistory,
}

impl SidecarCommand {
    pub fn parse(name: &str) -> Result<Self, String> {
        match name {
            "status" => Ok(Self::Status),
            "sync-status" => Ok(Self::SyncStatus),
            "sync-plan" => Ok(Self::SyncPlan),
            "connect" => Ok(Self::Connect),
            "sync-metadata" => Ok(Self::SyncMetadata),
            "sync-history" => Ok(Self::SyncHistory),
            other => Err(format!(
                "Sidecar command \"{other}\" is not allowed. Allowed: status, sync-status, sync-plan, connect, sync-metadata, sync-history"
            )),
        }
    }

    pub fn cli_name(self) -> &'static str {
        match self {
            Self::Status => "status",
            Self::SyncStatus => "sync-status",
            Self::SyncPlan => "sync-plan",
            Self::Connect => "connect",
            Self::SyncMetadata => "sync-metadata",
            Self::SyncHistory => "sync-history",
        }
    }
}

fn repo_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("src-tauri must have a parent repo root")
        .to_path_buf()
}

fn gmail_cli_path(repo: &Path) -> PathBuf {
    repo.join("tools").join("gmail").join("cli.js")
}

pub fn run_gmail_cli(
    app: &AppHandle,
    command: SidecarCommand,
    args: &[String],
) -> Result<Value, String> {
    let repo = repo_root();
    let cli = gmail_cli_path(&repo);
    if !cli.is_file() {
        return Err(format!("Gmail sidecar missing at {}", cli.display()));
    }

    let sidecar_env = runtime_store::sidecar_env(app)?;
    let mut cmd = Command::new("node");
    cmd.arg(&cli)
        .arg(command.cli_name())
        .args(args)
        .current_dir(repo.join("tools/gmail"));

    for (key, value) in sidecar_env {
        cmd.env(key, value);
    }

    let output = cmd
        .output()
        .map_err(|err| format!("Failed to spawn Gmail sidecar: {}", redact_sensitive_text(&err.to_string())))?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    if stdout.is_empty() {
        let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
        return Err(format_sidecar_error(
            command.cli_name(),
            output.status.code(),
            &stderr,
            None,
        ));
    }

    let parsed: Value = serde_json::from_str(&stdout).map_err(|err| {
        truncate_error_excerpt(&format!(
            "Gmail sidecar returned invalid JSON: {}",
            redact_sensitive_text(&err.to_string())
        ))
    })?;

    if !output.status.success() && parsed.get("success").and_then(Value::as_bool) != Some(true) {
        return Err(format_sidecar_error(
            command.cli_name(),
            output.status.code(),
            String::from_utf8_lossy(&output.stderr).trim(),
            parsed.get("error").and_then(Value::as_str),
        ));
    }

    Ok(parsed)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn allowlist_rejects_unknown_sidecar_command() {
        let err = SidecarCommand::parse("wipe").expect_err("wipe");
        assert!(err.contains("not allowed"));
    }

    #[test]
    fn repo_root_resolves() {
        let root = repo_root();
        assert!(root.join("package.json").is_file());
        assert!(gmail_cli_path(&root).is_file());
    }
}

use crate::runtime_store;
use serde_json::Value;
use std::path::{Path, PathBuf};
use std::process::Command;
use tauri::AppHandle;

fn repo_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("src-tauri must have a parent repo root")
        .to_path_buf()
}

fn gmail_cli_path(repo: &Path) -> PathBuf {
    repo.join("tools").join("gmail").join("cli.js")
}

pub fn run_gmail_cli(app: &AppHandle, command: &str, args: &[&str]) -> Result<Value, String> {
    let repo = repo_root();
    let cli = gmail_cli_path(&repo);
    if !cli.is_file() {
        return Err(format!(
            "Gmail sidecar missing at {}",
            cli.display()
        ));
    }

    let sidecar_env = runtime_store::sidecar_env(app)?;
    let mut cmd = Command::new("node");
    cmd.arg(&cli).arg(command).args(args).current_dir(repo.join("tools/gmail"));

    for (key, value) in sidecar_env {
        cmd.env(key, value);
    }

    let output = cmd
        .output()
        .map_err(|err| format!("Failed to spawn Gmail sidecar: {err}"))?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    if stdout.is_empty() {
        let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
        return Err(format!(
            "Gmail sidecar produced no JSON (exit={:?}){stderr_suffix}",
            output.status.code(),
            stderr_suffix = if stderr.is_empty() {
                String::new()
            } else {
                format!(": {stderr}")
            }
        ));
    }

    let parsed: Value = serde_json::from_str(&stdout)
        .map_err(|err| format!("Gmail sidecar returned invalid JSON: {err}"))?;

    if !output.status.success() && parsed.get("success").and_then(Value::as_bool) != Some(true) {
        return Err(format!(
            "Gmail sidecar command '{command}' failed (exit={:?}): {}",
            output.status.code(),
            parsed
                .get("error")
                .and_then(Value::as_str)
                .unwrap_or("unknown error")
        ));
    }

    Ok(parsed)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn repo_root_resolves() {
        let root = repo_root();
        assert!(root.join("package.json").is_file());
        assert!(gmail_cli_path(&root).is_file());
    }
}

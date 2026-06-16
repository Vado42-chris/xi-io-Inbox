use super::redaction::sanitize_provider_envelope;
use crate::runtime_store;
use serde_json::{json, Map, Value};
use std::fs;
use std::path::Path;
use tauri::AppHandle;

const MAIL_INDEX_SCHEMA_VERSION: u64 = 1;
const MAIL_INDEX_SOURCE: &str = "local-gmail-cli";
const MAIL_INDEX_MODE: &str = "metadata-index";

const THREAD_HEADER_KEYS: &[&str] = &[
    "id",
    "threadId",
    "accountEmail",
    "accountId",
    "provider",
    "labelIds",
    "snippet",
    "subject",
    "from",
    "date",
    "internalDate",
    "unread",
];

const MESSAGE_HEADER_KEYS: &[&str] = &[
    "id",
    "threadId",
    "labelIds",
    "subject",
    "from",
    "to",
    "date",
    "internalDate",
    "unread",
    "snippet",
    "provider",
];

fn blocked_capabilities() -> Value {
    json!(["body_read", "draft_write", "send", "provider_mutation"])
}

pub fn empty_mail_index_envelope() -> Value {
    json!({
        "schemaVersion": MAIL_INDEX_SCHEMA_VERSION,
        "updatedAt": null,
        "source": MAIL_INDEX_SOURCE,
        "mode": MAIL_INDEX_MODE,
        "accounts": [],
        "threads": [],
        "warnings": ["Mail index file missing; runtime store not populated yet."],
        "blockedCapabilities": blocked_capabilities(),
    })
}

fn validate_mail_index(value: &Value) -> Result<(), String> {
    let obj = value
        .as_object()
        .ok_or_else(|| "Mail index must be a JSON object.".to_string())?;

    let schema_version = obj
        .get("schemaVersion")
        .and_then(Value::as_u64)
        .ok_or_else(|| "Mail index schemaVersion must be a number.".to_string())?;
    if schema_version != MAIL_INDEX_SCHEMA_VERSION {
        return Err(format!(
            "Unsupported mail index schemaVersion: {schema_version}."
        ));
    }

    if obj.get("source").and_then(Value::as_str) != Some(MAIL_INDEX_SOURCE) {
        return Err("Mail index source must be local-gmail-cli.".to_string());
    }
    if obj.get("mode").and_then(Value::as_str) != Some(MAIL_INDEX_MODE) {
        return Err("Mail index mode must be metadata-index.".to_string());
    }
    if !obj.get("threads").map(Value::is_array).unwrap_or(false) {
        return Err("Mail index threads must be an array.".to_string());
    }
    if !obj.get("messages").map(Value::is_array).unwrap_or(false) {
        return Err("Mail index messages must be an array.".to_string());
    }
    if let Some(accounts) = obj.get("accounts") {
        if !accounts.is_array() {
            return Err("Mail index accounts must be an array when present.".to_string());
        }
    }

    Ok(())
}

fn pick_allowed_fields(source: &Map<String, Value>, allowed: &[&str]) -> Map<String, Value> {
    let mut out = Map::new();
    for key in allowed {
        if let Some(value) = source.get(*key) {
            out.insert((*key).to_string(), value.clone());
        }
    }
    out
}

fn sanitize_thread_headers(thread: &Value) -> Value {
    let Some(obj) = thread.as_object() else {
        return Value::Null;
    };

    let mut header = pick_allowed_fields(obj, THREAD_HEADER_KEYS);
    if let Some(messages) = obj.get("messages").and_then(Value::as_array) {
        let sanitized_messages: Vec<Value> = messages
            .iter()
            .filter_map(|message| {
                message
                    .as_object()
                    .map(|entry| Value::Object(pick_allowed_fields(entry, MESSAGE_HEADER_KEYS)))
            })
            .collect();
        if !sanitized_messages.is_empty() {
            header.insert("messages".into(), Value::Array(sanitized_messages));
        }
    }

    Value::Object(header)
}

fn project_mail_index_for_ui(raw: &Value) -> Value {
    let obj = raw.as_object().cloned().unwrap_or_default();
    let threads = obj
        .get("threads")
        .and_then(Value::as_array)
        .cloned()
        .unwrap_or_default()
        .into_iter()
        .map(|thread| sanitize_thread_headers(&thread))
        .filter(|thread| !thread.is_null())
        .collect::<Vec<_>>();

    json!({
        "schemaVersion": MAIL_INDEX_SCHEMA_VERSION,
        "updatedAt": obj.get("updatedAt").cloned().unwrap_or(Value::Null),
        "source": MAIL_INDEX_SOURCE,
        "mode": MAIL_INDEX_MODE,
        "accounts": obj.get("accounts").cloned().unwrap_or_else(|| json!([])),
        "threads": threads,
        "warnings": obj.get("warnings").cloned().unwrap_or_else(|| json!([])),
        "blockedCapabilities": obj.get("blockedCapabilities").cloned().unwrap_or_else(blocked_capabilities),
    })
}

pub fn read_mail_index(app: &AppHandle) -> Result<Value, String> {
    let boundary = runtime_store::boundary_for_app(app)?;
    let path = Path::new(&boundary.gmail_mail_index_path);
    if !path.is_file() {
        let mut envelope = empty_mail_index_envelope();
        attach_runtime_meta(&mut envelope);
        return Ok(envelope);
    }

    let raw = fs::read_to_string(path)
        .map_err(|err| format!("Unable to read runtime mail index: {err}"))?;
    let parsed: Value = serde_json::from_str(&raw)
        .map_err(|err| format!("Runtime mail index JSON parse failed: {err}"))?;

    validate_mail_index(&parsed)?;
    let mut envelope = project_mail_index_for_ui(&parsed);
    sanitize_provider_envelope(&mut envelope);
    attach_runtime_meta(&mut envelope);
    Ok(envelope)
}

fn attach_runtime_meta(envelope: &mut Value) {
    if let Some(obj) = envelope.as_object_mut() {
        obj.insert(
            "runtimeProvider".into(),
            json!({
                "id": "gmail-runtime-mail-index-v1",
                "host": "tauri-local-desktop",
                "command": "mail-index",
                "browserOAuth": "blocked",
                "browserLocalStorageTokens": "blocked",
                "liveSyncExecution": "read-only-runtime-store",
                "uiState": "Runtime mail index",
            }),
        );
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn validate_rejects_unsupported_schema_version() {
        let err = validate_mail_index(&json!({
            "schemaVersion": 999,
            "source": MAIL_INDEX_SOURCE,
            "mode": MAIL_INDEX_MODE,
            "threads": [],
            "messages": [],
        }))
        .expect_err("schema");
        assert!(err.contains("Unsupported mail index schemaVersion"));
    }

    #[test]
    fn project_strips_message_bodies_and_forbidden_fields() {
        let projected = project_mail_index_for_ui(&json!({
            "schemaVersion": 1,
            "source": MAIL_INDEX_SOURCE,
            "mode": MAIL_INDEX_MODE,
            "threads": [{
                "id": "t1",
                "snippet": "Hello",
                "messages": [{
                    "id": "m1",
                    "threadId": "t1",
                    "subject": "Subject",
                    "sanitizedPlainText": "secret body",
                    "body": "raw body",
                }]
            }],
            "messages": [{ "id": "m1", "sanitizedPlainText": "secret body" }],
            "warnings": [],
            "blockedCapabilities": ["body_read", "draft_write", "send", "provider_mutation"],
        }));

        assert!(projected.get("messages").is_none());
        let thread = &projected["threads"][0];
        assert_eq!(thread["snippet"], "Hello");
        assert!(thread["messages"][0].get("sanitizedPlainText").is_none());
        assert!(thread["messages"][0].get("body").is_none());
        assert_eq!(thread["messages"][0]["subject"], "Subject");
    }
}

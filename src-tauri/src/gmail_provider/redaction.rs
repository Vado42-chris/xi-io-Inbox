use serde_json::Value;

pub const MAX_ERROR_EXCERPT_CHARS: usize = 2000;
const REDACTED: &str = "[REDACTED]";

const SENSITIVE_KEYS: &[&str] = &[
    "access_token",
    "refresh_token",
    "id_token",
    "token",
    "client_secret",
    "authorization",
    "bearer",
    "password",
    "secret",
];

pub fn is_sensitive_key(key: &str) -> bool {
    let lower = key.to_ascii_lowercase();
    SENSITIVE_KEYS
        .iter()
        .any(|candidate| lower == *candidate)
}

pub fn deep_redact_json(value: &mut Value) {
    match value {
        Value::Object(map) => {
            let keys: Vec<String> = map.keys().cloned().collect();
            for key in keys {
                if is_sensitive_key(&key) {
                    map.remove(&key);
                    continue;
                }
                if let Some(child) = map.get_mut(&key) {
                    deep_redact_json(child);
                }
            }
        }
        Value::Array(items) => {
            for item in items {
                deep_redact_json(item);
            }
        }
        _ => {}
    }
}

pub fn normalize_runtime_storage_labels(value: &mut Value) {
    rewrite_token_storage_fields(value);
}

fn rewrite_token_storage_fields(value: &mut Value) {
    match value {
        Value::Object(map) => {
            if let Some(storage) = map.get_mut("tokenStorage") {
                if storage.as_str().is_some_and(|text| text.contains("tools/gmail/data")) {
                    *storage = Value::String("runtime-app-data (gitignored)".into());
                }
            }
            for child in map.values_mut() {
                rewrite_token_storage_fields(child);
            }
        }
        Value::Array(items) => {
            for item in items {
                rewrite_token_storage_fields(item);
            }
        }
        _ => {}
    }
}

pub fn sanitize_provider_envelope(envelope: &mut Value) {
    deep_redact_json(envelope);
    normalize_runtime_storage_labels(envelope);
    if let Some(obj) = envelope.as_object_mut() {
        if let Some(scope) = obj.get_mut("scopeState").and_then(Value::as_object_mut) {
            scope.remove("refreshTokenPresent");
            scope.remove("accessTokenPresent");
        }
    }
}

pub fn redact_sensitive_text(input: &str) -> String {
    let mut output = input.to_string();
    let lower = output.to_ascii_lowercase();
    if let Some(idx) = lower.find("bearer ") {
        let before = &output[..idx];
        let after_marker = &output[idx + "bearer ".len()..];
        let token_end = after_marker
            .find(|c: char| c.is_whitespace() || c == '"' || c == '\'' || c == ',')
            .unwrap_or(after_marker.len());
        output = format!("{before}Bearer {REDACTED}{}", &after_marker[token_end..]);
    }
    for marker in [
        "access_token=",
        "refresh_token=",
        "id_token=",
        "client_secret=",
    ] {
        let lower = output.to_ascii_lowercase();
        if let Some(idx) = lower.find(marker) {
            let prefix = &output[..idx + marker.len()];
            let tail = &output[idx + marker.len()..];
            let value_end = tail
                .find(|c: char| c.is_whitespace() || c == '&' || c == '"' || c == '\'' || c == ',')
                .unwrap_or(tail.len().min(120));
            output = format!("{prefix}{REDACTED}{}", &tail[value_end..]);
        }
    }
    truncate_error_excerpt(&output)
}

pub fn truncate_error_excerpt(input: &str) -> String {
    if input.chars().count() <= MAX_ERROR_EXCERPT_CHARS {
        return input.to_string();
    }
    let truncated: String = input.chars().take(MAX_ERROR_EXCERPT_CHARS).collect();
    format!("{truncated}… [truncated]")
}

pub fn format_sidecar_error(
    command: &str,
    exit_code: Option<i32>,
    stderr: &str,
    parsed_error: Option<&str>,
) -> String {
    let mut parts = vec![format!(
        "Gmail sidecar command '{command}' failed (exit={exit_code:?})"
    )];
    if let Some(error) = parsed_error.filter(|text| !text.is_empty()) {
        parts.push(redact_sensitive_text(error));
    }
    if !stderr.trim().is_empty() {
        parts.push(redact_sensitive_text(stderr.trim()));
    }
    truncate_error_excerpt(&parts.join(": "))
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn deep_redact_removes_nested_token_values() {
        let mut value = json!({
            "payload": {
                "nested": {
                    "access_token": "secret-value",
                    "ok": "keep"
                },
                "items": [{ "refresh_token": "nested-secret" }]
            }
        });
        deep_redact_json(&mut value);
        assert!(value.get("payload").unwrap().get("nested").is_none() || value["payload"]["nested"].get("access_token").is_none());
        assert_eq!(value["payload"]["nested"]["ok"], "keep");
        assert!(value["payload"]["items"][0].get("refresh_token").is_none());
    }

    #[test]
    fn sanitize_connect_payload_removes_token_fields() {
        let mut envelope = json!({
            "success": true,
            "token": { "access_token": "secret" },
            "payload": { "connected": true, "tokenStorage": "tools/gmail/data/token.json (gitignored)" }
        });
        sanitize_provider_envelope(&mut envelope);
        assert!(envelope.get("token").is_none());
        assert_eq!(envelope["payload"]["tokenStorage"], "runtime-app-data (gitignored)");
    }

    #[test]
    fn redact_sensitive_text_masks_bearer_like_values() {
        let text = "Authorization: Bearer abcdefghijklmnopqrstuvwxyz";
        let redacted = redact_sensitive_text(text);
        assert!(!redacted.contains("abcdefghijklmnopqrstuvwxyz"));
        assert!(redacted.contains(REDACTED));
    }

    #[test]
    fn truncate_error_excerpt_limits_length() {
        let long = "x".repeat(MAX_ERROR_EXCERPT_CHARS + 50);
        let excerpt = truncate_error_excerpt(&long);
        assert!(excerpt.chars().count() <= MAX_ERROR_EXCERPT_CHARS + 20);
        assert!(excerpt.contains("[truncated]"));
    }
}

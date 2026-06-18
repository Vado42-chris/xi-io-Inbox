const RUNTIME_MAIL_INDEX_COMMAND = 'gmail_provider_mail_index';
const RUNTIME_BOUNDARY_COMMAND = 'runtime_store_boundary';
const RUNTIME_STATUS_COMMAND = 'gmail_provider_status';
const RUNTIME_SYNC_STATUS_COMMAND = 'gmail_provider_sync_status';
const RUNTIME_CONNECT_COMMAND = 'gmail_provider_connect';
const RUNTIME_SYNC_METADATA_COMMAND = 'gmail_provider_sync_metadata';
const RUNTIME_SYNC_HISTORY_COMMAND = 'gmail_provider_sync_history';

export function isTauriRuntime() {
  return typeof window !== 'undefined' && Boolean(window.__TAURI__?.core?.invoke);
}

export async function safeInvokeRuntime(command, args = {}) {
  if (!isTauriRuntime()) {
    return {
      ok: false,
      mode: 'static-preview',
      data: null,
      error: 'Tauri runtime unavailable',
    };
  }
  try {
    const data = await window.__TAURI__.core.invoke(command, args);
    return {
      ok: true,
      mode: 'tauri-runtime',
      data,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      mode: 'tauri-runtime',
      data: null,
      error: String(error?.message || error || 'Runtime invoke failed'),
    };
  }
}

async function invokeRuntime(command, args = {}) {
  const result = await safeInvokeRuntime(command, args);
  if (!result.ok) return null;
  return result.data;
}

export async function loadRuntimeStoreBoundary() {
  return invokeRuntime(RUNTIME_BOUNDARY_COMMAND);
}

export async function loadRuntimeMailIndex() {
  return invokeRuntime(RUNTIME_MAIL_INDEX_COMMAND);
}

export async function getRuntimeStatus() {
  return safeInvokeRuntime(RUNTIME_STATUS_COMMAND);
}

export async function getRuntimeSyncStatus() {
  return safeInvokeRuntime(RUNTIME_SYNC_STATUS_COMMAND);
}

export async function connectGmailProvider() {
  return safeInvokeRuntime(RUNTIME_CONNECT_COMMAND);
}

export async function syncGmailMetadata(options = {}) {
  return safeInvokeRuntime(RUNTIME_SYNC_METADATA_COMMAND, { options });
}

export async function syncGmailHistory(options = {}) {
  return safeInvokeRuntime(RUNTIME_SYNC_HISTORY_COMMAND, { options });
}

export async function refreshRuntimeMail() {
  if (!isTauriRuntime()) {
    return {
      ok: false,
      mode: 'static-preview',
      boundary: null,
      syncStatus: null,
      mailIndex: null,
      error: 'Tauri runtime unavailable',
    };
  }
  const boundary = await safeInvokeRuntime(RUNTIME_BOUNDARY_COMMAND);
  const syncStatus = await safeInvokeRuntime(RUNTIME_SYNC_STATUS_COMMAND);
  const mailIndex = await safeInvokeRuntime(RUNTIME_MAIL_INDEX_COMMAND);
  const ok = Boolean(
    (boundary.ok || syncStatus.ok || mailIndex.ok)
    && !(mailIndex.ok === false && mailIndex.error),
  );
  return {
    ok,
    mode: 'tauri-runtime',
    boundary,
    syncStatus,
    mailIndex,
    error: mailIndex.error || syncStatus.error || boundary.error || null,
  };
}

export function runtimeHostModeLabel() {
  return isTauriRuntime() ? 'tauri-runtime' : 'static-preview';
}

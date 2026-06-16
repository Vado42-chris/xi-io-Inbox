const RUNTIME_MAIL_INDEX_COMMAND = 'gmail_provider_mail_index';
const RUNTIME_BOUNDARY_COMMAND = 'runtime_store_boundary';

export function isTauriRuntime() {
  return typeof window !== 'undefined' && Boolean(window.__TAURI__?.core?.invoke);
}

async function invokeRuntime(command, args = {}) {
  if (!isTauriRuntime()) return null;
  return window.__TAURI__.core.invoke(command, args);
}

export async function loadRuntimeStoreBoundary() {
  return invokeRuntime(RUNTIME_BOUNDARY_COMMAND);
}

export async function loadRuntimeMailIndex() {
  return invokeRuntime(RUNTIME_MAIL_INDEX_COMMAND);
}

export function runtimeHostModeLabel() {
  return isTauriRuntime() ? 'tauri-runtime' : 'static-preview';
}

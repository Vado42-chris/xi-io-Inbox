import { writeReceipt } from './receipts.js';
import { getScopeStateForResponse } from './body-gate.js';

export function envelope({
  success,
  blocked = false,
  providerGate = 'metadata_read_only',
  dataClassification = 'metadata_redacted',
  redactionState = 'applied',
  payload = null,
  error = null,
  method = 'unknown',
  scopeState = null,
  token = null,
}) {
  const receiptId = writeReceipt({ method, success, blocked, error: error?.message || error });
  return {
    success,
    blocked,
    scopeState: scopeState || getScopeStateForResponse(token),
    providerGate,
    dataClassification,
    receiptId,
    redactionState,
    payload,
    error: error ? String(error.message || error) : null,
  };
}

export function blocked(method, reason) {
  return envelope({
    success: false,
    blocked: true,
    providerGate: reason,
    method,
    error: reason,
  });
}

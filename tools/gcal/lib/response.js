import { writeReceipt } from './receipts.js';

export function envelope({
  success,
  blocked = false,
  providerGate = 'calendar_read_only',
  dataClassification = 'metadata_redacted',
  payload = null,
  error = null,
  method = 'unknown',
}) {
  const receiptId = writeReceipt({ method, success, blocked, error: error?.message || error });
  return {
    success,
    blocked,
    providerGate,
    dataClassification,
    receiptId,
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

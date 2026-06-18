/**
 * Tauri-only runtime mail refresh loop.
 * Polls read-only refreshRuntimeMail() — no live sync on each tick.
 */
const DEFAULT_INTERVAL_MS = 60_000;

export function createRuntimeRefreshLoop({
  isActive,
  onRefresh,
  intervalMs = DEFAULT_INTERVAL_MS,
} = {}) {
  if (typeof isActive !== 'function' || typeof onRefresh !== 'function') {
    throw new Error('createRuntimeRefreshLoop requires isActive and onRefresh');
  }

  let timerId = null;
  let lastRefreshAt = null;
  let lastError = null;
  let refreshing = false;

  async function tick({ reason = 'interval' } = {}) {
    if (!isActive() || refreshing) {
      return { ok: false, skipped: true, reason: refreshing ? 'busy' : 'inactive' };
    }
    refreshing = true;
    try {
      const result = await onRefresh({ reason });
      lastRefreshAt = new Date().toISOString();
      lastError = result?.error || null;
      return { ok: Boolean(result?.ok), ...result, lastRefreshAt, reason };
    } catch (error) {
      lastError = String(error?.message || error || 'Refresh failed');
      return { ok: false, error: lastError, reason };
    } finally {
      refreshing = false;
    }
  }

  function start() {
    stop();
    if (!isActive()) return false;
    timerId = globalThis.setInterval(() => {
      tick({ reason: 'interval' });
    }, intervalMs);
    tick({ reason: 'start' });
    return true;
  }

  function stop() {
    if (timerId != null) {
      globalThis.clearInterval(timerId);
      timerId = null;
    }
  }

  function isRunning() {
    return timerId != null;
  }

  function refreshNow() {
    return tick({ reason: 'manual' });
  }

  function getStatus() {
    return {
      running: isRunning(),
      lastRefreshAt,
      lastError,
      intervalMs,
      refreshing,
    };
  }

  return {
    start,
    stop,
    refreshNow,
    isRunning,
    getStatus,
    get intervalMs() {
      return intervalMs;
    },
  };
}

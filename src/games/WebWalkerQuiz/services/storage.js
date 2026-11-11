/**
 * localStorage wrapper. Every access is in try/catch because storage can be
 * blocked (private mode, embedded iframes) and must never break the game.
 */
export function createStorage(prefix, backend) {
  const resolve = () => {
    try {
      return backend ?? globalThis.localStorage ?? null;
    } catch {
      return null;
    }
  };
  const k = (key) => `${prefix}:${key}`;

  return {
    get(key, fallback = null) {
      try {
        const raw = resolve()?.getItem(k(key));
        return raw == null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        resolve()?.setItem(k(key), JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
  };
}

/** Typed helpers on top of the raw store, so callers never touch key names. */
export function createProgressStore(storage) {
  return {
    getSettings: () => storage.get('settings', {}),
    saveSettings: (patch) => storage.set('settings', { ...storage.get('settings', {}), ...patch }),
    getBest: (difficulty) => Number(storage.get('best', {})[difficulty]) || 0,
    /** Returns true when `score` set a new record for that difficulty. */
    submitScore(difficulty, score) {
      const best = storage.get('best', {});
      if (score > (Number(best[difficulty]) || 0)) {
        storage.set('best', { ...best, [difficulty]: score });
        return true;
      }
      return false;
    },
  };
}

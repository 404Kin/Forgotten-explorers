/** Errors the UI knows how to show. `messageKey` is an i18n key. */
export class AppError extends Error {
  constructor(code, messageKey, { retryable = false, cause } = {}) {
    super(code, { cause });
    this.name = 'AppError';
    this.code = code;
    this.messageKey = messageKey;
    this.retryable = retryable;
  }
}

export const toAppError = (err) =>
  err instanceof AppError
    ? err
    : new AppError('UNKNOWN', 'app.errorGeneric', { retryable: true, cause: err });

/**
 * Central place where failures end up: logs once, then tells whoever is
 * listening (the game shell shows the friendly error view).
 */
export function createErrorHandler({ log = console.error } = {}) {
  const listeners = new Set();
  return {
    handle(err, context = '') {
      const appError = toAppError(err);
      log(`[game${context ? `:${context}` : ''}]`, appError.code, appError.cause ?? '');
      listeners.forEach((fn) => fn(appError, context));
      return appError;
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

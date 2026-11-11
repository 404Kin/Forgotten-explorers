/** True when the user asked the OS/browser for less motion. Safe without matchMedia. */
export function prefersReducedMotion() {
  try {
    return Boolean(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  } catch {
    return false;
  }
}

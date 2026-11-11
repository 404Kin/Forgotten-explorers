const raf = (fn) =>
  typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame(fn)
    : setTimeout(() => fn(Date.now()), 16);
const caf = (id) =>
  typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame(id) : clearTimeout(id);

export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (edge0, edge1, x) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Runs onFrame(progress 0..1) over `duration` ms. Resolves when finished and
 * also resolves (without a final frame) if cancelled, so awaiting never hangs.
 */
export function runAnimation(duration, onFrame) {
  let id = 0;
  let cancelled = false;
  let finish;
  const promise = new Promise((resolve) => {
    finish = resolve;
  });
  const start = performance.now();
  const tick = () => {
    if (cancelled) return finish(false);
    const t = duration <= 0 ? 1 : clamp01((performance.now() - start) / duration);
    onFrame(t);
    if (t >= 1) return finish(true);
    id = raf(tick);
  };
  id = raf(tick);
  return {
    promise,
    cancel() {
      cancelled = true;
      caf(id);
      finish(false);
    },
  };
}

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
export const lerpPoint = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });

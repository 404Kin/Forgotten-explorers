import { h } from '../../utils/dom.js';
import { createRng } from '../../core/random.js';

/** Pure: build confetti particles bursting upward from `origin`. */
export function createParticles(count, origin, rng, colors) {
  return Array.from({ length: count }, () => {
    const angle = -Math.PI / 2 + (rng() - 0.5) * Math.PI * 0.9;
    const speed = 380 + rng() * 420;
    return {
      x: origin.x,
      y: origin.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: rng() * Math.PI * 2,
      vr: (rng() - 0.5) * 12,
      size: 6 + rng() * 6,
      color: colors[Math.floor(rng() * colors.length)],
      age: 0,
      ttl: 1.4 + rng() * 0.8,
    };
  });
}

/** Pure: advance one particle by dt seconds (mutates for speed). */
export function stepParticle(p, dt, gravity = 1100, drag = 0.992) {
  p.vx *= drag;
  p.vy = p.vy * drag + gravity * dt;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.rot += p.vr * dt;
  p.age += dt;
  return p.age < p.ttl;
}

/**
 * Draws a confetti burst on a temporary canvas over `root`. Resolves when done.
 * Callers lazy-import this module, so it costs nothing until the first correct answer.
 */
export function launchConfetti(root, { origin, colors, count = 90, rng = createRng() }) {
  const canvas = h('canvas', { class: 'ws-confetti', 'aria-hidden': 'true' });
  const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
  const { width, height } = root.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));
  root.append(canvas);
  const ctx = canvas.getContext?.('2d');
  if (!ctx) {
    canvas.remove();
    return Promise.resolve();
  }
  ctx.scale(dpr, dpr);

  let particles = createParticles(count, origin, rng, colors);
  let last = performance.now();
  return new Promise((resolve) => {
    const frame = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      particles = particles.filter((p) => stepParticle(p, dt));
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.min(1, (p.ttl - p.age) * 2);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (particles.length) requestAnimationFrame(frame);
      else {
        canvas.remove();
        resolve();
      }
    };
    requestAnimationFrame(frame);
  });
}

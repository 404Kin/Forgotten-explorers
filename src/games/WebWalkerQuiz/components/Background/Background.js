import { h, fromMarkup } from '../../utils/dom.js';
import { createRng } from '../../core/random.js';
import { prefersReducedMotion } from '../../utils/motion.js';
import './Background.css';

/** Deterministic star field as one box-shadow list (cheap: one element per layer). */
export function starShadows(count, size, rng) {
  return Array.from({ length: count }, () => {
    const x = (rng() * 100).toFixed(2);
    const y = (rng() * 100).toFixed(2);
    return `${x}vw ${y}vh 0 ${(rng() * size).toFixed(1)}px rgb(255 255 255 / ${(0.4 + rng() * 0.6).toFixed(2)})`;
  }).join(',');
}

const ROVER = `
<svg class="ws-bg-rover" viewBox="0 0 120 70" aria-hidden="true" focusable="false">
  <rect x="30" y="22" width="56" height="20" rx="6" fill="#8f9cf0"/>
  <rect x="40" y="10" width="26" height="14" rx="5" fill="#cdd6ff"/>
  <circle cx="53" cy="17" r="4" fill="#14206b" stroke="#7df9ff" stroke-width="1.5"/>
  <path d="M86 28 L112 14" stroke="#cdd6ff" stroke-width="3" stroke-linecap="round"/>
  <circle cx="113" cy="13" r="4" fill="#ffa94d"/>
  <rect x="14" y="30" width="22" height="3" rx="1.5" fill="#4aa3ff"/>
  <g fill="#3b4a9c" stroke="#cdd6ff" stroke-width="2.5">
    <circle cx="34" cy="52" r="12"/><circle cx="60" cy="52" r="12"/><circle cx="86" cy="52" r="12"/>
  </g>
</svg>`;

/** Space backdrop: nebula, three parallax star layers, a planet and a drifting rover. */
export function createBackground({ root, reducedMotion = prefersReducedMotion, seed = 42 }) {
  const rng = createRng(seed);
  const layers = [
    { count: 70, size: 1, depth: 6 },
    { count: 40, size: 1.6, depth: 14 },
    { count: 18, size: 2.4, depth: 26 },
  ].map(({ count, size, depth }) =>
    h('div', {
      class: 'ws-bg-stars',
      style: `box-shadow:${starShadows(count, size, rng)}`,
      'data-depth': depth,
    }),
  );
  const planet = h('div', { class: 'ws-bg-planet', 'data-depth': 10 });
  const rover = h('div', { class: 'ws-bg-rover-wrap', 'data-depth': 18 }, fromMarkup(ROVER));
  const el = h(
    'div',
    { class: 'ws-bg', 'aria-hidden': 'true' },
    h('div', { class: 'ws-bg-nebula' }),
    ...layers,
    planet,
    rover,
  );

  let frame = 0;
  const parallax = (event) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      for (const node of [...layers, planet, rover]) {
        const depth = Number(node.dataset.depth);
        node.style.translate = `${(-nx * depth).toFixed(1)}px ${(-ny * depth).toFixed(1)}px`;
      }
    });
  };
  if (!reducedMotion()) root.addEventListener('pointermove', parallax, { passive: true });

  return {
    el,
    destroy() {
      root.removeEventListener('pointermove', parallax);
      cancelAnimationFrame(frame);
      el.remove();
    },
  };
}

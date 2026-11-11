import { h } from '../../utils/dom.js';

/**
 * Small burst of star shapes at (x, y) inside `container`.
 * With reduced motion it is a single soft glow that fades, no travel.
 */
export function sparkleBurst(container, { x, y, colors, count = 12, reducedMotion = false }) {
  const burst = h('div', {
    class: 'ws-burst',
    'aria-hidden': 'true',
    style: `left:${x}px;top:${y}px`,
  });
  if (reducedMotion) {
    burst.append(
      h('span', { class: 'ws-spark ws-spark--still', style: `background:${colors[0]}` }),
    );
  } else {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = 40 + (i % 3) * 18;
      burst.append(
        h('span', {
          class: 'ws-spark',
          style: `--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px;background:${colors[i % colors.length]};animation-delay:${(i % 4) * 30}ms`,
        }),
      );
    }
  }
  container.append(burst);
  setTimeout(() => burst.remove(), 1000);
  return burst;
}

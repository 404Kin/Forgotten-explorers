import { fromMarkup } from '../../utils/dom.js';

/** SVG path for a slightly slack line between two points. */
export function tetherPath(a, b, slack = 0) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 + slack;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

/** The glowing tether line, plus two loose pieces used when it snaps. */
export function createTether() {
  const el = fromMarkup(`
    <svg class="ws-tether" aria-hidden="true" focusable="false">
      <path class="ws-tether-glow"></path>
      <path class="ws-tether-core"></path>
      <path class="ws-tether-cut"></path>
      <path class="ws-tether-cut"></path>
    </svg>`);
  const [glow, core, ...cuts] = el.querySelectorAll('path');

  const setMain = (visible) => {
    glow.style.display = core.style.display = visible ? '' : 'none';
  };

  return {
    el,
    draw(a, b, slack = 0) {
      setMain(true);
      const d = tetherPath(a, b, slack);
      glow.setAttribute('d', d);
      core.setAttribute('d', d);
    },
    hide() {
      setMain(false);
    },
    drawCut(index, a, b, opacity = 1, slack = 0) {
      cuts[index].setAttribute('d', tetherPath(a, b, slack));
      cuts[index].style.opacity = String(opacity);
    },
    reset() {
      setMain(true);
      cuts.forEach((c) => {
        c.setAttribute('d', '');
        c.style.opacity = '0';
      });
    },
  };
}

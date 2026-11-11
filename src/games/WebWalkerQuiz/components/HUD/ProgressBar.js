import { h } from '../../utils/dom.js';

export function createProgressBar({ t }) {
  const fill = h('span', { class: 'ws-progress-fill' });
  const label = h('span', { class: 'ws-progress-label' });
  const el = h(
    'div',
    { class: 'ws-progress-wrap' },
    h('div', { class: 'ws-progress', role: 'progressbar', 'aria-valuemin': '0' }, fill),
    label,
  );
  const bar = el.firstElementChild;
  return {
    el,
    /** `done` questions finished out of `total`; `current` is the 1-based question number. */
    update({ done, total, current }) {
      const text = t('hud.progress', { current: Math.min(current, total), total });
      bar.setAttribute('aria-valuemax', String(total));
      bar.setAttribute('aria-valuenow', String(done));
      bar.setAttribute('aria-valuetext', text);
      bar.setAttribute('aria-label', text);
      fill.style.transform = `scaleX(${total ? done / total : 0})`;
      label.textContent = text;
    },
  };
}

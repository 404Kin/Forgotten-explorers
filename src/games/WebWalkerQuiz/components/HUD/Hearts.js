import { h, fromMarkup } from '../../utils/dom.js';

const heart = (filled) =>
  fromMarkup(`
  <svg class="ws-heart" data-filled="${filled}" viewBox="0 0 24 22" aria-hidden="true" focusable="false">
    <path d="M12 21 C-4 9 4 -1 12 6 C20 -1 28 9 12 21Z"
      fill="${filled ? 'var(--ws-red)' : 'none'}" stroke="${filled ? '#fff' : 'var(--ws-red)'}"
      stroke-width="2" ${filled ? '' : 'stroke-dasharray="3 2.5"'}/>
  </svg>`);

/** Row of hearts; lost hearts are dashed outlines (shape, not just colour). */
export function createHearts({ t, total }) {
  const el = h('div', { class: 'ws-hearts', role: 'img' });
  let last = total;
  return {
    el,
    update(count) {
      el.setAttribute('aria-label', t('hud.hearts', { count, total }));
      el.replaceChildren(...Array.from({ length: total }, (_, i) => heart(i < count)));
      if (count < last) el.classList.add('ws-hearts--hit');
      else el.classList.remove('ws-hearts--hit');
      last = count;
    },
  };
}

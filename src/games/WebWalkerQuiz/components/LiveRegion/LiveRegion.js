import { h } from '../../utils/dom.js';

/** Visually hidden polite live region for screen-reader announcements. */
export function createLiveRegion() {
  const el = h('div', {
    class: 'ws-sr-only',
    role: 'status',
    'aria-live': 'polite',
    'aria-atomic': 'true',
  });
  let timer = 0;
  return {
    el,
    announce(message) {
      clearTimeout(timer);
      el.textContent = '';
      // Clearing first makes repeated identical messages be read again.
      timer = setTimeout(() => (el.textContent = message), 30);
    },
    destroy: () => clearTimeout(timer),
  };
}

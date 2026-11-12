import { h } from '../../utils/dom.js';
import '../GameOver/GameOver.css';

/** Shown when every question is mastered: celebrate, then offer Reset (start again from zero) or back to the menu. */
export function createMastered({ t }) {
  const el = h('section', { class: 'ws-screen ws-over' });
  return {
    el,
    show({ total, score = null, onReset, onMenu }) {
      el.replaceChildren(
        h(
          'div',
          { class: 'ws-panel ws-over-card' },
          h('div', { class: 'ws-over-emoji', 'aria-hidden': 'true' }, '🏆'),
          h('h2', { class: 'ws-over-title', tabindex: '-1' }, t('mastered.title')),
          h('p', {}, t('mastered.body', { total })),
          score !== null && h('p', { class: 'ws-over-mastery' }, t('mastered.score', { score })),
          h(
            'div',
            { class: 'ws-over-actions' },
            h('button', { class: 'ws-btn ws-btn--green', type: 'button', onClick: onReset }, t('mastered.reset')),
            onMenu && h('button', { class: 'ws-btn ws-btn--ghost', type: 'button', onClick: onMenu }, t('hud.home')),
          ),
        ),
      );
      el.querySelector('.ws-over-title').focus({ preventScroll: true });
    },
  };
}

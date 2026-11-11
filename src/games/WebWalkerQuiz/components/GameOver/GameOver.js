import { h } from '../../utils/dom.js';
import './GameOver.css';

/** End screen: result, score, best streak, review of missed questions, replay. */
export function createGameOver({ t }) {
  const el = h('section', { class: 'ws-screen ws-over' });

  return {
    el,
    show({ outcome, score, best, newBest, bestStreak, missed, onPlayAgain, onMenu }) {
      const playAgain = h(
        'button',
        { class: 'ws-btn ws-btn--green', type: 'button', onClick: onPlayAgain },
        t('gameOver.playAgain'),
      );
      const stat = (label, value) =>
        h('div', { class: 'ws-over-stat' }, h('dt', {}, label), h('dd', {}, String(value)));

      el.replaceChildren(
        h(
          'div',
          { class: 'ws-panel ws-over-card' },
          h(
            'div',
            { class: 'ws-over-emoji', 'aria-hidden': 'true' },
            outcome === 'won' ? '🚀' : '🛰️',
          ),
          h(
            'h2',
            { class: 'ws-over-title', tabindex: '-1' },
            outcome === 'won' ? t('gameOver.won') : t('gameOver.lost'),
          ),
          newBest && h('p', { class: 'ws-over-newbest' }, `★ ${t('gameOver.newBest')}`),
          h(
            'dl',
            { class: 'ws-over-stats' },
            stat(t('gameOver.score'), score),
            stat(t('gameOver.bestStreak'), bestStreak),
            stat(t('gameOver.best'), best),
          ),
          h(
            'section',
            { class: 'ws-over-review', 'aria-labelledby': 'ws-over-review-title' },
            h('h3', { id: 'ws-over-review-title' }, t('gameOver.review')),
            missed.length === 0
              ? h('p', {}, t('gameOver.noneMissed'))
              : h(
                  'ul',
                  {},
                  missed.map(({ question, choice }) =>
                    h(
                      'li',
                      {},
                      h('strong', {}, question.text),
                      h(
                        'span',
                        {},
                        `✕ ${t('gameOver.yourAnswer', { answer: question.options[choice] })}`,
                      ),
                      h(
                        'span',
                        {},
                        `✓ ${t('gameOver.rightAnswer', { answer: question.options[question.correctIndex] })}`,
                      ),
                    ),
                  ),
                ),
          ),
          h(
            'div',
            { class: 'ws-over-actions' },
            playAgain,
            onMenu &&
              h(
                'button',
                { class: 'ws-btn ws-btn--ghost', type: 'button', onClick: onMenu },
                t('hud.home'),
              ),
          ),
        ),
      );
      el.querySelector('.ws-over-title').focus({ preventScroll: true });
    },
  };
}

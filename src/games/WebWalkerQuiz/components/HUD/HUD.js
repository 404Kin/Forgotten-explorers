import { h } from '../../utils/dom.js';
import { createHearts } from './Hearts.js';
import { createProgressBar } from './ProgressBar.js';
import './HUD.css';

/** Top bar: hearts, score, streak, progress and sound/menu buttons. */
export function createHUD({ t, hearts, soundToggle, onHome }) {
  const heartsView = createHearts({ t, total: hearts });
  const score = h('output', { class: 'ws-stat-value' }, '0');
  const streakIcon = h('span', { 'aria-hidden': 'true' }, '🔥');
  const streak = h('output', { class: 'ws-stat-value' }, '0');
  const progress = createProgressBar({ t });
  const home = h(
    'button',
    {
      class: 'ws-btn ws-btn--ghost',
      type: 'button',
      'aria-label': t('hud.home'),
      title: t('hud.home'),
      onClick: onHome,
    },
    '☰',
  );

  const stat = (label, ...value) =>
    h(
      'div',
      { class: 'ws-stat' },
      h('span', { class: 'ws-stat-label' }, label),
      h('span', { class: 'ws-stat-row' }, ...value),
    );

  const el = h(
    'header',
    { class: 'ws-hud' },
    h(
      'div',
      { class: 'ws-hud-row' },
      heartsView.el,
      stat(t('hud.score'), score),
      stat(t('hud.streak'), streakIcon, streak),
      h('div', { class: 'ws-hud-actions' }, soundToggle.el, home),
    ),
    progress.el,
  );

  let lastScore = 0;
  return {
    el,
    update({ hearts: left, score: points, streak: run, done, total, current }) {
      heartsView.update(left);
      score.textContent = String(points);
      if (points !== lastScore) {
        score.classList.remove('ws-bump');
        void score.offsetWidth;
        score.classList.add('ws-bump');
      }
      lastScore = points;
      streak.textContent = String(run);
      streakIcon.style.opacity = run > 0 ? '1' : '0.4';
      progress.update({ done, total, current });
    },
  };
}

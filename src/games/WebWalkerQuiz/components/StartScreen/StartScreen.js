import { h, uniqueId } from '../../utils/dom.js';
import { createCharacter } from '../Character/Character.js';
import './StartScreen.css';

/** Title, difficulty, language and Play. Calls back; owns no game logic. */
export function createStartScreen({
  t,
  config,
  difficulty,
  best,
  mastery,
  soundToggle,
  onPlay,
  onDifficulty,
}) {
  const zip = createCharacter({ name: config.characterName, t });
  zip.setPose('swinging');

  const groupName = uniqueId('ws-diff');
  const radios = config.choices.map((level) => {
    const input = h('input', {
      type: 'radio',
      name: groupName,
      value: level,
      class: 'ws-pill-input',
      checked: level === difficulty,
      onChange: () => onDifficulty(level),
    });
    return h(
      'label',
      { class: 'ws-pill' },
      input,
      h('span', { class: 'ws-pill-face' }, t(`difficulty.${level}`)),
    );
  });

  const masteryLine = h('p', { class: 'ws-start-best' }, `🎓 ${t('start.mastery', { mastered: mastery.mastered, total: mastery.total })}`);
  const bestLine = h('p', { class: 'ws-start-best' });
  const setBest = (score) => {
    bestLine.hidden = !(score > 0);
    bestLine.textContent = score > 0 ? `★ ${t('start.best', { score })}` : '';
  };
  setBest(best);

  const el = h(
    'section',
    { class: 'ws-screen ws-start' },
    h('div', { class: 'ws-start-tools' }, soundToggle.el),
    h(
      'div',
      { class: 'ws-panel ws-start-card' },
      h('div', { class: 'ws-start-zip', 'aria-hidden': 'true' }, zip.el),
      h('h1', { class: 'ws-start-title', tabindex: '-1' }, config.title),
      h('p', { class: 'ws-start-tagline' }, t('start.tagline', { name: config.characterName })),
      h(
        'fieldset',
        { class: 'ws-fieldset' },
        h('legend', {}, t('start.difficulty')),
        h('div', { class: 'ws-pills' }, radios),
      ),
      masteryLine,
      bestLine,
      h(
        'button',
        { class: 'ws-btn ws-btn--green ws-start-play', type: 'button', onClick: onPlay },
        t('start.play'),
        h('span', { 'aria-hidden': 'true' }, '🚀'),
      ),
      h('p', { class: 'ws-start-howto' }, t('start.howTo', { hearts: config.hearts })),
    ),
  );

  return {
    el,
    setBest,
    focus: () => el.querySelector('.ws-start-play').focus({ preventScroll: true }),
  };
}

import { h } from '../../utils/dom.js';
import './AnswerBox.css';

export const ANSWER_STATES = Object.freeze(['idle', 'correct', 'wrong', 'dim']);

/**
 * One answer panel. State is always shown with an icon and a text label too,
 * never by colour alone. `dock` is the landing pad where Zip arrives.
 */
export function createAnswerBox({ index, t, onSelect }) {
  const dock = h('span', { class: 'ws-answer-dock', 'aria-hidden': 'true' });
  const key = h('span', { class: 'ws-answer-key', 'aria-hidden': 'true' }, String(index + 1));
  const text = h('span', { class: 'ws-answer-text' });
  const icon = h('span', { class: 'ws-answer-icon', 'aria-hidden': 'true' });
  const status = h('span', { class: 'ws-answer-status' });

  let locked = false;
  const el = h(
    'button',
    {
      class: 'ws-panel ws-answer',
      type: 'button',
      'data-state': 'idle',
      'aria-keyshortcuts': String(index + 1),
      onClick: () => {
        if (!locked) onSelect(index);
      },
    },
    dock,
    h(
      'span',
      { class: 'ws-answer-body' },
      h('span', { class: 'ws-answer-row' }, key, text),
      h('span', { class: 'ws-answer-tag' }, icon, status),
    ),
  );

  return {
    el,
    dock,
    setOption(label) {
      text.textContent = label;
      this.setState('idle');
      this.setLocked(false);
    },
    setState(state) {
      if (!ANSWER_STATES.includes(state)) throw new RangeError(`Unknown answer state: ${state}`);
      el.dataset.state = state;
      icon.textContent = state === 'correct' ? '✓' : state === 'wrong' ? '✕' : '';
      status.textContent =
        state === 'correct' ? t('answer.correct') : state === 'wrong' ? t('answer.wrong') : '';
    },
    getState: () => el.dataset.state,
    setLocked(value) {
      locked = value;
      el.setAttribute('aria-disabled', String(value));
    },
  };
}

import { h, uniqueId } from '../../utils/dom.js';
import './QuestionBoard.css';

/** Top panel with the question text; `hook` is where Zip's tether is anchored. */
export function createQuestionBoard({ t }) {
  const id = uniqueId('ws-question');
  const label = h('span', { class: 'ws-q-label' });
  const text = h('h2', { id, class: 'ws-q-text', tabindex: '-1' });
  const hook = h('span', { class: 'ws-q-hook', 'aria-hidden': 'true' });
  const el = h('section', { class: 'ws-panel ws-q', 'aria-labelledby': id }, label, text, hook);

  return {
    el,
    id,
    hook,
    setQuestion({ text: question, number, total }) {
      label.textContent = `${t('question.label')} ${number}/${total}`;
      text.textContent = question;
    },
    focus: () => text.focus({ preventScroll: true }),
  };
}

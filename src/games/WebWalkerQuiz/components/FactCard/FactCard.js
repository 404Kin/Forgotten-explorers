import { h, uniqueId } from '../../utils/dom.js';
import './FactCard.css';

/** Card shown after each answer: result, right answer, fun fact, source, Next. */
export function createFactCard({ t }) {
  const el = h('section', { class: 'ws-panel ws-fact', hidden: true });

  return {
    el,
    show({ correct, answerText, fact, source, points, bonus, isLast, onNext }) {
      const titleId = uniqueId('ws-fact-title');
      const next = h(
        'button',
        {
          class: `ws-btn ${correct ? 'ws-btn--green' : 'ws-btn--orange'}`,
          type: 'button',
          onClick: onNext,
        },
        isLast ? t('fact.finish') : t('fact.next'),
        h('span', { 'aria-hidden': 'true' }, '→'),
      );

      el.dataset.result = correct ? 'correct' : 'wrong';
      el.setAttribute('aria-labelledby', titleId);
      el.replaceChildren(
        h(
          'div',
          { class: 'ws-fact-head' },
          h('span', { class: 'ws-fact-icon', 'aria-hidden': 'true' }, correct ? '✓' : '✕'),
          h(
            'h3',
            { id: titleId, class: 'ws-fact-title' },
            correct ? t('fact.correctTitle') : t('fact.wrongTitle'),
          ),
          correct &&
            h('span', { class: 'ws-fact-points' }, `+${points}`, bonus > 0 && ` (🔥 +${bonus})`),
        ),
        h('p', { class: 'ws-fact-answer' }, t('fact.rightAnswer', { answer: answerText })),
        h('p', { class: 'ws-fact-text' }, h('strong', {}, `${t('fact.label')}: `), fact),
        source &&
          h(
            'a',
            { class: 'ws-fact-source', href: source, target: '_blank', rel: 'noopener noreferrer' },
            t('fact.source'),
          ),
        h('div', { class: 'ws-fact-actions' }, next),
      );
      el.hidden = false;
      next.focus({ preventScroll: true });
      el.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
    },
    hide() {
      el.hidden = true;
      el.replaceChildren();
    },
  };
}

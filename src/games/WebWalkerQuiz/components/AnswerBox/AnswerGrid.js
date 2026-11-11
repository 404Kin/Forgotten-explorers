import { h } from '../../utils/dom.js';
import { createAnswerBox } from './AnswerBox.js';

/** The four answer boxes as one labelled group. */
export function createAnswerGrid({ t, count = 4, labelledBy, onSelect }) {
  const boxes = Array.from({ length: count }, (_, i) => createAnswerBox({ index: i, t, onSelect }));
  const el = h(
    'div',
    { class: 'ws-answers', role: 'group', 'aria-labelledby': labelledBy },
    boxes.map((b) => b.el),
  );

  return {
    el,
    box: (i) => boxes[i],
    setOptions(options) {
      boxes.forEach((b, i) => b.setOption(options[i] ?? ''));
    },
    lock(value = true) {
      boxes.forEach((b) => b.setLocked(value));
    },
    /** Dim every box that is not highlighted, so the result stands out. */
    dimOthers(keep) {
      boxes.forEach((b, i) => {
        if (!keep.includes(i)) b.setState('dim');
      });
    },
  };
}

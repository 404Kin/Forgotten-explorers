/**
 * Minimal element builder.
 *   h('button', { class: 'x', onClick: fn, 'aria-label': 'y' }, 'text', childEl)
 * Props starting with "on" become listeners; null/false props are skipped.
 */
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value == null || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else el.setAttribute(key, value === true ? '' : String(value));
  }
  append(el, children);
  return el;
}

export function append(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

export const clear = (el) => {
  el.replaceChildren();
  return el;
};

/** Build an element tree from trusted, static SVG/HTML markup written in this repo. */
export function fromMarkup(markup) {
  const tpl = document.createElement('template');
  tpl.innerHTML = markup.trim();
  return tpl.content.firstElementChild;
}

let counter = 0;
export const uniqueId = (prefix = 'ws') => `${prefix}-${++counter}`;

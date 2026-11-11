const TYPING = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/**
 * Maps the 1..max number keys (main row and numpad) to a 0-based index.
 * Returns null for anything else, including modified keys and typing fields.
 */
export function keyToIndex(event, max) {
  if (event.ctrlKey || event.metaKey || event.altKey) return null;
  if (event.target && TYPING.has(event.target.tagName)) return null;
  const n = Number(event.key);
  return Number.isInteger(n) && n >= 1 && n <= max ? n - 1 : null;
}

/** Listens on `target` and calls onPick(index) for number keys. Returns an unbind function. */
export function bindNumberKeys(target, max, onPick) {
  const listener = (event) => {
    const index = keyToIndex(event, max);
    if (index === null) return;
    event.preventDefault();
    onPick(index);
  };
  target.addEventListener('keydown', listener);
  return () => target.removeEventListener('keydown', listener);
}

import { AppError } from './errors.js';
import { normalizeBank } from '../core/questions.js';
import { tx } from '../../../i18n/index.js';

// Lazy: each language bank is its own chunk and is only fetched when needed.
const banks = import.meta.glob('../data/questions.*.json', { import: 'default' });

/**
 * Loads and validates the question bank for a locale, falling back to the
 * fallback locale when no translated bank exists (add questions.<code>.json
 * to translate questions).
 */
export async function loadQuestions({
  locale,
  fallbackLocale = 'en',
  difficulties,
  sources = banks,
}) {
  const pathFor = (code) => `../data/questions.${code}.json`;
  const loader = sources[pathFor(locale)] ?? sources[pathFor(fallbackLocale)];
  if (!loader) throw new AppError('NO_BANK', 'app.errorLoad', { retryable: true });
  try {
    return normalizeBank(await loader(), difficulties).map(localize);
  } catch (cause) {
    throw new AppError('LOAD_FAILED', 'app.errorLoad', { retryable: true, cause });
  }
}

/**
 * English lives in questions.en.json. A language file can override any piece with
 * ww.q.<id>.question, ww.q.<id>.o0..o3 (same order as the English options) and ww.q.<id>.fact.
 * Missing keys keep the English text, so a half-translated bank still works.
 */
function localize(q) {
  const k = `ww.q.${q.id}`;
  return {
    ...q,
    question: tx(`${k}.question`, q.question),
    options: q.options.map((o, i) => tx(`${k}.o${i}`, o)),
    fact: tx(`${k}.fact`, q.fact),
  };
}

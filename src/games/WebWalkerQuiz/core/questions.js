import { shuffle } from './random.js';
import { pickRound } from '../../SmartQuiz/round.js';

/** Order used to top up a game when a difficulty has too few questions. */
const NEAREST = {
  easy: ['easy', 'medium', 'hard'],
  medium: ['medium', 'easy', 'hard'],
  hard: ['hard', 'medium', 'easy'],
};

export function isValidQuestion(q, difficulties) {
  return Boolean(
    q &&
    typeof q.id === 'string' &&
    difficulties.includes(q.difficulty) &&
    typeof q.question === 'string' &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    new Set(q.options).size === 4 &&
    q.options.every((o) => typeof o === 'string' && o.length > 0) &&
    Number.isInteger(q.correct) &&
    q.correct >= 0 &&
    q.correct < 4 &&
    typeof q.fact === 'string',
  );
}

/** Drops malformed entries and duplicate ids so one bad row never breaks a game. */
export function normalizeBank(raw, difficulties) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  return raw.filter((q) => {
    if (!isValidQuestion(q, difficulties) || seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });
}

/** Picks `count` unique questions for a difficulty, shuffled. */
export function selectQuestions(bank, { difficulty, count, rng }) {
  const picked = [];
  for (const level of NEAREST[difficulty] ?? NEAREST.easy) {
    if (picked.length >= count) break;
    const pool = shuffle(
      bank.filter((q) => q.difficulty === level),
      rng,
    );
    picked.push(...pool.slice(0, count - picked.length));
  }
  return shuffle(picked, rng);
}

/** Shuffles options and re-points `correctIndex` at the moved correct answer. */
export function prepareQuestion(q, rng) {
  const order = shuffle([0, 1, 2, 3], rng);
  return {
    id: q.id,
    difficulty: q.difficulty,
    text: q.question,
    options: order.map((i) => q.options[i]),
    correctIndex: order.indexOf(q.correct),
    fact: q.fact,
    source: q.source,
  };
}

/**
 * One round. `state` is the saved per-question progress (see SmartQuiz): missed questions first, then unseen ones,
 * mastered ones only when nothing else is left. Options are shuffled here; the data always keeps the right answer first.
 */
export const prepareGame = (bank, { difficulty, count, rng, state = {} }) =>
  pickRound(bank, state, { difficulty, count, rng }).map((q) => prepareQuestion(q, rng));

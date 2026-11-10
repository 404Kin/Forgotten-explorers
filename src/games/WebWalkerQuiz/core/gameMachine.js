import { scoreAnswer } from './scoring.js';

export const STATUS = Object.freeze({
  IDLE: 'idle',
  ASKING: 'asking',
  FEEDBACK: 'feedback',
  OVER: 'over',
});

export const initialState = (hearts) => ({
  status: STATUS.IDLE,
  questions: [],
  index: 0,
  hearts,
  maxHearts: hearts,
  score: 0,
  streak: 0,
  bestStreak: 0,
  missed: [],
  lastResult: null,
  outcome: null, // 'won' | 'lost' once status is OVER
});

/**
 * Pure transition function. Actions that are not valid in the current status are
 * ignored (same state object returned) so UI double-clicks cannot corrupt a game.
 *
 *  START {questions}  idle|over -> asking
 *  ANSWER {choice}    asking    -> feedback
 *  NEXT               feedback  -> asking | over
 *  RESET              any       -> idle
 */
export function reduce(state, action, config) {
  switch (action.type) {
    case 'START': {
      if (!action.questions?.length) return state;
      return { ...initialState(config.hearts), status: STATUS.ASKING, questions: action.questions };
    }

    case 'ANSWER': {
      if (state.status !== STATUS.ASKING) return state;
      const { choice } = action;
      const question = state.questions[state.index];
      if (!Number.isInteger(choice) || choice < 0 || choice >= question.options.length)
        return state;

      const correct = choice === question.correctIndex;
      if (correct) {
        const streak = state.streak + 1;
        const points = scoreAnswer({ difficulty: question.difficulty, streak }, config.points);
        return {
          ...state,
          status: STATUS.FEEDBACK,
          score: state.score + points.total,
          streak,
          bestStreak: Math.max(state.bestStreak, streak),
          lastResult: { correct: true, choice, points },
        };
      }
      return {
        ...state,
        status: STATUS.FEEDBACK,
        hearts: state.hearts - 1,
        streak: 0,
        missed: [...state.missed, { question, choice }],
        lastResult: { correct: false, choice, points: { base: 0, bonus: 0, total: 0 } },
      };
    }

    case 'NEXT': {
      if (state.status !== STATUS.FEEDBACK) return state;
      if (state.hearts <= 0) return { ...state, status: STATUS.OVER, outcome: 'lost' };
      if (state.index + 1 >= state.questions.length) {
        return { ...state, status: STATUS.OVER, outcome: 'won' };
      }
      return { ...state, status: STATUS.ASKING, index: state.index + 1, lastResult: null };
    }

    case 'RESET':
      return initialState(config.hearts);

    default:
      return state;
  }
}

/** Thin observable wrapper around `reduce`. No DOM, no timers. */
export function createGameMachine(config) {
  let state = initialState(config.hearts);
  const listeners = new Set();

  return {
    getState: () => state,
    currentQuestion: () => state.questions[state.index] ?? null,
    dispatch(action) {
      const next = reduce(state, action, config);
      if (next === state) return state;
      const prev = state;
      state = next;
      listeners.forEach((fn) => fn(state, prev, action));
      return state;
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

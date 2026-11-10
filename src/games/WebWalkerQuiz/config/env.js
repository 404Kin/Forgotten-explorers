import { gameConfig } from './game.config.js';

const num = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};

/**
 * Merge defaults <- VITE_* env values <- runtime options (from mountGame).
 * Pure function: pass `env` explicitly so it is trivially testable.
 */
export function resolveConfig(options = {}, env = import.meta.env ?? {}) {
  const fromEnv = {
    title: env.VITE_GAME_TITLE || undefined,
    characterName: env.VITE_CHARACTER_NAME || undefined,
    defaultLocale: env.VITE_DEFAULT_LOCALE || undefined,
    questionCount: env.VITE_QUESTION_COUNT ? num(env.VITE_QUESTION_COUNT) : undefined,
    hearts: env.VITE_HEARTS ? num(env.VITE_HEARTS) : undefined,
  };
  const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
  return {
    ...gameConfig,
    ...clean(fromEnv),
    ...clean(options),
    points: { ...gameConfig.points, ...options.points },
    timing: { ...gameConfig.timing, ...options.timing },
    colors: { ...gameConfig.colors, ...options.colors },
    sound: { ...gameConfig.sound, ...options.sound },
    storage: { ...gameConfig.storage, ...options.storage },
  };
}

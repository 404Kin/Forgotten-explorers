/**
 * Single source of truth for everything tweakable about the game.
 * Titles/names are plain data; UI text itself lives in src/i18n/locales.
 */
export const gameConfig = {
  rootClass: 'ws-root',
  title: 'Web Walker in Space',
  characterName: 'Zip',

  hearts: 3,
  questionCount: 10,
  defaultDifficulty: 'mixed',
  // What the player can choose before a round. 'mixed' is not a question difficulty, so `difficulties` stays the real three.
  difficulties: ['easy', 'medium', 'hard'],
  choices: ['easy', 'medium', 'hard', 'mixed'],
  defaultLocale: 'en',
  fallbackLocale: 'en',

  points: {
    perDifficulty: { easy: 10, medium: 15, hard: 20 },
    // Extra points per consecutive correct answer beyond the first, capped.
    streakBonusStep: 5,
    streakBonusCap: 20,
  },

  // Timings in ms (all skipped or shortened when reduced motion is on).
  timing: {
    swing: 900,
    snapSwing: 520,
    float: 1600,
    landSettle: 250,
  },

  colors: {
    space: '#070b24',
    panel: '#111a45',
    panelEdge: '#4aa3ff',
    text: '#f4f7ff',
    blue: '#4aa3ff',
    red: '#ff6b6b',
    green: '#4ade80',
    orange: '#ffa94d',
    yellow: '#ffe066',
  },

  sound: { enabledByDefault: true, volume: 0.35 },

  storage: { prefix: 'webWalker' },

  data: { questionsPath: 'questions' },
};

export default gameConfig;

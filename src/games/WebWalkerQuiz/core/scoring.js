/** Bonus grows with each consecutive correct answer after the first, up to a cap. */
export function streakBonus(streak, { streakBonusStep, streakBonusCap }) {
  if (streak <= 1) return 0;
  return Math.min(streakBonusCap, (streak - 1) * streakBonusStep);
}

/** `streak` is the streak length INCLUDING the answer being scored. */
export function scoreAnswer({ difficulty, streak }, pointsConfig) {
  const base = pointsConfig.perDifficulty[difficulty] ?? 0;
  const bonus = streakBonus(streak, pointsConfig);
  return { base, bonus, total: base + bonus };
}

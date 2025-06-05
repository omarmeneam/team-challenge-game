/**
 * Calculate the streak multiplier based on the current streak count.
 * Multiplier increases by 0.2 for each streak up to a maximum of 2.0 (5 streaks).
 *
 * @param {number} streak - Current streak count
 * @returns {number} - Multiplier value between 1.0 and 2.0
 */
export const getStreakMultiplier = (streak) => {
  // Ensure streak is not negative
  const validStreak = Math.max(0, streak);
  // Cap streak bonus at 5 (2.0x multiplier)
  const cappedStreak = Math.min(validStreak, 5);
  // Calculate multiplier: base 1.0 + (0.2 per streak)
  return 1 + (cappedStreak * 0.2);
};

/**
 * Calculate the final score for a question based on base points and streak.
 * The score is multiplied by the streak multiplier and rounded down.
 *
 * @param {number} basePoints - Base points for the question (200/400/600)
 * @param {number} streak - Current streak count
 * @returns {number} - Final score after applying streak multiplier
 */
export const calculateScore = (basePoints, streak) => {
  const multiplier = getStreakMultiplier(streak);
  return Math.floor(basePoints * multiplier);
};

/**
 * Get the point value for a question based on its difficulty.
 *
 * @param {string} difficulty - Question difficulty ('easy', 'medium', 'hard')
 * @returns {number} - Base point value for the difficulty
 */
export const getBasePoints = (difficulty) => {
  const pointValues = {
    easy: 200,
    medium: 400,
    hard: 600
  };
  return pointValues[difficulty] || 200; // Default to easy points if difficulty is invalid
};

/**
 * Format a score number with appropriate separators and animations.
 *
 * @param {number} score - The score to format
 * @returns {string} - Formatted score string
 */
export const formatScore = (score) => {
  return new Intl.NumberFormat('en-US').format(score);
};

/**
 * Calculate the percentile rank of a score within the leaderboard.
 *
 * @param {number} score - The score to rank
 * @param {Array<{score: number}>} leaderboard - Array of leaderboard entries
 * @returns {number} - Percentile rank (0-100)
 */
export const calculatePercentileRank = (score, leaderboard) => {
  if (!leaderboard.length) return 0;
  
  const sortedScores = leaderboard
    .map(entry => entry.score)
    .sort((a, b) => a - b);

  const position = sortedScores.findIndex(s => s >= score);
  if (position === -1) return 100;

  return Math.round((1 - position / sortedScores.length) * 100);
};

/**
 * Get a motivational message based on streak count.
 *
 * @param {number} streak - Current streak count
 * @returns {string} - Motivational message
 */
export const getStreakMessage = (streak) => {
  if (streak === 0) return 'Start your streak!';
  if (streak < 3) return 'Keep it going!';
  if (streak < 5) return 'Youre on fire! 🔥';
  return 'UNSTOPPABLE! 🌟';
};
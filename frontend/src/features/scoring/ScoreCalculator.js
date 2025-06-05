// ScoreCalculator.js - Handles scoring logic and calculations

const STREAK_THRESHOLDS = {
  LEVEL_1: 3,  // 1.2x multiplier
  LEVEL_2: 5,  // 1.5x multiplier
  LEVEL_3: 7   // 2.0x multiplier
};

const STREAK_MULTIPLIERS = {
  [STREAK_THRESHOLDS.LEVEL_1]: 1.2,
  [STREAK_THRESHOLDS.LEVEL_2]: 1.5,
  [STREAK_THRESHOLDS.LEVEL_3]: 2.0
};

const AID_PENALTIES = {
  FIFTY_FIFTY: 0.5,    // 50% penalty
  SKIP: 0.75,          // 75% penalty
  TIME_FREEZE: 0.9     // 10% penalty
};

export const calculateScore = ({
  basePoints,
  streakCount,
  usedAid = null,
  timeRemaining = null,
  maxTime = 45
}) => {
  // Get streak multiplier based on current streak
  let streakMultiplier = 1.0;
  for (const [threshold, multiplier] of Object.entries(STREAK_MULTIPLIERS)) {
    if (streakCount >= parseInt(threshold)) {
      streakMultiplier = multiplier;
    }
  }

  // Apply aid penalty if any aid was used
  let aidMultiplier = 1.0;
  if (usedAid && AID_PENALTIES[usedAid]) {
    aidMultiplier = AID_PENALTIES[usedAid];
  }

  // Calculate time bonus (up to 20% bonus for quick answers)
  let timeMultiplier = 1.0;
  if (timeRemaining !== null && maxTime > 0) {
    const timeBonus = Math.min(0.2, (timeRemaining / maxTime) * 0.2);
    timeMultiplier = 1 + timeBonus;
  }

  // Calculate final score
  const finalScore = Math.round(
    basePoints * streakMultiplier * aidMultiplier * timeMultiplier
  );

  return {
    finalScore,
    breakdown: {
      basePoints,
      streakMultiplier,
      aidMultiplier,
      timeMultiplier
    }
  };
};

export const getStreakLevel = (streakCount) => {
  if (streakCount >= STREAK_THRESHOLDS.LEVEL_3) return 3;
  if (streakCount >= STREAK_THRESHOLDS.LEVEL_2) return 2;
  if (streakCount >= STREAK_THRESHOLDS.LEVEL_1) return 1;
  return 0;
};

export const getNextStreakThreshold = (currentStreak) => {
  const thresholds = Object.values(STREAK_THRESHOLDS).sort((a, b) => a - b);
  return thresholds.find(threshold => threshold > currentStreak) || null;
};

export const formatScore = (score) => {
  return new Intl.NumberFormat().format(score);
};
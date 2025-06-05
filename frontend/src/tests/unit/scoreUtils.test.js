import { calculateScore, getStreakMultiplier } from '../../utils/scoreUtils';

describe('Score Calculation Utilities', () => {
  describe('getStreakMultiplier', () => {
    test('should return 1 for streak of 0', () => {
      expect(getStreakMultiplier(0)).toBe(1);
    });

    test('should return correct multiplier for streaks 1-5', () => {
      expect(getStreakMultiplier(1)).toBe(1.2);
      expect(getStreakMultiplier(2)).toBe(1.4);
      expect(getStreakMultiplier(3)).toBe(1.6);
      expect(getStreakMultiplier(4)).toBe(1.8);
      expect(getStreakMultiplier(5)).toBe(2.0);
    });

    test('should cap multiplier at 2.0 for streaks > 5', () => {
      expect(getStreakMultiplier(6)).toBe(2.0);
      expect(getStreakMultiplier(10)).toBe(2.0);
    });
  });

  describe('calculateScore', () => {
    test('should calculate correct score for different difficulties', () => {
      // Easy question (200 points)
      expect(calculateScore(200, 0)).toBe(200); // No streak
      expect(calculateScore(200, 2)).toBe(280); // 1.4x multiplier
      expect(calculateScore(200, 5)).toBe(400); // 2.0x multiplier

      // Medium question (400 points)
      expect(calculateScore(400, 0)).toBe(400); // No streak
      expect(calculateScore(400, 3)).toBe(640); // 1.6x multiplier
      expect(calculateScore(400, 5)).toBe(800); // 2.0x multiplier

      // Hard question (600 points)
      expect(calculateScore(600, 0)).toBe(600); // No streak
      expect(calculateScore(600, 4)).toBe(1080); // 1.8x multiplier
      expect(calculateScore(600, 5)).toBe(1200); // 2.0x multiplier
    });

    test('should handle edge cases', () => {
      expect(calculateScore(0, 5)).toBe(0); // Zero points
      expect(calculateScore(200, -1)).toBe(200); // Negative streak
      expect(calculateScore(200, 100)).toBe(400); // Very high streak
    });

    test('should round down decimal scores', () => {
      // 250 points with 1.2x multiplier = 300
      expect(calculateScore(250, 1)).toBe(300);
      // 333 points with 1.4x multiplier = 466.2 -> 466
      expect(calculateScore(333, 2)).toBe(466);
    });
  });
});
import React from 'react';
import { motion } from 'framer-motion';
import { getStreakLevel, getNextStreakThreshold } from './ScoreCalculator';

const StreakTracker = ({ streakCount }) => {
  const streakLevel = getStreakLevel(streakCount);
  const nextThreshold = getNextStreakThreshold(streakCount);

  const getStreakColor = () => {
    switch (streakLevel) {
      case 1: return 'var(--success-light)';
      case 2: return 'var(--success)';
      case 3: return 'var(--accent)';
      default: return 'var(--text-secondary)';
    }
  };

  const getMultiplierText = () => {
    switch (streakLevel) {
      case 1: return '1.2x';
      case 2: return '1.5x';
      case 3: return '2.0x';
      default: return '1.0x';
    }
  };

  return (
    <div className="streak-tracker">
      <motion.div
        className="streak-container"
        animate={{
          scale: [1, 1.1, 1],
          transition: { duration: 0.3 }
        }}
        key={streakCount}
      >
        <div className="streak-count" style={{ color: getStreakColor() }}>
          {streakCount}
        </div>
        <div className="streak-label">STREAK</div>
        <div className="multiplier">{getMultiplierText()}</div>
      </motion.div>

      {nextThreshold && (
        <div className="next-threshold">
          {nextThreshold - streakCount} more to {getMultiplierText(streakLevel + 1)}
        </div>
      )}

      <div className="streak-indicators">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`indicator ${index < streakLevel ? 'active' : ''} ${
              index === streakLevel ? 'next' : ''
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        .streak-tracker {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background-color: var(--background-secondary);
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .streak-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .streak-count {
          font-size: 3rem;
          font-weight: bold;
          line-height: 1;
        }

        .streak-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          letter-spacing: 0.1em;
        }

        .multiplier {
          font-size: 1.25rem;
          font-weight: bold;
          color: var(--primary);
        }

        .next-threshold {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .streak-indicators {
          display: flex;
          gap: 0.25rem;
          margin-top: 0.5rem;
        }

        .indicator {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background-color: var(--text-disabled);
          transition: all 0.2s ease;
        }

        .indicator.active {
          background-color: var(--success);
        }

        .indicator.next {
          background-color: var(--primary-light);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default StreakTracker;
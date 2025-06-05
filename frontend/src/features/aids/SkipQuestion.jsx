import React from 'react';
import { motion } from 'framer-motion';

const SkipQuestion = ({ remainingUses, isEnabled, onClick }) => {
  const handleClick = () => {
    if (isEnabled && remainingUses > 0) {
      onClick();
    }
  };

  return (
    <motion.button
      className="skip-aid"
      onClick={handleClick}
      disabled={!isEnabled || remainingUses === 0}
      whileHover={{ scale: isEnabled && remainingUses > 0 ? 1.05 : 1 }}
      whileTap={{ scale: isEnabled && remainingUses > 0 ? 0.95 : 1 }}
    >
      <div className="aid-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="icon"
        >
          <path d="M5.055 7.06C3.805 8.347 3 10.093 3 12c0 4.418 3.582 8 8 8 1.907 0 3.653-.805 4.94-2.055l-2.093-2.093C13.125 16.55 12.125 17 11 17c-2.757 0-5-2.243-5-5 0-1.125.45-2.125 1.148-2.847L5.055 7.06Zm13.89 9.88C20.195 15.653 21 13.907 21 12c0-4.418-3.582-8-8-8-1.907 0-3.653.805-4.94 2.055l2.093 2.093C10.875 7.45 11.875 7 13 7c2.757 0 5 2.243 5 5 0 1.125-.45 2.125-1.148 2.847l2.093 2.093ZM4.879 5.879l14.242 14.242 1.414-1.414L6.293 4.464 4.879 5.879Z" />
        </svg>
      </div>
      <div className="aid-info">
        <span className="aid-name">Skip Question</span>
        <span className="aid-count">{remainingUses} remaining</span>
      </div>
    </motion.button>
  );
};

export default SkipQuestion;
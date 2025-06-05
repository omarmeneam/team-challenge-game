import React from 'react';
import { motion } from 'framer-motion';

const TimeFreeze = ({ remainingUses, isEnabled, onClick }) => {
  const handleClick = () => {
    if (isEnabled && remainingUses > 0) {
      onClick();
    }
  };

  return (
    <motion.button
      className="time-freeze-aid"
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
          <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0 18c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm3.707-11.707a1 1 0 00-1.414 0L11 11.586V7a1 1 0 10-2 0v5a1 1 0 00.293.707l4 4a1 1 0 001.414-1.414L11.414 12l3.293-3.293a1 1 0 000-1.414z" />
        </svg>
      </div>
      <div className="aid-info">
        <span className="aid-name">Time Freeze</span>
        <span className="aid-count">{remainingUses} remaining</span>
      </div>
    </motion.button>
  );
};

export default TimeFreeze;
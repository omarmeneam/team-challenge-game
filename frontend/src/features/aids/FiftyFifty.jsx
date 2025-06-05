import React from 'react';
import { motion } from 'framer-motion';

const FiftyFifty = ({ remainingUses, isEnabled, onClick }) => {
  const handleClick = () => {
    if (isEnabled && remainingUses > 0) {
      onClick();
    }
  };

  return (
    <motion.button
      className="aid-button fifty-fifty-aid"
      onClick={handleClick}
      disabled={!isEnabled || remainingUses === 0}
      whileHover={{ scale: isEnabled && remainingUses > 0 ? 1.05 : 1 }}
      whileTap={{ scale: isEnabled && remainingUses > 0 ? 0.95 : 1 }}
    >
      <div className="aid-icon">50:50</div>
      <div className="aid-info">
        <span className="aid-name">Fifty-Fifty</span>
        <span className="aid-count">{remainingUses} remaining</span>
      </div>
    </motion.button>
  );
};

export default FiftyFifty;
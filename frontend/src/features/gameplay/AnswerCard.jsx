import React from 'react';
import { motion } from 'framer-motion';

const AnswerCard = ({ option, index, isSelected, isCorrect, isRevealed, onSelect, disabled }) => {
  const getClassName = () => {
    const baseClass = 'answer-card';
    if (!isRevealed) return `${baseClass} ${isSelected ? 'selected' : ''}`;
    if (isCorrect) return `${baseClass} correct`;
    return `${baseClass} ${isSelected ? 'incorrect' : ''}`;
  };

  return (
    <motion.button
      className={getClassName()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => !disabled && onSelect(index)}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <span className="option-letter">{String.fromCharCode(65 + index)}</span>
      <span className="option-text">{option}</span>
    </motion.button>
  );
};

export default AnswerCard;
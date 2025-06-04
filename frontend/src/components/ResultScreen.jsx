import React from 'react';

const ResultScreen = ({ isCorrect, correctAnswer, onNext }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h2 style={{ color: isCorrect ? 'green' : 'red' }}>
        {isCorrect ? '✅ Correct!' : '❌ Wrong!'}
      </h2>
      {!isCorrect && (
        <p style={{ fontSize: '18px' }}>
          The correct answer was: <strong>{correctAnswer}</strong>
        </p>
      )}
      <button
        onClick={onNext}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginTop: '20px',
          cursor: 'pointer',
        }}
      >
        Next Question
      </button>
    </div>
  );
};

export default ResultScreen;
// This component displays the result of the user's answer.
// It shows whether the answer was correct or wrong, and provides the correct answer if the user was wrong.
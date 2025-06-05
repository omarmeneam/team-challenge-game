import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const Timer = ({ duration, isPlaying, onComplete }) => {
  const formatTime = (remainingTime) => {
    if (remainingTime === 0) {
      return "Time's up!";
    }
    return remainingTime;
  };

  return (
    <div className="timer-container">
      <CountdownCircleTimer
        isPlaying={isPlaying}
        duration={duration}
        colors={['#2563eb', '#059669', '#dc2626']}
        colorsTime={[duration, duration/2, 10]}
        onComplete={onComplete}
        size={120}
      >
        {({ remainingTime }) => (
          <div className="timer-display">
            <span className="time">{formatTime(remainingTime)}</span>
            <span className="label">seconds</span>
          </div>
        )}
      </CountdownCircleTimer>
    </div>
  );
};

export default Timer;
import React, { useState, useEffect, useCallback } from 'react';

const QuestionTimer = ({ duration = 45, onTimeUp, isPaused = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  // Progress calculation for the timer animation
  const progress = (timeLeft / duration) * 100;
  
  // Dynamic color based on time remaining
  const getTimerColor = useCallback(() => {
    if (progress > 66) return '#4CAF50';
    if (progress > 33) return '#FFC107';
    return '#F44336';
  }, [progress]);

  useEffect(() => {
    let timer;

    if (isActive && !isPaused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsActive(false);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, isPaused, timeLeft, onTimeUp]);

  return (
    <div className="question-timer">
      <svg className="timer-circle" viewBox="0 0 100 100">
        <circle
          className="timer-background"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#ddd"
          strokeWidth="8"
        />
        <circle
          className="timer-progress"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getTimerColor()}
          strokeWidth="8"
          strokeDasharray={`${2 * Math.PI * 45}`}
          strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="50"
          dy=".3em"
          textAnchor="middle"
          className="timer-text"
          fill={getTimerColor()}
        >
          {timeLeft}
        </text>
      </svg>

      <style jsx>{`
        .question-timer {
          width: 100px;
          height: 100px;
          margin: 20px auto;
        }

        .timer-circle {
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
        }

        .timer-progress {
          transition: stroke-dashoffset 0.3s ease;
        }

        .timer-text {
          font-size: 24px;
          font-weight: bold;
          transform: rotate(90deg);
          transform-origin: 50% 50%;
        }
      `}</style>
    </div>
  );
};

export default QuestionTimer;
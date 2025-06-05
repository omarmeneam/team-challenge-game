import React, { useState } from 'react';

const GameInterface = ({ teamName }) => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  return (
    <div className="game-container">
      <header className="game-header">
        <div className="team-info">
          <h2>{teamName}</h2>
          <div className="stats">
            <div className="stat-item">
              <span className="label">Score:</span>
              <span className="value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="label">Streak:</span>
              <span className="value">{streak}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="game-content">
        <div className="welcome-message">
          <h1>Welcome to Team Challenge Game!</h1>
          <p>Get ready to test your knowledge and compete with other teams.</p>
          <button className="start-button">Start New Game</button>
        </div>
      </main>

      <style jsx>{`
        .game-container {
          min-height: 100vh;
          background-color: #f3f4f6;
        }

        .game-header {
          background-color: #2563eb;
          color: white;
          padding: 1rem 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .team-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .team-info h2 {
          font-size: 1.5rem;
          margin: 0;
        }

        .stats {
          display: flex;
          gap: 2rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .label {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .value {
          font-size: 1.25rem;
          font-weight: bold;
        }

        .game-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .welcome-message {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          margin-top: 2rem;
        }

        .welcome-message h1 {
          color: #1e40af;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .welcome-message p {
          color: #4b5563;
          font-size: 1.125rem;
          margin-bottom: 2rem;
        }

        .start-button {
          background-color: #2563eb;
          color: white;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .start-button:hover {
          background-color: #1d4ed8;
        }

        .start-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5);
        }
      `}</style>
    </div>
  );
};

export default GameInterface;
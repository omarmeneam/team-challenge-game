import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LoginPage = ({ onLogin }) => {
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (teamName.trim().length < 3) {
      setError('Team name must be at least 3 characters long');
      return;
    }

    onLogin(teamName.trim());
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Team Challenge Game</h1>
        <p>Enter your team name to start playing!</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
                setError('');
              }}
              placeholder="Enter team name"
              autoFocus
            />
            {error && <span className="error">{error}</span>}
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Game
          </motion.button>
        </form>
      </motion.div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background-color: var(--background-primary);
        }

        .login-card {
          background-color: var(--background-secondary);
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        h1 {
          color: var(--primary);
          margin-bottom: 1rem;
          font-size: 2rem;
        }

        p {
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: 0.5rem;
          font-size: 1rem;
          background-color: var(--background-primary);
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-light);
        }

        .error {
          color: var(--error);
          font-size: 0.875rem;
          margin-top: 0.5rem;
          display: block;
        }

        button {
          width: 100%;
          padding: 0.75rem 1.5rem;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        button:hover {
          background-color: var(--primary-dark);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
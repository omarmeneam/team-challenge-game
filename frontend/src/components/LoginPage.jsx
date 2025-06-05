import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = teamName.trim();
    
    if (trimmedName.length < 3) {
      setError('Team name must be at least 3 characters long');
      return;
    }
    
    setError('');
    onLogin(trimmedName);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Team Challenge Game</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="teamName">Enter Team Name</label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team Name"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Start Game
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #6366f1 0%, #2563eb 100%);
          padding: 20px;
        }

        .login-card {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        h1 {
          color: #1e40af;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4b5563;
          font-weight: 500;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: border-color 0.15s ease;
        }

        input:focus {
          border-color: #2563eb;
          outline: none;
        }

        .error-message {
          color: #dc2626;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .login-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .login-button:hover {
          background-color: #1d4ed8;
        }

        .login-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
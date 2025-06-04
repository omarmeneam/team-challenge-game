import React, { useState } from 'react';

const StartScreen = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) return;
    onStart(trimmed);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to Seen Game 🇪🇬</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Start Game</button>
      </form>
    </div>
  );
};

export default StartScreen;
// This component is the starting screen of the game.
// It prompts the user to enter their name and starts the game when the form is submitted.
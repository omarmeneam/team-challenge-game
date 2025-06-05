import React, { useState } from 'react';
import LoginPage from './LoginPage';
import QuestionEngine from './features/gameplay/QuestionEngine';
import FiftyFifty from './features/aids/FiftyFifty';
import SkipQuestion from './features/aids/SkipQuestion';
import TimeFreeze from './features/aids/TimeFreeze';
import StreakTracker from './features/scoring/StreakTracker';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [aids, setAids] = useState({
    fiftyFifty: 2,
    skip: 2,
    timeFreeze: 2
  });

  const handleLogin = (name) => {
    setTeamName(name);
    setIsLoggedIn(true);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleUseAid = (aidType) => {
    setAids(prev => ({
      ...prev,
      [aidType]: prev[aidType] - 1
    }));
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <header className="game-header">
        <h1>Team Challenge Game</h1>
        <div className="team-info">
          <span className="team-name">Team: {teamName}</span>
        </div>
      </header>

      <main className="game-content">
        {!gameStarted ? (
          <div className="start-screen">
            <h2>Welcome, Team {teamName}!</h2>
            <p>Ready to test your knowledge? You'll have:</p>
            <ul>
              <li>10 questions of increasing difficulty</li>
              <li>45 seconds per question</li>
              <li>Streak bonuses for consecutive correct answers</li>
              <li>3 types of help aids to use strategically</li>
            </ul>
            <button className="start-button" onClick={handleStartGame}>
              Start Game
            </button>
          </div>
        ) : (
          <div className="game-interface">
            <div className="aids-container">
              <FiftyFifty
                remainingUses={aids.fiftyFifty}
                isEnabled={true}
                onClick={() => handleUseAid('fiftyFifty')}
              />
              <SkipQuestion
                remainingUses={aids.skip}
                isEnabled={true}
                onClick={() => handleUseAid('skip')}
              />
              <TimeFreeze
                remainingUses={aids.timeFreeze}
                isEnabled={true}
                onClick={() => handleUseAid('timeFreeze')}
              />
            </div>

            <StreakTracker streakCount={streak} />

            <QuestionEngine
              onStreakUpdate={setStreak}
              availableAids={aids}
              onUseAid={handleUseAid}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
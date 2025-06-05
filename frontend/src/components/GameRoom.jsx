import React, { useState, useEffect } from 'react';
import { supabase, supabaseHelpers } from '../lib/supabaseClient';
import QuestionTimer from './QuestionTimer';
import TeamDashboard from './TeamDashboard';
import AnimatedLeaderboard from './AnimatedLeaderboard';

const GameRoom = ({ teamId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, playing, finished

  const getDifficulty = (questionNumber) => {
    if (questionNumber <= 12) return 'easy';
    if (questionNumber <= 24) return 'medium';
    return 'hard';
  };

  const loadNextQuestion = async () => {
    if (questionNumber > 36) {
      setGameStatus('finished');
      return;
    }

    const difficulty = getDifficulty(questionNumber);
    const { data: question, error } = await supabaseHelpers.getRandomQuestion(difficulty);

    if (error) {
      console.error('Error loading question:', error);
      return;
    }

    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setIsTimerPaused(false);
  };

  const handleAnswerSelect = async (answer) => {
    setSelectedAnswer(answer);
    setIsTimerPaused(true);

    const isCorrect = answer === currentQuestion.correct_answer;
    const points = {
      easy: 200,
      medium: 400,
      hard: 600
    }[currentQuestion.difficulty];

    if (isCorrect) {
      await supabaseHelpers.updateTeamScore(teamId, points);
    } else {
      await supabaseHelpers.resetStreak(teamId);
    }

    // Wait 2 seconds before loading next question
    setTimeout(() => {
      setQuestionNumber(prev => prev + 1);
      loadNextQuestion();
    }, 2000);
  };

  const handleTimeUp = () => {
    if (!selectedAnswer) {
      supabaseHelpers.resetStreak(teamId);
      setTimeout(() => {
        setQuestionNumber(prev => prev + 1);
        loadNextQuestion();
      }, 1000);
    }
  };

  useEffect(() => {
    if (gameStatus === 'playing') {
      loadNextQuestion();
    }
  }, [gameStatus]);

  if (gameStatus === 'waiting') {
    return (
      <div className="game-start">
        <h2>Ready to Play?</h2>
        <button onClick={() => setGameStatus('playing')}>
          Start Game
        </button>
      </div>
    );
  }

  if (gameStatus === 'finished') {
    return (
      <div className="game-end">
        <h2>Game Complete! 🎉</h2>
        <AnimatedLeaderboard />
      </div>
    );
  }

  return (
    <div className="game-room">
      <div className="game-header">
        <TeamDashboard teamId={teamId} />
        <div className="question-counter">
          Question {questionNumber}/36
        </div>
      </div>

      {currentQuestion && (
        <div className="question-section">
          <QuestionTimer
            onTimeUp={handleTimeUp}
            isPaused={isTimerPaused}
          />
          
          <div className="question-card">
            <h3>{currentQuestion.question}</h3>
            <div className="answers-grid">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(answer)}
                  disabled={selectedAnswer !== null}
                  className={`answer-button 
                    ${selectedAnswer === answer ? 
                      (answer === currentQuestion.correct_answer ? 'correct' : 'incorrect') 
                      : ''}`
                  }
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .game-room {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .question-counter {
          font-size: 18px;
          font-weight: bold;
          color: #666;
        }

        .question-section {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .question-card h3 {
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
        }

        .answers-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 20px;
        }

        .answer-button {
          padding: 15px;
          border: 2px solid #ddd;
          border-radius: 10px;
          background: white;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .answer-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .answer-button.correct {
          background: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }

        .answer-button.incorrect {
          background: #F44336;
          color: white;
          border-color: #F44336;
        }

        .answer-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default GameRoom;
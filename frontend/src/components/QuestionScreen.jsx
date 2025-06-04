import React, { useEffect, useState } from 'react';
import { getRandomQuestion } from '../services/gameAPI';

const TOTAL_QUESTIONS = 5;
const TIME_LIMIT = 15;

const QuestionScreen = ({ playerName, onFinish }) => {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

  useEffect(() => {
    loadQuestion();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleAnswer(null); // Time's up
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const loadQuestion = async () => {
    const q = await getRandomQuestion();
    setQuestion(q);
    setSelected(null);
    setFeedback('');
    setTimeLeft(TIME_LIMIT);
  };

  const handleAnswer = (choice) => {
    if (selected !== null) return; // prevent double clicks
    setSelected(choice);

    const correct = choice === question.correctAnswer;
    if (correct) {
      setFeedback('Correct! 🎉');
      setScore(s => s + 1);
    } else {
      setFeedback(`Wrong! ❌ Correct answer: ${question.correctAnswer}`);
    }

    setTimeout(() => {
      if (questionCount + 1 >= TOTAL_QUESTIONS) {
        onFinish(score + (correct ? 1 : 0));
      } else {
        setQuestionCount(c => c + 1);
        loadQuestion();
      }
    }, 2000);
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Question {questionCount + 1}/{TOTAL_QUESTIONS}</h2>
      <p><strong>Time Left:</strong> {timeLeft} seconds</p>
      <h3>{question.text}</h3>
      <div>
        {question.choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(choice)}
            disabled={selected !== null}
            style={{ display: 'block', margin: '8px 0' }}
          >
            {choice}
          </button>
        ))}
      </div>
      {feedback && <p><strong>{feedback}</strong></p>}
    </div>
  );
};

export default QuestionScreen;
// This component displays a question to the player.
// It handles the player's answer, provides feedback, and tracks the score and time left for each question.
// components/QuestionCard.jsx
import React, { useEffect, useState } from 'react';
import ResultScreen from './ResultScreen';
import { fetchRandomQuestion } from '../services/questionAPI'; // API لتحميل سؤال عشوائي

const QuestionCard = () => {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState('');
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const getQuestion = async () => {
    const q = await fetchRandomQuestion();
    setQuestion(q);
    setSelected('');
    setAnswered(false);
    setShowResult(false);
  };

  useEffect(() => {
    getQuestion();
  }, []);

  const handleAnswer = (choice) => {
    setSelected(choice);
    setAnswered(true);
    const correct = choice === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  if (!question) return <p>Loading question...</p>;

  if (showResult) {
    return (
      <ResultScreen
        isCorrect={isCorrect}
        correctAnswer={question.correctAnswer}
        onNext={() => {
          setShowResult(false);
          setSelected('');
          setAnswered(false);
          fetchQuestion(); // سؤال جديد
        }}
      />
    );
  }


  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>{question.question}</h2>
      <div>
        {[question.option_a, question.option_b, question.option_c, question.option_d].map((opt, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(opt)}
            disabled={answered}
            style={{
              display: 'block',
              margin: '10px 0',
              padding: '10px',
              backgroundColor: selected === opt ? '#ccc' : '#f0f0f0',
              cursor: answered ? 'not-allowed' : 'pointer',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
// This component displays a question card with multiple choice answers.
// It handles the logic for selecting an answer, showing results, and fetching a new question.
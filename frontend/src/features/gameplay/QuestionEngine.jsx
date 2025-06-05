import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timer from './Timer';
import AnswerCard from './AnswerCard';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const QuestionEngine = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTimerPlaying, setIsTimerPlaying] = useState(true);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First check if we can access the table
      const { error: tableError } = await supabase
        .from('questions')
        .select('count');

      if (tableError) {
        console.error('Table error:', tableError);
        throw new Error('Unable to access questions table. Please ensure the database is properly set up.');
      }

      // If table exists, fetch the questions
      const { data, error } = await supabase
        .from('questions')
        .select('id, text, options, correct_index, difficulty')
        .limit(10);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No questions available. Please add some questions to the database.');
      }

      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (index) => {
    if (isRevealed) return;
    
    setSelectedAnswer(index);
    setIsRevealed(true);
    setIsTimerPlaying(false);
    
    const isCorrect = index === currentQuestion.correct_index;
    updateScore(isCorrect);
    
    setTimeout(() => moveToNextQuestion(), 2000);
  };

  const handleTimeUp = () => {
    setIsRevealed(true);
    setStreak(0);
    setTimeout(() => moveToNextQuestion(), 2000);
  };

  const updateScore = (isCorrect) => {
    if (!isCorrect) {
      setStreak(0);
      return;
    }

    const basePoints = currentQuestion.difficulty || 200;
    let multiplier = 1;
    
    if (streak >= 9) {
      multiplier = 2.0;
    } else if (streak >= 6) {
      multiplier = 1.5;
    } else if (streak >= 3) {
      multiplier = 1.2;
    }
    
    setStreak(streak + 1);
    const points = Math.round(basePoints * multiplier);
    setScore(score + points);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsRevealed(false);
      setIsTimerPlaying(true);
    } else {
      // Game Over logic here
      console.log('Game Over! Final Score:', score);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <div>Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchQuestions} className="retry-button">Retry</button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="loading-container">
        <div className="error-message">No questions available</div>
      </div>
    );
  };

  return (
    <div className="question-engine">
      <div className="stats">
        <div className="score">Score: {score}</div>
        <div className="streak">Streak: {streak}</div>
      </div>

      <Timer
        duration={45}
        isPlaying={isTimerPlaying}
        onComplete={handleTimeUp}
      />

      <motion.div
        className="question"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={currentQuestionIndex}
      >
        <h2>{currentQuestion.text}</h2>
        
        <div className="options">
          {JSON.parse(currentQuestion.options).map((option, index) => (
            <AnswerCard
              key={index}
              answer={option}
              isSelected={selectedAnswer === index}
              isRevealed={isRevealed}
              isCorrect={index === currentQuestion.correct_index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isRevealed}
            />
          ))}
        </div>
      </motion.div>

      <div className="progress">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>

    </div>
  );
};

export default QuestionEngine;
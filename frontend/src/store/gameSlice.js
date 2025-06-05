import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  streak: 0,
  aids: {
    fiftyFifty: 2,
    skip: 2,
    timeFreeze: 2
  },
  gameStatus: 'idle', // 'idle' | 'loading' | 'playing' | 'finished'
  error: null,
  timeRemaining: 45,
  isTimerPaused: false
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
      state.gameStatus = 'playing';
    },
    setGameStatus: (state, action) => {
      state.gameStatus = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    submitAnswer: (state, action) => {
      const { isCorrect, timeRemaining } = action.payload;
      const currentQuestion = state.questions[state.currentQuestionIndex];
      
      if (isCorrect) {
        // Calculate score with streak bonus
        const basePoints = currentQuestion.difficulty;
        const streakBonus = state.streak >= 3 ? 1.2 : 1;
        const timeBonus = Math.min(0.2, (timeRemaining / 45) * 0.2);
        const points = Math.round(basePoints * streakBonus * (1 + timeBonus));
        
        state.score += points;
        state.streak += 1;
      } else {
        state.streak = 0;
      }

      // Move to next question
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      } else {
        state.gameStatus = 'finished';
      }
    },
    useAid: (state, action) => {
      const { aidType } = action.payload;
      if (state.aids[aidType] > 0) {
        state.aids[aidType] -= 1;
        
        // Apply aid effects
        switch (aidType) {
          case 'timeFreeze':
            state.timeRemaining += 15;
            break;
          case 'skip':
            if (state.currentQuestionIndex < state.questions.length - 1) {
              state.currentQuestionIndex += 1;
            }
            break;
          // fiftyFifty effect is handled in the component
          default:
            break;
        }
      }
    },
    updateTimer: (state, action) => {
      state.timeRemaining = action.payload;
    },
    pauseTimer: (state) => {
      state.isTimerPaused = true;
    },
    resumeTimer: (state) => {
      state.isTimerPaused = false;
    },
    resetGame: () => initialState
  }
});

export const {
  setQuestions,
  setGameStatus,
  setError,
  submitAnswer,
  useAid,
  updateTimer,
  pauseTimer,
  resumeTimer,
  resetGame
} = gameSlice.actions;

// Selectors
export const selectQuestions = (state) => state.game.questions;
export const selectCurrentQuestion = (state) => 
  state.game.questions[state.game.currentQuestionIndex];
export const selectGameStatus = (state) => state.game.gameStatus;
export const selectScore = (state) => state.game.score;
export const selectStreak = (state) => state.game.streak;
export const selectAids = (state) => state.game.aids;
export const selectTimeRemaining = (state) => state.game.timeRemaining;
export const selectIsTimerPaused = (state) => state.game.isTimerPaused;

export default gameSlice.reducer;
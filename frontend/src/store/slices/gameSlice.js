import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentQuestion: null,
  questionNumber: 0,
  timeRemaining: 45,
  gameStatus: 'waiting', // waiting, playing, finished
  helpAids: {
    skip: 3,
    fiftyFifty: 3,
    timeFreeze: 3
  },
  score: 0,
  streak: 0
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
      state.questionNumber += 1;
      state.timeRemaining = 45;
    },
    updateTimer: (state) => {
      if (state.timeRemaining > 0 && !state.isTimerPaused) {
        state.timeRemaining -= 1;
      }
    },
    pauseTimer: (state) => {
      state.isTimerPaused = true;
    },
    resumeTimer: (state) => {
      state.isTimerPaused = false;
    },
    useHelpAid: (state, action) => {
      const { type } = action.payload;
      if (state.helpAids[type] > 0) {
        state.helpAids[type] -= 1;
      }
    },
    updateScore: (state, action) => {
      const { basePoints, isCorrect } = action.payload;
      if (isCorrect) {
        // Calculate streak bonus (20% per streak, max 5x)
        const streakMultiplier = 1 + Math.min(state.streak, 5) * 0.2;
        state.score += Math.floor(basePoints * streakMultiplier);
        state.streak += 1;
      } else {
        state.streak = 0;
      }
    },
    setGameStatus: (state, action) => {
      state.gameStatus = action.payload;
      if (action.payload === 'playing') {
        state.questionNumber = 0;
        state.score = 0;
        state.streak = 0;
        state.helpAids = {
          skip: 3,
          fiftyFifty: 3,
          timeFreeze: 3
        };
      }
    },
    resetGame: (state) => {
      return { ...initialState };
    }
  }
});

export const {
  setCurrentQuestion,
  updateTimer,
  pauseTimer,
  resumeTimer,
  useHelpAid,
  updateScore,
  setGameStatus,
  resetGame
} = gameSlice.actions;

// Selectors
export const selectCurrentQuestion = (state) => state.game.currentQuestion;
export const selectQuestionNumber = (state) => state.game.questionNumber;
export const selectTimeRemaining = (state) => state.game.timeRemaining;
export const selectGameStatus = (state) => state.game.gameStatus;
export const selectHelpAids = (state) => state.game.helpAids;
export const selectScore = (state) => state.game.score;
export const selectStreak = (state) => state.game.streak;

export default gameSlice.reducer;
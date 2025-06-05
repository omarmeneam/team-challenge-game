import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import teamsReducer from './slices/teamsSlice';
import leaderboardReducer from './slices/leaderboardSlice';
import { supabaseErrorMiddleware } from './supabaseListener';

const store = configureStore({
  reducer: {
    game: gameReducer,
    teams: teamsReducer,
    leaderboard: leaderboardReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization check
        ignoredActions: ['teams/updateTeamData', 'leaderboard/updateRankings'],
        // Ignore these field paths in state for serialization check
        ignoredPaths: ['teams.currentTeam.created_at', 'leaderboard.lastUpdate']
      }
    }).concat(supabaseErrorMiddleware)
});

// Type definitions for TypeScript
/** @typedef {ReturnType<typeof store.getState>} RootState */
/** @typedef {typeof store.dispatch} AppDispatch */

export default store;
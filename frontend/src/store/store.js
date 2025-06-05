import { configureStore } from '@reduxjs/toolkit';
import gameReducer, { setQuestions, setGameStatus, setError } from './gameSlice';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with Vite environment variables
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

// Configure Redux store
export const store = configureStore({
  reducer: {
    game: gameReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in actions
        ignoredActions: ['game/setQuestions'],
        // Ignore non-serializable paths in state
        ignoredPaths: ['game.questions']
      }
    })
});

// Create async thunk for fetching questions
export const fetchQuestions = () => async (dispatch) => {
  try {
    dispatch(setGameStatus('loading'));

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('difficulty', { ascending: true })
      .limit(10);

    if (error) throw error;

    dispatch(setQuestions(data));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setGameStatus('error'));
  }
};

// Create async thunk for updating leaderboard
export const updateLeaderboard = (teamName, score) => async () => {
  try {
    const { error } = await supabase
      .from('leaderboard')
      .upsert([
        {
          team_name: teamName,
          score: score,
          updated_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
};

// Subscribe to leaderboard changes
export const subscribeToLeaderboard = (callback) => {
  const subscription = supabase
    .from('leaderboard')
    .on('*', (payload) => {
      callback(payload);
    })
    .subscribe();

  return () => {
    supabase.removeSubscription(subscription);
  };
};
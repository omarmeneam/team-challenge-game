import { supabase } from '../lib/supabaseClient';
import { setCurrentTeam, updateTeams } from './slices/teamsSlice';
import { updateRankings } from './slices/leaderboardSlice';

export const setupSupabaseListeners = (store) => {
  // Listen for team score updates
  const teamScoreChannel = supabase
    .channel('team-scores')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'teams',
        filter: `score:gt.0`
      },
      (payload) => {
        // Update both teams and leaderboard state
        store.dispatch(setCurrentTeam(payload.new));
        store.dispatch(updateTeams([payload.new]));
        store.dispatch(updateRankings([{
          teamId: payload.new.id,
          score: payload.new.score,
          streak: payload.new.streak
        }]));
      }
    )
    .subscribe();

  // Listen for help aid usage
  const helpAidChannel = supabase
    .channel('help-aids')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'teams',
        filter: `help_aids:not.is.null`
      },
      (payload) => {
        store.dispatch(setCurrentTeam(payload.new));
      }
    )
    .subscribe();

  return () => {
    teamScoreChannel.unsubscribe();
    helpAidChannel.unsubscribe();
  };
};

export const supabaseErrorMiddleware = () => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    if (error.message.includes('Supabase')) {
      console.error('Supabase Error:', error);
      // You could dispatch an action here to show a notification
    }
    throw error;
  }
};
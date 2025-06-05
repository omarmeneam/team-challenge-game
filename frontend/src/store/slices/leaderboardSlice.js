import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';

// Async thunk for fetching leaderboard data
export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data;
  }
);

const initialState = {
  rankings: [],
  topScore: 0,
  lastUpdate: null,
  status: 'idle',
  error: null
};

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    updateRankings: (state, action) => {
      state.rankings = action.payload.sort((a, b) => b.score - a.score);
      state.topScore = state.rankings[0]?.score || 0;
      state.lastUpdate = new Date().toISOString();
    },
    updateTeamScore: (state, action) => {
      const { teamId, score, streak } = action.payload;
      const teamIndex = state.rankings.findIndex(team => team.id === teamId);
      
      if (teamIndex !== -1) {
        state.rankings[teamIndex] = {
          ...state.rankings[teamIndex],
          score,
          streak
        };
        // Re-sort rankings
        state.rankings.sort((a, b) => b.score - a.score);
        state.topScore = state.rankings[0]?.score || 0;
        state.lastUpdate = new Date().toISOString();
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rankings = action.payload;
        state.topScore = action.payload[0]?.score || 0;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { updateRankings, updateTeamScore } = leaderboardSlice.actions;

// Selectors
export const selectLeaderboardRankings = (state) => state.leaderboard.rankings;
export const selectTopScore = (state) => state.leaderboard.topScore;
export const selectLastUpdate = (state) => state.leaderboard.lastUpdate;
export const selectLeaderboardStatus = (state) => state.leaderboard.status;

// Utility selector for team ranking
export const selectTeamRank = (teamId) => (state) => {
  const rankings = state.leaderboard.rankings;
  return rankings.findIndex(team => team.id === teamId) + 1;
};

// Utility selector for percentile ranking
export const selectTeamPercentile = (teamId) => (state) => {
  const rankings = state.leaderboard.rankings;
  const teamIndex = rankings.findIndex(team => team.id === teamId);
  if (teamIndex === -1) return 0;
  return ((rankings.length - teamIndex) / rankings.length) * 100;
};

export default leaderboardSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';

// Async thunks for team operations
export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (teamName) => {
    const { data, error } = await supabase
      .from('teams')
      .insert([{ name: teamName }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

export const updateTeamScore = createAsyncThunk(
  'teams/updateScore',
  async ({ teamId, points, streak }) => {
    const streakMultiplier = 1 + Math.min(streak, 5) * 0.2;
    const finalPoints = Math.floor(points * streakMultiplier);

    const { data, error } = await supabase
      .from('teams')
      .update({
        score: supabase.raw(`score + ${finalPoints}`),
        streak: streak + 1
      })
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

export const useHelpAid = createAsyncThunk(
  'teams/useHelpAid',
  async ({ teamId, aidType }) => {
    const { data, error } = await supabase
      .from('teams')
      .update({
        [`${aidType}_aids_remaining`]: supabase.raw(`${aidType}_aids_remaining - 1`)
      })
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

const initialState = {
  currentTeam: null,
  allTeams: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: null
};

export const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setCurrentTeam: (state, action) => {
      state.currentTeam = action.payload;
    },
    updateTeamData: (state, action) => {
      const updatedTeam = action.payload;
      state.allTeams = state.allTeams.map(team =>
        team.id === updatedTeam.id ? updatedTeam : team
      );
      if (state.currentTeam?.id === updatedTeam.id) {
        state.currentTeam = updatedTeam;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Create team cases
      .addCase(createTeam.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTeam = action.payload;
        state.allTeams.push(action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Update score cases
      .addCase(updateTeamScore.fulfilled, (state, action) => {
        const updatedTeam = action.payload;
        state.allTeams = state.allTeams.map(team =>
          team.id === updatedTeam.id ? updatedTeam : team
        );
        if (state.currentTeam?.id === updatedTeam.id) {
          state.currentTeam = updatedTeam;
        }
      })
      // Use help aid cases
      .addCase(useHelpAid.fulfilled, (state, action) => {
        const updatedTeam = action.payload;
        state.allTeams = state.allTeams.map(team =>
          team.id === updatedTeam.id ? updatedTeam : team
        );
        if (state.currentTeam?.id === updatedTeam.id) {
          state.currentTeam = updatedTeam;
        }
      });
  }
});

export const { setCurrentTeam, updateTeamData } = teamsSlice.actions;

// Selectors
export const selectCurrentTeam = (state) => state.teams.currentTeam;
export const selectAllTeams = (state) => state.teams.allTeams;
export const selectTeamsStatus = (state) => state.teams.status;
export const selectTeamsError = (state) => state.teams.error;

export default teamsSlice.reducer;
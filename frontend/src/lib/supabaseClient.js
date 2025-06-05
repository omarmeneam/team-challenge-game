import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '❌ Supabase URL and Key are required! Please check your .env file.\n' +
    'Required variables:\n' +
    '- VITE_SUPABASE_URL\n' +
    '- VITE_SUPABASE_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions for common Supabase operations
export const supabaseHelpers = {
  // Team operations
  async createTeam(teamName) {
    return await supabase
      .from('teams')
      .insert([{
        name: teamName,
        score: 0,
        streak: 0,
        skip_aids_remaining: 3,
        fifty_fifty_aids_remaining: 3,
        time_freeze_aids_remaining: 3
      }])
      .select()
      .single();
  },

  // Question operations
  async getRandomQuestion(difficulty) {
    return await supabase
      .from('questions')
      .select('*')
      .eq('difficulty', difficulty)
      .order('RANDOM()')
      .limit(1)
      .single();
  },

  // Score operations
  async updateTeamScore(teamId, points, streakMultiplier = 1) {
    const finalPoints = points * streakMultiplier;
    return await supabase
      .from('teams')
      .update({
        score: supabase.raw(`score + ${finalPoints}`),
        streak: supabase.raw(`streak + 1`)
      })
      .eq('id', teamId);
  },

  // Reset streak on wrong answer
  async resetStreak(teamId) {
    return await supabase
      .from('teams')
      .update({ streak: 0 })
      .eq('id', teamId);
  },

  // Subscribe to real-time updates
  subscribeToTeam(teamId, callback) {
    return supabase
      .channel(`team_${teamId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'teams',
        filter: `id=eq.${teamId}`
      }, callback)
      .subscribe();
  }
};
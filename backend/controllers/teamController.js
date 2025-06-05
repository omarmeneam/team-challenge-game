const supabase = require('../config/supabase');

// Create a new team
const createTeam = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Team name is required'
    });
  }

  try {
    const { data, error } = await supabase
      .from('teams')
      .insert([{
        name: name.trim(),
        score: 0,
        streak: 0,
        skip_aids_remaining: 3,
        fifty_fifty_aids_remaining: 3,
        time_freeze_aids_remaining: 3
      }])
      .select();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Team name already exists'
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error creating team:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create team'
    });
  }
};

// Get all teams
const getAllTeams = async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('score', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching teams:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teams'
    });
  }
};

// Update team score with streak bonus
const updateScore = async (req, res) => {
  const { id } = req.params;
  const { points, isCorrect } = req.body;

  if (!points || typeof isCorrect !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'Points and isCorrect status are required'
    });
  }

  try {
    // First get current streak
    const { data: team, error: fetchError } = await supabase
      .from('teams')
      .select('streak, score')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Calculate new streak and score
    const newStreak = isCorrect ? team.streak + 1 : 0;
    const streakMultiplier = 1 + Math.min(team.streak, 5) * 0.2;
    const scoreIncrement = isCorrect ? Math.floor(points * streakMultiplier) : 0;

    // Update team
    const { data, error } = await supabase
      .from('teams')
      .update({
        score: team.score + scoreIncrement,
        streak: newStreak
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Score updated successfully',
      data: {
        ...data,
        pointsEarned: scoreIncrement,
        streakMultiplier
      }
    });
  } catch (error) {
    console.error('Error updating score:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update score'
    });
  }
};

// Use help aid
const useHelpAid = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  if (!['skip', 'fifty_fifty', 'time_freeze'].includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid help aid type'
    });
  }

  const aidColumn = `${type}_aids_remaining`;

  try {
    // Check if aid is available
    const { data: team, error: fetchError } = await supabase
      .from('teams')
      .select(aidColumn)
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (team[aidColumn] <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No help aids remaining of this type'
      });
    }

    // Use the aid
    const { data, error } = await supabase
      .from('teams')
      .update({ [aidColumn]: team[aidColumn] - 1 })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Help aid used successfully',
      data
    });
  } catch (error) {
    console.error('Error using help aid:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to use help aid'
    });
  }
};

// Get leaderboard
const getLeaderboard = async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  updateScore,
  useHelpAid,
  getLeaderboard
};
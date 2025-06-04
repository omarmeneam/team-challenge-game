// controllers/teamController.js
const supabase = require('../config/supabase');

// ➕ إنشاء فريق
const createTeam = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Team name is required',
    });
  }

  try {
    const { data, error } = await supabase
      .from('teams')
      .insert([{ name: name.trim() }])
      .select();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Team name already exists',
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: data[0],
    });
  } catch (error) {
    console.error('Error creating team:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create team',
    });
  }
};

// 📥 جلب كل الفرق
const getAllTeams = async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Teams fetched successfully',
      data,
    });
  } catch (error) {
    console.error('Error fetching teams:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teams',
    });
  }
};

// 🔁 تحديث نقاط الفريق
const updateTeamScore = async (req, res) => {
  const { score } = req.body;
  const { team_id } = req.params;

  if (!team_id || !Number.isInteger(score)) {
    return res.status(400).json({
      success: false,
      message: '⚠️ team_id (in URL) and score (integer) are required',
    });
  }

  try {
    const { data, error } = await supabase
      .from('teams')
      .update({ score })
      .eq('id', team_id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team score updated',
      data: data[0],
    });
  } catch (error) {
    console.error('Error updating score:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update score',
    });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  updateTeamScore,
};
// This code defines the team controller for handling team-related operations in an Express.js application.
// It includes functions to create a team, retrieve all teams, and update a team's score in a Supabase database.
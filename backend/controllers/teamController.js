// controllers/teamController.js
const supabase = require('../config/supabase');

// ➕ إنشاء فريق
const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '⚠️ Team name is required',
      });
    }

    const { data, error } = await supabase
      .from('teams')
      .insert([{ name: name.trim() }])
      .select();

    if (error) {
      if (error.message.includes('duplicate key value')) {
        return res.status(400).json({
          success: false,
          message: '⚠️ This team name already exists. Please choose another.',
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: '✅ Team created successfully',
      data: data[0],
    });
  } catch (error) {
    console.error('❌ Supabase Insert Error:', error.message);
    res.status(500).json({
      success: false,
      message: '❌ Something went wrong. Please try again later.',
    });
  }
};

// 📥 جلب كل الفرق
const getAllTeams = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: '✅ Teams fetched successfully',
      data,
    });
  } catch (error) {
    console.error('❌ Supabase Fetch Error:', error.message);
    res.status(500).json({
      success: false,
      message: '❌ Could not fetch teams',
    });
  }
};

// 🔁 تحديث نقاط فريق
const updateTeamScore = async (req, res) => {
  try {
    const { score } = req.body;
    const { team_id } = req.params;

    if (!team_id || typeof score !== 'number') {
      return res.status(400).json({
        success: false,
        message: '⚠️ team_id (in URL) and score (number) are required',
      });
    }

    const { data, error } = await supabase
      .from('teams')
      .update({ score })
      .eq('id', team_id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: '⚠️ Team not found',
      });
    }

    res.status(200).json({
      success: true,
      message: '✅ Team score updated successfully',
      data: data[0],
    });
  } catch (error) {
    console.error('❌ Update Score Error:', error.message);
    res.status(500).json({
      success: false,
      message: '❌ Something went wrong while updating score',
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
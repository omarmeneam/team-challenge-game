const supabase = require('../config/supabase');

// ➕ إنشاء لاعب
const createPlayer = async (req, res) => {
  try {
    const { name, team_id } = req.body;

    if (!name || !team_id) {
      return res.status(400).json({ error: 'Name and team_id are required' });
    }

    const { data, error } = await supabase
      .from('players')
      .insert([{ name, team_id }])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('❌ Create Player Error:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// 📥 جلب لاعبين فريق
const getPlayersByTeam = async (req, res) => {
  try {
    const { team_id } = req.query;

    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', team_id);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Get Players Error:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { createPlayer, getPlayersByTeam };
// This code defines the player controller for handling player-related operations in an Express.js application.
// It includes functions to create a player and retrieve players by team from a Supabase database.
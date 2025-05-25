const supabase = require('../config/supabase');

const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: '⚠️ Team name is required' });
    }

    const { data, error } = await supabase
      .from('teams')
      .insert([{ name }])
      .select();

    if (error) {
      if (error.message.includes('duplicate key value')) {
        return res.status(400).json({ error: '⚠️ This team name already exists. Please choose another.' });
      }
      throw error;
    }

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('❌ Supabase Insert Error:', error.message);
    res.status(500).json({ error: '❌ Something went wrong. Please try again later.' });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Supabase Fetch Error:', error.message);
    res.status(500).json({ error: '❌ Could not fetch teams' });
  }
};

module.exports = { createTeam, getAllTeams };
// This code defines the team controller for handling team-related operations in an Express.js application.
// It includes functions to create a team and retrieve all teams from a Supabase database.
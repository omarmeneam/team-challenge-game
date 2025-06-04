const { supabase } = require('../config/supabase');

const getRandomQuestion = async (req, res) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('RANDOM()')
    .limit(1)
    .single();

  if (error) {
    return res.status(500).json({ message: 'Failed to fetch question', error });
  }

  res.json(data);
};

module.exports = { getRandomQuestion };
// This function retrieves a random question from the 'questions' table in the Supabase database.
// It uses the 'RANDOM()' function to select a random row and returns it as a JSON response.
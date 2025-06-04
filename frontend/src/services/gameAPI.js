import { supabase } from './supabaseClient';

export const getRandomQuestion = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('random()')
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching question:', error);
    return {
      text: 'Error loading question',
      choices: [],
      correctAnswer: '',
    };
  }

  return data;
};
// This function fetches a random question from the database.
// It returns the question text, choices, and the correct answer.
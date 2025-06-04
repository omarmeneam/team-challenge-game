import { supabase } from './supabaseClient';

export const fetchRandomQuestion = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('text, choices, correctAnswer');

  console.log("📦 Supabase Data:", data);
  console.log("🐛 Supabase Error:", error);

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('No questions found');

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
};
// This function fetches all questions from the 'questions' table,
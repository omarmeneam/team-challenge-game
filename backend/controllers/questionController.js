const supabase = require('../config/supabase');

// Get questions by difficulty level
const getQuestionsByDifficulty = async (req, res) => {
  const { difficulty } = req.query;
  const validDifficulties = ['easy', 'medium', 'hard'];

  if (!difficulty || !validDifficulties.includes(difficulty)) {
    return res.status(400).json({
      success: false,
      message: 'Valid difficulty level (easy, medium, hard) is required'
    });
  }

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('difficulty', difficulty)
      .order('RANDOM()')
      .limit(12); // 12 questions per difficulty level

    if (error) throw error;

    // Map point values based on difficulty
    const pointValues = {
      easy: 200,
      medium: 400,
      hard: 600
    };

    const questionsWithPoints = data.map(question => ({
      ...question,
      points: pointValues[difficulty]
    }));

    res.json({
      success: true,
      data: questionsWithPoints
    });
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions'
    });
  }
};

// Apply fifty-fifty help aid
const applyFiftyFifty = async (req, res) => {
  const { questionId } = req.params;

  try {
    const { data: question, error: fetchError } = await supabase
      .from('questions')
      .select('correct_answer, incorrect_answers')
      .eq('id', questionId)
      .single();

    if (fetchError) throw fetchError;

    // Randomly select one incorrect answer to keep
    const incorrectAnswers = JSON.parse(question.incorrect_answers);
    const randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
    const keptIncorrectAnswer = incorrectAnswers[randomIndex];

    // Return the correct answer and one random incorrect answer in random order
    const answers = [question.correct_answer, keptIncorrectAnswer];
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    res.json({
      success: true,
      data: {
        remainingAnswers: answers
      }
    });
  } catch (error) {
    console.error('Error applying fifty-fifty:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to apply fifty-fifty help aid'
    });
  }
};

// Skip question
const skipQuestion = async (req, res) => {
  const { difficulty } = req.query;
  const validDifficulties = ['easy', 'medium', 'hard'];

  if (!difficulty || !validDifficulties.includes(difficulty)) {
    return res.status(400).json({
      success: false,
      message: 'Valid difficulty level (easy, medium, hard) is required'
    });
  }

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('difficulty', difficulty)
      .order('RANDOM()')
      .limit(1)
      .single();

    if (error) throw error;

    // Map point values based on difficulty
    const pointValues = {
      easy: 200,
      medium: 400,
      hard: 600
    };

    const questionWithPoints = {
      ...data,
      points: pointValues[difficulty]
    };

    res.json({
      success: true,
      data: questionWithPoints
    });
  } catch (error) {
    console.error('Error skipping question:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to skip question'
    });
  }
};

module.exports = {
  getQuestionsByDifficulty,
  applyFiftyFifty,
  skipQuestion
};
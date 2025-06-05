const express = require('express');
const {
  getQuestionsByDifficulty,
  applyFiftyFifty,
  skipQuestion
} = require('../controllers/questionController');

const router = express.Router();

// 📝 Get questions by difficulty
router.get('/', getQuestionsByDifficulty);

// 5️⃣0️⃣ Apply fifty-fifty help aid
router.post('/fifty-fifty/:id', applyFiftyFifty);

// ⏭️ Skip current question
router.post('/skip', skipQuestion);

module.exports = router;
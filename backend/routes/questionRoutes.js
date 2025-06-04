const express = require('express');
const { getRandomQuestion } = require('../controllers/questionController');

const router = express.Router();

router.get('/random', getRandomQuestion);

module.exports = router;
// This code sets up an Express router for handling question-related routes.
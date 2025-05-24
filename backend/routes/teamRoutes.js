// routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const { registerTeam } = require('../controllers/teamController');

router.post('/register', registerTeam);

module.exports = router;
const express = require('express');
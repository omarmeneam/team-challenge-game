// routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const {
  createTeam,
  getAllTeams,
  updateTeamScore,
} = require('../controllers/teamController');

// ➕ إضافة فريق
router.post('/', createTeam);

// 📥 جلب كل الفرق
router.get('/', getAllTeams);

// 🔁 تحديث نقاط فريق (مع team_id في URL)
router.put('/score/:team_id', updateTeamScore);

module.exports = router;
// This code defines the routes for team-related operations in an Express.js application.
// It imports the necessary modules, sets up the routes for creating a team, retrieving all teams, and updating a team's score, and exports the router for use in the main application.
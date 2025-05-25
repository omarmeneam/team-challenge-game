const express = require('express');
const router = express.Router();
const { createTeam, getAllTeams } = require('../controllers/teamController');

router.post('/', createTeam);    // ➕ إضافة فريق
router.get('/', getAllTeams);    // 📥 جلب كل الفرق

module.exports = router;
// This code defines the routes for team-related operations in an Express.js application.
// It imports the necessary modules, sets up the routes for creating a team and retrieving all teams, and exports the router for use in the main application.
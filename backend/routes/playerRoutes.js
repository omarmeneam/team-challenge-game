const express = require('express');
const router = express.Router();
const {
  createPlayer,
  getPlayersByTeam,
} = require('../controllers/playerController');

router.post('/', createPlayer);
router.get('/', getPlayersByTeam);

module.exports = router;
// This code defines the routes for player-related operations in an Express.js application.
// It imports the necessary modules, sets up the routes for creating a player and retrieving players by team, and exports the router for use in the main application.
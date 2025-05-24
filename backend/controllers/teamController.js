// controllers/teamController.js
const Team = require('../models/Team');

exports.registerTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Team.findOne({ name });

    if (existing) {
      return res.status(400).json({ message: 'Team name already taken.' });
    }

    const team = new Team({ name });
    await team.save();

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ score: -1 });
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
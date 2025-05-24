// models/Team.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  score: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);

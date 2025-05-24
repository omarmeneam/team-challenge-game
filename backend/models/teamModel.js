// models/teamModel.js
const teams = [];

function addTeam(name) {
  const newTeam = { id: Date.now().toString(), name };
  teams.push(newTeam);
  return newTeam;
}

function getAllTeams() {
  return teams;
}

module.exports = { addTeam, getAllTeams };

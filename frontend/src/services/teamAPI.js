// services/teamAPI.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/teams';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTeams = async () => {
  const res = await apiClient.get('/');
  return res.data.data;
};

export const createTeam = async (name) => {
  const res = await apiClient.post('/', { name });
  return res.data.data;
};

export const updateTeamScore = async (teamId, score) => {
  const res = await apiClient.put(`/score/${teamId}`, { score });
  return res.data;
};
export const deleteTeam = async (teamId) => {
  const res = await apiClient.delete(`/${teamId}`);
  return res.data;
};
// This code defines the API client for interacting with the team-related endpoints of the backend.
// It uses Axios to create a client with a base URL and provides functions to get teams, create a team, update a team's score, and delete a team.
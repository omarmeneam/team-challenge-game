import React, { useState } from 'react';
import { createTeam } from '../services/teamAPI';
import { toast } from 'react-toastify';

const AddTeamForm = ({ onTeamAdded }) => {
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = teamName.trim();
    if (!trimmedName) {
      toast.error('Team name is required');
      return;
    }
    try {
      setLoading(true);
      const newTeam = await createTeam(trimmedName);
      toast.success('Team added successfully');
      setTeamName('');
      onTeamAdded(newTeam);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Enter team name"
        disabled={loading}
        style={{ padding: 8, marginRight: 8 }}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Team'}
      </button>
    </form>
  );
};

export default AddTeamForm;
// This component provides a form to add a new team.
// It handles the input for the team name, submits it to the API, and notifies the parent component when a team is added successfully.
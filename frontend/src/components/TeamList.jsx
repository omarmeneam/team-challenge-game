import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { getTeams, updateTeamScore } from '../services/teamAPI';
import { toast } from 'react-toastify';

const TeamList = forwardRef((props, ref) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingTeamId, setUpdatingTeamId] = useState(null);
  const [scoreInputs, setScoreInputs] = useState({});

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await getTeams();
      setTeams(data);
      const initialScores = {};
      data.forEach(team => {
        initialScores[team.id] = team.score;
      });
      setScoreInputs(initialScores);
    } catch (err) {
      toast.error('Error fetching teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchTeams,
  }));

  const handleScoreInputChange = (teamId, value) => {
    if (!/^\d*$/.test(value)) return; // accept only digits or empty
    setScoreInputs(prev => ({ ...prev, [teamId]: value }));
  };

  const handleScoreUpdate = async (teamId) => {
    const newScore = Number(scoreInputs[teamId]);
    if (isNaN(newScore)) {
      toast.error('Please enter a valid score');
      return;
    }
    try {
      setUpdatingTeamId(teamId);
      const updated = await updateTeamScore(teamId, newScore);
      const updatedTeams = teams.map(team =>
        team.id === teamId ? updated.data : team
      );
      setTeams(updatedTeams);
      toast.success('Score updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating score');
    } finally {
      setUpdatingTeamId(null);
    }
  };

  const handleAddPoint = async (teamId) => {
    const currentScore = scoreInputs[teamId] || 0;
    const newScore = Number(currentScore) + 1;
    setScoreInputs(prev => ({ ...prev, [teamId]: newScore }));
    await handleScoreUpdate(teamId);
  };

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const highestScore = sortedTeams.length ? sortedTeams[0].score : null;

  return (
    <section>
      {loading ? (
        <p>Loading teams...</p>
      ) : teams.length === 0 ? (
        <p>No teams yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
              <th style={{ padding: 8 }}>#</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Team Name</th>
              <th style={{ padding: 8 }}>Score</th>
              <th style={{ padding: 8 }}>Add Point</th>
              <th style={{ padding: 8 }}>Update Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => {
              const isLeader = team.score === highestScore && highestScore !== null;
              return (
                <tr
                  key={team.id}
                  style={{
                    backgroundColor: isLeader ? '#d4edda' : 'transparent',
                    fontWeight: isLeader ? 'bold' : 'normal',
                    borderBottom: '1px solid #ccc',
                  }}
                >
                  <td style={{ padding: 8, textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ padding: 8 }}>{team.name}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{team.score}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>
                    <button
                      onClick={() => handleAddPoint(team.id)}
                      disabled={updatingTeamId === team.id}
                      style={{ cursor: updatingTeamId === team.id ? 'not-allowed' : 'pointer' }}
                    >
                      {updatingTeamId === team.id ? 'Updating...' : '+1'}
                    </button>
                  </td>
                  <td style={{ padding: 8, textAlign: 'center' }}>
                    <input
                      type="text"
                      value={scoreInputs[team.id] ?? ''}
                      onChange={(e) => handleScoreInputChange(team.id, e.target.value)}
                      style={{ width: 50, textAlign: 'center' }}
                      disabled={updatingTeamId === team.id}
                    />
                    <button
                      onClick={() => handleScoreUpdate(team.id)}
                      disabled={updatingTeamId === team.id}
                      style={{ marginLeft: 5, cursor: updatingTeamId === team.id ? 'not-allowed' : 'pointer' }}
                    >
                      {updatingTeamId === team.id ? 'Updating...' : 'Update'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
});

export default TeamList;
// This component displays a list of teams with their scores.
// It allows updating scores and adding points to teams, with real-time updates and error handling.
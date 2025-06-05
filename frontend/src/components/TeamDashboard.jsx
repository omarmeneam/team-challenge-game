import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const TeamDashboard = ({ teamId }) => {
  const [team, setTeam] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [helpAids, setHelpAids] = useState({
    skip: 3,
    fiftyFifty: 3,
    timeFreeze: 3
  });

  useEffect(() => {
    // Subscribe to real-time team updates
    const teamSubscription = supabase
      .channel('team_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'teams',
        filter: `id=eq.${teamId}`
      }, (payload) => {
        setTeam(payload.new);
        setScore(payload.new.score);
        setStreak(payload.new.streak);
      })
      .subscribe();

    return () => {
      teamSubscription.unsubscribe();
    };
  }, [teamId]);

  const useHelpAid = async (type) => {
    if (helpAids[type] > 0) {
      setHelpAids(prev => ({
        ...prev,
        [type]: prev[type] - 1
      }));

      // Update help aid usage in database
      await supabase
        .from('teams')
        .update({ [`${type}_aids_remaining`]: helpAids[type] - 1 })
        .eq('id', teamId);

      return true;
    }
    return false;
  };

  return (
    <div className="team-dashboard">
      <h2>{team?.name || 'Team Dashboard'}</h2>
      
      <div className="score-section">
        <h3>Score: {score}</h3>
        <div className="streak-indicator">
          🔥 Streak: {streak}x
        </div>
      </div>

      <div className="help-aids">
        <button 
          onClick={() => useHelpAid('skip')}
          disabled={helpAids.skip === 0}
        >
          ⏭️ Skip ({helpAids.skip})
        </button>
        <button 
          onClick={() => useHelpAid('fiftyFifty')}
          disabled={helpAids.fiftyFifty === 0}
        >
          5️⃣0️⃣ 50:50 ({helpAids.fiftyFifty})
        </button>
        <button 
          onClick={() => useHelpAid('timeFreeze')}
          disabled={helpAids.timeFreeze === 0}
        >
          ⏸️ Freeze ({helpAids.timeFreeze})
        </button>
      </div>
    </div>
  );
};

export default TeamDashboard;
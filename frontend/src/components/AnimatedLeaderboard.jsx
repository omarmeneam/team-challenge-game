import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSpring, animated } from 'react-spring';
import { useSelector } from 'react-redux';
import { selectLeaderboardRankings, selectTeamPercentile } from '../store/slices/leaderboardSlice';
import { formatNumber } from '../locales/i18n';

const AchievementBadge = ({ type, isRTL }) => {
  const { t } = useTranslation();
  const badges = {
    streakMaster: '🔥',
    perfectScore: '💯',
    speedDemon: '⚡',
    helpfulFriend: '🤝'
  };

  return (
    <div
      className={`achievement-badge ${isRTL ? 'rtl' : 'ltr'}`}
      title={t(`achievements.${type}`)}
    >
      {badges[type]}
    </div>
  );
};

const LeaderboardEntry = ({ team, rank, isCurrentTeam, isRTL }) => {
  const { t, i18n } = useTranslation();
  const percentile = useSelector(state => selectTeamPercentile(team.id)(state));

  const [props, api] = useSpring(() => ({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 }
  }));

  // Animate score changes
  useEffect(() => {
    api.start({
      from: { scale: 1.2, color: '#4CAF50' },
      to: { scale: 1, color: '#000' }
    });
  }, [team.score]);

  // Determine achievements
  const achievements = [];
  if (team.streak >= 5) achievements.push('streakMaster');
  if (team.score >= 10000) achievements.push('perfectScore');
  if (team.fastestAnswer) achievements.push('speedDemon');
  if (team.helpfulCount >= 5) achievements.push('helpfulFriend');

  return (
    <animated.div
      style={props}
      className={`leaderboard-entry ${isCurrentTeam ? 'current-team' : ''} ${isRTL ? 'rtl' : 'ltr'}`}
      data-cy="leaderboard-entry"
    >
      <div className="rank">{rank}</div>
      <div className="team-info">
        <div className="team-name">{team.name}</div>
        <div className="achievements">
          {achievements.map(achievement => (
            <AchievementBadge
              key={achievement}
              type={achievement}
              isRTL={isRTL}
            />
          ))}
        </div>
      </div>
      <animated.div className="score">
        {formatNumber(team.score, i18n.language)}
      </animated.div>
      <div className="percentile" title={t('leaderboard.percentile')}>
        {t('leaderboard.topPercent', { percent: Math.round(percentile) })}
      </div>
    </animated.div>
  );
};

const AnimatedLeaderboard = () => {
  const { t, i18n } = useTranslation();
  const rankings = useSelector(selectLeaderboardRankings);
  const currentTeam = useSelector(state => state.teams.currentTeam);
  const isRTL = i18n.dir() === 'rtl';

  const [showAll, setShowAll] = useState(false);
  const displayRankings = showAll ? rankings : rankings.slice(0, 5);

  return (
    <div className={`leaderboard-container ${isRTL ? 'rtl' : 'ltr'}`}>
      <h2 className="leaderboard-title">{t('leaderboard.title')}</h2>
      
      <div className="leaderboard-headers">
        <div className="rank-header">{t('leaderboard.rank')}</div>
        <div className="team-header">{t('leaderboard.team')}</div>
        <div className="score-header">{t('leaderboard.points')}</div>
      </div>

      <div className="leaderboard-entries">
        {displayRankings.map((team, index) => (
          <LeaderboardEntry
            key={team.id}
            team={team}
            rank={index + 1}
            isCurrentTeam={currentTeam?.id === team.id}
            isRTL={isRTL}
          />
        ))}
      </div>

      {rankings.length > 5 && (
        <button
          className="view-all-button"
          onClick={() => setShowAll(!showAll)}
        >
          {t(showAll ? 'leaderboard.showLess' : 'leaderboard.viewAll')}
        </button>
      )}
    </div>
  );
};

export default AnimatedLeaderboard;
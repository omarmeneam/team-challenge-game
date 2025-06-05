import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import ShareButton from './ShareButton';

const ReferralSystem = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const currentTeam = useSelector(state => state.teams.currentTeam);
  const [referralCode, setReferralCode] = useState('');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  // Animation for the referral code container
  const codeAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' }
  });

  // Animation for the copied message
  const copiedMessageAnimation = useSpring({
    opacity: showCopiedMessage ? 1 : 0,
    transform: showCopiedMessage ? 'translateY(0px)' : 'translateY(10px)',
    config: { tension: 300, friction: 20 }
  });

  useEffect(() => {
    // Generate a unique referral code for the team
    if (currentTeam?.id) {
      const code = `${currentTeam.name.substring(0, 3).toUpperCase()}${currentTeam.id.substring(0, 6)}`;
      setReferralCode(code);
    }
  }, [currentTeam]);

  const copyReferralLink = async () => {
    const referralLink = `${window.location.origin}/join?code=${referralCode}&team=${currentTeam?.id}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (error) {
      console.error('Failed to copy referral link:', error);
    }
  };

  const generateReferralMessage = () => {
    return t('referral.message', {
      teamName: currentTeam?.name,
      code: referralCode,
      interpolation: { escapeValue: false }
    });
  };

  return (
    <div className={`referral-system ${isRTL ? 'rtl' : 'ltr'}`}>
      <h3>{t('referral.title')}</h3>
      
      <div className="referral-description">
        <p>{t('referral.description')}</p>
      </div>

      <animated.div style={codeAnimation} className="referral-code-container">
        <div className="referral-code">
          <span>{referralCode}</span>
          <button
            onClick={copyReferralLink}
            className="copy-button"
            aria-label={t('referral.copyCode')}
          >
            <i className="copy-icon" />
          </button>
        </div>

        <animated.div
          style={copiedMessageAnimation}
          className="copied-message"
          role="status"
        >
          {t('referral.codeCopied')}
        </animated.div>
      </animated.div>

      <div className="share-options">
        <h4>{t('referral.shareVia')}</h4>
        <div className="share-buttons">
          <ShareButton
            platform="whatsapp"
            message={generateReferralMessage()}
            referralCode={referralCode}
          />
          <ShareButton
            platform="instagram"
            message={generateReferralMessage()}
            referralCode={referralCode}
          />
        </div>
      </div>

      <div className="referral-rewards">
        <h4>{t('referral.rewards.title')}</h4>
        <ul>
          <li>{t('referral.rewards.firstFriend')}</li>
          <li>{t('referral.rewards.threeFriends')}</li>
          <li>{t('referral.rewards.fiveFriends')}</li>
        </ul>
      </div>

      <div className="referral-terms">
        <p>{t('referral.terms')}</p>
      </div>
    </div>
  );
};

export default ReferralSystem;
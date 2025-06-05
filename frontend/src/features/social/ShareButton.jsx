import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectCurrentTeam } from '../../store/slices/teamsSlice';
import { formatNumber } from '../../locales/i18n';

const ShareButton = () => {
  const { t, i18n } = useTranslation();
  const currentTeam = useSelector(selectCurrentTeam);
  const isRTL = i18n.dir() === 'rtl';

  const generateShareText = () => {
    const score = formatNumber(currentTeam.score, i18n.language);
    return t('sharing.shareMessage', { score });
  };

  const generateShareImage = () => {
    return `${window.location.origin}/api/share-image?team=${currentTeam.id}&lang=${i18n.language}`;
  };

  const shareToWhatsApp = async () => {
    const text = generateShareText();
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;;
    window.open(whatsappUrl, '_blank');
  };

  const shareToInstagram = async () => {
    try {
      // Generate share image URL
      const imageUrl = generateShareImage();

      // For mobile Instagram app
      if (/Instagram/.test(navigator.userAgent)) {
        const instagramUrl = `instagram://library?AssetPath=${encodeURIComponent(imageUrl)}`;
        window.location.href = instagramUrl;
        return;
      }

      // Fallback: download image for manual sharing
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'team-challenge-score.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      alert(t('sharing.instagramInstructions'));
    } catch (error) {
      console.error('Error sharing to Instagram:', error);
      alert(t('errors.sharingFailed'));
    }
  };

  const copyShareLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/join/${currentTeam.id}`;
      await navigator.clipboard.writeText(shareUrl);
      alert(t('sharing.linkCopied'));
    } catch (error) {
      console.error('Error copying link:', error);
      alert(t('errors.copyFailed'));
    }
  };

  return (
    <div className={`share-container ${isRTL ? 'rtl' : 'ltr'}`}>
      <h3>{t('sharing.share')}</h3>
      
      <div className="share-buttons">
        <button
          onClick={shareToWhatsApp}
          className="share-button whatsapp"
          aria-label={t('sharing.shareWhatsApp')}
        >
          <img
            src="/icons/whatsapp.svg"
            alt="WhatsApp"
            className="share-icon"
          />
          {t('sharing.whatsapp')}
        </button>

        <button
          onClick={shareToInstagram}
          className="share-button instagram"
          aria-label={t('sharing.shareInstagram')}
        >
          <img
            src="/icons/instagram.svg"
            alt="Instagram"
            className="share-icon"
          />
          {t('sharing.instagram')}
        </button>

        <button
          onClick={copyShareLink}
          className="share-button copy-link"
          aria-label={t('sharing.copyLink')}
        >
          <img
            src="/icons/link.svg"
            alt="Copy Link"
            className="share-icon"
          />
          {t('sharing.copyLink')}
        </button>
      </div>

      <div className="challenge-friends">
        <p>{t('sharing.challengeFriends')}</p>
        <div className="referral-code">
          {t('sharing.referralCode')}: <strong>{currentTeam.referralCode}</strong>
        </div>
      </div>
    </div>
  );
};

export default ShareButton;
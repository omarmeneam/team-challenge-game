import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fcmService } from './fcmService';
import { useSpring, animated } from 'react-spring';

const NotificationPreference = ({ label, value, onChange, isRTL }) => {
  const { t } = useTranslation();

  return (
    <div className={`notification-preference ${isRTL ? 'rtl' : 'ltr'}`}>
      <label className="preference-label">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="preference-checkbox"
        />
        <span>{t(label)}</span>
      </label>
    </div>
  );
};

const NotificationToast = ({ notification, onDismiss, isRTL }) => {
  const props = useSpring({
    from: { opacity: 0, transform: 'translateX(100%)' },
    to: { opacity: 1, transform: 'translateX(0%)' },
    leave: { opacity: 0, transform: 'translateX(100%)' }
  });

  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <animated.div
      style={props}
      className={`notification-toast ${isRTL ? 'rtl' : 'ltr'}`}
      role="alert"
    >
      <img
        src={notification.icon}
        alt=""
        className="notification-icon"
      />
      <div className="notification-content">
        <h4>{notification.title}</h4>
        <p>{notification.body}</p>
      </div>
      <button
        onClick={onDismiss}
        className="dismiss-button"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </animated.div>
  );
};

const NotificationCenter = () => {
  const { t, i18n } = useTranslation();
  const currentUser = useSelector(state => state.auth.user);
  const isRTL = i18n.dir() === 'rtl';

  const [preferences, setPreferences] = useState({
    turnReminders: true,
    scoreUpdates: true,
    achievements: true,
    teamChallenges: true
  });

  const [notifications, setNotifications] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check if notifications are already enabled
    fcmService.registerDevice(currentUser?.id).then(enabled => {
      setIsEnabled(enabled);
    });

    // Set up notification handler
    fcmService.setMessageHandler(payload => {
      setNotifications(prev => [
        {
          id: Date.now(),
          ...payload.notification
        },
        ...prev
      ]);
    });
  }, [currentUser]);

  const handlePreferenceChange = async (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    await fcmService.updateNotificationPreferences(
      currentUser.id,
      newPreferences
    );
  };

  const enableNotifications = async () => {
    const enabled = await fcmService.registerDevice(currentUser.id);
    setIsEnabled(enabled);

    if (!enabled) {
      alert(t('notifications.enableInstructions'));
    }
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  return (
    <div className={`notification-center ${isRTL ? 'rtl' : 'ltr'}`}>
      <h3>{t('notifications.notificationSettings')}</h3>

      {!isEnabled ? (
        <div className="enable-notifications">
          <p>{t('notifications.enableDescription')}</p>
          <button
            onClick={enableNotifications}
            className="enable-button"
          >
            {t('notifications.enableNotifications')}
          </button>
        </div>
      ) : (
        <div className="notification-preferences">
          <NotificationPreference
            label="notifications.turnReminders"
            value={preferences.turnReminders}
            onChange={(value) => handlePreferenceChange('turnReminders', value)}
            isRTL={isRTL}
          />
          <NotificationPreference
            label="notifications.scoreUpdates"
            value={preferences.scoreUpdates}
            onChange={(value) => handlePreferenceChange('scoreUpdates', value)}
            isRTL={isRTL}
          />
          <NotificationPreference
            label="notifications.achievements"
            value={preferences.achievements}
            onChange={(value) => handlePreferenceChange('achievements', value)}
            isRTL={isRTL}
          />
          <NotificationPreference
            label="notifications.teamChallenges"
            value={preferences.teamChallenges}
            onChange={(value) => handlePreferenceChange('teamChallenges', value)}
            isRTL={isRTL}
          />
        </div>
      )}

      <div className="notification-list" role="log">
        {notifications.map(notification => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={() => dismissNotification(notification.id)}
            isRTL={isRTL}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
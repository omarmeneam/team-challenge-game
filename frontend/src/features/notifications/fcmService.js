import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { supabase } from '../../lib/supabaseClient';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

class FCMService {
  #token = null;
  #notificationPermission = 'default';
  #onMessageCallback = null;

  constructor() {
    this.#checkPermission();
    this.#setupMessageListener();
  }

  async #checkPermission() {
    try {
      this.#notificationPermission = await Notification.requestPermission();
    } catch (error) {
      console.error('Notification permission error:', error);
    }
  }

  #setupMessageListener() {
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      if (this.#onMessageCallback) {
        this.#onMessageCallback(payload);
      }

      // Show notification if app is in foreground
      if (document.visibilityState === 'visible') {
        this.#showLocalNotification(payload.notification);
      }
    });
  }

  async registerDevice(userId) {
    try {
      if (this.#notificationPermission !== 'granted') {
        await this.#checkPermission();
      }

      if (this.#notificationPermission === 'granted') {
        this.#token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
        });

        // Store token in Supabase
        const { error } = await supabase
          .from('user_devices')
          .upsert({
            user_id: userId,
            fcm_token: this.#token,
            last_active: new Date().toISOString()
          });

        if (error) throw error;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error registering device:', error);
      return false;
    }
  }

  #showLocalNotification({ title, body, icon }) {
    if (!('Notification' in window)) return;

    try {
      new Notification(title, {
        body,
        icon,
        badge: '/icons/notification-badge.png',
        timestamp: Date.now(),
        requireInteraction: false,
        silent: false
      });
    } catch (error) {
      console.error('Error showing local notification:', error);
    }
  }

  setMessageHandler(callback) {
    this.#onMessageCallback = callback;
  }

  async updateNotificationPreferences(userId, preferences) {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  }

  // Helper method to format notification data
  static formatNotificationData(type, data) {
    const notifications = {
      turnStart: {
        title: 'Game Turn Starting',
        body: 'Your turn starts in 1 minute!',
        icon: '/icons/turn-notification.png'
      },
      teamOvertake: {
        title: 'Team Update',
        body: `${data.teamName} just overtook you!`,
        icon: '/icons/overtake-notification.png'
      },
      achievement: {
        title: 'New Achievement!',
        body: `You've unlocked: ${data.achievementName}`,
        icon: '/icons/achievement-notification.png'
      }
    };

    return notifications[type] || null;
  }
}

export const fcmService = new FCMService();
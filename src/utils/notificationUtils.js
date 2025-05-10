import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';
import { app } from '../services/firebase';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class NotificationManager {
  constructor() {
    this.messaging = null;
    this.currentToken = null;
    this.listeners = [];
    this.unreadCount = 0;
    this.isSupported = false;
    
    this.initializeMessaging();
  }

  async initializeMessaging() {
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        this.messaging = getMessaging(app);
        this.isSupported = true;
        
        // Check for existing token
        const token = await this.getToken();
        if (token) this.currentToken = token;
        
        // Set up foreground message handler
        onMessage(this.messaging, (payload) => {
          this.handleMessage(payload);
        });
      }
    } catch (error) {
      console.error('Messaging initialization failed:', error);
    }
  }

  async requestPermission() {
    if (!this.isSupported) return false;
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await this.getToken();
        return !!token;
      }
      return false;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  async getToken() {
    if (!this.isSupported) return null;
    
    try {
      const token = await getToken(this.messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      });
      
      if (token && token !== this.currentToken) {
        await this.registerToken(token);
        this.currentToken = token;
      }
      
      return token;
    } catch (error) {
      console.error('Token retrieval failed:', error);
      return null;
    }
  }

  async registerToken(token) {
    try {
      const deviceInfo = {
        os: navigator.platform,
        browser: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`
      };
      
      await axios.post(`${API_URL}/users/fcm-tokens`, { 
        token, 
        deviceInfo 
      }, {
        withCredentials: true
      });
      
      return true;
    } catch (error) {
      console.error('Token registration failed:', error);
      return false;
    }
  }

  async unregisterToken() {
    if (!this.currentToken) return false;
    
    try {
      // Delete from Firebase
      await deleteToken(this.messaging);
      
      // Remove from server
      await axios.delete(`${API_URL}/users/fcm-tokens`, {
        data: { token: this.currentToken },
        withCredentials: true
      });
      
      this.currentToken = null;
      return true;
    } catch (error) {
      console.error('Token unregistration failed:', error);
      return false;
    }
  }

  handleMessage(payload) {
    const notification = {
      id: payload.messageId,
      title: payload.notification?.title || 'New Notification',
      body: payload.notification?.body,
      data: payload.data,
      timestamp: new Date().toISOString()
    };
    
    // Notify listeners
    this.listeners.forEach(listener => listener(notification));
    
    // Show browser notification if app isn't focused
    if (document.visibilityState !== 'visible') {
      this.showBrowserNotification(notification);
    }
  }

  showBrowserNotification({ title, body, data }) {
    if (Notification.permission !== 'granted') return;
    
    const options = {
      body,
      icon: '/logo192.png',
      data,
      vibrate: [200, 100, 200]
    };
    
    const notification = new Notification(title, options);
    
    notification.onclick = (event) => {
      event.preventDefault();
      this.handleNotificationClick(data);
    };
  }

  handleNotificationClick(data) {
    // Custom navigation logic based on notification type
    if (data?.type === 'new_message') {
      window.location.href = `/messages/${data.conversationId}`;
    } else {
      window.location.href = '/notifications';
    }
  }

  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // ... (other utility methods for fetching notifications, etc.)
}

export const notificationManager = new NotificationManager();
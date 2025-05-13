
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
    this.tokenRegistrationInProgress = false;
    
    // Initialize only in browser environment
    if (typeof window !== 'undefined') {
      this.initializeMessaging();
    }
  }

  async initializeMessaging() {
    try {
      // Check if service workers and notifications are supported
      if ('serviceWorker' in navigator && 'Notification' in window) {
        // Register service worker first (if not already registered)
        await this.ensureServiceWorkerRegistered();
        
        // Initialize Firebase messaging
        this.messaging = getMessaging(app);
        this.isSupported = true;
        
        // Set up foreground message handler
        this.setupMessageHandler();
        
        // Check for existing permission and token
        if (Notification.permission === 'granted') {
          await this.getToken();
        }
        
        return true;
      } else {
        console.log('This browser does not support notifications or service workers');
        this.isSupported = false;
        return false;
      }
    } catch (error) {
      console.error('Failed to initialize messaging:', error);
      this.isSupported = false;
      return false;
    }
  }
  
  async ensureServiceWorkerRegistered() {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      const fcmSwRegistration = registrations.find(
        reg => reg.scope.includes('firebase-cloud-messaging-push-scope')
      );
      
      if (!fcmSwRegistration) {
        const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service worker registered successfully:', swRegistration);
        return swRegistration;
      }
      
      return fcmSwRegistration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      throw error;
    }
  }

  setupMessageHandler() {
    if (!this.messaging) return;
    
    onMessage(this.messaging, (payload) => {
      console.log('Foreground message received:', payload);
      this.handleMessage(payload);
    });
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
    if (!this.isSupported || this.tokenRegistrationInProgress) return null;
    
    try {
      this.tokenRegistrationInProgress = true;
      
      const token = await getToken(this.messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      });
      
      if (token && token !== this.currentToken) {
        await this.registerToken(token);
        this.currentToken = token;
      }
      
      this.tokenRegistrationInProgress = false;
      return token;
    } catch (error) {
      this.tokenRegistrationInProgress = false;
      console.error('Failed to get FCM token:', error);
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
      
      console.log('FCM token registered with backend');
      return true;
    } catch (error) {
      console.error('Token registration with backend failed:', error);
      return false;
    }
  }

  async unregisterToken() {
    if (!this.currentToken || !this.messaging) return false;
    
    try {
      // Delete from Firebase
      await deleteToken(this.messaging);
      
      // Remove from server
      await axios.delete(`${API_URL}/users/fcm-tokens`, {
        data: { token: this.currentToken },
        withCredentials: true
      });
      
      this.currentToken = null;
      console.log('FCM token unregistered');
      return true;
    } catch (error) {
      console.error('Token unregistration failed:', error);
      return false;
    }
  }

  handleMessage(payload) {
    const notification = {
      id: payload.messageId || new Date().getTime().toString(),
      title: payload.notification?.title || 'New Notification',
      body: payload.notification?.body || '',
      data: payload.data || {},
      timestamp: new Date().toISOString()
    };
    
    // Notify all registered listeners
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
      badge: '/badge-icon.png',
      data,
      vibrate: [200, 100, 200]
    };
    
    try {
      const notification = new Notification(title, options);
      
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        this.handleNotificationClick(data);
      };
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  handleNotificationClick(data) {
    // Custom navigation logic based on notification type
    if (data?.type === 'new_message' && data?.conversationId) {
      window.location.href = `/messages/${data.conversationId}`;
    } else if (data?.url) {
      window.location.href = data.url;
    } else {
      window.location.href = '/notifications';
    }
  }

  addListener(callback) {
    if (typeof callback !== 'function') return () => {};
    
    this.listeners.push(callback);
    
    // Return function to remove this listener
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }
}

// Create and export singleton instance
export const notificationManager = new NotificationManager();
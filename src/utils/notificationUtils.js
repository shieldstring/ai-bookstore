import { messaging, getToken, onMessage } from "../services/firebase";
import { notificationAPI } from "../services/api";

class NotificationManager {
  constructor() {
    this.listeners = [];
    this.deviceInfo = this.getDeviceInfo();
    this.vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
    this.currentToken = null;
    this.isSupported =
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;
  }

  getDeviceInfo() {
    return {
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    };
  }

  async requestPermission() {
    if (!this.isSupported) {
      console.warn("Push notifications are not supported in this browser");
      return false;
    }

    try {
      // Request permission
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";

      if (granted) {
        // Get and register token
        await this.getToken();
      }

      return granted;
    } catch (error) {
      console.error("Failed to request notification permission:", error);
      return false;
    }
  }

  async getToken() {
    if (!this.isSupported || Notification.permission !== "granted") {
      return null;
    }

    try {
      // Make sure service worker is registered
      await this.registerServiceWorker();

      // Get FCM token
      const currentToken = await getToken(messaging, {
        vapidKey: this.vapidKey,
      });

      if (currentToken) {
        // Save token
        this.currentToken = currentToken;

        // Register token with backend
        await notificationAPI.registerToken(currentToken, this.deviceInfo);

        return currentToken;
      } else {
        console.warn("No FCM token available");
        return null;
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  }

  async registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return false;

    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
          scope: "/",
        }
      );

      return registration;
    } catch (error) {
      console.error("Service worker registration failed:", error);
      return false;
    }
  }

  async unregisterToken() {
    if (!this.currentToken) {
      return false;
    }

    try {
      await notificationAPI.unregisterToken(this.currentToken);
      this.currentToken = null;
      return true;
    } catch (error) {
      console.error("Failed to unregister token:", error);
      return false;
    }
  }

  addListener(callback) {
    if (!this.isSupported) return () => {};

    // Set up onMessage listener for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      const notification = {
        title: payload.notification?.title || "New Notification",
        body: payload.notification?.body || "",
        data: payload.data || {},
      };

      callback(notification);
    });

    this.listeners.push({ callback, unsubscribe });

    return unsubscribe;
  }

  removeAllListeners() {
    this.listeners.forEach((listener) => {
      if (listener.unsubscribe) {
        listener.unsubscribe();
      }
    });

    this.listeners = [];
  }
}

export const notificationManager = new NotificationManager();

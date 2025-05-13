const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

// Create the service worker content with actual config values
const serviceWorkerContent = `
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Firebase configuration with actual values
const firebaseConfig = {
  apiKey: "${process.env.REACT_APP_FIREBASE_API_KEY}",
  authDomain: "${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}",
  projectId: "${process.env.REACT_APP_FIREBASE_PROJECT_ID}",
  storageBucket: "${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${process.env.REACT_APP_FIREBASE_APP_ID}"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message",
    payload
  );
  
  // Customize notification here
  const notificationTitle = payload.notification?.title || "New notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/logo192.png",
    badge: "/badge-icon.png",
    data: payload.data || {},
    vibrate: [200, 100, 200]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  // Get URL from data or default to homepage
  const urlToOpen = event.notification.data?.url || "/";
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's already a tab open with this URL
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
`;

// Ensure the public directory exists
const publicDir = path.resolve(__dirname, '../public');

// Write the generated service worker to the public directory
fs.writeFileSync(
  path.join(publicDir, 'firebase-messaging-sw.js'),
  serviceWorkerContent
);

console.log('Firebase messaging service worker generated successfully!');
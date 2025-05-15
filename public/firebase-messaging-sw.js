importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Use hardcoded values (must match your firebase.js config)
const firebaseConfig = {
  apiKey: "AIzaSyAU0f3smEJyfg0Pt0XcisXEbRVHtJDMCw0",
  authDomain: "bookstore-2141c.firebaseapp.com",
  projectId: "bookstore-2141c",
  storageBucket: "bookstore-2141c.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "626331056849",
  appId: "1:626331056849:web:4c18c91df40681d259a3f0",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message", payload);
  
  const notificationTitle = payload.notification?.title || "New notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/favicon.png",
    data: payload.data || {}, // Preserve payload data
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Enhanced notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  // Use data from notification to determine where to navigate
  const urlToOpen = event.notification.data?.url || "/";
  
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
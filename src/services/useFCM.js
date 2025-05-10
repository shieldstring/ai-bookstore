import { useEffect } from "react";
import { messaging, getToken, onMessage } from "./firebase";
import { notificationAPI } from "./api";
import { toast } from "react-toastify";

const useFCM = () => {
  useEffect(() => {
    const registerToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
          });

          if (token) {
            const deviceInfo = navigator.userAgent;
            await notificationAPI.registerToken(token, deviceInfo);
            toast.success("Notifications enabled for this device");
          }
        } else {
          toast.info("Please enable notifications for the best experience");
        }
      } catch (error) {
        toast.error("Failed to enable notifications");
        console.error("FCM registration error:", error);
      }
    };

    registerToken();

    // Handle foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message:", payload);

      toast.info(
        <div>
          <h4 className="font-bold">{payload.notification?.title}</h4>
          <p>{payload.notification?.body}</p>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Optional: Add function to manually request permission
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        toast.success("Notifications enabled!");
        return true;
      }
      toast.warn("Notifications permission denied");
      return false;
    } catch (error) {
      toast.error("Error requesting notification permission");
      console.error(error);
      return false;
    }
  };

  return { requestNotificationPermission };
};

export default useFCM;

import { useState, useEffect, useCallback } from 'react';

import { toast } from 'react-toastify';
import { notificationManager } from '../utils/notificationUtils';

const useFCM = () => {
  const [permissionStatus, setPermissionStatus] = useState(Notification.permission);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initial setup
  useEffect(() => {
    const initializeFCM = async () => {
      setIsLoading(true);
      try {
        // Check current permission status
        setPermissionStatus(Notification.permission);
        setNotificationEnabled(Notification.permission === 'granted');
        
        // If permission is already granted, just get the token
        if (Notification.permission === 'granted') {
          await notificationManager.getToken();
        }
      } catch (error) {
        console.error('FCM initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeFCM();
    
    // Set up notification listener (for displaying toasts)
    const unsubscribe = notificationManager.addListener((notification) => {
      // Show toast for foreground notifications
      toast.info(
        <div>
          <h4 className="font-bold">{notification.title}</h4>
          <p>{notification.body}</p>
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
  
  // Function to request notification permission
  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      const granted = await notificationManager.requestPermission();
      setPermissionStatus(Notification.permission);
      setNotificationEnabled(granted);
      
      if (granted) {
        toast.success('Notifications enabled for this device');
        return true;
      } else {
        toast.info('Please enable notifications for the best experience');
        return false;
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      toast.error('Failed to enable notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Function to disable notifications
  const disableNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const success = await notificationManager.unregisterToken();
      if (success) {
        setNotificationEnabled(false);
        toast.info('Notifications disabled for this device');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to disable notifications:', error);
      toast.error('Failed to disable notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    permissionStatus,
    notificationEnabled,
    isLoading,
    requestPermission,
    disableNotifications,
    isSupported: notificationManager.isSupported
  };
};

export default useFCM;
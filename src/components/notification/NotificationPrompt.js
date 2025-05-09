import { useEffect, useState } from 'react';
import useFCM from '../../services/useFCM';

const NotificationPrompt = () => {
  const { requestNotificationPermission } = useFCM();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if notifications are enabled
    const checkNotificationPermission = async () => {
      if (Notification.permission === 'default') {
        setIsVisible(true);
      }
    };

    checkNotificationPermission();
  }, []);

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-gray-900">Enable Notifications</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get real-time updates for messages, likes, and more.
          </p>
          <div className="mt-4 flex">
            <button
              onClick={handleEnable}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enable
            </button>
            <button
              onClick={handleDismiss}
              className="ml-3 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrompt;
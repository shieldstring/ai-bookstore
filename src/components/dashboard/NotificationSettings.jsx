import { useState, useEffect } from 'react';
import { notificationAPI } from '../../services/api';
import useFCM from '../../services/useFCM';

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState({
    likes: true,
    comments: true,
    groupActivity: true,
    mentions: true,
    newFollowers: true
  });
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Get FCM notification controls
  const { 
    permissionStatus, 
    notificationEnabled, 
    isLoading: fcmLoading, 
    requestPermission, 
    disableNotifications,
    isSupported
  } = useFCM();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prefsResponse, devicesResponse] = await Promise.all([
          notificationAPI.getPreferences(),
          notificationAPI.getTokens()
        ]);
        
        setPreferences(prefsResponse.data || preferences);
        setDevices(devicesResponse.data || []);
      } catch (err) {
        setError('Failed to load notification settings');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle notification permission toggle
  const handleToggleNotifications = async () => {
    try {
      setError(null);
      if (notificationEnabled) {
        const success = await disableNotifications();
        if (success) {
          setSuccessMessage('Notifications disabled successfully');
          // Refresh device list
          const response = await notificationAPI.getTokens();
          setDevices(response.data || []);
        }
      } else {
        const granted = await requestPermission();
        if (granted) {
          setSuccessMessage('Notifications enabled successfully');
          // Refresh device list
          const response = await notificationAPI.getTokens();
          setDevices(response.data || []);
        }
      }
    } catch (err) {
      setError('Failed to update notification status');
      console.error(err);
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handlePreferenceChange = async (e) => {
    const { name, checked } = e.target;
    const updatedPrefs = { ...preferences, [name]: checked };
    
    try {
      setError(null);
      await notificationAPI.updatePreferences(updatedPrefs);
      setPreferences(updatedPrefs);
      setSuccessMessage('Preferences updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to update preferences');
      console.error(err);
    }
  };

  const handleRemoveDevice = async (tokenId) => {
    try {
      setError(null);
      await notificationAPI.unregisterToken(tokenId);
      setDevices(devices.filter(device => device.id !== tokenId));
      setSuccessMessage('Device removed successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to remove device');
      console.error(err);
    }
  };

  if (isLoading || fcmLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Settings</h2>
      
      {/* Master notification toggle */}
      <div className="mb-8">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <h3 className="text-lg font-medium text-gray-800">Push Notifications</h3>
            <p className="text-gray-600 text-sm">
              {!isSupported 
                ? "Push notifications are not supported in this browser" 
                : notificationEnabled 
                  ? "You'll receive notifications when something important happens" 
                  : "Enable notifications to stay updated with important events"}
            </p>
          </div>
          
          {isSupported && (
            <button
              onClick={handleToggleNotifications}
              disabled={fcmLoading}
              className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                notificationEnabled 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {fcmLoading ? 'Processing...' : notificationEnabled ? 'Disable' : 'Enable'}
            </button>
          )}
        </div>
        
        {permissionStatus === 'denied' && (
          <div className="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
            <p>
              You've blocked notifications in your browser. To enable notifications, you'll need to update your browser
              settings to allow notifications from this site.
            </p>
          </div>
        )}
      </div>
      
      {/* Notification preferences */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {Object.entries(preferences).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name={key}
                  checked={value}
                  onChange={handlePreferenceChange}
                  disabled={!notificationEnabled}
                  className="sr-only"
                />
                <div className={`block w-10 h-6 rounded-full ${
                  !notificationEnabled ? 'bg-gray-300' : value ? 'bg-blue-500' : 'bg-gray-400'
                }`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                  value ? 'transform translate-x-4' : ''
                }`}></div>
              </div>
              <div className={`ml-3 font-medium ${!notificationEnabled ? 'text-gray-400' : 'text-gray-700'}`}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* Device management */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Registered Devices</h3>
      {devices.length === 0 ? (
        <p className="text-gray-500 italic">No devices registered for notifications</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {devices.map(device => (
            <li key={device.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="text-gray-800 font-medium">
                  {device.deviceInfo?.platform || 'Unknown Device'}
                  {device.isCurrent && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Current</span>}
                </p>
                <p className="text-sm text-gray-500">
                  Last active: {new Date(device.lastUsed || Date.now()).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleRemoveDevice(device.id)}
                className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
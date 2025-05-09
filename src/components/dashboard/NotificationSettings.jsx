import { useState, useEffect } from 'react';
import { notificationAPI } from '../../services/api';

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

  const handlePreferenceChange = async (e) => {
    const { name, checked } = e.target;
    const updatedPrefs = { ...preferences, [name]: checked };
    
    try {
      await notificationAPI.updatePreferences(updatedPrefs);
      setPreferences(updatedPrefs);
    } catch (err) {
      setError('Failed to update preferences');
      console.error(err);
    }
  };

  const handleRemoveDevice = async (tokenId) => {
    try {
      await notificationAPI.unregisterToken(tokenId);
      setDevices(devices.filter(device => device.id !== tokenId));
    } catch (err) {
      setError('Failed to remove device');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Preferences</h2>
      
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
                  className="sr-only"
                />
                <div className={`block w-10 h-6 rounded-full ${value ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${value ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <div className="ml-3 text-gray-700 font-medium">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
            </label>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">Registered Devices</h3>
      {devices.length === 0 ? (
        <p className="text-gray-500 italic">No devices registered for notifications</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {devices.map(device => (
            <li key={device.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="text-gray-800 font-medium">
                  {device.device || 'Unknown Device'}
                </p>
                <p className="text-sm text-gray-500">
                  Last used: {new Date(device.lastUsed).toLocaleString()}
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

      {/* Success/error messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
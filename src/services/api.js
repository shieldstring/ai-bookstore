import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get token from localStorage instead of using undefined getState()
api.interceptors.request.use((config) => {
  // Get the token from localStorage
  const userInfoStr = localStorage.getItem('userInfo');
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);
      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    } catch (error) {
      console.error('Error parsing user info from localStorage:', error);
    }
  }
  return config;
});

export const notificationAPI = {
  registerToken: (token, deviceInfo) =>
    api.post("users/fcm-tokens", { token, deviceInfo }),
  unregisterToken: (token) => 
    api.delete("users/fcm-tokens", { data: { token } }),
  getTokens: () => 
    api.get("users/fcm-tokens"),
  updatePreferences: (preferences) =>
    api.put("notifications/notification-preferences", preferences),
  getPreferences: () => 
    api.get("notifications/notification-preferences"),
};

export default api;

export const getRecommendations = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/recommendations`, {
      params: { userId },
    });
    return response.data.recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};
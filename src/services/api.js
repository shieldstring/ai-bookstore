import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const notificationAPI = {
  registerToken: (token, deviceInfo) =>
    api.post("/fcm-tokens", { token, deviceInfo }),

  unregisterToken: (token) => api.delete("/fcm-tokens", { data: { token } }),

  getTokens: () => api.get("/fcm-tokens"),

  updatePreferences: (preferences) =>
    api.put("/notification-preferences", preferences),

  getPreferences: () => api.get("/notification-preferences"),
};

export default api;

export const getRecommendations = async (userId) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/recommendations",
      {
        params: { userId },
      }
    );
    return response.data.recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

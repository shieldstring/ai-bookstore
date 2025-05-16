import { apiTwo } from "./apiSlice";
import { createSlice } from "@reduxjs/toolkit";

export const notificationApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => `notifications`,
      providesTags: ["Notification"],
      transformResponse: (response) => {
        // Transform the response to include sender, group, and discussion details
        return response.map((notification) => ({
          ...notification,
          sender: notification.sender || null,
          group: notification.group || null,
          discussion: notification.discussion || null,
        }));
      },
    }),
    getUnreadCount: builder.query({
      query: () => `notifications/unread-count`,
      providesTags: ["Notification"],
    }),
    markNotificationsAsRead: builder.mutation({
      query: (notificationIds) => ({
        url: `notifications/mark-read`,
        method: "POST",
        body: { notificationIds },
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: `notifications/mark-all-read`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
    createNotification: builder.mutation({
      query: (notificationData) => ({
        url: `/notifications/create`,
        method: "POST",
        body: notificationData,
      }),
      invalidatesTags: ["Notification"],
    }),
    updateNotificationPreferences: builder.mutation({
      query: (preferences) => ({
        url: `notifications/preferences`,
        method: "PUT",
        body: preferences,
      }),
    }),
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `notifications/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteAllNotifications: builder.mutation({
      query: () => ({
        url: `notifications`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationsAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useCreateNotificationMutation,
  useUpdateNotificationPreferencesMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationApiSlice;

// Create a slice for notification UI state
export const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    unreadCount: 0,
    selectedNotifications: [],
    bulkSelectActive: false,
    activeFilter: "all",
    timeRange: "all",
    searchTerm: "",
  },
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    setSelectedNotifications: (state, action) => {
      state.selectedNotifications = action.payload;
    },
    toggleBulkSelect: (state) => {
      state.bulkSelectActive = !state.bulkSelectActive;
      if (!state.bulkSelectActive) {
        state.selectedNotifications = [];
      }
    },
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    setTimeRange: (state, action) => {
      state.timeRange = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    resetNotificationFilters: (state) => {
      state.activeFilter = "all";
      state.timeRange = "all";
      state.searchTerm = "";
    },
  },
});

export const {
  setUnreadCount,
  setSelectedNotifications,
  toggleBulkSelect,
  setActiveFilter,
  setTimeRange,
  setSearchTerm,
  resetNotificationFilters,
} = notificationSlice.actions;

export default notificationSlice.reducer;

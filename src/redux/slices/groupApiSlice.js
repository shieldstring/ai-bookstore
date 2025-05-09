import { apiTwo } from "./apiSlice";
import { createSlice } from "@reduxjs/toolkit";


export const groupApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: ({ page = 1, limit = 10, category = '', search = '' }) =>
        `/groups?page=${page}&limit=${limit}&category=${category}&search=${search}`,
      providesTags: ['Group'],
    }),
    getUserGroups: builder.query({
      query: () => `/groups/user`,
      providesTags: ['Group'],
    }),
    getGroupDetails: builder.query({
      query: (groupId) => `/groups/${groupId}`,
      providesTags: (result, error, arg) => [{ type: 'Group', id: arg }],
    }),
    createGroup: builder.mutation({
      query: (groupData) => ({
        url: '/groups',
        method: 'POST',
        body: groupData,
      }),
      invalidatesTags: ['Group'],
    }),
    editGroup: builder.mutation({
      query: ({ groupId, groupData }) => ({
        url: `/groups/${groupId}`,
        method: 'PUT',
        body: groupData,
      }),
      invalidatesTags: ['Group'],
    }),
    deleteGroup: builder.mutation({
      query: (groupId) => ({
        url: `/groups/${groupId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Group'],
    }),
    joinGroup: builder.mutation({
      query: (groupId) => ({
        url: `/groups/${groupId}/join`,
        method: 'POST',
      }),
      invalidatesTags: ['Group'],
    }),
    leaveGroup: builder.mutation({
      query: (groupId) => ({
        url: `/groups/${groupId}/leave`,
        method: 'POST',
      }),
      invalidatesTags: ['Group'],
    }),
    // Discussion endpoints
    getGroupDiscussions: builder.query({
      query: (groupId) => `/groups/${groupId}/discussions`,
      providesTags: (result, error, arg) => [
        { type: 'Discussion', id: arg },
        'Discussion'
      ],
    }),
    addDiscussion: builder.mutation({
      query: ({ groupId, content }) => ({
        url: `/groups/discussions`,
        method: 'POST',
        body: { groupId, content },
      }),
      invalidatesTags: ['Discussion', 'Group'],
    }),
    deleteDiscussion: builder.mutation({
      query: (discussionId) => ({
        url: `/groups/discussions/${discussionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Discussion', 'Group'],
    }),
    createGroupPost: builder.mutation({
      query: ({ groupId, content }) => ({
        url: `/groups/${groupId}/posts`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['Post'],
    }),
    // Notification endpoints
    getNotifications: builder.query({
      query: () => `/notifications`,
      providesTags: ['Notification'],
    }),
    markNotificationsRead: builder.mutation({
      query: () => ({
        url: `/notifications/mark-read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetUserGroupsQuery,
  useGetGroupDetailsQuery,
  useCreateGroupMutation,
  useEditGroupMutation,
  useDeleteGroupMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useGetGroupDiscussionsQuery,
  useAddDiscussionMutation,
  useDeleteDiscussionMutation,
  useCreateGroupPostMutation,
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} = groupApiSlice;
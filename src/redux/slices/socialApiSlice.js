import { apiTwo } from "./apiSlice";

export const socialApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    getFeedPosts: builder.query({
      query: ({ page = 1, limit = 10 }) => `/social/feed?page=${page}&limit=${limit}`,
      providesTags: ['Post'],
    }),
    createPost: builder.mutation({
      query: (content) => ({
        url: '/social/posts',
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['Post'],
    }),
    likePost: builder.mutation({
      query: (postId) => ({
        url: `/social/posts/${postId}/like`,
        method: 'POST',
      }),
      invalidatesTags: ['Post'],
    }),
    addComment: builder.mutation({
      query: ({ postId, content }) => ({
        url: `/social/posts/${postId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['Post'],
    }),
    getUserProfile: builder.query({
      query: (userId) => `/social/users/${userId}`,
      providesTags: ['User'],
    }),
    getNotifications: builder.query({
      query: () => '/social/notifications',
      providesTags: ['Notification'],
    }),
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/social/notifications/${notificationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetFeedPostsQuery,
  useCreatePostMutation,
  useLikePostMutation,
  useAddCommentMutation,
  useGetUserProfileQuery,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} = socialApiSlice;
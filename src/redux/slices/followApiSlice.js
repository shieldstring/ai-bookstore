import { apiTwo } from "./apiSlice";

export const followApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    // Get followers for specific user or current user
    getFollowers: builder.query({
      query: (userId = "me") => `users/${userId}/followers`,
      providesTags: (result, error, arg) => [
        { type: "Follow", id: arg === "me" ? "CURRENT" : arg },
      ],
    }),

    // Get following for specific user or current user
    getFollowing: builder.query({
      query: (userId = "me") => `users/${userId}/following`,
      providesTags: (result, error, arg) => [
        { type: "Follow", id: arg === "me" ? "CURRENT" : arg },
      ],
    }),

    // Follow a user
    followUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}/follow`,
        method: "POST",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Follow", id: arg },
        { type: "Follow", id: "CURRENT" },
      ],
    }),

    // Unfollow a user
    unfollowUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}/unfollow`,
        method: "POST",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Follow", id: arg },
        { type: "Follow", id: "CURRENT" },
      ],
    }),

    // Check follow status
    checkFollowStatus: builder.query({
      query: (userId) => `users/${userId}/follow-status`,
      providesTags: (result, error, arg) => [{ type: "Follow", id: arg }],
    }),

    // Get suggested users to follow
    getSuggestedUsers: builder.query({
      query: ({ limit = 5 } = {}) => `users/suggested?limit=${limit}`,
      providesTags: ["Follow"],
    }),
  }),
});

export const {
  useGetFollowersQuery,
  useGetFollowingQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useCheckFollowStatusQuery,
  useGetSuggestedUsersQuery,
} = followApiSlice;
